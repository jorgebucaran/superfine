import { h, patch, VNode, Component } from "ultradom"

const App: Component<any> = (props, children) => (
  <div class="app">{children}</div>
)

type View = (value: string) => VNode<any>
const view: View = value => <App>{value}</App>

const element = document.body.appendChild(patch(view("foo")))
