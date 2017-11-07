import { Component, h, patch, VNode } from "../../"

const App: Component<any> = (props, children) => (
  <div class="app">{children}</div>
)

type View = (value: string) => VNode<any>
const view: View = value => <App>{value}</App>

let oldNode: VNode<any> | null = null
let newNode: VNode<any> = view("foo")

patch(document.body, oldNode, (oldNode = newNode))

newNode = view("bar")

patch(document.body, oldNode, (oldNode = newNode))
