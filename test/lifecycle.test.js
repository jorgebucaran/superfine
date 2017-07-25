import { h, patch } from "../src"

window.requestAnimationFrame = setTimeout

const getElementByTagName = tag => document.getElementsByTagName(tag)[0]
const root = document.body

beforeEach(() => (root.innerHTML = ""))

test("all lifecycle methods are optional", () => {
  let generateNode = state => state
    ? h("ul", { class: state }, [h("li"), h("li")])
    : h("ul", { class: state }, [h("li")])

  // oncreate & oninsert don't throw errors if not specified
  let state = "foo"
  let oldNode = null
  let newNode = generateNode(state)
  let element = patch(root, null, oldNode, newNode)

  // onupdate doesn't throw error if not specified
  state = "bar"
  oldNode = newNode
  newNode = generateNode(state)
  element = patch(root, element, oldNode, newNode)

  // onremove doesn't throw error if not specified
  state = ""
  oldNode = newNode
  newNode = generateNode(state)
  element = patch(root, element, oldNode, newNode)
})

test("oncreate is called", done => {
  let node = h("div", {
    oncreate: element => {
      setTimeout(() => {})

      expect(element).not.toBe(undefined)
      expect(getElementByTagName("div")).toBe(undefined)

      setTimeout(() => {
        expect(getElementByTagName("div")).toBe(element)
        done()
      })
    }
  })

  patch(root, null, null, node);
})

test("oninsert is called", done => {
  let node = h("div", {
    oninsert: element => {
      expect(getElementByTagName("div")).toBe(element)
      done()
    }
  })

  patch(root, null, null, node);
})

test("onupdate fires if node data changes", done => {
  let generateNode = state => h("div", {
    class: state,
    onupdate: done
  })

  let state = "foo"
  let initialNode = generateNode(state)
  let element = patch(root, null, null, initialNode);

  state = "bar"
  let updatedNode = generateNode(state);
  element = patch(root, element, initialNode, updatedNode)
})

test("onupdate does not fire if data does not change", () => {
  const noop = () => {}

  return new Promise((resolve, reject) => {
    let generateNode = state => h("div", {
      class: state,
      oncreate: noop,
      onupdate: reject,
      oninsert: noop,
      onremove: noop
    })

    let state = "foo"

    let initialNode = generateNode(state)
    let element = patch(root, null, null, initialNode)

    let newNode = generateNode(state)
    element = patch(root, element, initialNode, newNode)

    resolve()
  })
})

test("onremove is called", done => {
  let generateNode = state => state
    ? h("ul", {}, [h("li"), h("li", { onremove: done })])
    : h("ul", {}, [h("li")])

  let state = true
  let initialNode = generateNode(state)
  let element = patch(root, null, null, initialNode)

  state = false
  let updatedNode = generateNode(state)
  element = patch(root, element, initialNode, updatedNode)
})

test("onremove doesn't remove the node if specified", () => {
  let testId = "test"
  let generateNode = state => state
    ? h("ul", {}, [h("li"), h("li", { id: testId, onremove: () => null })])
    : h("ul", {}, [h("li")])

  let state = true
  let initialNode = generateNode(state)
  let element = patch(root, null, null, initialNode)

  expect(document.getElementById(testId)).not.toEqual(null)

  state = false
  let updatedNode = generateNode(state)
  element = patch(root, element, initialNode, updatedNode)

  expect(document.getElementById(testId)).not.toBe(null)
})
