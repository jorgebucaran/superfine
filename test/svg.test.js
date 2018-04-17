import { h, render } from "../src"

const SVG_NS = "http://www.w3.org/2000/svg"

const deepExpectNS = (element, ns) =>
  Array.from(element.childNodes).map(child => {
    expect(child.namespaceURI).toBe(ns)
    deepExpectNS(child, ns)
  })

test("svg", () => {
  const node = h("div", {}, [
    h("p", { id: "foo" }, "foo"),
    h("svg", { id: "bar", viewBox: "0 0 10 10" }, [h("foo")]),
    h("p", { id: "baz" }, "baz")
  ])

  render(node, document.body)

  const foo = document.getElementById("foo")
  const bar = document.getElementById("bar")
  const baz = document.getElementById("baz")

  expect(foo.namespaceURI).not.toBe(SVG_NS)
  expect(baz.namespaceURI).not.toBe(SVG_NS)
  expect(bar.namespaceURI).toBe(SVG_NS)
  expect(bar.getAttribute("viewBox")).toBe("0 0 10 10")

  deepExpectNS(bar, SVG_NS)
})
