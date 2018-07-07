import { h, patch, recycle } from "../src/index.js"

beforeEach(() => {
  document.body.innerHTML = ""
})

expect.extend({
  toMatchDOM(nodes, results) {
    nodes.reduce((lastNode, nextNode, i) => {
      const node = patch(lastNode, nextNode, document.body)
      expect(document.body.innerHTML).toBe(results[i].replace(/\s{2,}/g, ""))
      return node
    }, null)

    return { pass: true }
  }
})

const expectDeepNS = (el, ns) =>
  Array.from(el.childNodes).map(child => {
    expect(child.namespaceURI).toBe(ns)
    expectDeepNS(child, ns)
  })

const tag = name => (props, children) =>
  h(
    name,
    Array.isArray(props) ? {} : props,
    Array.isArray(props) ? props : children
  )

const { div, main, input, ul, li, svg, use } = [
  "div",
  "main",
  "input",
  "ul",
  "li",
  "svg"
].reduce((fns, name) => ({ ...fns, [name]: tag(name) }), {})

const fake = key => div({ key, oncreate: e => (e.id = key) }, key.toUpperCase())

test("skip null and Boolean children", () => {
  expect(div([true]).children).toEqual([])
  expect(div([false]).children).toEqual([])
  expect(div([null]).children).toEqual([])
})

test("name as a function (JSX component syntax)", () => {
  const Title = props => div({ key: props.key }, props.children)

  expect(h(Title, { key: "key", children: "foo" })).toEqual(
    div({ key: "key" }, ["foo"])
  )

  expect(h(Title, { key: "key", children: "foo" }, "bar")).toEqual(
    div({ key: "key" }, ["bar"])
  )
})

test("skip equal nodes", () => {
  const node = div(["foo"])

  patch(node, node, document.body)

  expect(document.body.innerHTML).toBe("")
})

test("remove attribute", () => {
  expect([
    div({
      id: "foo",
      class: "bar"
    }),
    div()
  ]).toMatchDOM([`<div id="foo" class="bar"></div>`, `<div></div>`])
})

test("styles", () => {
  expect([
    div({ style: { color: "red", fontSize: "1em", "--foo": "red" } }),
    div({ style: { color: "blue", float: "left", "--foo": "blue" } }),
    div()
  ]).toMatchDOM([
    `<div style="color: red; font-size: 1em;"></div>`,
    `<div style="color: blue; float: left;"></div>`,
    `<div style=""></div>`
  ])
})

test("update element with dynamic props", () => {
  expect([
    input({
      type: "text",
      value: "foo",
      oncreate: el => expect(el.value).toBe("foo")
    }),
    input({
      type: "text",
      value: "bar",
      onupdate: el => expect(el.value).toBe("bar")
    })
  ]).toMatchDOM([`<input type="text">`, `<input type="text">`])
})

test("input list attribute", () => {
  expect([input({ list: "foobar" })]).toMatchDOM([`<input list="foobar">`])
})

test("event handlers", done => {
  patch(
    null,
    div({
      onclick: () => done(),
      oncreate: el => el.dispatchEvent(new Event("click"))
    }),
    document.body
  )
})

test("replace element", () => {
  expect([main(), div()]).toMatchDOM([`<main></main>`, `<div></div>`])
})

test("keyed nodes", () => {
  expect([
    main([fake("a"), fake("b"), fake("c")]),
    main([div({ key: "a" }, "A"), div({ key: "b" }, "B")]),
    main([div({ key: "b" }, "B")]),
    main([fake("a"), div({ key: "b" }, "B"), fake("c")]),
    main([div({ key: "b" }, "B"), div({ key: "a" }, "A")])
  ]).toMatchDOM([
    `<main><div id="a">A</div><div id="b">B</div><div id="c">C</div></main>`,
    `<main><div id="a">A</div><div id="b">B</div></main>`,
    `<main><div id="b">B</div></main>`,
    `<main><div id="a">A</div><div id="b">B</div><div id="c">C</div></main>`,
    `<main><div id="b">B</div><div id="a">A</div></main>`
  ])
})

test("mixed keyed/non-keyed nodes", () => {
  expect([
    main([fake("a"), div(["B"]), div(["C"]), fake("d")]),
    main([
      div(["C"]),
      div({ key: "d" }, "D"),
      div({ key: "a" }, "A"),
      div(["B"])
    ]),
    main([div({ key: "d" }, "D"), div(["B"]), div(["C"])])
  ]).toMatchDOM([
    `<main><div id="a">A</div><div>B</div><div>C</div><div id="d">D</div></main>`,
    `<main><div>C</div><div id="d">D</div><div id="a">A</div><div>B</div></main>`,
    `<main><div id="d">D</div><div>B</div><div>C</div></main>`
  ])
})

