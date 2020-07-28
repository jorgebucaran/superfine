# Superfine

Superfine is a minimal view layer for building web interfaces. Think [Hyperapp](https://github.com/jorgebucaran/hyperapp) without the framework—no state machines, effects, or subscriptions—just the absolute bare minimum. Mix it with your own custom-flavor of state management, or use it standalone for maximum flexibility.

Here's the first example to get you started. You can copy-paste this code in a new HTML file and open it in a browser or [try it here](https://cdpn.io/LdLJXX)—it works without bundlers or compilers!

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module">
      import { h, text, patch } from "https://unpkg.com/superfine"

      const setState = (state) => {
        patch(
          document.getElementById("app"),
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

We use the `h` and `text` functions to create the "virtual" DOM nodes that represent how our DOM should look. The view isn't made out of real DOM nodes, but a bunch of plain objects. Whenever we change the state, we use `patch` under the hood to update the DOM. By comparing the old and new virtual DOM, we're able to update only the parts of the DOM that actually changed instead of rendering everything from scratch! 🙌

In the next example we show how to synchronize an text node and a text field: [try it here](https://cdpn.io/KoqxGW)—it'so easy you can probably guess what's going on without much theory.

```html
<script type="module">
  import { h, text, patch } from "https://unpkg.com/superfine"

  const setState = (state) => {
    patch(
      document.getElementById("app"),
      h("main", {}, [
        h("h1", {}, text(state)),
        h("input", {
          type: "text",
          value: state,
          oninput: (event) => setState(event.target.value),
          autofocus: true,
        }),
      ])
    )
  }

  setState("Hello!")
</script>
```

Let's take it up a notch. Rather than anonymous state updates, how about encapsulating the state-update logic inside little helper functions? You can think of them as "actions" if you want. Here's a minimal todo list app that demonstrates the idea. Go ahead and play with the code [here](https://cdpn.io/vqRZmy).

```html
<script type="module">
  import { h, text, patch } from "https://unpkg.com/superfine"

  const updateValue = (state, value) => ({ ...state, value })

  const addTodo = (state) => ({
    ...state,
    value: "",
    todos: state.todos.concat(state.value),
  })

  const setState = (state) => {
    patch(
      document.getElementById("app"),
      h("main", {}, [
        h("input", {
          type: "text",
          oninput: (event) => setState(updateValue(state, event.target.value)),
          value: state.value,
        }),
        h("button", { onclick: () => setState(addTodo(state)) }, text("Add")),
        h("ul", {},
          state.todos.map((todo) => h("li", {}, text(todo)))
        ),
      ])
    )
  }

  setState({ todos: [], value: "" })
</script>
```

Now it's your turn to take Superfine for a spin. Experiment with the code a bit. Can you add a button to clear all todos? How about marking todos as done? If you get stuck or would like to ask a question, please [file an issue](https://github.com/jorgebucaran/superfine/issues/new), and we'll try our best to help you out.

Looking for more examples? [Try this search](https://codepen.io/search/pens?q=superfine&page=1&order=superviewularity&depth=everything&show_forks=false).

## Installation

Install Superfine with npm or Yarn:

```console
npm i superfine
```

Then with a module bundler like [Rollup](https://rollupjs.org) or [Webpack](https://webpack.js.org) import it in your application and get right down to business.

```js
import { h, text, patch } from "superfine"
```

Don't want to set up a build step? Import Superfine in a `<script>` tag as a module—it works on all evergreen, self-updating desktop, and mobile browsers.

```html
<script type="module">
  import { h, text, app } from "https://unpkg.com/superfine"
</script>
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

## Special Attributes

Superfine nodes can use any [HTML attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes), [SVG attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute), [DOM events](https://developer.mozilla.org/en-US/docs/Web/Events), and [keys](#keys).

### Keys

Keys help identify nodes whenever we update the DOM. By setting the `key` property on a virtual node, you declare that the node should correspond to a particular DOM element. This allows us to re-order the element into its new position, if the position changed, rather than risk destroying it. Keys must be unique among sibling nodes.

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

## License

[MIT](LICENSE.md)
