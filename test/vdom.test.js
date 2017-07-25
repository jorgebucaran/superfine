import { h, patch } from "../src"

window.requestAnimationFrame = setTimeout

const root = document.body

beforeEach(() => (root.innerHTML = ""))

const TreeTest = trees => {
  return new Promise((resolve, reject) => {
    const NextTree = (testIterator) => {
      let { value: expectedHtml, done } = testIterator.next()
      if (done) {
        resolve()
        return
      }

      try {
        expect(root.innerHTML).toBe(expectedHtml.replace(/\s{2,}/g, ""))
      } catch (error) {
        reject(error)
        return
      }

      setTimeout(NextTree, 0, testIterator)
    }

    function* createTestIterator() {
      let oldNode = null
      let newNode = null
      let element = null

      for (let { tree, html } of trees) {
        oldNode = newNode
        newNode = tree
        element = patch(root, element, oldNode, newNode)
        yield html
      }
    }

    NextTree(createTestIterator())
  })
}

test("replace element", () =>
  TreeTest([
    {
      tree: h("main"),
      html: `<main></main>`
    },
    {
      tree: h("div"),
      html: `<div></div>`
    }
  ]))

test("replace child", () =>
  TreeTest([
    {
      tree: h("main", null, [h("div", null, ["foo"])]),
      html: `
        <main>
          <div>foo</div>
        </main>
      `
    },
    {
      tree: h("main", null, [h("main", null, ["bar"])]),
      html: `
        <main>
          <main>bar</main>
        </main>
      `
    }
  ]))

test("insert children on top", () =>
  TreeTest([
    {
      tree: h("main", {}, [
        h("div", { key: "a", oncreate: e => (e.id = "a") }, "A")
      ]),
      html: `
        <main>
          <div id="a">A</div>
        </main>
      `
    },
    {
      tree: h("main", {}, [
        h("div", { key: "b", oncreate: e => (e.id = "b") }, "B"),
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
      tree: h("main", {}, [
        h("div", { key: "c", oncreate: e => (e.id = "c") }, "C"),
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
    },
    {
      tree: h("main", {}, [
        h("div", { key: "d", oncreate: e => (e.id = "d") }, "D"),
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
  ]))

test("remove text node", () =>
  TreeTest([
    {
      tree: h("main", {}, [h("div", {}, ["foo"]), "bar"]),
      html: `
        <main>
          <div>foo</div>
          bar
        </main>
      `
    },
    {
      tree: h("main", {}, [h("div", {}, ["foo"])]),
      html: `
        <main>
          <div>foo</div>
        </main>
      `
    }
  ]))

test("replace keyed", () =>
  TreeTest([
    {
      tree: h("main", {}, [
        h("div", { key: "a", oncreate: e => (e.id = "a") }, "A")
      ]),
      html: `
        <main>
          <div id="a">A</div>
        </main>
      `
    },
    {
      tree: h("main", {}, [
        h("div", { key: "b", oncreate: e => (e.id = "b") }, "B")
      ]),
      html: `
        <main>
          <div id="b">B</div>
        </main>
      `
    }
  ]))

test("reorder keyed", () =>
  TreeTest([
    {
      tree: h("main", {}, [
        h("div", { key: "a", oncreate: e => (e.id = "a") }, "A"),
        h("div", { key: "b", oncreate: e => (e.id = "b") }, "B"),
        h("div", { key: "c", oncreate: e => (e.id = "c") }, "C"),
        h("div", { key: "d", oncreate: e => (e.id = "d") }, "D"),
        h("div", { key: "e", oncreate: e => (e.id = "e") }, "E")
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
      tree: h("main", {}, [
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
      tree: h("main", {}, [
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
      tree: h("main", {}, [
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
  ]))

test("grow/shrink keyed", () =>
  TreeTest([
    {
      tree: h("main", {}, [
        h("div", { key: "a", oncreate: e => (e.id = "a") }, "A"),
        h("div", { key: "b", oncreate: e => (e.id = "b") }, "B"),
        h("div", { key: "c", oncreate: e => (e.id = "c") }, "C"),
        h("div", { key: "d", oncreate: e => (e.id = "d") }, "D"),
        h("div", { key: "e", oncreate: e => (e.id = "e") }, "E")
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
      tree: h("main", {}, [
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
      tree: h("main", {}, [h("div", { key: "d" }, "D")]),
      html: `
        <main>
          <div id="d">D</div>
        </main>
      `
    },
    {
      tree: h("main", {}, [
        h("div", { key: "a", oncreate: e => (e.id = "a") }, "A"),
        h("div", { key: "b", oncreate: e => (e.id = "b") }, "B"),
        h("div", { key: "c", oncreate: e => (e.id = "c") }, "C"),
        h("div", { key: "d" }, "D"),
        h("div", { key: "e", oncreate: e => (e.id = "e") }, "E")
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
      tree: h("main", {}, [
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
  ]))

test("mixed keyed/non-keyed", () =>
  TreeTest([
    {
      tree: h("main", {}, [
        h("div", { key: "a", oncreate: e => (e.id = "a") }, "A"),
        h("div", {}, "B"),
        h("div", {}, "C"),
        h("div", { key: "d", oncreate: e => (e.id = "d") }, "D"),
        h("div", { key: "e", oncreate: e => (e.id = "e") }, "E")
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
      tree: h("main", {}, [
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
      tree: h("main", {}, [
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
      tree: h("main", {}, [
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
  ]))

test("style", () =>
  TreeTest([
    {
      tree: h("div"),
      html: `<div></div>`
    },
    {
      tree: h("div", { style: { color: "red", fontSize: "1em" } }),
      html: `<div style="color: red; font-size: 1em;"></div>`
    },
    {
      tree: h("div", { style: { color: "blue", float: "left" } }),
      html: `<div style="color: blue; float: left;"></div>`
    },
    {
      tree: h("div"),
      html: `<div style=""></div>`
    }
  ]))

test("update element data", () =>
  TreeTest([
    {
      tree: h("div", { id: "foo", class: "bar" }),
      html: `<div id="foo" class="bar"></div>`
    },
    {
      tree: h("div", { id: "foo", class: "baz" }),
      html: `<div id="foo" class="baz"></div>`
    }
  ]))

test("svg elements", () =>
  TreeTest([
    {
      tree: h("main", { id: "html1" }, [
        h("svg", { id: "svg1" }, [
          h("circle", { cx: 25, cy: 25, r: 15 })
        ]),
        h("div", { id: "html2" })
      ]),
      html: `
        <main id="html1">
          <svg id="svg1">
            <circle cx="25" cy="25" r="15"></circle>
          </svg>
          <div id="html2"></div>
        </main>`
    }
  ]).then(() => {
    let div1 = document.getElementById("html1")
    let svgElement = document.getElementById("svg1")
    let div2 = document.getElementById("html2")

    expect(div1.namespaceURI).toBe("http://www.w3.org/1999/xhtml")
    expect(svgElement.namespaceURI).toBe("http://www.w3.org/2000/svg")
    expect(div2.namespaceURI).toBe("http://www.w3.org/1999/xhtml")
  }))
