const { h, patch } = require("./dist/turbodom")
const assert = require("assert")

assert.deepEqual(h("div", { id: "main" }, ["Hello"]), {
  tag: "div",
  data: { id: "main" },
  children: ["Hello"]
})
