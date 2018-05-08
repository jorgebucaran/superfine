import { h, render } from "./ultradom.m.js"

beforeEach(() => {
  document.body.innerHTML = ""
})

expect.extend({
  toMatchDOM(node, html) {
    render(node, document.body)
    expect(document.body.innerHTML).toBe(html.replace(/\s{2,}/g, ""))
    return { pass: true }
  }
})

const divWithId = id =>
  h(
    "div",
    {
      key: id,
      oncreate(e) {
        e.id = id
      }
    },
    id.toUpperCase()
  )

const deepExpectNS = (element, ns) =>
  Array.from(element.childNodes).map(child => {
    expect(child.namespaceURI).toBe(ns)
    deepExpectNS(child, ns)
  })

test("replace element", () => {
  expect(h("main", {})).toMatchDOM(`<main></main>`)
  expect(h("div", {})).toMatchDOM(`<div></div>`)
})

test("insert children on top", () => {
  expect(h("main", {}, [divWithId("a")])).toMatchDOM(`
    <main>
      <div id="a">A</div>
    </main>
  `)

  expect(h("main", {}, [divWithId("b"), h("div", { key: "a" }, "A")]))
    .toMatchDOM(`
    <main>
      <div id="b">B</div>
      <div id="a">A</div>
    </main>
  `)

  expect(
    h("main", {}, [
      divWithId("c"),
      h("div", { key: "b" }, "B"),
      h("div", { key: "a" }, "A")
    ])
  ).toMatchDOM(`
    <main>
      <div id="c">C</div>
      <div id="b">B</div>
      <div id="a">A</div>
    </main>
  `)
})

test("remove text node", () => {
  expect(h("main", {}, [h("div", {}, ["foo"]), "bar"])).toMatchDOM(`
    <main>
      <div>foo</div>
      bar
    </main>
  `)

  expect(h("main", {}, [h("div", {}, ["foo"])])).toMatchDOM(`
    <main>
      <div>foo</div>
    </main>
  `)
})

test("keyed nodes", () => {
  expect(
    h("main", {}, [
      divWithId("a"),
      divWithId("b"),
      divWithId("c"),
      divWithId("d"),
      divWithId("e")
    ])
  ).toMatchDOM(`
    <main>
      <div id="a">A</div>
      <div id="b">B</div>
      <div id="c">C</div>
      <div id="d">D</div>
      <div id="e">E</div>
    </main>
  `)

  expect(
    h("main", {}, [
      h("div", { key: "a" }, "A"),
      h("div", { key: "c" }, "C"),
      h("div", { key: "d" }, "D")
    ])
  ).toMatchDOM(`
    <main>
      <div id="a">A</div>
      <div id="c">C</div>
      <div id="d">D</div>
    </main>
  `)

  expect(h("main", {}, [h("div", { key: "d" }, "D")])).toMatchDOM(`
    <main>
      <div id="d">D</div>
    </main>
  `)

  expect(
    h("main", {}, [
      divWithId("a"),
      divWithId("b"),
      divWithId("c"),
      h("div", { key: "d" }, "D"),
      divWithId("e")
    ])
  ).toMatchDOM(`
    <main>
      <div id="a">A</div>
      <div id="b">B</div>
      <div id="c">C</div>
      <div id="d">D</div>
      <div id="e">E</div>
    </main>
  `)

  expect(
    h("main", {}, [
      h("div", { key: "d" }, "D"),
      h("div", { key: "c" }, "C"),
      h("div", { key: "b" }, "B"),
      h("div", { key: "a" }, "A")
    ])
  ).toMatchDOM(`
    <main>
      <div id="d">D</div>
      <div id="c">C</div>
      <div id="b">B</div>
      <div id="a">A</div>
    </main>
  `)
})

test("mixed keyed/non-keyed nodes", () => {
  expect(
    h("main", {}, [
      divWithId("a"),
      h("div", {}, "B"),
      h("div", {}, "C"),
      divWithId("d"),
      divWithId("e")
    ])
  ).toMatchDOM(`
    <main>
      <div id="a">A</div>
      <div>B</div>
      <div>C</div>
      <div id="d">D</div>
      <div id="e">E</div>
    </main>
  `)

  expect(
    h("main", {}, [
      h("div", { key: "e" }, "E"),
      h("div", {}, "C"),
      h("div", {}, "B"),
      h("div", { key: "d" }, "D"),
      h("div", { key: "a" }, "A")
    ])
  ).toMatchDOM(`
    <main>
      <div id="e">E</div>
      <div>C</div>
      <div>B</div>
      <div id="d">D</div>
      <div id="a">A</div>
    </main>
  `)

  expect(
    h("main", {}, [
      h("div", {}, "C"),
      h("div", { key: "d" }, "D"),
      h("div", { key: "a" }, "A"),
      h("div", { key: "e" }, "E"),
      h("div", {}, "B")
    ])
  ).toMatchDOM(`
    <main>
      <div>C</div>
      <div id="d">D</div>
      <div id="a">A</div>
      <div id="e">E</div>
      <div>B</div>
    </main>
  `)

  expect(
    h("main", {}, [
      h("div", { key: "e" }, "E"),
      h("div", { key: "d" }, "D"),
      h("div", {}, "B"),
      h("div", {}, "C")
    ])
  ).toMatchDOM(`
    <main>
      <div id="e">E</div>
      <div id="d">D</div>
      <div>B</div>
      <div>C</div>
    </main>
  `)
})

