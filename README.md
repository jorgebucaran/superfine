# Superfine [![npm](https://img.shields.io/npm/v/superfine.svg?label=&color=0080FF)](https://github.com/jorgebucaran/superfine/releases/latest)

Superfine is a minimal view layer for building web interfaces. Think React without the framework—no flux, hooks, or components—just the bare minimum to survive. Mix it with your favorite state management solution, or use it standalone for maximum flexibility.

## Quickstart

Install Superfine with npm or Yarn:

```console
npm i superfine
```

Then with a module bundler like [Parcel](https://parceljs.org) or [Webpack](https://webpack.js.org), import what you need and start using it in your project.

```js
import { h, patch } from "superfine"
```

Fear the build step? Import Superfine in a `<script>` tag as a module. Don't worry; modules are supported in all evergreen, self-updating desktop, and mobile browsers.

```html
<script type="module">
  import { h, app } from "https://unpkg.com/superfine"
</script>
```

How about we start with something simple: let's create a counter that can go up or down. You can copy and paste the following code in a new HTML file or go ahead and [try it here](https://cdpn.io/LdLJXX).

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module">
      import { h, patch } from "https://unpkg.com/superfine"

      const node = document.getElementById("app")

      const setState = state => {
        patch(
          node,
          h("div", {}, [
            h("h1", {}, state),
            h("button", { onclick: () => setState(state - 1) }, "-"),
            h("button", { onclick: () => setState(state + 1) }, "+")
          ])
        )
      }

      setState(0) // Start app with initial state.
    </script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

The hyperscript function `h` describes our view as a tree of nodes. The view isn't made out of real DOM nodes, but a virtual DOM: a representation of how the DOM should look using a plain object.

The `patch` function updates the DOM to match our view. By comparing the old and new virtual DOM we can patch only the parts of the DOM that changed instead of rendering the entire document from scratch. Profit!

The next example uses the same custom `setState` approach to show a heading syncronized to a text field ([try it here](https://cdpn.io/KoqxGW)).

```html
<script type="module">
  import { h, patch } from "https://unpkg.com/superfine"

  const node = document.getElementById("app")

  const setState = state => {
    patch(
      node,
      h("div", {}, [
        h("h1", {}, state),
        h("input", {
          type: "text",
          value: state,
          oninput: e => setState(e.target.value),
          autofocus: true
        })
      ])
    )
  }

  setState("Hello!")
</script>
```

Spend some time thinking about how the view reacts to changes in the state. Rather than anonymous state updates, how about dispatching messages to a central store a-la Elm/Redux? Let's work on that next (or [try it here](https://cdpn.io/vqRZmy)).

```html
<script type="module">
  import { h, patch } from "https://unpkg.com/superfine"

  const start = ({ init, view, update, node }, state) => {
    const setState = newState => {
      state = newState
      node = patch(node, view(app))
    }
    const app = {
      dispatch: name => setState(update(state, name)),
      getState: () => state
    }
    setState(init())
  }

  start({
    init: () => 0,
    view: app =>
      h("div", {}, [
        h("h1", {}, app.getState()),
        h("button", { onclick: () => app.dispatch("DOWN") }, "-"),
        h("button", { onclick: () => app.dispatch("UP") }, "+")
      ]),
    update: (state, msg) =>
      msg === "DOWN" ? state - 1 : msg === "UP" ? state + 1 : 0,
    node: document.getElementById("app")
  })
</script>
```

Why `init` instead of `state`, or `update` rather than `actions` is not important. Moving `start` to a different module would be a good idea too, but having it all in the same file helps to see the big picture.

Now it's your turn to take Superfine for a spin. If you get stuck and need help, please file an issue, and we'll try to help you out. In particular, the [Hyperapp Slack](https://hyperappjs.herokuapp.com) is a great way to get help quickly. Looking for more examples? [Here you go](https://codepen.io/search/pens?q=superfine&page=1&order=superviewularity&depth=everything&show_forks=false).

## Attributes

Superfine nodes can use all your favorite [HTML attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes), [SVG attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute), [DOM events](https://developer.mozilla.org/en-US/docs/Web/Events), and also [keys](#keys).

### Keys

Keys help identify nodes whenever we update the DOM. By setting the `key` property on a virtual node, you declare that the node should correspond to a particular DOM element. This allows us to re-order the element into its new position, if the position changed, rather than risk destroying it. Keys must be unique among sibling nodes.

> **Warning**: Keys are not registered on the top-level node of your view. If you are toggling the top-level view, and you must use keys, wrap them in an unchanging node.

```js
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

## API

### `h(name, props, children)`

Create virtual DOM nodes. `h` takes three arguments: a string that specifies the name of the node; an object of HTML or SVG properties, and array of child nodes (or a string for text nodes).

```js
const link = h("div", { class: "container" }, [
  h("a", { href: "#" }, "Click Me")
])
```

### `patch(node, vdom)`

Render a virtual DOM. `patch` takes a DOM node, a virtual DOM, and returns the updated DOM node.

```js
const main = patch(document.getElementById("main"), h("h1", {}, "Superfine!"))
```

## License

[MIT](LICENSE.md)
