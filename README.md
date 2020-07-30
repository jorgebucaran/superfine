# Superfine

Superfine is a minimal view layer for building web interfaces. Think [Hyperapp](https://github.com/jorgebucaran/hyperapp) without the framework—no state machines, effects, or subscriptions—just the absolute bare minimum. Mix it with your favorite state management library or use it standalone for maximum flexibility.

Here's the first example to get you started. You can copy-paste this code in a new HTML file and open it in a browser, or [try it here](https://cdpn.io/LdLJXX)—it works without bundlers or compilers!

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

Let's go through the code and talk about it. If you're new to JavaScript modules, you can [catch up here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). We'll be using modules for all the examples in this documentation, so make sure you are not getting stuck on that.

```js
import { h, text, patch } from "https://unpkg.com/superfine"
```

Using the `h` and `text` functions we create "virtual" DOM (and text) nodes that represent how the DOM should look. Our view isn't made out of real DOM nodes, but a bunch of plain objects. Whenever we set the state, we use `patch` under the hood to update the DOM. By comparing the old and new virtual DOM, we're able to update only the parts of the DOM that actually changed instead of rendering everything from scratch! 🙌

In the next example we show how to synchronize a text node with a text field: [try it here](https://cdpn.io/KoqxGW)—it'so easy you can probably skip the theory and figure out what's happening by poking around the code a bit.

```html
<script type="module">
  import { h, text, patch } from "https://unpkg.com/superfine"

  const setState = (state) =>
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

  setState("Hello!")
</script>
```

Now let's take it up a notch. Rather than anonymous state updates, how about encapsulating the update logic inside little helper functions? If it helps, you can think of them as "actions". Here's a minimal todo list app that demonstrates the idea. Go ahead and [play with the code here](https://cdpn.io/MWKdOBj).

```html
<script type="module">
  import { h, text, patch } from "https://unpkg.com/superfine"

  const updateValue = (state, value) => ({ ...state, value })

  const addTodo = (state) => ({
    ...state,
    value: "",
    todos: state.todos.concat(state.value),
  })

  const setState = (state) =>
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

  setState({ todos: [], value: "" })
</script>
```

Now it's your turn to take Superfine for a spin. Experiment with the code a bit. Can you add a button to clear todos? How about bull-marking as done? Surprise me. If you get stuck or would like to ask a question, just [file an issue](https://github.com/jorgebucaran/superfine/issues/new) and we'll try our best to help you out—good luck!

Looking for more examples? [Browse this collection](https://codepen.io/collection/nVVmyg).

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

### `h(name, props, [children])`

Create virtual DOM nodes. `h` takes three arguments: a string of the node type: `a`, `input`, `form`, etc; an object of HTML or SVG properties, and an array of child nodes (or just one child node).

```js
h("section", { class: "container" }, [h("a", { href: "#" }, text("Click Me"))]) //=> <section class=container><a href=#>Click Me</a></section>
```

### `text(text)`

Create a virtual text node.

```js
h("h1", {}, text("Super 8")) //=> "Super 8"
```

### `patch(node, vdom)`

Render a virtual DOM. `patch` takes a DOM node, a virtual DOM, and returns the updated DOM node.

```js
patch(
  document.getElementById("main"),
  h("h1", {}, text("Supercalifragilisticexpialidocious!"))
)
```

## Special Attributes

Superfine nodes can use any [HTML attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes), [SVG attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute), [DOM events](https://developer.mozilla.org/en-US/docs/Web/Events), and [keys](#keys).

### Keys

Keys help identify nodes whenever we update the DOM. By setting the `key` property on a virtual node, you declare that the node should correspond to a particular DOM element. This allows us to re-order the element into its new position, if the position changed, rather than risk destroying it. Keys must be unique among sibling nodes.

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

## JSX

JSX is a language syntax extension that lets you write HTML tags interspersed with JavaScript. To compile JSX to JavaScript, install the [JSX transform plugin](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx), and create a `.babelrc` file in the root of your project like this one.

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

Superfine doesn't support JSX out of the box, but you can add it to your project easily. All we need to do is wrap our `h` and `text` functions and handle function components, variable arguments and nested arrays like this.

```js
import { h, text } from "superfine"

export default (type, props, ...children) =>
  typeof type === "function"
    ? type(props, children)
    : h(type,
        props || {},
        [].concat(...children)
          .map((any) =>
            typeof any === "string" || typeof any === "number" ? text(any) : any
          )
      )
```

Now import it everywhere you're using JSX and you're good to go. [Here's an example](https://cdpn.io/wXEBYO).

```js
import jsx from "./jsx.js"
import { patch } from "superfine"
```

## License

[MIT](LICENSE.md)