test("trim prefix/suffix", () => {
  expect([
    main([fake("a"), fake("p"), fake("q"), fake("z")]),
    main([
      div({ key: "a" }, "A"),
      div({ key: "q" }, "Q"),
      div({ key: "p" }, "P"),
      div({ key: "z" }, "Z")
    ]),
    main([div({ key: "a" }, "A")]),
    main([fake("c"), div({ key: "a" }, "A")])
  ]).toMatchDOM([
    `<main><div id="a">A</div><div id="p">P</div><div id="q">Q</div><div id="z">Z</div></main>`,
    `<main><div id="a">A</div><div id="q">Q</div><div id="p">P</div><div id="z">Z</div></main>`,
    `<main><div id="a">A</div></main>`,
    `<main><div id="c">C</div><div id="a">A</div></main>`
  ])
})

test("svg", () => {
  const SVG_NS = "http://www.w3.org/2000/svg"

  const view = state =>
    div([
      div({ id: "foo" }, "foo"),
      svg({ id: state, viewBox: "0 0 10 10" }, [h(state)])
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
    svg({ viewBox: "0 0 10 10" }, [
      h("use", { id: "use", "xlink:href": "about:blank" })
    ]),
    document.body
  )

  const use = document.getElementById("use")
  expect(use.getAttributeNS(NS_XLINK, "href")).toBe("about:blank")

  patch(
    lastNode,
    svg({ viewBox: "0 0 10 10" }, [h("use", { id: "use" })]),
    document.body
  )

  expect(use.getAttributeNS(NS_XLINK, "href")).toBe(null)
})

test("oncreate", () => {
  patch(
    null,
    div(
      {
        oncreate: el => {
          el.className = "foo"
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
    div(
      {
        class: state,
        onupdate: (el, old) => {
          expect(el.textContent).toBe("bar")
          expect(old.class).toBe("foo")
          done()
        }
      },
      state
    )

  let node = patch(node, view("foo"), document.body)
  patch(node, view("bar"), document.body)
})

test("onremove", done => {
  const view = state =>
    state
      ? h("ul", {}, [
          h("li"),
          h("li", {
            onremove(_, remove) {
              remove()
              expect(document.body.innerHTML).toBe("<ul><li></li></ul>")
              done()
            }
          })
        ])
      : h("ul", {}, [h("li")])

  let node = patch(null, view(true), document.body)
  patch(node, view(false), document.body)
})

test("ondestroy", done => {
  const view = state =>
    state
      ? ul([
          li(),
          li([
            div({
              ondestroy() {
                expect(document.body.innerHTML).toBe(
                  "<ul><li></li><li><div></div></li></ul>"
                )
                setTimeout(() => {
                  expect(document.body.innerHTML).toBe("<ul><li></li></ul>")
                  done()
                })
              }
            })
          ])
        ])
      : ul([li()])

  let node = patch(null, view(true), document.body)
  patch(node, view(false), document.body)
})

test("onremove/ondestroy", done => {
  let destroyed = false

  const view = state =>
    state
      ? ul([
          li(),
          li({
            ondestroy() {
              destroyed = true
            },
            onremove(_, remove) {
              expect(destroyed).toBe(false)
              remove()
              expect(destroyed).toBe(true)
              done()
            }
          })
        ])
      : ul([li()])

  let node = patch(node, view(true), document.body)
  patch(node, view(false), document.body)
})

test("event bubbling", done => {
  let count = 0

  const view = state =>
    main(
      {
        oncreate: () => expect(count++).toBe(3),
        onupdate: () => {
          expect(count++).toBe(7)
          done()
        }
      },
      [
        div({
          oncreate: () => expect(count++).toBe(2),
          onupdate: () => expect(count++).toBe(6)
        }),
        div({
          oncreate: () => expect(count++).toBe(1),
          onupdate: () => expect(count++).toBe(5)
        }),
        div({
          oncreate: () => expect(count++).toBe(0),
          onupdate: () => expect(count++).toBe(4)
        })
      ]
    )

  let node = patch(node, view(), document.body)
  patch(node, view(), document.body)
})

test("recycling", done => {
  const container = document.body

  container.innerHTML = `<div><p id="foo">Foo</p></div>`

  patch(
    recycle(container),
    h("div", {}, [
      h("p", {
        key: "foo",
        oncreate: el => {
          expect(el.id).toBe("foo")
          done()
        }
      })
    ]),
    container
  )
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
