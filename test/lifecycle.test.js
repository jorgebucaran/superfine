import { h, patch } from "../src"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("oncreate", done => {
  patch(
    document.body,
    null,
    h(
      "div",
      {
        oncreate(element) {
          element.className = "foo"
          expect(document.body.innerHTML).toBe(`<div class="foo">foo</div>`)
          done()
        }
      },
      "foo"
    )
  )
})

test("onupdate", done => {
  var view = value =>
    h(
      "div",
      {
        class: value,
        onupdate(element, oldProps) {
          expect(element.textContent).toBe("foo")
          expect(oldProps.class).toBe("foo")
          done()
        }
      },
      value
    )

  let node = view("foo")

  patch(document.body, null, node)
  patch(document.body, node, node)
})

test("onremove", done => {
  var _remove
  var view = value =>
    h(
      "ul",
      {},
      [
        h("li", { id: "a", key: "a" }),
        value
          ? h("li", {
            id: "b",
            key: "b",
            onremove(element) {
              return remove => {
                _remove = remove // deferred pending assertions below
              }
            }
          })
          : null,
        h("li", { id: "c", key: "c" })
      ]
    )

  const contents_before_removal = '<ul><li id="a"></li><li id="b"></li><li id="c"></li></ul>'
  const contents_after_removal = '<ul><li id="a"></li><li id="c"></li></ul>'
  
  let node = view(true)

  patch(document.body, null, node)

  expect(document.body.innerHTML).toBe(contents_before_removal)

  patch(document.body, node, view(false))

  expect(document.body.innerHTML).toBe(contents_before_removal)

  _remove() // completes deferred removal
  
  expect(document.body.innerHTML).toBe(contents_after_removal)

  done()
})

test("event bubling", done => {
  var view = value =>
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

  let count = 0
  let node = view(true)

  patch(document.body, null, node)
  patch(document.body, node, view(false))
})
