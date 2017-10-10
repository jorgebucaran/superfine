# [Picodom](https://codepen.io/picodom)
[![Travis CI](https://img.shields.io/travis/picodom/picodom/master.svg)](https://travis-ci.org/picodom/picodom)
[![Codecov](https://img.shields.io/codecov/c/github/picodom/picodom/master.svg)](https://codecov.io/gh/picodom/picodom)
[![npm](https://img.shields.io/npm/v/picodom.svg)](https://www.npmjs.org/package/picodom)

Picodom is a 1 KB VDOM builder and patch function.

[Try it Online](https://codepen.io/picodom/pen/BRbJpG?editors=0010)

```js
import { h, patch } from "picodom"

let element, oldNode

function render(node) {
  return element = patch(oldNode, (oldNode = node), element)
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

## Installation

Download the minified library from a [CDN](https://unpkg.com/picodom).

```html
<script src="https://unpkg.com/picodom"></script>
```

Then access the exported global.

```js
const { h, patch } = picodom
```

Or install with npm / Yarn.

<pre>
npm i <a href="https://www.npmjs.com/package/picodom">picodom</a>
</pre>

Then build with a bundler, e.g., Browserify, Rollup, Webpack, etc., and import it.

```jsx
import { h, patch } from "picodom"
```

## API

### h

<pre>
h(
  string | <a href="#virtualcomponent">VirtualComponent</a>,
  <a href="#attributes">Attributes</a>,
  Array&lt<a href="#virtualnode">VirtualNode</a>&gt | string
): <a href="#virtualnode">VirtualNode</a>
</pre>

### VirtualNode

<pre>
{
  tag: string,
  data: <a href="#attributes">Attributes</a>,
  children: Array&lt<a href="#virtualnode">VirtualNode</a>&gt
}
</pre>

### VirtualComponent

<pre>
(any, Array&lt<a href="#virtualnode">VirtualNode</a>&gt | string): <a href="#virtualnode">VirtualNode</a>
</pre>

### Attributes

<pre>
<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes">HTMLAttributes</a> | <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute">SVGAttributes</a> | <a href="https://developer.mozilla.org/en-US/docs/Web/Events">DOMEvents</a> | <a href="#virtualdomevents">VirtualDOMEvents</a>
</pre>

### VirtualDOMEvents

#### oncreate

Fired after the element is created and attached to the DOM.

<pre>
<a id="oncreate-api"></a>oncreate(<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a>): void
</pre>

#### onupdate

Fired after the element attributes are updated. This event will fire even if the attributes have not changed.

<pre>
<a id="onupdate-api"></a>onupdate(<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a>, oldData: <a href="#attributes">Attributes</a>): void
</pre>

#### onremove
Fired before the element is removed from the DOM.

<pre>
<a id="onremove-api"></a>onremove(<a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a>): void
</pre>


### patch

<pre>
patch(
  oldNode: <a href="#virtualnode">VirtualNode</a>,
  newNode: <a href="#virtualnode">VirtualNode</a>,
  element: <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement">HTMLElement</a>,
  root: <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement">HTMLElement</a> | <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/body">document.body</a>
): <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement">HTMLElement</a>
</pre>


## Links

- [Twitter](https://twitter.com/picodom)
- [CodePen](https://codepen.io/picodom)
- [/r/picodom](https://www.reddit.com/r/picodom)

## License

Picodom is MIT licensed. See [LICENSE](/LICENSE.md).
