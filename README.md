# [Picodom](https://codepen.io/picodom)
[![Travis CI](https://img.shields.io/travis/picodom/picodom/master.svg)](https://travis-ci.org/picodom/picodom)
[![Codecov](https://img.shields.io/codecov/c/github/picodom/picodom/master.svg)](https://codecov.io/gh/picodom/picodom)
[![npm](https://img.shields.io/npm/v/picodom.svg)](https://www.npmjs.org/package/picodom)

Picodom is a 1 KB VDOM builder and patch function.

[Try it Online](https://codepen.io/picodom/pen/BRbJpG?editors=0010)

```js
import { h, patch } from "picodom"

/** @jsx h */

let node

function render(view, state) {
  patch(document.body, node, (node = view(state)))
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
import { h, patch } from "picodom"
```

Or download directly from [unpkg](https://unpkg.com/picodom) or [jsDelivr](https://cdn.jsdelivr.net/npm/picodom@latest/dist/picodom.js).

```html
<script src="https://unpkg.com/picodom"></script>
```

Then find it in `window.picodom`.

```jsx
const { h, patch } = picodom
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

To diff two virtual nodes and update the DOM, use the `patch` function:

```js
const element = patch(
  parent,  // HTML container, e.g., document.body
  oldNode, // the old VNode
  newNode  // the new VNode
)
```

The `patch` function returns the patched child element.

## Supported Attributes

This section describes the particular handling of certain HTML/SVG attributes, and certain special attributes reserved by Picodom.

### Standard HTML and SVG Attributes

All standard HTML and SVG attributes are supported, and the following standard attributes are handled specifically:

#### `class`

Both the `className`-property and `class`-attribute are supported.

#### `style`

This attribute expects a standard `object` rather than a `string` as in HTML.

Individual style properties will be diffed and mapped against [`HTMLElement.style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) property members of the DOM element - you should therefore use the [Javascript](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference) `style` object property names, e.g. `backgroundColor` rather than `background-color`.

### Life-Cycle Attributes

Picodom supports element-level life-cycle events and keyed updates via the following reserved attributes:

#### `key`

The `key` attribute enables Picodom to identify and preserve DOM elements, even when the order of child elements changes during an update.

The value must be a string (or number) and it must be unique among all the siblings of a given child element.

For example, use keys to ensure that input elements don't get replaced (and lose their focus or selection state, etc.) during updates - or for table rows (or other repeated elements) to ensure that these get reused.

#### `oncreate`

Fired after the element is created and attached to the DOM.

<pre>
<a id="oncreate-api"></a>oncreate(<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a>)
</pre>

#### `onupdate`

Fired after the existing element is updated. This event will fire even if the attributes have not changed.

<pre>
<a id="onupdate-api"></a>onupdate(<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a>, oldProps: <a href="#attributes">Attributes</a>)
</pre>

#### `onremove`

Fired before the element is removed from the DOM.

Your event handler will receive a reference to the element that is about to be removed, and a `done` callback function, which must be called to complete the removal, upon which the `ondestroy` handler will be fired.

<pre>
<a id="onremove-api"></a>onremove(<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a>, done)
</pre>

You can use this event to defer the physical removal of an element from the DOM, for purposes such as animation during removal.

Note that the `onremove` event is only triggered for *direct* removals, e.g. for updates where the parent of the element still exists. For *indirect* removals (where the parent element was also removed) only the `ondestroy` event will fire.

#### `ondestroy`

Fired after the element is removed from the DOM.

<pre>
<a id="ondestroy-api"></a>ondestroy(<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a>)
</pre>

You can use this event to clean up after your `oncreate` handler - this enables you to integrate third-party widgets (date-pickers, content editors, etc.) and clean up after them.

## Links

- [Twitter](https://twitter.com/picodom)
- [CodePen](https://codepen.io/picodom)
- [/r/picodom](https://www.reddit.com/r/picodom)

## License

Picodom is MIT licensed. See [LICENSE](/LICENSE.md).
