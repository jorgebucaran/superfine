# Ultradom

[![Travis CI](https://img.shields.io/travis/jorgebucaran/ultradom/master.svg)](https://travis-ci.org/jorgebucaran/ultradom)
[![npm](https://img.shields.io/npm/v/ultradom.svg)](https://www.npmjs.org/package/ultradom)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "#ultradom")

Ultradom is a minimal virtual DOM view layer for building browser-based applications and frameworks. Mix it with your favorite state solution architecture or use it standalone for maximum flexibility. Features include server-rendered DOM recycling, keyed updates & lifecycle events — all with no dependencies.

## Installation

Install with npm or Yarn.

<pre>
npm i <a href=https://www.npmjs.com/package/ultradom>ultradom</a>
</pre>

Then with a module bundler like [Rollup](https://rollupjs.org) or [Webpack](https://webpack.js.org), use as you would anything else.

```js
import { h, patch } from "ultradom"
```

Don't want to set up a build environment? Download Ultradom from a CDN like [unpkg.com](https://unpkg.com/ultradom) and it will be globally available through the <samp>window.ultradom</samp> object. Ultradom supports ES5-compliant browsers, including IE 10.

```html
<script src="https://unpkg.com/ultradom"></script>
```

## Getting Started

Let's walkthrough a simple counter that can be incremented or decremented. You can [try it online](https://codepen.io/jorgebucaran/pen/PQLZqg?editors=0010) to get a sense of what we are building. We'll break it down afterwards.

```jsx
import { h, patch } from "ultradom"

const view = count =>
  h("div", {}, [
    h("h1", {}, count),
    h("button", { onclick: () => patch(view(count - 1), element) }, "-"),
    h("button", { onclick: () => patch(view(count + 1), element) }, "+")
  ])

const element = document.body.appendChild(patch(view(0)))
```

Ultradom consists of a two-function API. <samp>ultradom.h</samp> returns a new virtual DOM node tree and <samp>ultradom.patch</samp> updates the attributes and children of the supplied DOM element to match the virtual DOM. Without an element, <samp>patch</samp> returns a new element which we can append to the page as seen above.

### Virtual DOM

A virtual DOM is a description of what a DOM should look like using a tree of nested JavaScript objects known as virtual nodes. In the example, the view function returns and object like this.

```jsx
{
  nodeName: "div",
  attributes: {},
  children: [
    {
      nodeName: "h1",
      attributes: {},
      children: 0
    },
    {
      nodeName: "button",
      attributes: { ... },
      children: "-"
    },
    {
      nodeName: "button",
      attributes: { ... },
      children: "+"
    }
  ]
}
```

The virtual DOM allows us to write code as if the entire document is thrown away and rebuilt every time we patch an element, while we only update the parts of the DOM that actually changed. We try to do this in the least number of steps possible, by comparing the new virtual DOM against the previous one. This leads to high efficiency, since typically only a small percentage of nodes need to change, and changing real DOM nodes is costly compared to recalculating the virtual DOM.

It may seem wasteful to throw away the old virtual DOM and re-create it entirely on every update — not to mention the fact that at any one time, we are keeping two virtual DOM trees in memory, but as it turns out, browsers can create hundreds of thousands of objects very quickly.

The first time you try to update a DOM element, <samp>patch</samp> will attempt to reuse the supplied element and its children (instead of creating everything from scratch) enabling SEO optimization and improving your application time-to-interactive. This is how we can turn server-rendered content into an interative application out the previous example.

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script defer src="bundle.js"></script>
</head>

<body>
  <div>
    <h1>0</h1>
    <button>-</button>
    <button>+</button>
  </div>
</body>
</html>
```

Then patch the element you want to recycle (the first element of the body in this example).

```jsx
const element = patch(view(0), document.body.firstElementChild)
```

## Supported Attributes

Supported attributes include [HTML attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes), [SVG attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute), [DOM events](https://developer.mozilla.org/en-US/docs/Web/Events), [Lifecycle Events](#lifecycle-events), and [Keys](#keys). Note that non-standard HTML attribute names are not supported, <samp>onclick</samp> and <samp>class</samp> are valid, but <samp>onClick</samp> or <samp>className</samp> are not.

### Styles

The <samp>style</samp> attribute expects a plain object rather than a string as in HTML.
Each declaration consists of a style name property written in <samp>camelCase</samp> and a value. CSS variables are currently not supported.

Individual style properties will be diffed and mapped against <samp>[HTMLElement.style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style)</samp> property members of the DOM element — you should therefore use the JavaScript style object [property names](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Properties_Reference), e.g. <samp>backgroundColor</samp> rather than <samp>background-color</samp>.

```jsx
import { h } from "ultradom"

export const Jumbotron = text =>
  h(
    "div",
    {
      style: {
        color: "white",
        margin: "20px",
        textAlign: center,
        fontSize: "32px",
        backgroundImage: `url(${imgUrl})`
      }
    },
    text
  )
```

### Lifecycle Events

You can be notified when elements managed by the virtual DOM are created, updated or removed via lifecycle events. Use them for animation, data fetching, wrapping third party libraries, cleaning up resources, etc.

#### oncreate

This event is fired after the element is created and attached to the DOM. Use it to manipulate the DOM node directly, make a network request, create a slide/fade in animation, etc.

```jsx
import { h } from "ultradom"

export const Textbox = placeholder =>
  h("input", {
    type: "text",
    placeholder,
    oncreate: element => element.focus()
  })
```

#### onupdate

This event is fired every time we update the element attributes. Use <samp>oldAttributes</samp> inside the event handler to check if any attributes changed or not.

```jsx
import { h } from "ultradom"

export const Textbox = placeholder =>
  h("input", {
    type: "text",
    placeholder,
    onupdate: (element, oldAttributes) => {
      if (oldAttributes.placeholder !== placeholder) {
        // Handle changes here!
      }
    }
  })
```

#### onremove

This event is fired before the element is removed from the DOM. Use it to create slide/fade out animations. Call <samp>done</samp> inside the function to remove the element. This event is not called in its child elements.

```jsx
import { h } from "ultradom"

export const MessageWithFadeout = title =>
  h(
    "div",
    {
      onremove: (element, done) => fadeout(element).then(done)
    },
    [h("h1", {}, title)]
  )
```

#### ondestroy

This event is fired after the element has been removed from the DOM, either directly or as a result of a parent being removed. Use it for invalidating timers, canceling a network request, removing global events listeners, etc.

```jsx
import { h } from "ultradom"

export const Camera = onerror =>
  h("video", {
    poster: "loading.png",
    oncreate: element => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(stream => (element.srcObject = stream))
        .catch(onerror)
    },
    ondestroy: element => element.srcObject.getTracks()[0].stop()
  })
```

### Keys

Keys help identify which nodes were added, changed or removed from a list when a view is rendered. A key must be unique among sibling-nodes.

```jsx
import { h } from "ultradom"

export const ImageGallery = images =>
  images.map(({ hash, url, description }) =>
    h(
      "li",
      {
        key: hash
      },
      [
        h("img", {
          src: url,
          alt: description
        })
      ]
    )
  )
```

By setting the <samp>key</samp> property on a virtual node, you declare that the node should correspond to a particular DOM element. This allow us to re-order the element into its new position, if the position changed, rather than risk destroying it.

Don't use an array index as key, if the index also specifies the order of siblings. If the position and number of items in a list is fixed, it will make no difference, but if the list is dynamic, the key will change every time the tree is rebuilt.

```jsx
import { h } from "ultradom"

export const PlayerList = players =>
  players
    .slice()
    .sort((player, nextPlayer) => nextPlayer.score - player.score)
    .map(player =>
      h(
        "li",
        {
          key: player.username,
          class: player.isAlive ? "alive" : "dead"
        },
        [PlayerProfile(player)]
      )
    )
```

## JSX

[JSX](https://facebook.github.io/jsx/) is a language syntax extension that lets you write HTML tags interspersed with JavaScript. Because browsers don't understand JSX, you must use a compiler like [Babel](https://babeljs.io) or [TypeScript](https://www.typescriptlang.org) to transform it into <samp>ultradom.h</samp> function calls.

```jsx
import { h, patch } from "ultradom"

const view = state => (
  <main>
    <h1>{state}</h1>
    <button onclick={() => patch(view(state - 1), element)}>-</button>
    <button onclick={() => patch(view(state + 1), element)}>+</button>
  </main>
)

const element = document.body.appendChild(patch(view(0)))
```

Usually, all you need to do is install the JSX [transform plugin](https://babeljs.io/docs/plugins/transform-react-jsx) and add the pragma option to your <samp>.babelrc</samp> file to get JSX running in your application.

```json
{
  "plugins": [["transform-react-jsx", { "pragma": "h" }]]
}
```

## Community

* [Slack#ultradom](https://hyperappjs.herokuapp.com)
* [Twitter/hashtag/ultradom](https://twitter.com/hashtag/ultradom)
* [/r/ultradom](https://www.reddit.com/r/ultradom)

## License

Ultradom is MIT licensed. See [LICENSE](/LICENSE.md).
