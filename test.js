import { h, render } from "./ultradom.mjs"

console.log(h, render)

function testTrees(name, trees) {
  test(name, done => {
    trees.map(tree => {
      render(tree.node, document.body)
      expect(document.body.innerHTML).toBe(tree.html.replace(/\s{2,}/g, ""))
    })
    done()
  })
}

beforeEach(() => {
  document.body.innerHTML = ""
})

beforeEach(() => {
  document.body.innerHTML = ""
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

test("positional string/number children", () => {
  expect(h("div", {}, "foo", "bar", "baz")).toEqual({
    name: "div",
    attributes: {},
    children: ["foo", "bar", "baz"]
  })

  expect(h("div", {}, 0, "foo", 1, "baz", 2)).toEqual({
    name: "div",
    attributes: {},
    children: [0, "foo", 1, "baz", 2]
  })

  expect(h("div", {}, "foo", h("div", {}, "bar"), "baz", "quux")).toEqual({
    name: "div",
    attributes: {},
    children: [
      "foo",
      {
        name: "div",
        attributes: {},
        children: ["bar"]
      },
      "baz",
      "quux"
    ]
  })
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

testTrees("replace element", [
  {
    node: h("main", {}),
    html: `<main></main>`
  },
  {
    node: h("div", {}),
    html: `<div></div>`
  }
])

testTrees("insert children on top", [
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      h("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="b">B</div>
          <div id="a">A</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      h("div", { key: "b" }, "B"),
      h("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="c">C</div>
          <div id="b">B</div>
          <div id="a">A</div>
        </main>
      `
  }
])

testTrees("remove text node", [
  {
    node: h("main", {}, [h("div", {}, ["foo"]), "bar"]),
    html: `
        <main>
          <div>foo</div>
          bar
        </main>
      `
  },
  {
    node: h("main", {}, [h("div", {}, ["foo"])]),
    html: `
        <main>
          <div>foo</div>
        </main>
      `
  }
])

testTrees("keyed", [
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      h(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      h(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      h(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      h(
        "div",
        {
          key: "e",
          oncreate(e) {
            e.id = "e"
          }
        },
        "E"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
          <div id="b">B</div>
          <div id="c">C</div>
          <div id="d">D</div>
          <div id="e">E</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", { key: "a" }, "A"),
      h("div", { key: "c" }, "C"),
      h("div", { key: "d" }, "D")
    ]),
    html: `
        <main>
          <div id="a">A</div>
          <div id="c">C</div>
          <div id="d">D</div>
        </main>
      `
  },
  {
    node: h("main", {}, [h("div", { key: "d" }, "D")]),
    html: `
        <main>
          <div id="d">D</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      h(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      h(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      h("div", { key: "d" }, "D"),
      h(
        "div",
        {
          key: "e",
          oncreate(e) {
            e.id = "e"
          }
        },
        "E"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
          <div id="b">B</div>
          <div id="c">C</div>
          <div id="d">D</div>
          <div id="e">E</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", { key: "d" }, "D"),
      h("div", { key: "c" }, "C"),
      h("div", { key: "b" }, "B"),
      h("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="d">D</div>
          <div id="c">C</div>
          <div id="b">B</div>
          <div id="a">A</div>
        </main>
      `
  }
])

testTrees("mixed keyed/non-keyed", [
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      h("div", {}, "B"),
      h("div", {}, "C"),
      h(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      h(
        "div",
        {
          key: "e",
          oncreate(e) {
            e.id = "e"
          }
        },
        "E"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
          <div>B</div>
          <div>C</div>
          <div id="d">D</div>
          <div id="e">E</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", { key: "e" }, "E"),
      h("div", {}, "C"),
      h("div", {}, "B"),
      h("div", { key: "d" }, "D"),
      h("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="e">E</div>
          <div>C</div>
          <div>B</div>
          <div id="d">D</div>
          <div id="a">A</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", {}, "C"),
      h("div", { key: "d" }, "D"),
      h("div", { key: "a" }, "A"),
      h("div", { key: "e" }, "E"),
      h("div", {}, "B")
    ]),
    html: `
        <main>
          <div>C</div>
          <div id="d">D</div>
          <div id="a">A</div>
          <div id="e">E</div>
          <div>B</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", { key: "e" }, "E"),
      h("div", { key: "d" }, "D"),
      h("div", {}, "B"),
      h("div", {}, "C")
    ]),
    html: `
        <main>
          <div id="e">E</div>
          <div id="d">D</div>
          <div>B</div>
          <div>C</div>
        </main>
      `
  }
])

testTrees("styles", [
  {
    node: h("div"),
    html: `<div></div>`
  },
  {
    node: h("div", {
      style: { color: "red", fontSize: "1em", "--foo": "red" }
    }),
    html: `<div style="color: red; font-size: 1em;"></div>`
  },
  {
    node: h("div", {
      style: { color: "blue", float: "left", "--foo": "blue" }
    }),
    html: `<div style="color: blue; float: left;"></div>`
  },
  {
    node: h("div"),
    html: `<div style=""></div>`
  }
])

testTrees("removeAttribute", [
  {
    node: h("div", { id: "foo", class: "bar" }),
    html: `<div id="foo" class="bar"></div>`
  },
  {
    node: h("div"),
    html: `<div></div>`
  }
])

testTrees("skip setAttribute for functions", [
  {
    node: h("div", {
      onclick() {}
    }),
    html: `<div></div>`
  }
])

testTrees("setAttribute true", [
  {
    node: h("div", {
      enabled: true
    }),
    html: `<div enabled="true"></div>`
  }
])

testTrees("update element with dynamic props", [
  {
    node: h("input", {
      type: "text",
      value: "foo",
      oncreate(element) {
        expect(element.value).toBe("foo")
      }
    }),
    html: `<input type="text">`
  },
  {
    node: h("input", {
      type: "text",
      value: "bar",
      onupdate(element) {
        expect(element.value).toBe("bar")
      }
    }),
    html: `<input type="text">`
  }
])

testTrees("input list attribute", [
  {
    node: h("input", {
      list: "foobar"
    }),
    html: `<input list="foobar">`
  }
])

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

const deepExpectNS = (element, ns) =>
  Array.from(element.childNodes).map(child => {
    expect(child.namespaceURI).toBe(ns)
    deepExpectNS(child, ns)
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
