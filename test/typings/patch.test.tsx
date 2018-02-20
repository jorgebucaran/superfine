import { Component, h, patch, VNode } from "../../"

const App: Component<any> = (props, children) => (
  <div class="app">{children}</div>
)

type View = (value: string) => VNode<any>
const view: View = value => <App>{value}</App>

let node: VNode<any> = view("foo")

const element = document.body.appendChild(patch(node))

node = view("bar")

patch(node, element);
