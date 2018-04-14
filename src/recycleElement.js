var map = [].map

export function recycleElement(element) {
  return {
    nodeName: element.nodeName.toLowerCase(),
    attributes: {},
    children: map.call(element.childNodes, function(element) {
      return element.nodeType === 3 // Node.TEXT_NODE
        ? element.nodeValue
        : recycleElement(element)
    })
  }
}
