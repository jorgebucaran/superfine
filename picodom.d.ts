export as namespace picodom

export interface ReservedProps<Props = {}> extends Object {
  key?: string
  oncreate?: { (element: Element): any }
  onupdate?: { (element: Element, oldProps: Props): any }
  onremove?: { (element: Element, done: Function): any }
  ondestroy?: { (element: Element): any }
}

export interface VNode<Props extends ReservedProps<Props> = {}> {
  type: string
  props?: Props
  children: Array<VNode | string>
}

export interface Component<Props extends ReservedProps<Props> = {}> {
  (props: Props, children: Array<VNode | string>): VNode<Props>
}

export function h<Props extends ReservedProps<Props>>(
  type: Component<Props> | string,
  props?: Props,
  ...children: Array<VNode | string | number | null>
): VNode<Props>

export function h<Props extends ReservedProps<Props>>(
  tag: Component<Props> | string,
  props?: Props,
  children?: Array<VNode | string | number | null>
): VNode<Props>

export function patch(
  parent: Element,
  oldNode: VNode | null,
  newNode: VNode
): Element

declare global {
  namespace JSX {
    interface Element extends VNode<any> {}
    interface IntrinsicElements {
      [elemName: string]: ReservedProps & { [attrName: string]: any }
    }
  }
}
