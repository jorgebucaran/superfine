# Superfine

[![Travis CI](https://img.shields.io/travis/jorgebucaran/superfine/master.svg)](https://travis-ci.org/jorgebucaran/superfine)
[![Codecov](https://img.shields.io/codecov/c/github/jorgebucaran/superfine/master.svg)](https://codecov.io/gh/jorgebucaran/superfine)
[![Gzip Size](https://img.badgesize.io/https://unpkg.com/superfine?compression=gzip)](https://bundlephobia.com/result?p=superfine)
[![npm](https://img.shields.io/npm/v/superfine.svg)](https://www.npmjs.org/package/superfine)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "#superfine")

Superfine is a minimal view layer for creating declarative web user interfaces. Mix it with your favorite state container library or use it standalone for maximum flexibility.

## Installation

<pre>
npm i <a href=https://www.npmjs.com/package/superfine>superfine</a>
</pre>

Don't want to set up a build environment? Download Superfine from [unpkg](https://unpkg.com/superfine/superfine.js)—or [jsdelivr](https://cdn.jsdelivr.net/npm/superfine/superfine.js)—and it will be globally available through the `window.superfine` object. Works in ES5-friendly browsers >=IE9.

```html
<script src="https://unpkg.com/superfine"></script>
```

## Usage

Here is the first example to get you started. Go ahead and [try it online]() or find [more examples](https://codepen.io/search/pens?q=superfine&page=1&order=superviewularity&depth=everything&show_forks=false).

```jsx
import { h, render } from "superfine"

const view = state => h("h1", {}, state)
const app = (container => (lastNode, nextNode) =>
  render(lastNode, nextNode, container))(document.body)

let node = app(null, view("Hey!"))
setTimeout(() => {
  node = app(node, view("Ho!"))
  setTimeout(() => {
    node = app(node, view("Let's go!"))
  }, 500)
}, 500)
```

Superfine consists of two functions: `superfine.h` creates a virtual DOM tree and `superfine.render` renders it into the DOM. A virtual DOM is a description of what a DOM should look like using a tree of plain JavaScript objects called virtual nodes. By comparing the old and new virtual DOM we can update the parts of the DOM that actually changed instead of rendering the entire document from scratch.

The [next example](https://codepen.io/jorgebucaran/pen/KoqxGW) shows how to use regular HTML attributes to synchronize the text of an input element to a heading element. Superfine nodes support [HTML attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes), [SVG attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute), [DOM events](https://developer.mozilla.org/en-US/docs/Web/Events), [keys](#keys) and [lifecycle events](#lifecycle-events).

```js
import { h, render } from "superfine"

const app = (lastNode => state => {
  lastNode = render(lastNode, view(state), document.body)
})()

const view = state =>
  h("div", {}, [
    h("h1", {}, state),
    h("input", {
      autofocus: true,
      type: "text",
      value: state,
      oninput: e => app(e.target.value)
    })
  ])

app("Hello!")
```

## Keys

Keys help identify nodes every time we update the DOM. By setting the `key` property on a virtual node, you declare that the node should correspond to a particular DOM element. This allow us to re-order the element into its new position, if the position changed, rather than risk destroying it. Keys must be unique among sibling-nodes.

```jsx
import { h } from "superfine"

export const ImageGallery = images =>
  images.map(({ hash, url, description }) =>
    h("li", { key: hash }, [
      h("img", {
        src: url,
        alt: description
      })
    ])
  )
```

## Lifecycle Events

You can be notified when elements managed by the virtual DOM are created, updated or removed via lifecycle events. Use them for animation, wrapping third party libraries, cleaning up resources, etc.

### `oncreate`

This event is fired after the element is created and attached to the DOM. Use it to manipulate the DOM node directly, make a network request, create a slide/fade in animation, etc.

```jsx
import { h } from "superfine"

export const Textbox = placeholder =>
  h("input", {
    type: "text",
    placeholder,
    oncreate: element => element.focus()
  })
```

### `onupdate`

This event is fired every time we try to update the element attributes. Use the `old` attributes inside the event handler to check if any attributes changed or not.

```jsx
import { h } from "superfine"
import { RichEditor } from "richeditor"

export const Editor = value =>
  h("div", {
    key: "editor",
    oncreate: element => {
      element.editor = new RichEditor({ text: value })
    },
    onupdate: (element, old) => {
      if (old.value !== value) {
        element.editor.update({ text: value })
      }
    },
    ondestroy: element => {
      delete element.editor
    }
  })
```

### `onremove`

This event is fired before the element is removed from the DOM. Use it to create slide/fade out animations. Call `done` inside the function to remove the element. This event is not called in its child elements.

```jsx
import { h } from "superfine"
import { fadeout } from "some-fadeout-fx"

export const MessageWithFadeout = title =>
  h(
    "div",
    {
      onremove: (element, done) => fadeout(element).then(done)
    },
    [h("h1", {}, title)]
  )
```

### `ondestroy`

This event is fired after the element has been removed from the DOM, either directly or as a result of a parent being removed. Use it for invalidating timers, canceling a network request, removing global events listeners, etc.

```jsx
import { h } from "superfine"

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

## JSX

[JSX](https://facebook.github.io/jsx/) is an optional language syntax extension that lets you write HTML tags interspersed with JavaScript. To use JSX install the JSX [transform plugin](https://babeljs.io/docs/plugins/transform-react-jsx) and add the pragma option to your `.babelrc` file (don't have one? create it in the root of your project).

```json
{
  "plugins": [
    [
      "transform-react-jsx",
      {
        "pragma": "h"
      }
    ]
  ]
}
```

## License

Superfine is MIT licensed. See [LICENSE](/LICENSE.md).
