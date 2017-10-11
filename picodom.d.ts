export interface VNode<Data> {
  type: string
  props?: Props
  children: VNode<Props> | string
}

export interface Component<Props> {
  (props?: Props, ...children: VNode<Props> | string): VNode<Props>
}

export function h<Props>(
  type: Component<Props> | string,
  props?: Props,
  ...children: VNode<Props> | string
): VNode<Props>

export function patch(
  oldNode: VNode<{}> | null,
  newNode: VNode<{}>,
  container: HTMLElement = document.body
): Element

export as namespace picodom
