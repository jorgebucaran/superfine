import { recycleElement } from "./recycleElement"
import { patchElement } from "./patchElement"

export function patch(node, element) {
  var lifecycle = []

  element = element
    ? patchElement(
        element.parentNode,
        element,
        element.node == null ? recycleElement(element, [].map) : element.node,
        node,
        lifecycle,
        element.node == null // isRecycling
      )
    : patchElement(null, null, null, node, lifecycle)

  element.node = node

  while (lifecycle.length) lifecycle.pop()()

  return element
}
