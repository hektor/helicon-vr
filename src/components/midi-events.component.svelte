<script>
  import { BehaviorSubject, fromEvent } from "rxjs";
  import { skip, filter, tap, pluck } from "rxjs/operators";
  import { inputs$ } from "../stores/devices.js";

  const messages$ = new BehaviorSubject();

  inputs$
    .pipe(
      skip(1),
      tap((input) => {
        fromEvent(input, "midimessage").subscribe((e) => messages$.next(e));
      })
    )
    .subscribe();

  // messages$.pipe(skip(1), tap(console.log)).subscribe();

  /*
   * Stream channel messages (0x80 - 0xEF)
   */

  const channelMessages$ = messages$.pipe(
    pluck("data"), // MIDI data in Uint8Array format (3 bytes)
    filter((message) => !!message),
    filter((message) => message[0] < 240)
  );

  channelMessages$.subscribe();

  const statusByte = (msg) => msg[0];
  const isNoteOn = (msg) => statusByte(msg) == 0x90;
  const isNoteOff = (msg) => statusByte(msg) == 0x80;
  const isNoteToggle = (msg) => isNoteOn(msg) || isNoteOff(msg);
  channelMessages$.pipe(filter(isNoteToggle)).subscribe(console.log);
</script>
