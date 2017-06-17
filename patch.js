export function patch(parent, element, oldNode, node) {
  if (oldNode == null) {
    element = parent.insertBefore(createElementFrom(node), element)
  } else if (node.tag && node.tag === oldNode.tag) {
    updateElementData(element, oldNode.data, node.data)

    var len = node.children.length
    var oldLen = oldNode.children.length
    var reusableChildren = {}
    var oldElements = []
    var newKeys = {}

    for (var i = 0; i < oldLen; i++) {
      var oldElement = element.childNodes[i]
      oldElements[i] = oldElement

      var oldChild = oldNode.children[i]
      var oldKey = getKeyFrom(oldChild)

      if (null != oldKey) {
        reusableChildren[oldKey] = [oldElement, oldChild]
      }
    }

    var i = 0
    var j = 0

    while (j < len) {
      var oldElement = oldElements[i]
      var oldChild = oldNode.children[i]
      var newChild = node.children[j]

      var oldKey = getKeyFrom(oldChild)
      if (newKeys[oldKey]) {
        i++
        continue
      }

      var newKey = getKeyFrom(newChild)

      var reusableChild = reusableChildren[newKey] || []

      if (null == newKey) {
        if (null == oldKey) {
          patch(element, oldElement, oldChild, newChild)
          j++
        }
        i++
      } else {
        if (oldKey === newKey) {
          patch(element, reusableChild[0], reusableChild[1], newChild)
          i++
        } else if (reusableChild[0]) {
          element.insertBefore(reusableChild[0], oldElement)
          patch(element, reusableChild[0], reusableChild[1], newChild)
        } else {
          patch(element, oldElement, null, newChild)
        }

        j++
        newKeys[newKey] = newChild
      }
    }

    while (i < oldLen) {
      var oldChild = oldNode.children[i]
      var oldKey = getKeyFrom(oldChild)
      if (null == oldKey) {
        removeElement(element, oldElements[i], oldChild)
      }
      i++
    }

    for (var i in reusableChildren) {
      var reusableChild = reusableChildren[i]
      var reusableNode = reusableChild[1]
      if (!newKeys[reusableNode.data.key]) {
        removeElement(element, reusableChild[0], reusableNode)
      }
    }
  } else if (node !== oldNode) {
    var i = element
    parent.replaceChild((element = createElementFrom(node)), i)
  }

  return element
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

function createElementFrom(node, isSVG) {
  if (typeof node === "string") {
    var element = document.createTextNode(node)
  } else {
    var element = (isSVG = isSVG || node.tag === "svg")
      ? document.createElementNS("http://www.w3.org/2000/svg", node.tag)
      : document.createElement(node.tag)

    for (var i = 0; i < node.children.length; ) {
      element.appendChild(createElementFrom(node.children[i++], isSVG))
    }

    for (var i in node.data) {
      if (i === "oncreate") {
        node.data[i](element)
      } else {
        setElementData(element, i, node.data[i])
      }
    }
  }

  return element
}

function setElementData(element, name, value, oldValue) {
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

function updateElementData(element, oldData, data) {
  for (var name in merge(oldData, data)) {
    var value = data[name]
    var oldValue = name === "value" || name === "checked"
      ? element[name]
      : oldData[name]

    if (name === "onupdate" && value) {
      value(element)
    } else if (value !== oldValue) {
      setElementData(element, name, value, oldValue)
    }
  }
}

function getKeyFrom(node) {
  if (node && (node = node.data)) {
    return node.key
  }
}

function removeElement(parent, element, node) {
  ;((node.data && node.data.onremove) || removeChild)(element, removeChild)
  function removeChild() {
    parent.removeChild(element)
  }
}
