import { h, patch } from "../src/index.js"

const expectDeepNS = (element, ns) =>
  Array.from(element.childNodes).map(child => {
    expect(child.namespaceURI).toBe(ns)
    expectDeepNS(child, ns)
  })

beforeEach(() => {
  document.body.innerHTML = ""
})

test("svg", () => {
  const SVG_NS = "http://www.w3.org/2000/svg"

  const view = state =>
    h("div", {}, [
      h("p", { id: "foo" }, "foo"),
      h("svg", { id: state, viewBox: "0 0 10 10" }, [h(state)])
    ])

  let node = patch(null, view("bar"), document.body)

  const foo = document.getElementById("foo")
  const bar = document.getElementById("bar")

  expect(foo.namespaceURI).not.toBe(SVG_NS)
  expect(bar.namespaceURI).toBe(SVG_NS)
  expect(bar.getAttribute("viewBox")).toBe("0 0 10 10")
  expectDeepNS(bar, SVG_NS)

  patch(node, view("baz"), document.body)

  const baz = document.getElementById("baz")
  expect(baz.namespaceURI).toBe(SVG_NS)
  expectDeepNS(baz, SVG_NS)
})
