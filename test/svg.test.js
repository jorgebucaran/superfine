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

test("xlink:href", () => {
  const NS_XLINK = "http://www.w3.org/1999/xlink"

  let lastNode = patch(
    null,
    h("svg", { viewBox: "0 0 10 10" }, [
      h("use", { id: "use", "xlink:href": "about:blank" })
    ]),
    document.body
  )

  const use = document.getElementById("use")
  expect(use.getAttributeNS(NS_XLINK, "href")).toBe("about:blank")

  patch(
    lastNode,
    h("svg", { viewBox: "0 0 10 10" }, [h("use", { id: "use" })]),
    document.body
  )

  expect(use.getAttributeNS(NS_XLINK, "href")).toBe(null)
})
