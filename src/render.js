import { patch } from "./patch"

export function render(node, container) {
  var lifecycle = []
  var element = container.children[0]

  patch(
    container,
    element,
    element && element.node,
    node,
    lifecycle
  ).node = node

  while (lifecycle.length) lifecycle.pop()()
}
