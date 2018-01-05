var callbacks = []

function set(element, value) {
  element.value = value
}

export var mods = {
  key: function () {},
  style: function (element, value, oldValue) {
    for (var i in copy(oldValue, (value = value || {}))) {
      element.style[i] = value[i] != null ? value[i] : ""
    }
  },
  value: set,
  checked: set
}

export function patch(parent, oldNode, newNode) {
  var element = patchElement(parent, parent.children[0], oldNode, newNode)

  for (var cb; (cb = callbacks.pop()); cb()) {}

  return element
}

function copy(target, source) {
  var obj = {}

  for (var i in target) obj[i] = target[i]
  for (var i in source) obj[i] = source[i]

  return obj
}

function getKey(node) {
  return node && node.props ? node.props.key : null
}

function setElementProps(element, props, oldProps) {
  for (var name in copy(oldProps, props)) {
    var value = props[name]
    var oldValue = oldProps[name]

    if (name in mods) {
      mods[name](element, value, oldValue)
    } else {
      if (value !== oldValue) {
        var empty = null == value || false === value
        
        if (name in element) {
          try {
            element[name] = null == value ? "" : value
          } catch (_) {}
        } else if (!empty && typeof value !== "function") {
          element.setAttribute(name, value === true ? "" : value)
        }
    
        if (empty) {
          element.removeAttribute(name)
        }
      }
    }
  }
}

function createElement(node, isSVG) {
  if (typeof node === "string") {
    var element = document.createTextNode(node)
  } else {
    var element = (isSVG = isSVG || "svg" === node.type)
      ? document.createElementNS("http://www.w3.org/2000/svg", node.type)
      : document.createElement(node.type)

    if (node.props.oncreate) {
      callbacks.push(function() {
        node.props.oncreate(element)
      })
    }

    for (var i = 0; i < node.children.length; i++) {
      element.appendChild(createElement(node.children[i], isSVG))
    }

    setElementProps(element, node.props, {})
  }
  return element
}

function removeChildren(element, node, props) {
  if ((props = node.props)) {
    for (var i = 0; i < node.children.length; i++) {
      removeChildren(element.childNodes[i], node.children[i])
    }

    if (props.ondestroy) {
      props.ondestroy(element)
    }
  }
  return element
}

function removeElement(parent, element, node) {
  function done() {
    parent.removeChild(removeChildren(element, node))
  }

  if (node.props && node.props.onremove) {
    node.props.onremove(element, done)
  } else {
    done()
  }
}

function patchElement(parent, element, oldNode, node, isSVG, nextSibling) {
  if (oldNode == null) {
    element = parent.insertBefore(createElement(node, isSVG), element)
  } else if (node.type != null && node.type === oldNode.type) {
    setElementProps(element, node.props, oldNode.props)
    
    if (node.props.onupdate) {
      callbacks.push(function() {
        node.props.onupdate(element, oldNode.props)
      })
    }
    
    isSVG = isSVG || node.type === "svg"

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
          patchElement(element, oldElement, oldChild, newChild, isSVG)
          j++
        }
        i++
      } else {
        if (oldKey === newKey) {
          patchElement(element, keyedNode[0], keyedNode[1], newChild, isSVG)
          i++
        } else if (keyedNode[0]) {
          element.insertBefore(keyedNode[0], oldElement)
          patchElement(element, keyedNode[0], keyedNode[1], newChild, isSVG)
        } else {
          patchElement(element, oldElement, null, newChild, isSVG)
        }

        j++
        keyed[newKey] = newChild
      }
    }

    while (i < oldLen) {
      var oldChild = oldNode.children[i]
      var oldKey = getKey(oldChild)
      if (null == oldKey) {
        removeElement(element, oldElements[i], oldChild)
      }
      i++
    }

    for (var i in oldKeyed) {
      var keyedNode = oldKeyed[i]
      var reusableNode = keyedNode[1]
      if (!keyed[reusableNode.props.key]) {
        removeElement(element, keyedNode[0], reusableNode)
      }
    }
  } else if (element && node !== element.nodeValue) {
    if (typeof node === "string" && typeof oldNode === "string") {
      element.nodeValue = node
    } else {
      element = parent.insertBefore(
        createElement(node, isSVG),
        (nextSibling = element)
      )
      removeElement(parent, nextSibling, oldNode)
    }
  }
  return element
}
