# Documentation
<!-- TOC -->

- [Installation](#installation)
- [Reference](#reference)
  - [picodom.h](#picodomh)
  - [picodom.patch](#picodompatch)
- [Lifecycle Events](#lifecycle-events)
  - [oncreate](#oncreate)
  - [oninsert](#oninsert)
  - [onupdate](#onupdate)
  - [onremove](#onremove)
- [Keys](#keys)

<!-- /TOC -->

## Installation

You can download the minified library from a [CDN](https://unpkg.com/picodom).

```html
<script src="https://unpkg.com/picodom"></script>
```

Then access the exported global.

```js
const { h, patch } = picodom
```

Or with npm / Yarn.

<pre>
npm i <a href="https://www.npmjs.com/package/picodom">picodom</a>
</pre>

Then setup a build pipeline using a bundler, e.g., Browserify, Rollup, Webpack, etc., and import it.

```jsx
import { h, patch } from "picodom"
```

## Reference

### picodom.h

Create virtual nodes.

<pre>
h(
  <a href="#h-tag">tag</a>: string | (props, children): vnode,
  <a href="#h-data">data</a>: {},
  <a href="#h-children">children</a>: string | vnode[]
): vnode: {
  <a href="#h-tag">tag</a>,
  <a href="#h-data">data</a>,
  <a href="#h-children">children</a>
}
</pre>

- <a id="h-tag"></a>tag: A tag name, e.g. div, svg, etc.
- <a id="h-data"></a>data: Any valid HTML [attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes), [events](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers), [styles](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference), etc. Also, [lifecycle events](#lifecycle-events) and meta data like [keys](#keys).
- <a id="h-children"></a>children: An array of children vnodes. A string denotes a text node.

#### Example

```js
const vnode = h("button", {
  onclick: () => alert("Hello World")
}, "Click Here")
```

Use [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html) or [Hyperx](https://github.com/substack/hyperx) to create virtual nodes declaratively and compile it to h() calls in a build pipeline.

### picodom.patch

Diff a pair of virtual nodes and update the DOM with the result.

<pre>
patch(
  <a href="#patch-root">root</a>: <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement">HTMLElement</a>,
  <a href="#patch-element">element</a>: <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement">HTMLElement</a>,
  <a href="#patch-oldNode">oldNode</a>: vnode,
  <a href="#patch-newNode">newNode</a>: vnode
): <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement">HTMLElement</a>
</pre>

- <a id="patch-root"></a>root: The root HTML element of the updated DOM.
- <a id="patch-element"></a>element: The HTML element to update. This must be an element returned by patch or null.
- <a id="patch-oldNode"></a>oldNode: The previous virtual node or null.
- <a id="patch-newNode"></a>newNode: The new virtual node used to update the DOM.

#### Example

[Try it online](https://codepen.io/picodom/pen/QvogzJ?editors=0011)

```jsx
import { h, patch } from "picodom"

patch(
  document.body,
  null, // element
  null, // oldNode
  <button onclick={() => console.log("Hello.")}>
    Click Here
  </button>
)
```

## Lifecycle Events

Lifecycle events are custom function handlers invoked at various points in the life of a virtual node.

### oncreate

The oncreate event is fired when the element is created, but before it is inserted into the DOM. Use this event to start animations before an element is rendered.

<pre>
oncreate: <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">element</a> =&gt {}
</pre>

### oninsert

The oninsert event is fired after the element is created and inserted into the DOM. Use this event to wrap third party libraries that require a reference to a DOM node, etc.

<pre>
oninsert: <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">element</a> =&gt {}
</pre>

### onupdate

The onupdate event is fired every time the element's data is updated.

<pre>
onupdate: <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">element</a> =&gt {}
</pre>

### onremove

The onremove event is fired before the element is removed from the DOM.

<pre>
onremove: <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">element</a> =&gt {}
</pre>

You are responsible for removing the element if you use this event.

```js
if (element.parentNode) {
  element.parentNode.removeChild(element)
}
```

## Keys

Every time your application is rendered, a virtual node tree is created from scratch.

Keys help identify which nodes were added, changed or removed from the old / new tree.

Use keys to tell the render algorithm to re-order the children instead of mutating them.

```jsx
<ul>
  {urls.map((url, id) => (
    <li key={id}>
      <img src={url} />
    </li>
  ))}
</ul>
```
