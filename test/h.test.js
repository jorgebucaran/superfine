import { h } from "../src/index.js"

test("skip null and Boolean children", () => {
  expect(h("div", {}, true).children).toEqual([])
  expect(h("div", {}, false).children).toEqual([])
  expect(h("div", {}, null).children).toEqual([])
})

test("name as a function (JSX component syntax)", () => {
  const expected = h("div", { key: "key" }, ["foo", "bar"])

  const Title = props =>
    h(
      "div",
      {
        key: props.key,
        children: "foo"
      },
      props.children
    )

  expect(h(Title, { key: "key" }, "bar")).toEqual(expected)
  // <Title key="key">foo</Title>
})
