import { h, Component } from "../../"

// empty vnode
h("div")

// vnode with a single child
h("div", {}, ["foo"])
h("div", {}, "foo")
h("div", {}, [h("div")])
h("div", {}, h("div"))

// positional String/Number children
h("div", {}, "foo", "bar", "baz")
h("div", {}, 1, "foo", 2, "baz", 3)
h("div", {}, "foo", h("div", {}, "bar"), "baz", "quux")

// vnode with props
interface TestProps {
  id: string
  class: string
  style: { color: string }
}

const props: TestProps = {
  id: "foo",
  class: "bar",
  style: {
    color: "red"
  }
}

h("div", props, "baz")

// skip null and Boolean children
// these throw a compiler error by design
// h("div", {}, true)
// h("div", {}, false)
// h("div", {}, null)

// component tests
const Test: Component<any> = (props, children) => h("div", props, children)
const Wrapper: Component<TestProps> = (props, children) =>
  h("div", props, children.map(vn => h(Test, null, vn)))

// The following line, while it isn't type correct (Wrapper requires type TestProps for props), it is allowed
// because the type of `h` defines the `props` param as optional
h(Wrapper)
// The following line should throw a compiler error since {id: "foo"} doesn't match the required type TestProps
// h(Wrapper, { id: "foo" })
h(Test)
h(Test, { id: "foo" }, "bar")
h(Test, { id: "foo" }, [h(Test, { id: "bar" })])
h(Wrapper, props, [
  h("span", { "data-attr": "child1" }),
  h("span", { "data-attr": "child2" })
])

let element: JSX.Element
// The following two lines should throw a compile error since { id: "foo" } or empty doesn't match the required type TestProps
// element = <Wrapper />
// element = <Wrapper id="foo">bar</Wrapper>
element = (
  <Wrapper {...props}>
    <Test />
  </Wrapper>
)
element = (
  <Wrapper {...props}>
    <span id="child1">Child 1</span>
    <span id="child2">Child 2</span>
  </Wrapper>
)
