# [Picodom](https://codepen.io/picodom)
[![Travis CI](https://img.shields.io/travis/picodom/picodom/master.svg)](https://travis-ci.org/picodom/picodom)
[![Codecov](https://img.shields.io/codecov/c/github/picodom/picodom/master.svg)](https://codecov.io/gh/picodom/picodom)
[![npm](https://img.shields.io/npm/v/picodom.svg)](https://www.npmjs.org/package/picodom)

Picodom is a 1 KB VDOM builder and patch function.

[Try it Online](https://codepen.io/picodom/pen/BRbJpG?editors=0010)

```js
import { h, patch } from "picodom"

let node

function render(view, withState) {
  patch(document.body, node, (node = view(withState)))
}

function view(state) {
  return (
    <div>
      <h1>{state}</h1>
      <input
        autofocus
        type="text"
        value={state}
        oninput={e => render(view, e.target.value)}
      />
    </div>
  )
}

render(view, "Hello!")
```

Picodom supports keyed updates & lifecycle events — all with no dependencies. Mix it with your favorite state management library or create your own custom view framework.

## Installation

Install with npm or Yarn.

<pre>
npm i <a href="https://www.npmjs.com/package/picodom">picodom</a>
</pre>

Then with a module bundler like [Rollup](https://github.com/rollup/rollup) or [Webpack](https://github.com/webpack/webpack), use as you would anything else.

```jsx
import { h, app } from "picodom"
```

Or download directly from [unpkg](https://unpkg.com/picodom) or [jsDelivr](https://cdn.jsdelivr.net/npm/picodom@latest/dist/picodom.js).

```html
<script src="https://unpkg.com/picodom"></script>
```

Then find it in `window.picodom`.

```jsx
const { h, app } = picodom
```

We support all ES5-compliant browsers, including Internet Explorer 10 and above.

## Usage

Create virtual nodes with the built-in `h()` function. A virtual node is an object that describes a DOM tree.

```js
const node = h("h1", { id: "title" }, "Hello.")
```

To create a component, define a function that returns a virtual node.

```js
function AwesomeTitle(text) {
  return h("h1", { class: "awesome title" }, text)
}
```

### Lifecycle

#### oncreate

Fired after the element is created and attached to the DOM.

<pre>
<a id="oncreate-api"></a>oncreate(<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a>)
</pre>

#### onupdate

Fired after the element attributes are updated. This event will fire even if the attributes have not changed.

<pre>
<a id="onupdate-api"></a>onupdate(<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a>, oldProps: <a href="#attributes">Attributes</a>)
</pre>

#### onremove

Fired before the element is removed from the DOM. Return a function that takes a `remove()` function and use it to remove the element asynchronously.

<pre>
<a id="onremove-api"></a>onremove(<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a>)
</pre>

### patch

Use `patch` to diff two nodes and update the DOM. `patch` returns the patched child element.

```js
const element = patch(
  parent,  // parent HTMLElement to be patched
  oldNode, // the old VNode
  newNode  // the new VNode
)
```

## Links

- [Twitter](https://twitter.com/picodom)
- [CodePen](https://codepen.io/picodom)
- [/r/picodom](https://www.reddit.com/r/picodom)

## License

Picodom is MIT licensed. See [LICENSE](/LICENSE.md).
