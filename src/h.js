// @flow
var i
var stack = []

export type VirtualNode = {
  tag: string,
  data: { [string]: any },
  children: Array<VirtualNode | string>
};

type VirtualComponent = (
  data: { [string]: any } | null,
  children: Array<VirtualNode | string> | VirtualNode | string
) => VirtualNode;

export function h(
  tag: VirtualComponent,
  data: any
): VirtualNode {
  var node
  var children = []

  for (i = arguments.length; i-- > 2; ) {
    stack.push(arguments[i])
  }

  while (stack.length) {
    if (Array.isArray((node = stack.pop()))) {
      for (i = node.length; i--; ) {
        stack.push(node[i])
      }
    } else if (node != null && node !== true && node !== false) {
      if (typeof node === "number") {
        node = node + ""
      }
      children.push(node)
    }
  }

  return typeof tag === "string"
    ? {
        tag: tag,
        data: data || {},
        children: children
      }
    : tag(data, children)
}
