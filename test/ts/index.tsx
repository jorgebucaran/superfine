import { h, render, VNode } from "ultradom"

type View = (value: string) => VNode<any>
const view: View = value => <h1>{value}</h1>

render(view("Hello World"), document.body)
