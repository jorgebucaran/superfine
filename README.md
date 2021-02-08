# _Superfine_

Superfine is a minimal view layer for building web interfaces. Think [Hyperapp](https://github.com/jorgebucaran/hyperapp) without the framework—no state machines, effects, or subscriptions—just the absolute bare minimum (1 kB minified+gzipped). Mix it with your favorite state management library or use it standalone for maximum flexibility.

Here's the first example to get you started. [Try it here](https://codepen.io/jorgebucaran/pen/LdLJXX?editors=1000)—no build step required!

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module">
      import { h, text, patch } from "https://unpkg.com/superfine"

      const setState = (state) =>
        patch(
          document.getElementById("app"),
          h("main", {}, [
            h("h1", {}, text(state)),
            h("button", { onclick: () => setState(state - 1) }, text("-")),
            h("button", { onclick: () => setState(state + 1) }, text("+")),
          ])
        )

      setState(0)
    </script>
  </head>
  <body>
    <main id="app"></main>
  </body>
</html>
```

When describing how a page looks in Superfine, we don't write markup. Instead, we use the `h()` and `text()` functions to create a lightweight representation of the DOM (or virtual DOM for short), and `patch()` to actually render the DOM.

Superfine won't re-create the entire DOM every time we use `patch()`. By comparing the old and new virtual DOM we are able to change only the parts of the DOM that need to change instead of rendering everything from scratch.

Next up, let's take a look at a simple todo app. You can only add or cross off todos with it. Can you figure out what's happening just by poking around the code a bit? [Have a go here](https://codepen.io/jorgebucaran/pen/KoqxGW).

<!-- prettier-ignore -->
```html
<script type="module">
  import { h, text, patch } from "https://unpkg.com/superfine"

  const updateValue = (state, value) => ({ ...state, value })

  const addTodo = (state) => ({
    ...state,
    value: "",
    todos: state.todos.concat(state.value).filter(any => any),
  })

  const setState = (state) => {
    patch(
      document.getElementById("app"),
      h("main", {}, [
        h("h2", {}, text("To do list")),
        h("section", {}, [
          h("input", {
            type: "text",
            value: state.value,
            oninput: ({ target }) =>
              setState(updateValue(state, target.value)),
          }),
          h("button",
            { onclick: () => setState(addTodo(state)) },
            text("Add todo")
          ),
        ]),
        h("ul", {},
          state.todos.map((todo) =>
            h("li", {}, [
              h("label", {}, [
                h("input", { type: "checkbox" }),
                h("span", {}, text(todo))
              ]),
            ])
          )
        ),
      ])
    )
  }

  setState({ todos: [], value: "" })
</script>
```

[Find more examples here](https://codepen.io/collection/nVVmyg?grid_type=grid)

Now it's your turn to take Superfine for a spin. Can you add a button to clear all todos? How about bulk-marking as done? If you get stuck or would like to ask a question, just [file an issue](https://github.com/jorgebucaran/superfine/issues/new) and I'll try to help you out—have fun! ✨

## Installation

```console
npm install superfine
```

Then with a module bundler import like you would anything else.

```js
import { h, text, patch } from "superfine"
```

Or right in your browser without a build step.

```html
<script type="module">
  import { h, text, app } from "https://unpkg.com/superfine"
</script>
```

## Top-Level API

### `h(type, props, [children])`

Create them virtual DOM nodes! `h()` takes the node type; an object of [HTML or SVG attributes](#attributes-api), and an array of child nodes (or just one child node).

```js
h("main", { class: "relative" }, [
  h("label", { for: "outatime" }, text("Destination time:")),
  h("input", { id: "outatime", type: "date", value: "2015-10-21" }),
])
```

---

### `text(string)`

Create a virtual DOM text node.

```js
h("h1", {}, text("1.21 Gigawatts!?!"))
```

---

### `patch(node, vdom)`

Render a virtual DOM on the DOM efficiently. `patch()` takes an existing DOM node, a virtual DOM, and returns the freshly patched DOM.

```js
const node = patch(
  document.getElementById("app"),
  h("main", {}, [
    // ...
  ])
)
```

## Attributes API

Superfine nodes can use any of the [HTML attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes), [SVG attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute), [DOM events](https://developer.mozilla.org/en-US/docs/Web/Events), and also [keys](#keys).

### `class:`

To specify one or more CSS classes, use the `class` attribute. This applies to all regular DOM and SVG elements alike. The `class` attribute expects a string.

```js
const mainView = h("main", { class: "relative flux" }, [
  // ...
])
```

### `style:`

Use the `style` attribute to apply arbitrary CSS rules to your DOM nodes. The `style` attribute expects a string.

> **Important**: We don't recommend using the `style` attribute as the primary means of styling elements. In most cases, `class` should be used to reference classes defined in an external CSS stylesheet.

```js
const alertView = h("h1", { style: "color:red" }, text("Great Scott!"))
```

### `key:`

Keys help identify nodes whenever we update the DOM. By setting the `key` property on a virtual DOM node, you declare that the node should correspond to a particular DOM element. This allows us to re-order the element into its new position, if the position changed, rather than risk destroying it.

> **Important**: Keys must be unique among sibling nodes.

```js
import { h } from "superfine"

export const imageGalleryView = (images) =>
  images.map(({ hash, url, description }) =>
    h("li", { key: hash }, [
      h("img", {
        src: url,
        alt: description,
      }),
    ])
  )
```

## Recycling

Superfine will patch over server-side rendered HTML, recycling existing content instead of creating new elements. This technique enables better SEO, as search engine crawlers will see the fully rendered page more easily. And on slow internet or slow devices, users will enjoy faster time-to-content as HTML renders before your JavaScript is downloaded and executed.

<!-- prettier-ignore -->
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module">
      import { h, text, patch } from "https://unpkg.com/superfine"

      const setState = (state) =>
        patch(
          document.getElementById("app"),
          h("main", {}, [
            h("h1", {}, text(state)),
            h("button", { onclick: () => setState(state - 1) }, text("-")),
            h("button", { onclick: () => setState(state + 1) }, text("+")),
          ])
        )

      setState(0)
    </script>
  </head>
  <body>
    <main id="app"><h1>0</h1><button>-</button><button>+</button></main>
  </body>
</html>
```

> Notice that all the necessary HTML is already served with the document.

Superfine expects the markup to be identical between the server and the client. Treat mismatches as bugs and fix them! Now you just need a way to send content to browsers.

## JSX

JSX is a language syntax extension that lets you write HTML tags interspersed with JavaScript. To compile JSX to JavaScript, install the [JSX transform plugin](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx), and create a `.babelrc` file in the root of your project like this:

```json
{
  "plugins": [["transform-react-jsx", { "pragma": "h" }]]
}
```

Superfine doesn't support JSX out of the box, but adding it to your project is easy.

```js
import { h, text } from "superfine"

export default (type, props, ...children) =>
  typeof type === "function"
    ? type(props, children)
    : h(
        type,
        props || {},
        []
          .concat(...children)
          .map((any) =>
            typeof any === "string" || typeof any === "number" ? text(any) : any
          )
      )
```

Import that everywhere you're using JSX and you'll be good to go. [Here's a working example](https://cdpn.io/e/wXEBYO?editors=0010).

```js
import jsx from "./jsx.js"
import { patch } from "superfine"
```

## License

[MIT](LICENSE.md)
