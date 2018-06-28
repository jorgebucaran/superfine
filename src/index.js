var map = [].map
var isArray = Array.isArray

var clone = function(target, source) {
  var out = []

  for (var i in target) out[i] = target[i]
  for (var i in source) out[i] = source[i]

  return out
}

var eventProxy = function(event) {
  return event.currentTarget.events[event.type](event)
}

var updateProperty = function(element, name, lastValue, nextValue, isSvg) {
  if (name === "key") {
  } else {
    if (name[0] === "o" && name[1] === "n") {
      if (!element.events) {
        element.events = {}
      }
      element.events[(name = name.slice(2))] = nextValue

      if (nextValue) {
        if (!lastValue) {
          element.addEventListener(name, eventProxy)
        }
      } else {
        element.removeEventListener(name, eventProxy)
      }
    } else if (name in element && name !== "list" && !isSvg) {
      element[name] = nextValue == null ? "" : nextValue
    } else if (nextValue != null && nextValue !== false) {
      element.setAttribute(name, nextValue)
    }

    if (nextValue == null || nextValue === false) {
      element.removeAttribute(name)
    }
  }
}

var createElement = function(node, lifecycle, isSvg) {
  var element =
    typeof node === "string" || typeof node === "number"
      ? document.createTextNode(node)
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

  return element
}

var updateElement = function(
  element,
  lastProps,
  nextProps,
  lifecycle,
  isSvg,
  isRecycled
) {
  for (var name in clone(lastProps, nextProps)) {
    if (
      nextProps[name] !==
      (name === "value" || name === "checked" ? element[name] : lastProps[name])
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

var removeChildren = function(element, node) {
  var props = node.props
  if (props) {
    for (var i = 0; i < node.children.length; i++) {
      removeChildren(element.childNodes[i], node.children[i])
    }

    if (props.ondestroy) {
      props.ondestroy(element)
    }
  }
  return element
}

var removeElement = function(parent, element, node) {
  parent.removeChild(removeChildren(element, node))
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
  } else if (lastNode == null || lastNode.name !== nextNode.name) {
    var newElement = parent.insertBefore(
      createElement(nextNode, lifecycle, isSvg),
      element
    )

    if (lastNode != null) {
      removeElement(parent, element, lastNode)
    }

    element = newElement
  } else if (lastNode.name == null) {
    element.nodeValue = nextNode
  } else {
    updateElement(
      element,
      lastNode.props,
      nextNode.props,
      lifecycle,
      (isSvg = isSvg || nextNode.name === "svg"),
      lastNode.recycled
    )

    var lastKeyed = {}
    var nextKeyed = {}
    var lastElements = []
    var lastChildren = lastNode.children
    var children = nextNode.children

    for (var i = 0; i < lastChildren.length; i++) {
      lastElements[i] = element.childNodes[i]

      var lastKey = getKey(lastChildren[i])
      if (lastKey != null) {
        lastKeyed[lastKey] = [lastElements[i], lastChildren[i]]
      }
    }

    var i = 0
    var k = 0

    while (k < children.length) {
      var lastKey = getKey(lastChildren[i])
      var nextKey = getKey(children[k])

      if (nextKeyed[lastKey]) {
        i++
        continue
      }

      if (nextKey != null && nextKey === getKey(lastChildren[i + 1])) {
        if (lastKey == null) {
          removeElement(element, lastElements[i], lastChildren[i])
        }
        i++
        continue
      }

      if (nextKey == null || lastNode.recycled) {
        if (lastKey == null) {
          patchElement(
            element,
            lastElements[i],
            lastChildren[i],
            children[k],
            lifecycle,
            isSvg
          )
          k++
        }
        i++
      } else {
        var keyed = lastKeyed[nextKey] || []

        if (lastKey === nextKey) {
          patchElement(
            element,
            keyed[0],
            keyed[1],
            children[k],
            lifecycle,
            isSvg
          )
          i++
        } else if (keyed[0]) {
          patchElement(
            element,
            element.insertBefore(keyed[0], lastElements[i]),
            keyed[1],
            children[k],
            lifecycle,
            isSvg
          )
        } else {
          patchElement(
            element,
            lastElements[i],
            null,
            children[k],
            lifecycle,
            isSvg
          )
        }

        nextKeyed[nextKey] = children[k]
        k++
      }
    }

    while (i < lastChildren.length) {
      if (getKey(lastChildren[i]) == null) {
        removeElement(element, lastElements[i], lastChildren[i])
      }
      i++
    }

    for (var j in lastKeyed) {
      if (!nextKeyed[j]) {
        removeElement(element, lastKeyed[j][0], lastKeyed[j][1])
      }
    }
  }
  return element
}

var createNode = function(name, props, children, recycled) {
  return {
    name: name,
    props: props,
    children: children,
    key: props.key,
    recycled: recycled
  }
}

var recycleChild = function(element) {
  return element.nodeType === 3 // Node.TEXT_NODE
    ? element.nodeValue
    : recycleElement(element)
}

var recycleElement = function(element) {
  return createNode(
    element.nodeName.toLowerCase(),
    {},
    map.call(element.childNodes, recycleChild),
    true
  )
}

export var recycle = function(container) {
  return recycleElement(container.children[0])
}

export var render = function(lastNode, nextNode, container) {
  var lifecycle = []
  var element = container.children[0]

  patchElement(container, element, lastNode, nextNode, lifecycle)

  while (lifecycle.length) lifecycle.pop()()

  return nextNode
}

export var h = function(name, props) {
  props = props || {}

  var rest = []
  var children = []
  var length = arguments.length

  while (length-- > 2) rest.push(arguments[length])

  if (props.children != null) {
    rest.push(props.children)
    delete props.children
  }

  while (rest.length) {
    var node = rest.pop()
    if (node && isArray(node)) {
      for (length = node.length; length--; ) {
        rest.push(node[length])
      }
    } else if (node != null && node !== true && node !== false) {
      children.push(node)
    }
  }

  return typeof name === "function"
    ? name(props, (props.children = children))
    : createNode(name, props, children, false)
}
