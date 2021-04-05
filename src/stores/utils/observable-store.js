import { BehaviorSubject } from 'rxjs'

/*
 * Basically an RxJS Observable wrapper for
 * compatibility with Svelte's 'bind' directives
 *
 * As seen in
 * https://monad.fi/en/blog/svelte-custom-stores/
 */

export const writable$ = init => {
  const store = new BehaviorSubject(init)
  store.set = store.next
  return store
}
