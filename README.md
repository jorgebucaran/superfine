# Superfine [![npm](https://img.shields.io/npm/v/superfine.svg?label=&color=0080FF)](https://github.com/jorgebucaran/superfine/releases/latest) [![Travis CI](https://img.shields.io/travis/jorgebucaran/superfine/master.svg?label=)](https://travis-ci.org/jorgebucaran/superfine)

Superfine is a minimal view layer for building web interfaces. Think React without the framework—no flux, hooks or components—just the bare minimum to survive. Mix it with your favorite state management solution or use it standalone for maximum flexibility.

## Quickstart

Install the latest version of Superfine with npm or Yarn:

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

How about we start with something simple: let's create a counter that can go up or down. [Try it online here]().

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
            h("button", { onClick: () => setState(state - 1) }, "-"),
            h("button", { onClick: () => setState(state + 1) }, "+")
          ])
        )
      }

      setState(0) // Start app with the initial state.
    </script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

The `patch` function updates the DOM with your app's view. When creating a view, we use the `h` function to describe a tree of nodes. The view isn't made out of real DOM nodes, but a virtual DOM: a representation of what a DOM should look like using plain objects. By comparing the old and new virtual DOM we can patch only the parts of the DOM that changed instead of rendering the entire document from scratch.

Next, let's create a heading that changes when we type into a text field. You can [try it online](https://codepen.io/jorgebucaran/pen/LdLJXX) too.

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
          onInput: e => setState(e.target.value),
          autofocus: true
        })
      ])
    )
  }

  setState("Hello!")
</script>
```

We followed the same approach as before by defining a `setState` function. This is just a way to hide away the details of calling `patch` and make it easy to redraw the app whenever we want.

Spend some time thinking about how the view reacts to changes in the state. How about a different approach where you dispatch messages to a central store to update the state a-la Redux? Now it's your turn. Go build your own apps, or browse [more examples here](https://codepen.io/search/pens?q=superfine&page=1&order=superviewularity&depth=everything&show_forks=false).

The best way to learn Superfine is by digging your toes in the water, but if you get stuck and need help, please file an issue, and we'll try to help you out.

## Attributes

Superfine nodes can use all your favorite [HTML attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes), [SVG attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute), [DOM events](https://developer.mozilla.org/en-US/docs/Web/Events), and [keys](#keys).

### Keys

Keys help identify nodes every time we update the DOM. By setting the `key` property on a virtual node, you declare that the node should correspond to a particular DOM element. This allows us to re-order the element into its new position, if the position changed, rather than risk destroying it. Keys must be unique among sibling nodes.

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

## License

[MIT](LICENSE.md)
