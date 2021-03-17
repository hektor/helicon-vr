<script>
  import { skip, tap } from "rxjs/operators";
  import { controls$ } from "../stores/midi.js";

  const controlNum = (control) => control[1];
  const controlVal = (control) => control[2];

  controls$
    .pipe(
      skip(1)
      //
    )
    .subscribe();
</script>

<pre>
  {JSON.stringify($controls$, 0, 2)}
</pre>
