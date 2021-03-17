<script>
  import { skip, tap } from "rxjs/operators";
  import { notes$ } from "../stores/midi.js";

  const noteNum = (note) => note[1];
  const noteVel = (note) => note[2];

  notes$
    .pipe(
      skip(1)
      //
    )
    .subscribe();
</script>

<pre>
  {JSON.stringify($notes$, 0, 2)}
</pre>
