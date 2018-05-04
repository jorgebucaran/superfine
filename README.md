# _Ultradom_

[![Travis CI](https://img.shields.io/travis/jorgebucaran/ultradom/master.svg)](https://travis-ci.org/jorgebucaran/ultradom)
[![Codecov](https://img.shields.io/codecov/c/github/jorgebucaran/ultradom/master.svg)](https://codecov.io/gh/jorgebucaran/ultradom)
[![npm](https://img.shields.io/npm/v/ultradom.svg)](https://www.npmjs.org/package/ultradom)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "#ultradom")

Ultradom is a minimal (1 kB) view layer for building declarative web user interfaces. Mix it with your favorite state management library or use it standalone for maximum flexibility.

What's in the bundle? A virtual DOM diff engine, keyed-based node [reconciliation](#keys), element-level [lifecycle events](#lifecycle-events) and browser support all the way back to IE9 — no polyfills required.

## Installation

<pre>
npm i <a href=https://www.npmjs.com/package/ultradom>ultradom</a>
</pre>

Don't want to set up a build environment? Download Ultradom from a CDN like [unpkg.com](https://unpkg.com/ultradom) and it will be globally available through the <samp>window.ultradom</samp> object.

```html
<script src="https://unpkg.com/ultradom"></script>
```

## Usage

Let's walkthrough a simple ticking clock. You can [try it online](https://codepen.io/jorgebucaran/pen/wjvEBj?editors=0010) to see what it looks like.

```js
import { h, render } from "ultradom"

setInterval(
  () =>
    render(
      h("div", {}, [
        h("h1", {}, `The time is: ${new Date().toLocaleTimeString()}`)
      ]),
      document.body
    ),
  1000
)
```

Ultradom consists of a two-function API. <samp>ultradom.h</samp> creates a new virtual DOM node and <samp>ultradom.render</samp> renders it into a supplied container. Ultradom nodes support [HTML attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes), [SVG attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute), [DOM events](https://developer.mozilla.org/en-US/docs/Web/Events), [styles](#styles), [lifecycle events](#lifecycle-events) and [keys](#keys).

A virtual DOM is a description of what a DOM should look like using a tree of nested JavaScript objects known as virtual nodes. It allows us to write code as if the entire document is rebuilt every time we render a node, while we only update the parts of the DOM that actually changed.

We try to do this in the least number of steps possible, by comparing the new virtual DOM against the previous one. This leads to high efficiency, since typically only a small percentage of nodes need to change, and changing real DOM nodes is costly compared to recalculating the virtual DOM.

### Styles

The <samp>style</samp> attribute expects a plain object rather than a string as in HTML. Each declaration consists of a style name property written in <samp>camelCase</samp> and a value.

```jsx
import { h } from "ultradom"

export const Banner = ({ text, imgUrl }) =>
  h(
    "div",
    {
      style: {
        color: "white",
        fontSize: "32px",
        textAlign: "center",
        backgroundImage: `url(${imgUrl})`
      }
    },
    text
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
  h("div", { onremove: (element, done) => fadeout(element).then(done) }, [
    h("h1", {}, title)
  ])
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

Keys helps identify nodes every time we update the DOM. By setting the <samp>key</samp> property on a virtual node, you declare that the node should correspond to a particular DOM element. This allow us to re-order the element into its new position, if the position changed, rather than risk destroying it. Note that keys must be unique among sibling-nodes.

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

## Links

* [Examples](https://codepen.io/search/pens?q=ultradom&page=1&order=popularity&depth=everything&show_forks=false)
* [Slack#ultradom](https://hyperappjs.herokuapp.com)
* [Twitter/#/ultradom](https://twitter.com/hashtag/ultradom)
* [/r/ultradom](https://www.reddit.com/r/ultradom)

## License

Ultradom is MIT licensed. See [LICENSE](/LICENSE.md).
