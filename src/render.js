import { recycleElement } from "./recycleElement"
import { patchElement } from "./patchElement"

export function render(node, container) {
  var lifecycle = []
  var element = container.children[0]
  var oldNode = element && (element.node || recycleElement(element))

  patchElement(container, element, oldNode, node, lifecycle).node = node

  while (lifecycle.length) lifecycle.pop()()
}
