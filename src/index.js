var IS_VNODE = 0
var IS_RECYCLED = 1
var IS_TEXT_NODE = 2

var EMPTY_OBJECT = {}
var EMPTY_ARRAY = []

var map = [].map
var isArray = Array.isArray

var isNull = function(any) {
  return any === null || any === undefined
}

var merge = function(a, b) {
  var target = []

  for (var i in a) target[i] = a[i]
  for (var i in b) target[i] = b[i]

  return target
}

var eventProxy = function(event) {
  return event.currentTarget.events[event.type](event)
}

var updateProperty = function(element, name, lastValue, nextValue, isSvg) {
  if (name === "key") {
  } else if (name === "style") {
    for (var i in merge(lastValue, nextValue)) {
      var style = nextValue == null || nextValue[i] == null ? "" : nextValue[i]
      if (i[0] === "-") {
        element[name].setProperty(i, style)
      } else {
        element[name][i] = style
      }
    }
  } else {
    if (name[0] === "o" && name[1] === "n") {
      if (!element.events) element.events = {}
      element.events[(name = name.slice(2))] = nextValue

      if (isNull(nextValue)) {
        element.removeEventListener(name, eventProxy)
      } else if (isNull(lastValue)) {
        element.addEventListener(name, eventProxy)
      }
    } else if (name in element && name !== "list" && !isSvg) {
      element[name] = isNull(nextValue) ? "" : nextValue
    } else if (!isNull(nextValue) && nextValue !== false) {
      element.setAttribute(name, nextValue)
    }

    if (isNull(nextValue) || nextValue === false) {
      element.removeAttribute(name)
    }
  }
}

var createElement = function(node, lifecycle, isSvg) {
  var element =
    node.flags & IS_TEXT_NODE
      ? document.createTextNode(node.name)
      : (isSvg = isSvg || node.name === "svg")
        ? document.createElementNS("http://www.w3.org/2000/svg", node.name)
        : document.createElement(node.name)

  var props = node.props
  if (props) {
    if (props.oncreate) {
      lifecycle.push(function() {
        props.oncreate(element)
      })
    }

    for (var i = 0; i < node.children.length; i++) {
      element.appendChild(createElement(node.children[i], lifecycle, isSvg))
    }

    for (var name in props) {
      updateProperty(element, name, null, props[name], isSvg)
    }
  }

  return (node.element = element)
}

var updateElement = function(
  element,
  lastProps,
  nextProps,
  lifecycle,
  isSvg,
  isRecycled
) {
  for (var name in merge(lastProps, nextProps)) {
    if (
      (name === "value" || name === "checked"
        ? element[name]
        : lastProps[name]) !== nextProps[name]
    ) {
      updateProperty(element, name, lastProps[name], nextProps[name], isSvg)
    }
  }

  var cb = isRecycled ? nextProps.oncreate : nextProps.onupdate
  if (cb) {
    lifecycle.push(function() {
      cb(element, lastProps)
    })
  }
}

var removeChildren = function(node) {
  var props = node.props
  if (props) {
    for (var i = 0; i < node.children.length; i++) {
      removeChildren(node.children[i])
    }

    if (props.ondestroy) {
      props.ondestroy(node.element)
    }
  }
  return node.element
}

var removeElement = function(parent, node) {
  var remove = function() {
    parent.removeChild(removeChildren(node))
  }
  var cb = node.props && node.props.onremove
  if (cb) {
    cb(node.element, remove)
  } else {
    remove()
  }
}

var getKey = function(node) {
  return node ? node.key : null
}

