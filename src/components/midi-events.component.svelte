<script>
  import { BehaviorSubject, fromEvent } from "rxjs";
  import { skip, filter, tap, pluck } from "rxjs/operators";
  import { inputs$ } from "../stores/devices.js";
  import { notes$, controls$ } from "../stores/midi.js";

  /*
   * Channel voice messages (0x80 - 0xEF)
   */

  const NOTE_OFF = 0x80;
  const NOTE_ON = 0x90;
  const CONTROL_CHANGE = 0xb0;

  /*
   * Initialize MIDI message observable
   */

  const messages$ = new BehaviorSubject();

  inputs$
    .pipe(
      skip(1),
      tap((input) => {
        fromEvent(input, "midimessage").subscribe((e) => messages$.next(e));
      })
    )
    .subscribe();

  /*
   * Channel message stream
   */

  const channelMessages$ = messages$.pipe(
    pluck("data"), // MIDI data in Uint8Array format (3 bytes)
    filter((message) => !!message),
    filter((message) => message[0] < 240)
  );

  const statusByte = (msg) => msg[0];

  /*
   * Notes stream
   */

  const isNoteOn = (msg) => statusByte(msg) == NOTE_ON;
  const isNoteOff = (msg) => statusByte(msg) == NOTE_OFF;
  const isNoteToggle = (msg) => isNoteOn(msg) || isNoteOff(msg);
  const noteMessages$ = channelMessages$.pipe(filter(isNoteToggle));

  const noteNum = (note) => note[1];
  const noteVel = (note) => note[2];

  noteMessages$.pipe(skip(1)).subscribe((note) => notes$.next(note));

  /*
   * Control stream
   */

  const isControlChange = (msg) => statusByte(msg) == CONTROL_CHANGE;
  const controlMessages$ = channelMessages$.pipe(filter(isControlChange));

  const controlNum = (controller) => controller[1];
  const controlVal = (controller) => controller[2];

  controlMessages$.pipe(skip(1)).subscribe((cc) => controls$.next(cc));
</script>
