declare namespace picodom {
  export interface VNode<D> {
    tag: string
    data?: D
    children: VNode<{}>
  }

  export interface Component<D> {
    (data?: D, ...children: VNode<{}>[]): VNode<D>
  }

  export type VElement<D> = Component<D> | string

  export function h<D>(
    tag: VElement<D>,
    data?: D,
    ...children: VNode<{}>[]
  ): VNode<D>

  export function patch(
    parent: Element,
    element: Element,
    oldNode: VNode<{}> | null,
    node: VNode<{}>
  ): Element
}

declare module "picodom" {
  export = picodom
}
