# ▞ Patchdom

[![Travis CI](https://img.shields.io/travis/jorgebucaran/patchdom/master.svg)](https://travis-ci.org/jorgebucaran/patchdom)
[![Codecov](https://img.shields.io/codecov/c/github/jorgebucaran/patchdom/master.svg)](https://codecov.io/gh/jorgebucaran/patchdom)
[![npm](https://img.shields.io/npm/v/patchdom.svg)](https://www.npmjs.org/package/patchdom)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "#patchdom")

Patchdom is a 1 kB Virtual DOM builder and patch function.

Try it live [here](https://codepen.io/jorgebucaran/pen/BRbJpG?editors=0010).

```js
import { h, patch } from "patchdom"

document.body.appendChild(
  patch(
    h(
      "h1",
      {
        class: "app"
      },
      "Hello World"
    )
  )
)


<>
```

Patchdom supports keyed updates & lifecycle events — all with no dependencies. Mix it with your favorite state management library or create your own custom view framework.

## Installation

Install with npm or Yarn.

<pre>
npm i <a href=https://www.npmjs.com/package/patchdom>patchdom</a>
</pre>

Then with a module bundler like [Rollup](https://rollupjs.org) or [Webpack](https://webpack.js.org), use as you would anything else.

```js
import { h, patch } from "patchdom"
```

If you don't want to set up a build environment, you can download Patchdom from a CDN like [unpkg.com](https://unpkg.com/patchdom) and it will be globally available through the <samp>window.patchdom</samp> object. We support all ES5-compliant browsers, including Internet Explorer 10 and above.

```html
<script src="https://unpkg.com/patchdom"></script>
```

## Usage

WIP

## Supported Attributes

This section describes the particular handling of certain HTML/SVG attributes, and certain special attributes reserved by patchdom.

### Standard HTML and SVG Attributes

All standard HTML and SVG attributes are supported, and the following standard attributes are handled specifically:

#### `class`

Both the `className`-property and `class`-attribute are supported.

#### `style`

This attribute expects a standard `object` rather than a `string` as in HTML.

Individual style properties will be diffed and mapped against [`HTMLElement.style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) property members of the DOM element - you should therefore use the [JavaScript](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference) `style` object property names, e.g. `backgroundColor` rather than `background-color`.

### Attributes and Life-Cycle

#### `key`

#### `oncreate`

#### `onupdate`

#### `onremove`

#### `ondestroy`

## License

patchdom is MIT licensed. See [LICENSE](/LICENSE.md).
