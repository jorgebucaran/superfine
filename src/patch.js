// @flow
import type { VirtualNode } from "./h"

var globalInvokeLaterStack = []

/* start helper functions for flow */
function invariant(v: any, name: string) {
  if (v == null) {
    throw Error(`Unexepcted null ${name}`)
  } else {
    return v
  }
}

function getIndexableElement(element: Node | Element | HTMLElement): Object {
  var e: Object = element
  return e // best work around I found for flow errors "Indexiable signature not found in"
}
/* end helper functions for flow */

export default function(
  oldNode: VirtualNode | null,
  node: VirtualNode,
  element: Node | Text | Element | HTMLElement | null,
  parent: Node | Text | Element | HTMLElement | null,
  cb: Function
): Node | Text | Element | HTMLElement {
  if (parent == null) {
    invariant(document.body, "document.body")
    parent = document.body
  }
  element = patch(parent || document.body, element, oldNode, node)
  while ((cb = globalInvokeLaterStack.pop())) cb()
  invariant(element, "element")
  return element
}

function patch(
  parent: Node | Text | Element | HTMLElement,
  element: Node | Text | Element | HTMLElement | null,
  oldNode: VirtualNode | string | null,
  node: VirtualNode | string,
  isSVG?: boolean,
  nextSibling?: Node | Text | Element | HTMLElement
): Node | Text | Element | HTMLElement | null {
  if (oldNode == null) {
    element = parent.insertBefore(createElement(node, isSVG), element)
  } else if (
    typeof node !== "string" && // needed to satisify flow node.tag != null won't work for flow...
    typeof oldNode !== "string" &&
    node.tag === oldNode.tag
  ) {
    updateElement(element, oldNode.data, node.data)

    isSVG = isSVG || node.tag === "svg"

    var len = node.children.length
    var oldLen = oldNode.children.length
    var oldKeyed = {}
    var oldElements = []
    var keyed = {}

    invariant(element, "element")
    for (var i = 0; i < oldLen; i++) {
      var oldElement = (oldElements[i] = element.childNodes[i])
      var oldChild: VirtualNode | string = oldNode.children[i]
      var oldKey = getKey(oldChild)

      if (null != oldKey) {
        oldKeyed[oldKey] = [oldElement, oldChild]
      }
    }

    var i: number = 0
    var j: number = 0

    while (j < len) {
      var oldElement = oldElements[i]
      var oldChild = oldNode.children[i]
      var newChild = node.children[j]

      var oldKey: string | null = getKey(oldChild)
      if (oldKey != null && keyed[oldKey]) {
        i++
        continue
      }

      var newKey = getKey(newChild)

      var keyedNode = newKey != null ? oldKeyed[newKey] || [] : []

      if (null == newKey) {
        if (null == oldKey) {
          patch(element, oldElement, oldChild, newChild, isSVG)
          j++
        }
        i++
      } else {
        if (oldKey === newKey) {
          patch(element, keyedNode[0], keyedNode[1], newChild, isSVG)
          i++
        } else if (keyedNode[0]) {
          element.insertBefore(keyedNode[0], oldElement)
          patch(element, keyedNode[0], keyedNode[1], newChild, isSVG)
        } else {
          patch(element, oldElement, null, newChild, isSVG)
        }

        j++
        keyed[newKey] = newChild
      }
    }

    while (i < oldLen) {
      var oldChild = oldNode.children[i]
      var oldKey = getKey(oldChild)
      if (null == oldKey && typeof oldChild !== "string") {
        removeElement(element, oldElements[i], oldChild.data)
      }
      i++
    }

    for (var x in oldKeyed) { // var i had type conflict with number above...
      var keyedNode = oldKeyed[x]
      var reusableNode = keyedNode[1]
      if (!keyed[reusableNode.data.key]) {
        removeElement(element, keyedNode[0], reusableNode.data)
      }
    }
  } else if (element && node !== element.nodeValue && typeof oldNode !== "string") {
    element = parent.insertBefore(
      createElement(node, isSVG),
      (nextSibling = element)
    )
    removeElement(parent, nextSibling, oldNode.data)
  }

  return element
}

function getKey(node: VirtualNode | string | null): string | null {
  if (typeof node !== "string" && node && node.data) {
    return node.data.key
  }
  return null
}

function merge(a, b) {
  var obj = {}

  for (var i in a) {
    obj[i] = a[i]
  }

  for (var i in b) {
    obj[i] = b[i]
  }

  return obj
}

function createElement(node: string | VirtualNode, isSVG?: boolean) {
  if (typeof node === "string") {
    var element = document.createTextNode(node)
  } else {
    var n: VirtualNode = node // had to add type cast to get flow to work below...
    var element = (isSVG = isSVG || n.tag === "svg")
      ? document.createElementNS("http://www.w3.org/2000/svg", n.tag)
      : document.createElement(n.tag)

    if (n.data && n.data.oncreate) {
      globalInvokeLaterStack.push(function() {
        n.data.oncreate(element)
      })
    }

    for (var i in n.data) {
      setData(element, i, n.data[i])
    }

    for (var i = 0; i < n.children.length; ) {
      element.appendChild(createElement(n.children[i++], isSVG))
    }
  }

  return element
}

function updateElement(element, oldData, data) {
  invariant(element, "element")
  var e = getIndexableElement(element)
  for (var i in merge(oldData, data)) {
    var value = data[i]
    var oldValue = i === "value" || i === "checked" ? e[i] : oldData[i]

    if (value !== oldValue) {
      setData(element, i, value, oldValue)
    }
  }

  if (data && data.onupdate) {
    globalInvokeLaterStack.push(function() {
      data.onupdate(element, oldData)
    })
  }
}

function removeElement(parent, element, data) {
  if (data && data.onremove) {
    data.onremove(element)
  } else {
    parent.removeChild(element)
  }
}

function setData(element, name, value, oldValue) {
  var e = getIndexableElement(element)
  if (name === "key") {
  } else if (name === "style") {
    for (var i in merge(oldValue, (value = value || {}))) {
      e.style[i] = value[i] || ""
    }
  } else {
    try {
      e[name] = value
    } catch (_) {}

    if (typeof value !== "function") {
      if (value) {
        e.setAttribute(name, value)
      } else {
        e.removeAttribute(name)
      }
    }
  }
}
