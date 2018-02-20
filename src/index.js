var map = [].map
var isRecycling
var lifecycleStack = []

export function h(name, attributes) {
  var node
  var rest = []
  var children = []
  var length = arguments.length

  while (length-- > 2) rest.push(arguments[length])

  while (rest.length) {
    if ((node = rest.pop()) && node.pop /* Array? */) {
      for (length = node.length; length--; ) {
        rest.push(node[length])
      }
    } else if (node != null && node !== true && node !== false) {
      children.push(node)
    }
  }

  return typeof name === "function"
    ? name(attributes || {}, children)
    : {
        nodeName: name,
        attributes: attributes || {},
        children: children,
        key: attributes && attributes.key
      }
}

export function patch(node, element) {
  element = patchElement(
    element && element.parentNode,
    element,
    (isRecycling = element && element.node == null)
      ? recycleElement(element)
      : element && element.node,
    node
  )
  element.node = node

  while (lifecycleStack.length) lifecycleStack.pop()()

  return element
}

function recycleElement(element) {
  return {
    // recycled: true,
    nodeName: element.nodeName.toLowerCase(),
    attributes: {},
    children: map.call(element.childNodes, function(element) {
      return element.nodeType === 3 // Node.TEXT_NODE
        ? element.nodeValue
        : recycleElement(element)
    })
  }
}

function clone(target, source) {
  var obj = {}

  for (var i in target) obj[i] = target[i]
  for (var i in source) obj[i] = source[i]

  return obj
}

function getKey(node) {
  return node ? node.key : null
}

function updateAttribute(element, name, value, isSVG, oldValue) {
  if (name === "key") {
  } else if (name === "style") {
    for (var i in clone(oldValue, value)) {
      element[name][i] = value == null || value[i] == null ? "" : value[i]
    }
  } else {
    if (typeof value === "function" || (name in element && !isSVG)) {
      element[name] = value == null ? "" : value
    } else if (value != null && value !== false) {
      element.setAttribute(name, value)
    }

    if (value == null || value === false) {
      element.removeAttribute(name)
    }
  }
}

function createElement(node, isSVG) {
  var element =
    typeof node === "string" || typeof node === "number"
      ? document.createTextNode(node)
      : (isSVG = isSVG || node.nodeName === "svg")
        ? document.createElementNS("http://www.w3.org/2000/svg", node.nodeName)
        : document.createElement(node.nodeName)

  var attributes = node.attributes
  if (attributes) {
    if (attributes.oncreate) {
      lifecycleStack.push(function() {
        attributes.oncreate(element)
      })
    }

    for (var i = 0; i < node.children.length; i++) {
      element.appendChild(createElement(node.children[i], isSVG))
    }

    for (var name in attributes) {
      updateAttribute(element, name, attributes[name], isSVG)
    }
  }

  return element
}

function updateElement(element, /*oldNode,*/ oldAttributes, attributes, isSVG) {
  for (var name in clone(oldAttributes, attributes)) {
    if (
      attributes[name] !==
      (name === "value" || name === "checked"
        ? element[name]
        : oldAttributes[name])
    ) {
      updateAttribute(
        element,
        name,
        attributes[name],
        isSVG,
        oldAttributes[name]
      )
    }
  }

  var cb = isRecycling ? attributes.oncreate : attributes.onupdate
  // var cb = oldNode.recycled ? attributes.oncreate : attributes.onupdate
  if (cb) {
    lifecycleStack.push(function() {
      cb(element, oldAttributes)
    })
  }
}

function removeChildren(element, node) {
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

function removeElement(parent, element, node) {
  function done() {
    parent.removeChild(removeChildren(element, node))
  }

  var cb = node.attributes && node.attributes.onremove
  if (cb) {
    cb(element, done)
  } else {
    done()
  }
}

function patchElement(parent, element, oldNode, node, isSVG) {
  if (node === oldNode) {
  } else if (oldNode == null || oldNode.nodeName !== node.nodeName) {
    var newElement = createElement(node, isSVG)
    if (parent) {
      parent.insertBefore(newElement, element)
      if (oldNode != null) {
        removeElement(parent, element, oldNode)
      }
    }
    element = newElement
  } else if (oldNode.nodeName == null) {
    element.nodeValue = node
  } else {
    updateElement(
      element,
      // oldNode,
      oldNode.attributes,
      node.attributes,
      (isSVG = isSVG || node.nodeName === "svg")
    )

    var oldElements = []
    var oldKeyed = {}
    var newKeyed = {}

    for (var i = 0; i < oldNode.children.length; i++) {
      oldElements[i] = element.childNodes[i]

      var oldChild = oldNode.children[i]
      var oldKey = getKey(oldChild)

      if (null != oldKey) {
        oldKeyed[oldKey] = [oldElements[i], oldChild]
      }
    }

    var i = 0
    var j = 0

    while (j < node.children.length) {
      var oldChild = oldNode.children[i]
      var newChild = node.children[j]

      var oldKey = getKey(oldChild)
      var newKey = getKey(newChild)

      if (newKeyed[oldKey]) {
        i++
        continue
      }

      if (newKey == null) {
        if (oldKey == null) {
          patchElement(element, oldElements[i], oldChild, newChild, isSVG)
          j++
        }
        i++
      } else {
        var recyledNode = oldKeyed[newKey] || []

        if (oldKey === newKey) {
          patchElement(element, recyledNode[0], recyledNode[1], newChild, isSVG)
          i++
        } else if (recyledNode[0]) {
          patchElement(
            element,
            element.insertBefore(recyledNode[0], oldElements[i]),
            recyledNode[1],
            newChild,
            isSVG
          )
        } else {
          patchElement(element, oldElements[i], null, newChild, isSVG)
        }

        j++
        newKeyed[newKey] = newChild
      }
    }

    while (i < oldNode.children.length) {
      var oldChild = oldNode.children[i]
      if (getKey(oldChild) == null) {
        removeElement(element, oldElements[i], oldChild)
      }
      i++
    }

    for (var i in oldKeyed) {
      if (!newKeyed[oldKeyed[i][1].key]) {
        removeElement(element, oldKeyed[i][0], oldKeyed[i][1])
      }
    }
  }
  return element
}
