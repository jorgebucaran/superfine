export as namespace superfine

export type Children = VNode | string | number | null

/**
 * The virtual DOM representation of an Element.
 */
export interface VNode<Props = {}> {
  name: string
  props?: Props
  children: Array<VNode>
  key: string
}

/**
 * Create a new virtual DOM node. A virtual DOM is a description of what a DOM should look like using a tree of virtual nodes.
 * @param name The name of an Element or a function that returns a virtual DOM node.
 * @param props HTML props, SVG props, DOM events, Lifecycle Events, and Keys.
 * @param children The element's child nodes.
 */
export function h<Props>(
  name: string,
  props?: Props | null,
  ...children: Array<Children | Children[]>
): VNode<Props>

/**
 * Render a virtual DOM node into a DOM element container.
 *
 * @param {VNode} oldNode The last virtual DOM node.
 * @param {VNode} nextNode The next virtual DOM node.
 * @param {Element?} container A DOM element where the new virtual DOM will be rendered.
 * @returns {VNode} Returns nextNode.
 **/
export function patch(
  lastNode: VNode,
  nextNode: VNode,
  container: Element
): VNode

declare global {
  namespace JSX {
    interface Element extends VNode<any> {}
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
