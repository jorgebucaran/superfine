import { createElement } from "./createElement"
import { removeElement } from "./removeElement"
import { updateElement } from "./updateElement"
import { getKey } from "./getKey"

export function patchElement(
  parent,
  element,
  oldNode,
  node,
  lifecycle,
  isRecycling,
  isSVG
) {
  if (node === oldNode) {
  } else if (oldNode == null || oldNode.nodeName !== node.nodeName) {
    var newElement = createElement(node, lifecycle, isSVG)
    if (parent) {
      parent.insertBefore(newElement, element)
      if (oldNode != null) {
        removeElement(parent, element, oldNode)
      }
    }
    element = newElement
  } else if (oldNode.nodeName == null) {
    element.nodeValue = node
  } else {
    updateElement(
      element,
      oldNode.attributes,
      node.attributes,
      lifecycle,
      isRecycling,
      (isSVG = isSVG || node.nodeName === "svg")
    )

    var oldKeyed = {}
    var newKeyed = {}
    var oldElements = []
    var oldChildren = oldNode.children
    var children = node.children

    for (var i = 0; i < oldChildren.length; i++) {
      oldElements[i] = element.childNodes[i]

      var oldKey = getKey(oldChildren[i])
      if (oldKey != null) {
        oldKeyed[oldKey] = [oldElements[i], oldChildren[i]]
      }
    }

    var i = 0
    var k = 0

    while (k < children.length) {
      var oldKey = getKey(oldChildren[i])
      var newKey = getKey(children[k])

      if (newKeyed[oldKey]) {
        i++
        continue
      }

      if (newKey == null || isRecycling) {
        if (oldKey == null) {
          patchElement(
            element,
            oldElements[i],
            oldChildren[i],
            children[k],
            lifecycle,
            isRecycling,
            isSVG
          )
          k++
        }
        i++
      } else {
        var keyedNode = oldKeyed[newKey] || []

        if (oldKey === newKey) {
          patchElement(
            element,
            keyedNode[0],
            keyedNode[1],
            children[k],
            lifecycle,
            isRecycling,
            isSVG
          )
          i++
        } else if (keyedNode[0]) {
          patchElement(
            element,
            element.insertBefore(keyedNode[0], oldElements[i]),
            keyedNode[1],
            children[k],
            lifecycle,
            isRecycling,
            isSVG
          )
        } else {
          patchElement(
            element,
            oldElements[i],
            null,
            children[k],
            lifecycle,
            isRecycling,
            isSVG
          )
        }

        newKeyed[newKey] = children[k]
        k++
      }
    }

    while (i < oldChildren.length) {
      if (getKey(oldChildren[i]) == null) {
        removeElement(element, oldElements[i], oldChildren[i])
      }
      i++
    }

    for (var i in oldKeyed) {
      if (!newKeyed[i]) {
        removeElement(element, oldKeyed[i][0], oldKeyed[i][1])
      }
    }
  }
  return element
}
