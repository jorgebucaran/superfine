import { h, patch, recycle } from "../src/index.js"

test("recycling", done => {
  const container = document.body

  container.innerHTML = `<div><p id="foo">Foo</p></div>`

  patch(
    recycle(container),
    h("div", {}, [
      h("p", {
        key: "foo",
        oncreate: element => {
          expect(element.id).toBe("foo")
          done()
        }
      })
    ]),
    container
  )
})
