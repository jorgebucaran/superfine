import { h } from "../src"

test("empty vnode", () => {
  expect(h("div")).toEqual({
    name: "div",
    props: {},
    children: [],
    recycled: false
  })
})

test("vnode with a single child", () => {
  expect(h("div", {}, ["foo"])).toEqual({
    name: "div",
    props: {},
    children: ["foo"],
    recycled: false
  })

  expect(h("div", {}, "foo")).toEqual({
    name: "div",
    props: {},
    children: ["foo"],
    recycled: false
  })
})

test("positional String/Number children", () => {
  expect(h("div", {}, "foo", "bar", "baz")).toEqual({
    name: "div",
    props: {},
    children: ["foo", "bar", "baz"],
    recycled: false
  })

  expect(h("div", {}, 0, "foo", 1, "baz", 2)).toEqual({
    name: "div",
    props: {},
    children: [0, "foo", 1, "baz", 2],
    recycled: false
  })

  expect(h("div", {}, "foo", h("div", {}, "bar"), "baz", "quux")).toEqual({
    name: "div",
    props: {},
    children: [
      "foo",
      {
        name: "div",
        props: {},
        children: ["bar"],
        recycled: false
      },
      "baz",
      "quux"
    ],
    recycled: false
  })
})

test("skip null and Boolean children", () => {
  const expected = {
    name: "div",
    props: {},
    children: [],
    recycled: false
  }

  expect(h("div", {}, true)).toEqual(expected)
  expect(h("div", {}, false)).toEqual(expected)
  expect(h("div", {}, null)).toEqual(expected)
})

test("name as a function (JSX functional components)", () => {
  const Title = props =>
    h(
      "div",
      {
        key: props.key,
        children: "foo"
      },
      props.children
    )

  const expected = {
    name: "div",
    props: { key: "key" },
    children: ["foo", "bar"],
    key: "key",
    recycled: false
  }

  expect(h(Title, { key: "key" }, "bar")).toEqual(expected)
  // <Title key="key">foo</Title>
})
