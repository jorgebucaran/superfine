import { h, render } from "../src/index.js"

let lastNode

beforeEach(() => {
  document.body.innerHTML = ""
  lastNode = null
})

expect.extend({
  toMatchDOM(node, html) {
    lastNode = render(lastNode, node, document.body)
    expect(document.body.innerHTML).toBe(html.replace(/\s{2,}/g, ""))
    return { pass: true }
  }
})

const divWithId = id =>
  h(
    "div",
    {
      key: id,
      oncreate: e => (e.id = id)
    },
    id.toUpperCase()
  )

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

test("event handlers", done => {
  render(
    null,
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
