export as namespace picodom

export interface VNode<Data> {
  type: string
  props?: Props
  children: Array<VNode<Props> | string>
}

export interface Component<Props> {
  (props?: Props, children: Array<VNode<Props> | string>): VNode<Props>
}

export function h<Props>(
  type: Component<Props> | string,
  props?: Props,
  ...children: Array<VNode<Props> | string | number>
): VNode<Props>

export function patch(
  oldNode: VNode<{}> | null,
  newNode: VNode<{}>,
  container: HTMLElement = document.body
): Element

declare global {
  namespace JSX {
    interface Element<Data = any> extends VirtualNode<Data> {}
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

