var globalInvokeLaterStack = []

export default function(oldNode, node, element, parent, cb) {
  element = patch(parent || document.body, element, oldNode, node)
  while ((cb = globalInvokeLaterStack.pop())) cb()
  return element
}

function patch(parent, element, oldNode, node, isSVG, nextSibling) {
  if (oldNode == null) {
    element = parent.insertBefore(createElement(node, isSVG), element)
  } else if (node.tag != null && node.tag === oldNode.tag) {
    updateElement(element, oldNode.props, node.props)

    isSVG = isSVG || node.tag === "svg"

    var len = node.children.length
    var oldLen = oldNode.children.length
    var oldKeyed = {}
    var oldElements = []
    var keyed = {}

    for (var i = 0; i < oldLen; i++) {
      var oldElement = (oldElements[i] = element.childNodes[i])
      var oldChild = oldNode.children[i]
      var oldKey = getKey(oldChild)

      if (null != oldKey) {
        oldKeyed[oldKey] = [oldElement, oldChild]
      }
    }

    var i = 0
    var j = 0

    while (j < len) {
      var oldElement = oldElements[i]
      var oldChild = oldNode.children[i]
      var newChild = node.children[j]

      var oldKey = getKey(oldChild)
      if (keyed[oldKey]) {
        i++
        continue
      }

      var newKey = getKey(newChild)

      var keyedNode = oldKeyed[newKey] || []

      if (null == newKey) {
        if (null == oldKey) {
          patch(element, oldElement, oldChild, newChild, isSVG)
          j++
        }
        i++
      } else {
        if (oldKey === newKey) {
          patch(element, keyedNode[0], keyedNode[1], newChild, isSVG)
          i++
        } else if (keyedNode[0]) {
          element.insertBefore(keyedNode[0], oldElement)
          patch(element, keyedNode[0], keyedNode[1], newChild, isSVG)
        } else {
          patch(element, oldElement, null, newChild, isSVG)
        }

        j++
        keyed[newKey] = newChild
      }
    }

    while (i < oldLen) {
      var oldChild = oldNode.children[i]
      var oldKey = getKey(oldChild)
      if (null == oldKey) {
        removeElement(element, oldElements[i], oldChild.props)
      }
      i++
    }

    for (var i in oldKeyed) {
      var keyedNode = oldKeyed[i]
      var reusableNode = keyedNode[1]
      if (!keyed[reusableNode.props.key]) {
        removeElement(element, keyedNode[0], reusableNode.props)
      }
    }
  } else if (element && node !== element.nodeValue) {
    element = parent.insertBefore(
      createElement(node, isSVG),
      (nextSibling = element)
    )
    removeElement(parent, nextSibling, oldNode.props)
  }

  return element
}

function getKey(node) {
  if (node && (node = node.props)) {
    return node.key
  }
}

function merge(a, b) {
  var obj = {}

  for (var i in a) {
    obj[i] = a[i]
  }

  for (var i in b) {
    obj[i] = b[i]
  }

  return obj
}

function createElement(node, isSVG) {
  if (typeof node === "string") {
    var element = document.createTextNode(node)
  } else {
    var element = (isSVG = isSVG || node.tag === "svg")
      ? document.createElementNS("http://www.w3.org/2000/svg", node.tag)
      : document.createElement(node.tag)

    if (node.props && node.props.oncreate) {
      globalInvokeLaterStack.push(function() {
        node.props.oncreate(element)
      })
    }

    for (var i in node.props) {
      setProp(element, i, node.props[i])
    }

    for (var i = 0; i < node.children.length; ) {
      element.appendChild(createElement(node.children[i++], isSVG))
    }
  }

  return element
}

function updateElement(element, oldProps, props) {
  for (var i in merge(oldProps, props)) {
    var value = props[i]
    var oldValue = i === "value" || i === "checked" ? element[i] : oldProps[i]

    if (value !== oldValue) {
      setProp(element, i, value, oldValue)
    }
  }

  if (props && props.onupdate) {
    globalInvokeLaterStack.push(function() {
      props.onupdate(element, oldProps)
    })
  }
}

function removeElement(parent, element, props) {
  if (props && props.onremove) {
    props.onremove(element)
  } else {
    parent.removeChild(element)
  }
}

function setProp(element, name, value, oldValue) {
  if (name === "key") {
  } else if (name === "style") {
    for (var i in merge(oldValue, (value = value || {}))) {
      element.style[i] = value[i] || ""
    }
  } else {
    try {
      element[name] = value
    } catch (_) {}

    if (typeof value !== "function") {
      if (value) {
        element.setAttribute(name, value)
      } else {
        element.removeAttribute(name)
      }
    }
  }
}
