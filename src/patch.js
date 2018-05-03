import { createElement } from "./createElement"
import { updateElement } from "./updateElement"
import { removeElement } from "./removeElement"
import { getKey } from "./getKey"

export function patch(parent, element, oldNode, node, lifecycle, isSVG) {
  if (node === oldNode) {
  } else if (oldNode == null || oldNode.name !== node.name) {
    var newElement = parent.insertBefore(
      createElement(node, lifecycle, isSVG),
      element
    )

    if (oldNode != null) {
      removeElement(parent, element, oldNode)
    }

    element = newElement
  } else if (oldNode.name == null) {
    element.nodeValue = node
  } else {
    updateElement(
      element,
      oldNode.attributes,
      node.attributes,
      lifecycle,
      (isSVG = isSVG || node.name === "svg")
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

      if (newKey != null && newKey === getKey(oldChildren[i + 1])) {
        if (oldKey == null) {
          removeElement(element, oldElements[i], oldChildren[i])
        }
        i++
        continue
      }

      if (newKey == null || oldNode.recycled) {
        if (oldKey == null) {
          patch(
            element,
            oldElements[i],
            oldChildren[i],
            children[k],
            lifecycle,
            isSVG
          )
          k++
        }
        i++
      } else {
        var keyed = oldKeyed[newKey] || []

        if (oldKey === newKey) {
          patch(element, keyed[0], keyed[1], children[k], lifecycle, isSVG)
          i++
        } else if (keyed[0]) {
          patch(
            element,
            element.insertBefore(keyed[0], oldElements[i]),
            keyed[1],
            children[k],
            lifecycle,
            isSVG
          )
        } else {
          patch(element, oldElements[i], null, children[k], lifecycle, isSVG)
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
