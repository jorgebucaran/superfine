import { h, patch } from "../src"

let element;
beforeEach(() => {
  document.body.innerHTML= "";
  const el = document.createElement('div');
  element = document.body.appendChild(el);
})

test("oncreate", done => {
  var view = value =>
    h(
      "div",
      {
        key: "create",
        oncreate(element) {
          element.className = "foo"
          expect(document.body.innerHTML).toBe(`<div class="foo">foo</div>`)
          done()
        }
      },
      "foo"
    )

    let node = view("foo")
    patch(node, element);
})

test("onupdate", done => {
  var view = value =>
    h(
      "div",
      {
        class: value,
        onupdate(element, oldProps) {
          expect(element.textContent).toBe("foo2")
          expect(oldProps.class).toBe("foo")
          done()
        }
      },
      value
    )

  let node = view("foo");

  patch(node, element);
  patch(view("foo2"), element);
})

test("onremove", done => {
  var view = value =>
    value
      ? h(
          "ul",
          {
            oncreate() {
              expect(document.body.innerHTML).toBe(
                "<ul><li></li><li></li></ul>"
              )
            }
          },
          [
            h("li"),
            h("li", {
              onremove(element, remove) {
                expect(document.body.innerHTML).toBe(
                  "<ul><li></li><li></li></ul>"
                )

                remove()
                expect(document.body.innerHTML).toBe("<ul><li></li></ul>")
                done()
              }
            })
          ]
        )
      : h("ul", {}, [h("li")])

  patch(view(true), document.body.firstElementChild)
  patch(view(false), document.body.firstElementChild)
})

test("ondestroy", done => {
  var log = []

  var view = value =>
    value
      ? h("p", {id: "a", onremove: (el, done) => { log.push("removed a"); done(); }, ondestroy: () => log.push("destroyed a")}, [
        h("p", {id: "b", onremove: (el, done) => { log.push("removed b"); done(); }, ondestroy: () => log.push("destroyed b")}, [
          h("p", {id: "c", onremove: (el, done) => { log.push("removed c"); done(); }, ondestroy: () => log.push("destroyed c")})
        ])
      ])
      : h("p", {id: "a", onremove: (el, done) => { log.push("removed a"); done(); }, ondestroy: () => log.push("destroyed a")})

  patch(view(true), document.body.firstElementChild)

  expect(log.length).toBe(0)

  patch(view(false), document.body.firstElementChild)

  expect(log.join(', ')).toBe('removed b, destroyed c, destroyed b')

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

  patch(view(true), document.body.firstElementChild)
  patch(view(false), document.body.firstElementChild)
})
