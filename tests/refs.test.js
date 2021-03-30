import { t as tw, equal } from "twist"
import { JSDOM } from "jsdom"
import { h, patch } from "../index.js"

// we enhance twist's original function `t` 
// with support for generator functions as source
// for tests as alternative to arrays
function t(name, tests) {
  return tw(name, Array.isArray(tests) ? tests : Array.from(tests()))
}

// === ref helpers ====================================================

function createRefObject() {
  let current = null
  let previous = null

  return {
    get current() {
      return current
    },

    set current(value) {
      previous = current
      current = value
    },

    get previous() {
      return previous
    }
  }
}

function createRefCallback() {
  let current = null
  let previous = null

  const ret = (value) => {
    previous = current
    current = value
  }

  Object.defineProperties(ret, {
    current: { get: () => current },
    previous: { get: () => previous }
  })

  return ret
}

// === tests =========================================================

export default [
  t("ref support for superfine", [
    t("test ref helpers (only needed for testing)", [
      t("testing createRefObject", function* () {
        const refObject = createRefObject()
        yield equal(refObject.current, null)
        yield equal(refObject.previous, null)

        refObject.current = 11
        yield equal(refObject.current, 11)
        yield equal(refObject.previous, null)

        refObject.current = 22
        yield equal(refObject.current, 22)
        yield equal(refObject.previous, 11)

        refObject.current = 33
        yield equal(refObject.current, 33)
        yield equal(refObject.previous, 22)
      }),
      t("testing createRefCallback", function* () { 
        const refCallback = createRefCallback()
        yield equal(refCallback.current, null)
        yield equal(refCallback.previous, null)

        refCallback(111)
        yield equal(refCallback.current, 111)
        yield equal(refCallback.previous, null)

        refCallback(222)
        yield equal(refCallback.current, 222)
        yield equal(refCallback.previous, 111)

        refCallback(333)
        yield equal(refCallback.current, 333)
        yield equal(refCallback.previous, 222)
      }),
    ]),
    t("test behavior of refs", [
      t("ref objects and ref callback should work properly", function* () {
        const container = new JSDOM('<div id="root"><span><span></div>')
          .window.document.getElementById('root')
        
        const render = (vnode) => patch(container.firstChild, vnode)
        const refObject = createRefObject()
        const refCallback = createRefCallback()

        render(h("div", { ref: refObject }))
        yield equal(refObject.current?.tagName, "DIV")
        yield equal(refObject.previous, null)
        yield equal(refCallback.current, null)
        yield equal(refCallback.previous, null)

        render(h("input", { ref: refCallback }))
        yield equal(refObject.current, null)
        yield equal(refObject.previous?.tagName ,"DIV")
        yield equal(refCallback.current?.tagName ,"INPUT")
        yield equal(refCallback.previous, null)

        render(h("input", { ref: refCallback }))
        yield equal(refObject.current, null)
        yield equal(refObject.previous?.tagName, "DIV")
        yield equal(refCallback.current?.tagName, "INPUT")
        yield equal(refCallback.previous, null)

        render(h("button", { ref: refObject }))
        yield equal(refObject.current?.tagName, "BUTTON")
        yield equal(refObject.previous, null)
        yield equal(refCallback.current, null)
        yield equal(refCallback.previous?.tagName, "INPUT")

        render(h("button", { ref: refCallback }))
        yield equal(refObject.current, null)
        yield equal(refObject.previous?.tagName, "BUTTON")
        yield equal(refCallback.current?.tagName ,"BUTTON")
        yield equal(refCallback.previous, null)

        render(h("input", { ref: refCallback }))
        yield equal(refObject.current, null)
        yield equal(refObject.previous?.tagName, "BUTTON")
        yield equal(refCallback.current?.tagName, "INPUT")
        yield equal(refCallback.previous, null)
      })
    ])
  ])
]
