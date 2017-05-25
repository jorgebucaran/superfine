# Turbodom
[![Travis CI](https://img.shields.io/travis/turbodom/turbodom/master.svg)](https://travis-ci.org/turbodom/turbodom)
[![npm](https://img.shields.io/npm/v/turbodom.svg?colorB=531b93)](https://www.npmjs.org/package/turbodom)

Turbodom is a 1kb Virtual DOM builder and patch algorithm.

[Try it online](https://codepen.io/turbodom/pen/QvogzJ?editors=0010)

```js
import { h, patch } from "turbodom"

patch(
  document.body,
  null,
  null,
  h("button", {
    onclick: () => alert("Hello World")
  }, "Click Here")
)
```

Use Turbodom to build your own view library and state management architecture.

[Try it online](https://codepen.io/turbodom/pen/BRbJpG?editors=0010)

```jsx
import { h, patch } from "turbodom"

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
        oninput={e => render(view(e.target.value))}
        value={state}
        type="text"
      />
    </div>
  )
}

render(view("Hello Turbodom!"))
```

## Documentation

The documentation is located in the [/docs](/docs) directory.

## License

Turbodom is MIT licensed. See [LICENSE](/LICENSE.md).
