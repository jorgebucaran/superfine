export as namespace picodom

export interface VNode<Props> {
  type: string
  props?: Props
  children: Array<VNode<{}> | string>
}

export interface Component<Props = {}> {
  (props: Props, children: Array<VNode<{}> | string>): VNode<Props>
}

export function h<Props>(
  type: Component<Props> | string,
  props?: Props,
  ...children: Array<VNode<{}> | string | number | null>
): VNode<Props>

export function h<Props>(
  tag: Component<Props> | string,
  props?: Props,
  children?: Array<VNode<{}> | string | number | null>
): VNode<Props>

export function patch(
  parent: HTMLElement,
  oldNode: VNode<{}> | null,
  newNode: VNode<{}>
): Element

declare global {
  namespace JSX {
    interface Element extends VNode<any> {}
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
