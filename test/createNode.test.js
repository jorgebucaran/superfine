import { createNode as U } from "../src"

test("empty vnode", () => {
  expect(U("div")).toEqual({
    nodeName: "div",
    attributes: {},
    children: []
  })
})

test("vnode with a single child", () => {
  expect(U("div", {}, ["foo"])).toEqual({
    nodeName: "div",
    attributes: {},
    children: ["foo"]
  })

  expect(U("div", {}, "foo")).toEqual({
    nodeName: "div",
    attributes: {},
    children: ["foo"]
  })
})

test("positional String/Number children", () => {
  expect(U("div", {}, "foo", "bar", "baz")).toEqual({
    nodeName: "div",
    attributes: {},
    children: ["foo", "bar", "baz"]
  })

  expect(U("div", {}, 0, "foo", 1, "baz", 2)).toEqual({
    nodeName: "div",
    attributes: {},
    children: [0, "foo", 1, "baz", 2]
  })

  expect(U("div", {}, "foo", U("div", {}, "bar"), "baz", "quux")).toEqual({
    nodeName: "div",
    attributes: {},
    children: [
      "foo",
      {
        nodeName: "div",
        attributes: {},
        children: ["bar"]
      },
      "baz",
      "quux"
    ]
  })
})

test("vnode with attributes", () => {
  const attributes = {
    id: "foo",
    class: "bar",
    style: {
      color: "red"
    }
  }

  expect(U("div", attributes, "baz")).toEqual({
    nodeName: "div",
    attributes,
    children: ["baz"]
  })
})

test("skip null and Boolean children", () => {
  const expected = {
    nodeName: "div",
    attributes: {},
    children: []
  }

  expect(U("div", {}, true)).toEqual(expected)
  expect(U("div", {}, false)).toEqual(expected)
  expect(U("div", {}, null)).toEqual(expected)
})

test("components", () => {
  const Component = (attributes, children) => U("div", attributes, children)

  expect(U(Component, { id: "foo" }, "bar")).toEqual({
    nodeName: "div",
    attributes: { id: "foo" },
    children: ["bar"]
  })

  expect(U(Component, { id: "foo" }, [U(Component, { id: "bar" })])).toEqual({
    nodeName: "div",
    attributes: { id: "foo" },
    children: [
      {
        nodeName: "div",
        attributes: { id: "bar" },
        children: []
      }
    ]
  })
})

test("component with no attributes adds default attributes", () => {
  const Component = ({ name = "world" }, children) =>
    U("div", {}, "Hello " + name)

  expect(U(Component)).toEqual({
    nodeName: "div",
    attributes: {},
    children: ["Hello world"]
  })
})
