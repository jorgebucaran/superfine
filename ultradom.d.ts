export as namespace ultradom

export type Children = VNode | string | number | null

/**
 * The virtual DOM representation of an Element.
 */
export interface VNode<Attributes = {}> {
  nodeName: string
  attributes?: Attributes
  children: Array<VNode>
  key: string
}

export interface Component<Attributes = {}> {
  (attributes: Attributes, children: Array<VNode | string>): VNode<Attributes>
}

/**
 * Return a new virtual DOM node. A virtual DOM is a description of what a DOM should look like using a tree of nested JavaScript objects known as virtual nodes. Think of it as a lightweight representation of the DOM.
 * @param nodeName The name of an Element or a function that returns a virtual DOM node.
 * @param attributes HTML attributes, SVG attributes, DOM events, Lifecycle Events, and Keys. Note that non-standard HTML attribute names are not supported, onclick and class are valid, but onClick or className are not.
 * @param children The element's child nodes.
 */
export function h<Attributes>(
  nodeName: Component<Attributes> | string,
  attributes?: Attributes | null,
  ...children: Array<Children | Children[]>
): VNode<Attributes>

/**
 * Update the attributes and children of the supplied DOM element to match the virtual DOM node. If no element is provided, create and return a new DOM element.
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
