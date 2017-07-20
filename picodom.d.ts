export interface VNode<D> {
  tag: string
  data?: D
  children: VElement<{}>[]
}

export interface Component<D> {
  (data?: D, ...children: VElement<{}>[]): VNode<D>
}

export type VElement<D> = VNode<D> | string

export function h<D>(
  tag: Component<D> | string,
  data?: D,
  ...children: VElement<{}>[]
): VNode<D>

export function patch(
  parent: Element,
  element: Element,
  oldNode: VNode<{}> | null,
  node: VNode<{}>
): Element

export as namespace picodom
