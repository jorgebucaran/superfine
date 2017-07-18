# Picodom
[![Travis CI](https://img.shields.io/travis/picodom/picodom/master.svg)](https://travis-ci.org/picodom/picodom)
[![npm](https://img.shields.io/npm/v/picodom.svg)](https://www.npmjs.org/package/picodom)

Picodom is a 1 KB Virtual DOM builder and patch function.

[Try it online](https://codepen.io/picodom/pen/BRbJpG?editors=0010)

```js
import { h, patch } from "picodom"

let element, oldNode

function render(newNode) {
  return (element = patch(
    document.body,
    element,
    oldNode,
    (oldNode = newNode)
  ))
}

function view(state) {
  return (
    <div>
      <h1>{state}</h1>
      <input
        autofocus
        type="text"
        value={state}
        oninput={e => render(view(e.target.value))}
      />
    </div>
  )
}

render(view("Hello!"))
```

Picodom supports keyed updates & lifecycle events — all with no dependencies. Mix it with your favorite state management library and roll your own custom view framework.

## Links

- [Documentation](/docs)
- [Twitter](https://twitter.com/picodom)
- [/r/picodom](https://www.reddit.com/r/picodom)

## License

Picodom is MIT licensed. See [LICENSE](/LICENSE.md).
