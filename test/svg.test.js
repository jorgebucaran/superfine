import { h, render } from "../src/index.js"

const deepExpectNS = (element, ns) =>
  Array.from(element.childNodes).map(child => {
    expect(child.namespaceURI).toBe(ns)
    deepExpectNS(child, ns)
  })

beforeEach(() => {
  document.body.innerHTML = ""
})

test("svg", () => {
  const SVG_NS = "http://www.w3.org/2000/svg"

  const node = h("div", {}, [
    h("p", { id: "foo" }, "foo"),
    h("svg", { id: "bar", viewBox: "0 0 10 10" }, [h("foo")]),
    h("p", { id: "baz" }, "baz")
  ])

  render(null, node, document.body)

  const foo = document.getElementById("foo")
  const bar = document.getElementById("bar")
  const baz = document.getElementById("baz")

  expect(foo.namespaceURI).not.toBe(SVG_NS)
  expect(baz.namespaceURI).not.toBe(SVG_NS)
  expect(bar.namespaceURI).toBe(SVG_NS)
  expect(bar.getAttribute("viewBox")).toBe("0 0 10 10")

  deepExpectNS(bar, SVG_NS)
})
