# Picodom
[![Travis CI](https://img.shields.io/travis/picodom/picodom/master.svg)](https://travis-ci.org/picodom/picodom)
[![npm](https://img.shields.io/npm/v/picodom.svg)](https://www.npmjs.org/package/picodom)

Picodom is a 1kb Virtual DOM builder and patch algorithm.

[Try it online](https://codepen.io/picodom/pen/QvogzJ?editors=0010)

```js
import { h, patch } from "picodom"

patch(
  document.body,
  null,
  null,
  h("button", {
    onclick: () => alert("Hello World")
  }, "Click Here")
)
```

Use Picodom to build your own view library and state management architecture.

[Try it online](https://codepen.io/picodom/pen/BRbJpG?editors=0010)

```jsx
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
        oninput={e => render(view(e.target.value))}
        value={state}
        type="text"
      />
    </div>
  )
}

render(view("Hello Picodom!"))
```

## Documentation

The documentation is located in the [/docs](/docs) directory.

## License

Picodom is MIT licensed. See [LICENSE](/LICENSE.md).
