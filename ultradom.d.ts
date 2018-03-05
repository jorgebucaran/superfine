export as namespace ultradom

/** The virtual DOM representation of an Element. */
export interface VNode<Attributes = {}> {
  nodeName: string
  attributes?: Attributes
  children: Array<VNode | string>
  key: string
}

export interface Component<Attributes = {}> {
  (attributes: Attributes, children: Array<VNode | string>): VNode<Attributes>
}

export function h<Attributes>(
  nodeName: Component<Attributes> | string,
  attributes?: Attributes,
  ...children: Array<VNode | string | number | null>
): VNode<Attributes>

/**
 * Patch a DOM element to match the supplied virtual DOM representation. If no element is given, create and return a new DOM element.
 *
 * @param {VNode} node The new virtual DOM representation.
 * @param {Element?} element A DOM element.
 **/
export function patch(node: VNode, element?: Element | null): Element

declare global {
  namespace JSX {
    interface Element extends VNode<any> {}
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
