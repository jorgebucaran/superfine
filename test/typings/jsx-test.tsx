import { h, patch, Component } from "../../picodom";

let element: JSX.Element

// empty vnode
element = <div></div>

// vnode with a single child
element = <div>foo</div>
element = <div><span></span></div>
element = <div>12</div>

// vnode with data
interface TestData {
    id: string;
    class: string;
    style: { color: string; }
}

const data: TestData = {
  id: "foo",
  class: "bar",
  style: {
    color: "red"
  }
}

element = <div {...data}>baz</div>

// skip null and Boolean children
// these throw a compiler error by design
// h("div", {}, true)
// h("div", {}, false)
// h("div", {}, null)


// component tests
const Test: Component<any> = (data, children) => <div>{ ...children }</div>
const Wrapper: Component<TestData> = (data, children) => <div>{ children.map(vn => <Test {...data}>{ vn }</Test>) }</div>

// The following two lines should throw a compile error since { id: "foo" } or empty doesn't match the required type TestData//
// element = <Wrapper />
// element = <Wrapper id="foo">bar</Wrapper>;
element = <Wrapper {...data}><Test/></Wrapper>
element = <Wrapper {...data}>
  <span id="child1">Child 1</span>
  <span id="child2">Child 2</span>
</Wrapper>
