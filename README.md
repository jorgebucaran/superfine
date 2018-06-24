# ultraDOM

[![Travis CI](https://img.shields.io/travis/jorgebucaran/ultraDOM/master.svg)](https://travis-ci.org/jorgebucaran/ultraDOM)
[![Codecov](https://img.shields.io/codecov/c/github/jorgebucaran/ultraDOM/master.svg)](https://codecov.io/gh/jorgebucaran/ultraDOM)
[![Gzip Size](https://img.badgesize.io/https://unpkg.com/ultradom/ultraDOM.js?compression=gzip)](https://unpkg.com/ultradom)
[![npm](https://img.shields.io/npm/v/ultradom.svg)](https://www.npmjs.org/package/ultradom)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "#ultraDOM")

ultraDOM is a minimal view layer for building declarative web user interfaces.

What's in the bundle? A virtual DOM diff engine, keyed-based node [reconciliation](#keys), element-level [lifecycle events](#lifecycle-events) and browser support all the way back to IE9. Mix it with your favorite state management library or use it standalone for maximum flexibility.

## Installation

<pre>
npm i <a href=https://www.npmjs.com/package/ultradom>ultradom</a>
</pre>

Don't want to set up a build environment? Download ultraDOM from [unpkg](https://unpkg.com/ultradom/ultradom.js) (or [jsdelivr](https://cdn.jsdelivr.net/npm/ultradom/ultraDOM.js)) and it will be globally available through the `window.ultraDOM` object.

```html
<script src="https://unpkg.com/ultradom"></script>
```

## Usage

Here is a basic example that mirrors the text of an [input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) element. Go ahead and [try it online](https://codepen.io/jorgebucaran/pen/KoqxGW) to see what it looks like.

```js
import { h, render } from "ultradom"

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

const app = state => render(view(state), document.body)

app("Hello!")
```

ultraDOM consists of a two-function API: `ultraDOM.h` creates virtual nodes and `ultraDOM.render` renders them into a DOM container.

We try to do this in the least number of steps possible, by comparing the new virtual DOM against the previous one. This leads to high efficiency, since typically only a small percentage of nodes need to change, and changing real DOM nodes is costly compared to recalculating the virtual DOM.

A virtual DOM is a description of what a DOM should look like using a tree of nested JavaScript objects known as virtual nodes. It allows us to write our application as if the entire document is rebuilt every time we render a node, while we only update the parts of the DOM that actually changed.

ultraDOM nodes support [HTML attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes), [SVG attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute), [DOM events](https://developer.mozilla.org/en-US/docs/Web/Events), [keys](#keys) and [lifecycle events](#lifecycle-events).

### Keys

Keys help identify nodes every time we update the DOM. By setting the `key` property on a virtual node, you declare that the node should correspond to a particular DOM element. This allow us to re-order the element into its new position, if the position changed, rather than risk destroying it. Keys must be unique among sibling-nodes.

```jsx
import { h } from "ultradom"

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

### Lifecycle Events

You can be notified when elements managed by the virtual DOM are created, updated or removed via lifecycle events. Use them for animation, wrapping third party libraries, cleaning up resources, etc.

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

This event is fired every time we try to update the element attributes. Use the `old` attributes inside the event handler to check if any attributes changed or not.

```jsx
import { h } from "ultradom"
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

#### onremove

This event is fired before the element is removed from the DOM. Use it to create slide/fade out animations. Call `done` inside the function to remove the element. This event is not called in its child elements.

```jsx
import { h } from "ultradom"
import { fadeout } from "dom-fade-fx"

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

## JSX

[JSX](https://facebook.github.io/jsx/) is an optional language syntax extension that lets you write HTML tags interspersed with JavaScript. To use JSX install the JSX [transform plugin](https://babeljs.io/docs/plugins/transform-react-jsx) and add the pragma option to your `.babelrc` file.

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

## Links

- [Examples](https://codepen.io/search/pens?q=ultraDOM&page=1&order=popularity&depth=everything&show_forks=false)
- [Twitter/#/ultraDOM](https://twitter.com/hashtag/ultraDOM)
- [/r/ultraDOM](https://www.reddit.com/r/ultraDOM)

## License

ultraDOM is MIT licensed. See [LICENSE](/LICENSE.md).
