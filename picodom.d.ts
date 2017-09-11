export as namespace picodom

export interface VNode<Data> {
  type: string
  props?: Props
  children: Array<VNode<{}> | string>
}

export interface Component<Props> {
  (props?: Props, children: Array<VNode<{}> | string>): VNode<Props>
}

export function h<Props>(
  type: Component<Props> | string,
  props?: Props,
  ...children: Array<VNode<{}> | string | number>
): VNode<Props>

export function patch(
  oldNode: VNode<{}> | null,
  newNode: VNode<{}>,
  container: HTMLElement = document.body
): Element

declare global {
  namespace JSX {
    interface Element extends VirtualNode<any> {}
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

