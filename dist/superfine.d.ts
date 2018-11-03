/**
 * Types
 */
declare type KeyValueMap = {
    [key: string]: any;
};
interface SuperFineElement extends Element {
    events: KeyValueMap;
    nodeValue: any;
    [key: string]: any;
}
declare interface SuperFineNodeProps {
    oncreate?: (element: SuperFineElement, props?: SuperFineNodeProps) => void;
    onupdate?: (element: SuperFineElement, props?: SuperFineNodeProps) => void;
    onremove?: (element: SuperFineElement, func?: Function) => void;
    ondestroy?: (element: SuperFineElement, props?: SuperFineNodeProps) => void;
    children?: Array<SuperFineNode>;
    [key: string]: any;
}
interface SuperFineNode {
    key: any;
    element: SuperFineElement;
    type: number;
    children: Array<SuperFineNode>;
    props: SuperFineNodeProps;
    name: string;
}
declare const _default: {
    h: (name: TimerHandler, props: SuperFineNodeProps) => any;
    patch: (lastNode: SuperFineNode, nextNode: SuperFineNode, container: SuperFineElement) => SuperFineNode;
    recycle: (container: SuperFineElement) => SuperFineNode;
};
export default _default;
