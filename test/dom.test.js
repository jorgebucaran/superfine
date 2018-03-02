import { createNode as U, patch } from "../src"

function testTrees(name, trees) {
  test(name, done => {
    trees.map(tree => {
      patch(tree.node, document.body.firstElementChild)
      expect(document.body.innerHTML).toBe(tree.html.replace(/\s{2,}/g, ""))
    })

    done()
  })
}

beforeEach(() => {
  document.body.innerHTML = "<div></div>"
})

testTrees("replace element", [
  {
    node: U("main", {}),
    html: `<main></main>`
  },
  {
    node: U("div", {}),
    html: `<div></div>`
  }
])

testTrees("replace child", [
  {
    node: U("main", {}, [U("div", {}, "foo")]),
    html: `
        <main>
          <div>foo</div>
        </main>
      `
  },
  {
    node: U("main", {}, [U("main", {}, "bar")]),
    html: `
        <main>
          <main>bar</main>
        </main>
      `
  }
])

testTrees("insert children on top", [
  {
    node: U("main", {}, [
      U(
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
    node: U("main", {}, [
      U(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      U("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="b">B</div>
          <div id="a">A</div>
        </main>
      `
  },
  {
    node: U("main", {}, [
      U(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      U("div", { key: "b" }, "B"),
      U("div", { key: "a" }, "A")
    ]),
    html: `
        <main>
          <div id="c">C</div>
          <div id="b">B</div>
          <div id="a">A</div>
        </main>
      `
  },
  {
    node: U("main", {}, [
      U(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      U("div", { key: "c" }, "C"),
      U("div", { key: "b" }, "B"),
      U("div", { key: "a" }, "A")
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

testTrees("remove text node", [
  {
    node: U("main", {}, [U("div", {}, ["foo"]), "bar"]),
    html: `
        <main>
          <div>foo</div>
          bar
        </main>
      `
  },
  {
    node: U("main", {}, [U("div", {}, ["foo"])]),
    html: `
        <main>
          <div>foo</div>
        </main>
      `
  }
])

testTrees("replace keyed", [
  {
    node: U("main", {}, [
      U(
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
    node: U("main", {}, [
      U(
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
    node: U("main", {}, [
      U(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      U(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      U(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      U(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      U(
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
    node: U("main", {}, [
      U("div", { key: "e" }, "E"),
      U("div", { key: "a" }, "A"),
      U("div", { key: "b" }, "B"),
      U("div", { key: "c" }, "C"),
      U("div", { key: "d" }, "D")
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
    node: U("main", {}, [
      U("div", { key: "e" }, "E"),
      U("div", { key: "d" }, "D"),
      U("div", { key: "a" }, "A"),
      U("div", { key: "c" }, "C"),
      U("div", { key: "b" }, "B")
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
    node: U("main", {}, [
      U("div", { key: "c" }, "C"),
      U("div", { key: "e" }, "E"),
      U("div", { key: "b" }, "B"),
      U("div", { key: "a" }, "A"),
      U("div", { key: "d" }, "D")
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
    node: U("main", {}, [
      U(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      U(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      U(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      U(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      U(
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
    node: U("main", {}, [
      U("div", { key: "a" }, "A"),
      U("div", { key: "c" }, "C"),
      U("div", { key: "d" }, "D")
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
    node: U("main", {}, [U("div", { key: "d" }, "D")]),
    html: `
        <main>
          <div id="d">D</div>
        </main>
      `
  },
  {
    node: U("main", {}, [
      U(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      U(
        "div",
        {
          key: "b",
          oncreate(e) {
            e.id = "b"
          }
        },
        "B"
      ),
      U(
        "div",
        {
          key: "c",
          oncreate(e) {
            e.id = "c"
          }
        },
        "C"
      ),
      U("div", { key: "d" }, "D"),
      U(
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
    node: U("main", {}, [
      U("div", { key: "d" }, "D"),
      U("div", { key: "c" }, "C"),
      U("div", { key: "b" }, "B"),
      U("div", { key: "a" }, "A")
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
    node: U("main", {}, [
      U(
        "div",
        {
          key: "a",
          oncreate(e) {
            e.id = "a"
          }
        },
        "A"
      ),
      U("div", {}, "B"),
      U("div", {}, "C"),
      U(
        "div",
        {
          key: "d",
          oncreate(e) {
            e.id = "d"
          }
        },
        "D"
      ),
      U(
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
    node: U("main", {}, [
      U("div", { key: "e" }, "E"),
      U("div", {}, "C"),
      U("div", {}, "B"),
      U("div", { key: "d" }, "D"),
      U("div", { key: "a" }, "A")
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
    node: U("main", {}, [
      U("div", {}, "C"),
      U("div", { key: "d" }, "D"),
      U("div", { key: "a" }, "A"),
      U("div", { key: "e" }, "E"),
      U("div", {}, "B")
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
    node: U("main", {}, [
      U("div", { key: "e" }, "E"),
      U("div", { key: "d" }, "D"),
      U("div", {}, "B"),
      U("div", {}, "C")
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
    node: U("div"),
    html: `<div></div>`
  },
  {
    node: U("div", { style: { color: "red", fontSize: "1em" } }),
    html: `<div style="color: red; font-size: 1em;"></div>`
  },
  {
    node: U("div", { style: { color: "blue", float: "left" } }),
    html: `<div style="color: blue; float: left;"></div>`
  },
  {
    node: U("div"),
    html: `<div style=""></div>`
  }
])

testTrees("update element data", [
  {
    node: U("div", { id: "foo", class: "bar" }),
    html: `<div id="foo" class="bar"></div>`
  },
  {
    node: U("div", { id: "foo", class: "baz" }),
    html: `<div id="foo" class="baz"></div>`
  }
])

testTrees("removeAttribute", [
  {
    node: U("div", { id: "foo", class: "bar" }),
    html: `<div id="foo" class="bar"></div>`
  },
  {
    node: U("div"),
    html: `<div></div>`
  }
])

testTrees("skip setAttribute for functions", [
  {
    node: U("div", {
      onclick() {}
    }),
    html: `<div></div>`
  }
])

testTrees("setAttribute true", [
  {
    node: U("div", {
      enabled: true
    }),
    html: `<div enabled="true"></div>`
  }
])

testTrees("update element with dynamic props", [
  {
    node: U("input", {
      type: "text",
      value: "foo",
      oncreate(element) {
        expect(element.value).toBe("foo")
      }
    }),
    html: `<input type="text">`
  },
  {
    node: U("input", {
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
    node: U(
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
    node: U("main", {}, "foobar"),
    html: `<main>foobar</main>`
  }
])

testTrees("a list with empty text nodes", [
  {
    node: U("ul", {}, [U("li", {}, ""), U("div", {}, "foo")]),
    html: `<ul><li></li><div>foo</div></ul>`
  },
  {
    node: U("ul", {}, [U("li", {}, ""), U("li", {}, ""), U("div", {}, "foo")]),
    html: `<ul><li></li><li></li><div>foo</div></ul>`
  },
  {
    node: U("ul", {}, [
      U("li", {}, ""),
      U("li", {}, ""),
      U("li", {}, ""),
      U("div", {}, "foo")
    ]),
    html: `<ul><li></li><li></li><li></li><div>foo</div></ul>`
  }
])

testTrees("elements with falsey values", [
  {
    node: U("div", {
      "data-test": "foo"
    }),
    html: `<div data-test="foo"></div>`
  },
  {
    node: U("div", {
      "data-test": "0"
    }),
    html: `<div data-test="0"></div>`
  },
  {
    node: U("div", {
      "data-test": 0
    }),
    html: `<div data-test="0"></div>`
  },
  {
    node: U("div", {
      "data-test": null
    }),
    html: `<div></div>`
  },
  {
    node: U("div", {
      "data-test": false
    }),
    html: `<div></div>`
  },
  {
    node: U("div", {
      "data-test": undefined
    }),
    html: `<div></div>`
  }
])

testTrees("input list attribute", [
  {
    node: U("input", {
      list: "foobar"
    }),
    html: `<input list="foobar">`
  }
])