test("remove attribute", () => {
  expect(h("div", { id: "foo", class: "bar" })).toMatchDOM(
    `<div id="foo" class="bar"></div>`
  )

  expect(h("div")).toMatchDOM(`<div></div>`)
})

test("skip setAttribute for functions", () => {
  expect(h("div", { onclick: () => {} })).toMatchDOM(`<div></div>`)
})

test("setAttribute true", () => {
  expect(h("div", { enabled: true })).toMatchDOM(`<div enabled="true"></div>`)
})

test("update element with dynamic props", () => {
  expect(
    h("input", {
      type: "text",
      value: "foo",
      oncreate(element) {
        expect(element.value).toBe("foo")
      }
    })
  ).toMatchDOM(`<input type="text">`)

  expect(
    h("input", {
      type: "text",
      value: "bar",
      onupdate(element) {
        expect(element.value).toBe("bar")
      }
    })
  ).toMatchDOM(`<input type="text">`)
})

test("input list attribute", () => {
  expect(h("input", { list: "foobar" })).toMatchDOM(`<input list="foobar">`)
})

test("skip null and boolean children", () => {
  const expected = {
    name: "div",
    attributes: {},
    children: []
  }

  expect(h("div", {}, true)).toEqual(expected)
  expect(h("div", {}, false)).toEqual(expected)
  expect(h("div", {}, null)).toEqual(expected)
})

test("event handlers", done => {
  render(
    h("button", {
      oncreate(el) {
        el.dispatchEvent(new Event("click"))
      },
      onclick(event) {
        done()
      }
    }),
    document.body
  )
})

test("svg", () => {
  const SVG_NS = "http://www.w3.org/2000/svg"

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

test("oncreate", () => {
  render(
    h(
      "div",
      {
        oncreate: element => {
          element.className = "foo"
          expect(document.body.innerHTML).toBe(`<div class="foo">foo</div>`)
        }
      },
      "foo"
    ),
    document.body
  )
})

test("onupdate", done => {
  const view = state =>
    h(
      "div",
      {
        class: state,
        onupdate: (element, old) => {
          expect(element.textContent).toBe("bar")
          expect(old.class).toBe("foo")
          done()
        }
      },
      state
    )

  render(view("foo"), document.body)
  render(view("bar"), document.body)
})

test("onremove", done => {
  const view = state =>
    state
      ? h("ul", {}, [
          h("li"),
          h("li", {
            onremove(element, remove) {
              remove()
              expect(document.body.innerHTML).toBe("<ul><li></li></ul>")
              done()
            }
          })
        ])
      : h("ul", {}, [h("li")])

  render(view(true), document.body)
  render(view(false), document.body)
})

test("ondestroy", done => {
  const view = state =>
    state
      ? h("ul", {}, [
          h("li"),
          h("li", {}, [
            h("span", {
              ondestroy() {
                expect(document.body.innerHTML).toBe(
                  "<ul><li></li><li><span></span></li></ul>"
                )
                setTimeout(() => {
                  expect(document.body.innerHTML).toBe("<ul><li></li></ul>")
                  done()
                })
              }
            })
          ])
        ])
      : h("ul", {}, [h("li")])

  render(view(true), document.body)
  render(view(false), document.body)
})

test("onremove/ondestroy", done => {
  let destroyed = false

  const view = state =>
    state
      ? h("ul", {}, [
          h("li"),
          h("li", {
            ondestroy() {
              destroyed = true
            },
            onremove(element, remove) {
              expect(destroyed).toBe(false)
              remove()
              expect(destroyed).toBe(true)
              done()
            }
          })
        ])
      : h("ul", {}, [h("li")])

  render(view(true), document.body)
  render(view(false), document.body)
})

test("event bubbling", done => {
  let count = 0

  const view = state =>
    h(
      "main",
      {
        oncreate() {
          expect(count++).toBe(3)
        },
        onupdate() {
          expect(count++).toBe(7)
          done()
        }
      },
      [
        h("p", {
          oncreate() {
            expect(count++).toBe(2)
          },
          onupdate() {
            expect(count++).toBe(6)
          }
        }),
        h("p", {
          oncreate() {
            expect(count++).toBe(1)
          },
          onupdate() {
            expect(count++).toBe(5)
          }
        }),
        h("p", {
          oncreate() {
            expect(count++).toBe(0)
          },
          onupdate() {
            expect(count++).toBe(4)
          }
        })
      ]
    )

  render(view(), document.body)
  render(view(), document.body)
})
