export as namespace patchdom

export interface VNode<Props = {}> {
  nodeName: string
  attributes?: Props
  children: Array<VNode | string>
}

export interface Component<Props = {}> {
  (props: Props, children: Array<VNode | string>): VNode<Props>
}

export function h<Props>(
  nodeName: Component<Props> | string,
  attributes?: Props,
  ...children: Array<VNode | string | number | null>
): VNode<Props>

export function patch(node: VNode, element?: Element): Element

declare global {
  namespace JSX {
    interface Element extends VNode<any> {}
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
