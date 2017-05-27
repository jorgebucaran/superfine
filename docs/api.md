# API

- [picodom.h](#h)
- [picodom.patch](#patch)

## h

Type: (tag, data, children): vnode

- tag: string | (props, children): vnode
- data: {}
- children: string | vnode[]
- vnode: { tag, data, children }

## patch

Type: (parent, element, oldNode, newNode): [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)

- parent: HTMLElement
- element: HTMLElement
- oldNode: vnode
- newNode: vnode

