var clone = function(target, source) {
  var out = []

  for (var i in target) out[i] = target[i]
  for (var i in source) out[i] = source[i]

  return out
}

var eventProxy = function(event) {
  return event.currentTarget.events[event.type](event)
}

var updateAttribute = function(element, name, value, oldValue, isSvg) {
  if (name === "key") {
  } else {
    if (name[0] === "o" && name[1] === "n") {
      if (!element.events) {
        element.events = {}
      }
      element.events[(name = name.slice(2))] = value

      if (value) {
        if (!oldValue) {
          element.addEventListener(name, eventProxy)
        }
      } else {
        element.removeEventListener(name, eventProxy)
      }
    } else if (name in element && name !== "list" && !isSvg) {
      element[name] = value == null ? "" : value
    } else if (value != null && value !== false) {
      element.setAttribute(name, value)
    }

    if (value == null || value === false) {
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

  var attributes = node.attributes
  if (attributes) {
    if (attributes.oncreate) {
      lifecycle.push(function() {
        attributes.oncreate(element)
      })
    }

    for (var i = 0; i < node.children.length; i++) {
      element.appendChild(createElement(node.children[i], lifecycle, isSvg))
    }

    for (var name in attributes) {
      updateAttribute(element, name, attributes[name], null, isSvg)
    }
  }

  return element
}

var updateElement = function(element, oldAttrs, attributes, lifecycle, isSvg) {
  for (var name in clone(oldAttrs, attributes)) {
    if (
      attributes[name] !==
      (name === "value" || name === "checked" ? element[name] : oldAttrs[name])
    ) {
      updateAttribute(element, name, attributes[name], oldAttrs[name], isSvg)
    }
  }

  if (attributes.onupdate) {
    lifecycle.push(function() {
      attributes.onupdate(element, oldAttrs)
    })
  }
}

var removeChildren = function(element, node) {
  var attributes = node.attributes
  if (attributes) {
    for (var i = 0; i < node.children.length; i++) {
      removeChildren(element.childNodes[i], node.children[i])
    }

    if (attributes.ondestroy) {
      attributes.ondestroy(element)
    }
  }
  return element
}

var removeElement = function(parent, element, node) {
  var done = function() {
    parent.removeChild(removeChildren(element, node))
  }
  var cb = node.attributes && node.attributes.onremove

  if (cb) {
    cb(element, done)
  } else {
    done()
  }
}

var getKey = function(node) {
  return node ? node.key : null
}

var patchElement = function(parent, element, oldNode, node, lifecycle, isSvg) {
  if (node === oldNode) {
  } else if (oldNode == null || oldNode.name !== node.name) {
    var newElement = parent.insertBefore(
      createElement(node, lifecycle, isSvg),
      element
    )

    if (oldNode != null) {
      removeElement(parent, element, oldNode)
    }

    element = newElement
  } else if (oldNode.name == null) {
    element.nodeValue = node
  } else {
    updateElement(
      element,
      oldNode.attributes,
      node.attributes,
      lifecycle,
      (isSvg = isSvg || node.name === "svg")
    )

    var oldKeyed = {}
    var newKeyed = {}
    var oldElements = []
    var oldChildren = oldNode.children
    var children = node.children

    for (var i = 0; i < oldChildren.length; i++) {
      oldElements[i] = element.childNodes[i]

      var oldKey = getKey(oldChildren[i])
      if (oldKey != null) {
        oldKeyed[oldKey] = [oldElements[i], oldChildren[i]]
      }
    }

    var i = 0
    var k = 0

    while (k < children.length) {
      var oldKey = getKey(oldChildren[i])
      var newKey = getKey(children[k])

      if (newKeyed[oldKey]) {
        i++
        continue
      }

      if (newKey != null && newKey === getKey(oldChildren[i + 1])) {
        if (oldKey == null) {
          removeElement(element, oldElements[i], oldChildren[i])
        }
        i++
        continue
      }

      if (newKey == null) {
        if (oldKey == null) {
          patchElement(
            element,
            oldElements[i],
            oldChildren[i],
            children[k],
            lifecycle,
            isSvg
          )
          k++
        }
        i++
      } else {
        var keyed = oldKeyed[newKey] || []

        if (oldKey === newKey) {
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
            element.insertBefore(keyed[0], oldElements[i]),
            keyed[1],
            children[k],
            lifecycle,
            isSvg
          )
        } else {
          patchElement(
            element,
            oldElements[i],
            null,
            children[k],
            lifecycle,
            isSvg
          )
        }

        newKeyed[newKey] = children[k]
        k++
      }
    }

    while (i < oldChildren.length) {
      if (getKey(oldChildren[i]) == null) {
        removeElement(element, oldElements[i], oldChildren[i])
      }
      i++
    }

    for (var i in oldKeyed) {
      if (!newKeyed[i]) {
        removeElement(element, oldKeyed[i][0], oldKeyed[i][1])
      }
    }
  }
  return element
}

export var render = function(node, container) {
  var lifecycle = []
  var element = container.children[0]

  patchElement(
    container,
    element,
    element && element.node,
    node,
    lifecycle
  ).node = node

  while (lifecycle.length) lifecycle.pop()()
}

export var h = function(name, attributes) {
  var node
  var rest = []
  var children = []
  var length = arguments.length

  while (length-- > 2) rest.push(arguments[length])

  while (rest.length) {
    node = rest.pop()
    if (node && node.pop) {
      for (length = node.length; length--; ) {
        rest.push(node[length])
      }
    } else if (node != null && node !== true && node !== false) {
      children.push(node)
    }
  }

  return {
    name: name,
    attributes: attributes || {},
    children: children,
    key: attributes && attributes.key
  }
}