var patchElement = function(
  parent,
  element,
  lastNode,
  nextNode,
  lifecycle,
  isSvg
) {
  if (nextNode === lastNode) {
  } else if (
    !isNull(lastNode) &&
    lastNode.flags & IS_TEXT_NODE &&
    nextNode.flags & IS_TEXT_NODE
  ) {
    if (lastNode.name !== nextNode.name) {
      element.nodeValue = nextNode.name
    }
  } else if (isNull(lastNode) || lastNode.name !== nextNode.name) {
    var newElement = parent.insertBefore(
      createElement(nextNode, lifecycle, isSvg),
      element
    )

    if (!isNull(lastNode)) removeElement(parent, lastNode)

    element = newElement
  } else {
    updateElement(
      element,
      lastNode.props,
      nextNode.props,
      lifecycle,
      (isSvg = isSvg || nextNode.name === "svg"),
      lastNode.flags & IS_RECYCLED
    )

    var child
    var lastCh = lastNode.children
    var lastChStart = 0
    var nextChStart = 0
    var nextCh = nextNode.children
    var lastChEnd = lastCh.length - 1
    var nextChEnd = nextCh.length - 1

    while (nextChStart <= nextChEnd && lastChStart <= lastChEnd) {
      var lastKey = getKey(lastCh[lastChStart])
      var nextKey = getKey(nextCh[nextChStart])

      if (isNull(lastKey) || lastKey !== nextKey) break

      patchElement(
        element,
        lastCh[lastChStart].element,
        lastCh[lastChStart],
        nextCh[nextChStart],
        lifecycle,
        isSvg
      )

      lastChStart++
      nextChStart++
    }

    while (nextChStart <= nextChEnd && lastChStart <= lastChEnd) {
      var lastKey = getKey(lastCh[lastChEnd])
      var nextKey = getKey(nextCh[nextChEnd])

      if (isNull(lastKey) || lastKey !== nextKey) break

      patchElement(
        element,
        lastCh[lastChEnd].element,
        lastCh[lastChEnd],
        nextCh[nextChEnd],
        lifecycle,
        isSvg
      )

      lastChEnd--
      nextChEnd--
    }

    if (lastChStart > lastChEnd) {
      while (nextChStart <= nextChEnd) {
        element.insertBefore(
          createElement(nextCh[nextChStart], lifecycle, isSvg),
          isNull((child = lastCh[lastChStart])) ? null : child.element
        )
        nextChStart++
      }
    } else if (nextChStart > nextChEnd) {
      while (lastChStart <= lastChEnd) {
        removeElement(element, lastCh[lastChStart++])
      }
    } else {
      var lastKeyed = {}
      var nextKeyed = {}

      for (var i = lastChStart, key; i <= lastChEnd; i++) {
        if (!isNull((key = getKey((child = lastCh[i]))))) {
          lastKeyed[key] = child
        }
      }

      var i = lastChStart
      var k = nextChStart

      while (k <= nextChEnd) {
        var lastKey = getKey((child = lastCh[i]))
        var nextKey = getKey(nextCh[k])

        if (nextKeyed[lastKey]) {
          i++
          continue
        }

        if (!isNull(nextKey) && nextKey === getKey(lastCh[i + 1])) {
          if (isNull(lastKey)) {
            removeElement(element, child)
          }
          i++
          continue
        }

        if (isNull(nextKey) || lastNode.flags & IS_RECYCLED) {
          if (isNull(lastKey)) {
            patchElement(
              element,
              child && child.element,
              child,
              nextCh[k],
              lifecycle,
              isSvg
            )
            k++
          }
          i++
        } else {
          var foundNode = lastKeyed[nextKey]

          if (lastKey === nextKey) {
            patchElement(
              element,
              foundNode.element,
              foundNode,
              nextCh[k],
              lifecycle,
              isSvg
            )
            i++
          } else if (foundNode && foundNode.element) {
            patchElement(
              element,
              element.insertBefore(foundNode.element, child && child.element),
              foundNode,
              nextCh[k],
              lifecycle,
              isSvg
            )
          } else {
            patchElement(
              element,
              child && child.element,
              null,
              nextCh[k],
              lifecycle,
              isSvg
            )
          }

          nextKeyed[nextKey] = nextCh[k]
          k++
        }
      }

      while (i <= lastChEnd) {
        if (isNull(getKey((child = lastCh[i++])))) {
          removeElement(element, child)
        }
      }

      for (var key in lastKeyed) {
        if (isNull(nextKeyed[key])) {
          removeElement(element, lastKeyed[key])
        }
      }
    }
  }

  return (nextNode.element = element)
}

var createVNode = function(name, props, children, element, key, flags) {
  return {
    name: name,
    props: props,
    children: children,
    element: element,
    key: key,
    flags: flags
  }
}

var createTextVNode = function(text, element) {
  return createVNode(
    text,
    EMPTY_OBJECT,
    EMPTY_ARRAY,
    element,
    null,
    IS_TEXT_NODE
  )
}

var recycleChild = function(element) {
  return element.nodeType === 3 // Node.TEXT_NODE
    ? createTextVNode(element.nodeValue, element)
    : recycleElement(element)
}

var recycleElement = function(element) {
  return createVNode(
    element.nodeName.toLowerCase(),
    EMPTY_OBJECT,
    map.call(element.childNodes, recycleChild),
    element,
    null,
    IS_RECYCLED
  )
}

export var recycle = function(container) {
  return recycleElement(container.children[0])
}

export var patch = function(lastNode, nextNode, container) {
  var lifecycle = []

  patchElement(container, container.children[0], lastNode, nextNode, lifecycle)

  while (lifecycle.length) lifecycle.pop()()

  return nextNode
}

export var h = function(name, props) {
  var node
  var rest = []
  var children = []
  var length = arguments.length

  while (length-- > 2) rest.push(arguments[length])

  if (!isNull((props = props || {}).children)) {
    rest.push(props.children)
    delete props.children
  }

  while (rest.length > 0) {
    if ((node = rest.pop()) && isArray(node)) {
      for (length = node.length; length--; ) {
        rest.push(node[length])
      }
    } else if (isNull(node) || node === true || node === false) {
    } else {
      children.push(typeof node === "object" ? node : createTextVNode(node))
    }
  }

  return typeof name === "function"
    ? name(props, (props.children = children))
    : createVNode(name, props, children, null, props.key, IS_VNODE)
}
