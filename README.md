# Superfine

Superfine is a minimal view layer for building web interfaces. Think [Hyperapp]() without the framework—no state machines, effects, or subscriptions—just the absolute bare minimum. Mix it with your own custom-flavored state management solution, or use it standalone for maximum flexibility.

Here's the first example to get you started. You can copy and paste the following code in a new HTML file and open it in a browser or [try it here](https://cdpn.io/LdLJXX)—no bundlers or compilers!

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module">
      import { h, text, patch } from "https://unpkg.com/superfine"

      const node = document.getElementById("app")

      const setState = (state) => {
        patch(
          node,
          h("main", {}, [
            h("h1", {}, text(state)),
            h("button", { onclick: () => setState(state - 1) }, text("-")),
            h("button", { onclick: () => setState(state + 1) }, text("+")),
          ])
        )
      }

      setState(0)
    </script>
  </head>
  <body>
    <main id="app"></main>
  </body>
</html>
```

We use the hyperscript function `h` and `text` to create the "virtual" DOM nodes that represent how our DOM should look. The view isn't made out of real DOM nodes, but a bunch of plain objects. Every time we want to change the state, we use `patch` under the hood to update the real DOM. By comparing the old and new virtual DOM, we're able to update only the parts of the DOM that actually changed instead of rendering the entire document from scratch! 🙌

Here's another example that shows how to synchronize an element to a text field: [try it here](https://cdpn.io/KoqxGW).

```html
<script type="module">
  import { h, text, patch } from "https://unpkg.com/superfine"

  const node = document.getElementById("app")

  const setState = (state) => {
    patch(
      node,
      h("main", {}, [
        h("h1", {}, text(state)),
        h("input", {
          type: "text",
          value: state,
          oninput: (e) => setState(e.target.value),
          autofocus: true,
        }),
      ])
    )
  }

  setState("Hello!")
</script>
```

Now, rather than anonymous state updates, how about sending messages to a central store like in Elm or Redux? Let's work on that next. Here's a minimal implementation you can use or remix in your own projects. You can [try it here](https://cdpn.io/vqRZmy).

```html
<script type="module">
  import { h, text, patch } from "https://unpkg.com/superfine"

  const run = (
    { init, view, update, node },
    state,
    emit = (action) => next(update(state, action)),
    next = (newState) => {
      node = patch(node, view((state = newState), emit))
    }
  ) => next(init())

  run({
    init: () => 0,
    view: (state, emit) =>
      h("main", {}, [
        h("h1", {}, text(state)),
        h("button", { onclick: () => emit("Subtract") }, text("-")),
        h("button", { onclick: () => emit("Add") }, text("+")),
      ]),
    update: (state, action) =>
      action === "Subtract" ? state - 1 : action === "Add" ? state + 1 : 0,
    node: document.getElementById("app"),
  })
</script>
```

Can you feel the Redux vibes? Now it's your turn to take Superfine for a spin. If you get stuck and need help, please file an issue, and we'll try to help you out. In particular, the [Hyperapp Slack](https://hyperappjs.herokuapp.com) is a fine way to get help quickly.

Looking for more examples? [Try this search](https://codepen.io/search/pens?q=superfine&page=1&order=superviewularity&depth=everything&show_forks=false).

## Attributes

Superfine nodes can use any [HTML attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes), [SVG attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute), [DOM events](https://developer.mozilla.org/en-US/docs/Web/Events), and [keys](#keys).

### Keys

Keys help identify nodes whenever we update the DOM. By setting the `key` property on a virtual node, you declare that the node should correspond to a particular DOM element. This allows us to re-order the element into its new position, if the position changed, rather than risk destroying it. Keys must be unique among sibling nodes.

> **Warning**: Keys are not registered on the top-level node of your view. If you are toggling the top-level view, and you must use keys, wrap them in an unchanging node.

```js
import { h } from "superfine"

export const ImageGallery = (images) =>
  images.map(({ hash, url, description }) =>
    h("li", { key: hash }, [
      h("img", {
        src: url,
        alt: description,
      }),
    ])
  )
```

## API

### `h(name, props, children)`

Create virtual DOM nodes. `h` takes three arguments: a string that specifies the name of the node; an object of HTML or SVG properties, and array of child nodes (or a string for text nodes).

```js
const link = h("div", { class: "container" }, [
  h("a", { href: "#" }, text("Click Me")),
])
```

### `text(text)`

Create a virtual text node.

```js
const movieTitle = h("h1", {}, text("The Shining"))
```

### `patch(node, vdom)`

Render a virtual DOM. `patch` takes a DOM node, a virtual DOM, and returns the updated DOM node.

```js
const main = patch(
  document.getElementById("main"),
  h("h1", {}, text("Superfine!"))
)
```

## License

[MIT](LICENSE.md)
