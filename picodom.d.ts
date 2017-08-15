export interface VirtualNode<Data> {
  tag: string
  data?: Data
  children: VirtualNode<Data> | string
}

export interface VirtualComponent<Data> {
  (data?: Data, ...children: VirtualNode<Data> | string): VirtualNode<Data>
}

export function h<Data>(
  tag: VirtualComponent<Data> | string,
  data?: Data,
  ...children: VirtualNode<Data> | string
): VirtualNode<Data>

export function patch(
  oldNode: VirtualNode<{}> | null,
  newNode: VirtualNode<{}>,
  element: Element | null,
  parent: Element | null
): Element


export as namespace picodom
