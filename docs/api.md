# API

- turbodom.h
- turbodom.patch

## h

Type: (tag, data, children): vnode

- tag: string | (props, children): vnode
- data: {}
- children: string | vnode[]

## patch

Type: (parent, element, oldNode, newNode): [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)

- parent: HTMLElement
- element: HTMLElement
- oldNode: vnode
- newNode: vnode

