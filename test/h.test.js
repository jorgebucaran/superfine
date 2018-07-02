import { h } from "../src/index.js"

test("skip null and Boolean children", () => {
  expect(h("div", {}, true).children).toEqual([])
  expect(h("div", {}, false).children).toEqual([])
  expect(h("div", {}, null).children).toEqual([])
})

test("name as a function (JSX component syntax)", () => {
  const Title = props => h("div", { key: props.key }, props.children)

  expect(h(Title, { key: "key", children: "foo" })).toEqual(
    h("div", { key: "key" }, ["foo"])
  )

  expect(h(Title, { key: "key", children: "foo" }, "bar")).toEqual(
    h("div", { key: "key" }, ["bar"])
  )
})
