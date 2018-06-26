import { h, render } from "../src/index.js"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("oncreate", () => {
  render(
    null,
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

  let node = render(node, view("foo"), document.body)
  render(node, view("bar"), document.body)
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

  let node = render(node, view(true), document.body)
  render(node, view(false), document.body)
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

  let node = render(node, view(true), document.body)
  render(node, view(false), document.body)
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

  let node = render(node, view(true), document.body)
  render(node, view(false), document.body)
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

  let node = render(node, view(), document.body)
  render(node, view(), document.body)
})
