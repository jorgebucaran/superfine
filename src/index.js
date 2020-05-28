var IS_RECYCLED = 1
var IS_TEXT = 3
var EMPTY_OBJ = {}
var EMPTY_ARR = []
var SVG_NS = "http://www.w3.org/2000/svg"

var listener = function (event) {
  this.tag[event.type](event)
}

var getKey = (vdom) => (vdom == null ? null : vdom.key)

var vdomify = (vdom) =>
  vdom !== true && vdom !== false && vdom ? vdom : text("")

var patchDom = (parent, dom, oldVdom, newVdom, isSvg) => {
  if (oldVdom === newVdom) {
  } else if (
    oldVdom != null &&
    oldVdom.tag === IS_TEXT &&
    newVdom.tag === IS_TEXT
  ) {
    if (oldVdom.type !== newVdom.type) dom.nodeValue = newVdom.type
  } else if (oldVdom == null || oldVdom.type !== newVdom.type) {
    dom = parent.insertBefore(
      createNode((newVdom = vdomify(newVdom)), isSvg),
      dom
    )
    if (oldVdom != null) {
      parent.removeChild(oldVdom.dom)
    }
  } else {
    var tmpVKid
    var oldVKid

    var oldKey
    var newKey

    var oldProps = oldVdom.props
    var newProps = newVdom.props

    var oldVKids = oldVdom.children
    var newVKids = newVdom.children

    var oldHead = 0
    var newHead = 0
    var oldTail = oldVKids.length - 1
    var newTail = newVKids.length - 1

    isSvg = isSvg || newVdom.type === "svg"

    for (var i in { ...oldProps, ...newProps }) {
      if (
        (i === "value" || i === "selected" || i === "checked"
          ? dom[i]
          : oldProps[i]) !== newProps[i]
      ) {
        patchProp(dom, i, oldProps[i], newProps[i], isSvg)
      }
    }

    while (newHead <= newTail && oldHead <= oldTail) {
      if (
        (oldKey = getKey(oldVKids[oldHead])) == null ||
        oldKey !== getKey(newVKids[newHead])
      ) {
        break
      }

      patchDom(
        dom,
        oldVKids[oldHead].dom,
        oldVKids[oldHead++],
        (newVKids[newHead] = vdomify(newVKids[newHead++])),
        isSvg
      )
    }

    while (newHead <= newTail && oldHead <= oldTail) {
      if (
        (oldKey = getKey(oldVKids[oldTail])) == null ||
        oldKey !== getKey(newVKids[newTail])
      ) {
        break
      }

      patchDom(
        dom,
        oldVKids[oldTail].dom,
        oldVKids[oldTail--],
        (newVKids[newTail] = vdomify(newVKids[newTail--])),
        isSvg
      )
    }

    if (oldHead > oldTail) {
      while (newHead <= newTail) {
        dom.insertBefore(
          createNode((newVKids[newHead] = vdomify(newVKids[newHead++])), isSvg),
          (oldVKid = oldVKids[oldHead]) && oldVKid.dom
        )
      }
    } else if (newHead > newTail) {
      while (oldHead <= oldTail) {
        dom.removeChild(oldVKids[oldHead++].dom)
      }
    } else {
      for (var keyed = {}, newKeyed = {}, i = oldHead; i <= oldTail; i++) {
        if ((oldKey = oldVKids[i].key) != null) {
          keyed[oldKey] = oldVKids[i]
        }
      }

      while (newHead <= newTail) {
        oldKey = getKey((oldVKid = oldVKids[oldHead]))
        newKey = getKey((newVKids[newHead] = vdomify(newVKids[newHead])))

        if (
          newKeyed[oldKey] ||
          (newKey != null && newKey === getKey(oldVKids[oldHead + 1]))
        ) {
          if (oldKey == null) {
            dom.removeChild(oldVKid.dom)
          }
          oldHead++
          continue
        }

        if (newKey == null || oldVdom.tag === IS_RECYCLED) {
          if (oldKey == null) {
            patchDom(
              dom,
              oldVKid && oldVKid.dom,
              oldVKid,
              newVKids[newHead],
              isSvg
            )
            newHead++
          }
          oldHead++
        } else {
          if (oldKey === newKey) {
            patchDom(dom, oldVKid.dom, oldVKid, newVKids[newHead], isSvg)
            newKeyed[newKey] = true
            oldHead++
          } else {
            if ((tmpVKid = keyed[newKey]) != null) {
              patchDom(
                dom,
                dom.insertBefore(tmpVKid.dom, oldVKid && oldVKid.dom),
                tmpVKid,
                newVKids[newHead],
                isSvg
              )
              newKeyed[newKey] = true
            } else {
              patchDom(
                dom,
                oldVKid && oldVKid.dom,
                null,
                newVKids[newHead],
                isSvg
              )
            }
          }
          newHead++
        }
      }

      while (oldHead <= oldTail) {
        if (getKey((oldVKid = oldVKids[oldHead++])) == null) {
          dom.removeChild(oldVKid.dom)
        }
      }

      for (var i in keyed) {
        if (newKeyed[i] == null) {
          dom.removeChild(keyed[i].dom)
        }
      }
    }
  }

  return (newVdom.dom = dom)
}

var createNode = (vdom, isSvg) => {
  var props = vdom.props
  var dom =
    vdom.tag === IS_TEXT
      ? document.createTextNode(vdom.type)
      : (isSvg = isSvg || vdom.type === "svg")
      ? document.createElementNS(SVG_NS, vdom.type, { is: props.is })
      : document.createElement(vdom.type, { is: props.is })

  for (var k in props) patchProp(dom, k, null, props[k], isSvg)

  vdom.children.map((kid) =>
    dom.appendChild(createNode((kid = vdomify(kid)), isSvg))
  )

  return (vdom.dom = dom)
}

var patchProp = (dom, key, oldVal, newVal, isSvg) => {
  if (key === "key") {
  } else if (key[0] === "o" && key[1] === "n") {
    if (!((dom.tag || (dom.tag = {}))[(key = key.slice(2))] = newVal)) {
      dom.removeEventListener(key, listener)
    } else if (!oldVal) {
      dom.addEventListener(key, listener)
    }
  } else if (!isSvg && key !== "list" && key !== "form" && key in dom) {
    dom[key] = newVal == null ? "" : newVal
  } else if (newVal == null || newVal === false) {
    dom.removeAttribute(key)
  } else {
    dom.setAttribute(key, newVal)
  }
}

var recycle = (dom) =>
  dom.nodeType === IS_TEXT
    ? text(dom.nodeValue, dom)
    : newVdom(
        dom.nodeName.toLowerCase(),
        EMPTY_OBJ,
        EMPTY_ARR.map.call(dom.childNodes, recycle),
        dom,
        null,
        IS_RECYCLED
      )

var newVdom = (type, props, children, dom, key, tag) => ({
  type,
  props,
  children,
  dom,
  tag,
  key,
})

export var patch = (dom, vdom) => (
  ((dom = patchDom(dom.parentNode, dom, dom.v || recycle(dom), vdom)).v = vdom),
  dom
)

export var text = (value, dom) =>
  newVdom(value, EMPTY_OBJ, EMPTY_ARR, dom, null, IS_TEXT)

export var h = (type, props, ch) =>
  newVdom(
    type,
    props,
    Array.isArray(ch) ? ch : ch == null ? EMPTY_ARR : [ch],
    null,
    props.key
  )
