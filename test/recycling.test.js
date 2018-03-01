import { h, patch } from "../src"

test("recycle markup", done => {
  const SSR_BODY = (document.body.innerHTML = `<main><p id="foo">foo</p></main>`)

  const node = h("main", {}, [
    h(
      "p",
      {
        oncreate(element) {
          expect(element.id).toBe("foo")
          expect(document.body.innerHTML).toBe(SSR_BODY)
          done()
        }
      },
      "foo"
    )
  ])
  patch(node, document.body.lastElementChild)
})

test("recycle markup against keyed vdom", done => {
  const SSR_BODY = (document.body.innerHTML = `<main><p id="foo">foo</p></main>`)

  const node = h("main", {}, [
    h(
      "p",
      {
        key: "key",
        oncreate(element) {
          expect(element.id).toBe("foo")
          expect(document.body.innerHTML).toBe(SSR_BODY)
          done()
        }
      },
      "foo"
    )
  ])
  
  patch(node, document.body.lastElementChild)
})
