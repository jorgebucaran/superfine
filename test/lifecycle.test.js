import { h, patch } from "../src"

window.requestAnimationFrame = setTimeout

const getElementByTagName = tag => document.getElementsByTagName(tag)[0]
const root = document.body

beforeEach(() => (root.innerHTML = ""))

test("oncreate", done => {
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

test("oninsert", done => {
  let node = h("div", {
    oninsert: element => {
      expect(getElementByTagName("div")).toBe(element)
      done()
    }
  })
  
  patch(root, null, null, node);
})

test("fire onupdate if node data changes", done => {
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

test("do not fire onupdate if data does not change", () => {
  return new Promise((resolve, reject) => {
    let generateNode = state => h("div", {
      class: state,
      onupdate: reject
    })

    let state = "foo"

    let initialNode = generateNode(state)
    let element = patch(root, null, null, initialNode)
    
    let newNode = generateNode(state)
    element = patch(root, element, initialNode, newNode)

    resolve()
  })
})

test("onremove", done => {
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