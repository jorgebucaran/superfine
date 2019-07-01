import { h, patch } from "../src/index.js"
import { equal } from "testmatrix"
import { JSDOM } from "jsdom"

const html = `<div id="app"></div>`

global.document = new JSDOM(html).window.document

export default {
  superfine: [
    {
      name: "first test",
      assert: equal,
      actual: patch(document.getElementById("app"), h("div", {}, "hello"))
        .outerHTML,
      expected: `<div id="app">hello</div>`
    }
  ]
}
