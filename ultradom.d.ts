export as namespace ultradom

export type Children = VNode | string | number | null

/**
 * The virtual DOM representation of an Element.
 */
export interface VNode<Attributes = {}> {
  name: string
  attributes?: Attributes
  children: Array<VNode>
  key: string
}

/**
 * Create a new virtual DOM node. A virtual DOM is a description of what a DOM should look like using a tree of nested JavaScript objects known as virtual nodes.
 * @param name The name of an Element or a function that returns a virtual DOM node.
 * @param attributes HTML attributes, SVG attributes, DOM events, Lifecycle Events, and Keys. Note that non-standard HTML attribute names are not supported, onclick and class are valid, but onClick or className are not.
 * @param children The element's child nodes.
 */
export function h<Attributes>(
  name: string,
  attributes?: Attributes | null,
  ...children: Array<Children | Children[]>
): VNode<Attributes>

/**
 * Render a virtual DOM node in a DOM container.
 *
 * @param {VNode} node The virtual DOM node.
 * @param {Element?} element A DOM element.
 **/
export function render(node: VNode, container: Element): void

declare global {
  namespace JSX {
    interface Element extends VNode<any> {}
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
