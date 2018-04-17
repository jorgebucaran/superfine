import { h, render } from "../src"

function testTrees(name, trees) {
  test(name, done => {
    trees.map(tree => {
      render(tree.node, document.body)
      expect(document.body.innerHTML).toBe(tree.html.replace(/\s{2,}/g, ""))
    })

    done()
  })
}

beforeEach(() => {
  document.body.innerHTML = ""
})

testTrees("replace element", [
  {
    node: h("main", {}),
    html: `<main></main>`
  },
  {
    node: h("div", {}),
    html: `<div></div>`
  }
])

testTrees("replace child", [
  {
    node: h("main", {}, [h("div", {}, "foo")]),
    html: `
        <main>
          <div>foo</div>
        </main>
      `
  },
  {
    node: h("main", {}, [h("main", {}, "bar")]),
    html: `
        <main>
          <main>bar</main>
        </main>
      `
  }
])

testTrees("insert children on top", [
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      h("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="b">B</div>
          <div id="a">A</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      h("div", { key: "b" }, "B"),
      h("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="c">C</div>
          <div id="b">B</div>
          <div id="a">A</div>
        </main>
      `
  }
])

testTrees("remove text node", [
  {
    node: h("main", {}, [h("div", {}, ["foo"]), "bar"]),
    html: `
        <main>
          <div>foo</div>
          bar
        </main>
      `
  },
  {
    node: h("main", {}, [h("div", {}, ["foo"])]),
    html: `
        <main>
          <div>foo</div>
        </main>
      `
  }
])

testTrees("replace keyed", [
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      )
    ]),
    html: `
        <main>
          <div id="b">B</div>
        </main>
      `
  }
])

testTrees("reorder keyed", [
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      h(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      h(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      h(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      h(
        "div",
        {
          key: "e",
          oncreate(e) {
            e.id = "e"
          }
        },
        "E"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
          <div id="b">B</div>
          <div id="c">C</div>
          <div id="d">D</div>
          <div id="e">E</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", { key: "e" }, "E"),
      h("div", { key: "a" }, "A"),
      h("div", { key: "b" }, "B"),
      h("div", { key: "c" }, "C"),
      h("div", { key: "d" }, "D")
    ]),
    html: `
        <main>
          <div id="e">E</div>
          <div id="a">A</div>
          <div id="b">B</div>
          <div id="c">C</div>
          <div id="d">D</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", { key: "e" }, "E"),
      h("div", { key: "d" }, "D"),
      h("div", { key: "a" }, "A"),
      h("div", { key: "c" }, "C"),
      h("div", { key: "b" }, "B")
    ]),
    html: `
        <main>
          <div id="e">E</div>
          <div id="d">D</div>
          <div id="a">A</div>
          <div id="c">C</div>
          <div id="b">B</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", { key: "c" }, "C"),
      h("div", { key: "e" }, "E"),
      h("div", { key: "b" }, "B"),
      h("div", { key: "a" }, "A"),
      h("div", { key: "d" }, "D")
    ]),
    html: `
        <main>
          <div id="c">C</div>
          <div id="e">E</div>
          <div id="b">B</div>
          <div id="a">A</div>
          <div id="d">D</div>
        </main>
      `
  }
])

testTrees("grow/shrink keyed", [
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      h(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      h(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      h(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      h(
        "div",
        {
          key: "e",
          oncreate(e) {
            e.id = "e"
          }
        },
        "E"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
          <div id="b">B</div>
          <div id="c">C</div>
          <div id="d">D</div>
          <div id="e">E</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", { key: "a" }, "A"),
      h("div", { key: "c" }, "C"),
      h("div", { key: "d" }, "D")
    ]),
    html: `
        <main>
          <div id="a">A</div>
          <div id="c">C</div>
          <div id="d">D</div>
        </main>
      `
  },
  {
    node: h("main", {}, [h("div", { key: "d" }, "D")]),
    html: `
        <main>
          <div id="d">D</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      h(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      h(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      h("div", { key: "d" }, "D"),
      h(
        "div",
        {
          key: "e",
          oncreate(e) {
            e.id = "e"
          }
        },
        "E"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
          <div id="b">B</div>
          <div id="c">C</div>
          <div id="d">D</div>
          <div id="e">E</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", { key: "d" }, "D"),
      h("div", { key: "c" }, "C"),
      h("div", { key: "b" }, "B"),
      h("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="d">D</div>
          <div id="c">C</div>
          <div id="b">B</div>
          <div id="a">A</div>
        </main>
      `
  }
])

testTrees("mixed keyed/non-keyed", [
  {
    node: h("main", {}, [
      h(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      h("div", {}, "B"),
      h("div", {}, "C"),
      h(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      h(
        "div",
        {
          key: "e",
          oncreate(e) {
            e.id = "e"
          }
        },
        "E"
      )
    ]),
    html: `
        <main>
          <div id="a">A</div>
          <div>B</div>
          <div>C</div>
          <div id="d">D</div>
          <div id="e">E</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", { key: "e" }, "E"),
      h("div", {}, "C"),
      h("div", {}, "B"),
      h("div", { key: "d" }, "D"),
      h("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="e">E</div>
          <div>C</div>
          <div>B</div>
          <div id="d">D</div>
          <div id="a">A</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", {}, "C"),
      h("div", { key: "d" }, "D"),
      h("div", { key: "a" }, "A"),
      h("div", { key: "e" }, "E"),
      h("div", {}, "B")
    ]),
    html: `
        <main>
          <div>C</div>
          <div id="d">D</div>
          <div id="a">A</div>
          <div id="e">E</div>
          <div>B</div>
        </main>
      `
  },
  {
    node: h("main", {}, [
      h("div", { key: "e" }, "E"),
      h("div", { key: "d" }, "D"),
      h("div", {}, "B"),
      h("div", {}, "C")
    ]),
    html: `
        <main>
          <div id="e">E</div>
          <div id="d">D</div>
          <div>B</div>
          <div>C</div>
        </main>
      `
  }
])

testTrees("styles", [
  {
    node: h("div"),
    html: `<div></div>`
  },
  {
    node: h("div", {
      style: { color: "red", fontSize: "1em", "--foo": "red" }
    }),
    html: `<div style="color: red; font-size: 1em;"></div>`
  },
  {
    node: h("div", {
      style: { color: "blue", float: "left", "--foo": "blue" }
    }),
    html: `<div style="color: blue; float: left;"></div>`
  },
  {
    node: h("div"),
    html: `<div style=""></div>`
  }
])

testTrees("update element data", [
  {
    node: h("div", { id: "foo", class: "bar" }),
    html: `<div id="foo" class="bar"></div>`
  },
  {
    node: h("div", { id: "foo", class: "baz" }),
    html: `<div id="foo" class="baz"></div>`
  }
])

testTrees("removeAttribute", [
  {
    node: h("div", { id: "foo", class: "bar" }),
    html: `<div id="foo" class="bar"></div>`
  },
  {
    node: h("div"),
    html: `<div></div>`
  }
])

testTrees("skip setAttribute for functions", [
  {
    node: h("div", {
      onclick() {}
    }),
    html: `<div></div>`
  }
])

testTrees("setAttribute true", [
  {
    node: h("div", {
      enabled: true
    }),
    html: `<div enabled="true"></div>`
  }
])

testTrees("update element with dynamic props", [
  {
    node: h("input", {
      type: "text",
      value: "foo",
      oncreate(element) {
        expect(element.value).toBe("foo")
      }
    }),
    html: `<input type="text">`
  },
  {
    node: h("input", {
      type: "text",
      value: "bar",
      onupdate(element) {
        expect(element.value).toBe("bar")
      }
    }),
    html: `<input type="text">`
  }
])

testTrees("don't touch textnodes if equal", [
  {
    node: h(
      "main",
      {
        oncreate(element) {
          element.childNodes[0].textContent = "foobar"
        }
      },
      "foo"
    ),
    html: `<main>foobar</main>`
  },
  {
    node: h("main", {}, "foobar"),
    html: `<main>foobar</main>`
  }
])

testTrees("a list with empty text nodes", [
  {
    node: h("ul", {}, [h("li", {}, ""), h("div", {}, "foo")]),
    html: `<ul><li></li><div>foo</div></ul>`
  },
  {
    node: h("ul", {}, [h("li", {}, ""), h("li", {}, ""), h("div", {}, "foo")]),
    html: `<ul><li></li><li></li><div>foo</div></ul>`
  },
  {
    node: h("ul", {}, [
      h("li", {}, ""),
      h("li", {}, ""),
      h("li", {}, ""),
      h("div", {}, "foo")
    ]),
    html: `<ul><li></li><li></li><li></li><div>foo</div></ul>`
  }
])

testTrees("elements with falsey values", [
  {
    node: h("div", {
      "data-test": "foo"
    }),
    html: `<div data-test="foo"></div>`
  },
  {
    node: h("div", {
      "data-test": "0"
    }),
    html: `<div data-test="0"></div>`
  },
  {
    node: h("div", {
      "data-test": 0
    }),
    html: `<div data-test="0"></div>`
  },
  {
    node: h("div", {
      "data-test": null
    }),
    html: `<div></div>`
  },
  {
    node: h("div", {
      "data-test": false
    }),
    html: `<div></div>`
  },
  {
    node: h("div", {
      "data-test": undefined
    }),
    html: `<div></div>`
  }
])

testTrees("input list attribute", [
  {
    node: h("input", {
      list: "foobar"
    }),
    html: `<input list="foobar">`
  }
])

test("event handlers", done => {
  render(
    h("button", {
      oncreate(el) {
        el.dispatchEvent(new Event("click"))
      },
      onclick(event) {
        done()
      }
    }),
    document.body
  )
})
