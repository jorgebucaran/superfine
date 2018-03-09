import { clone } from "./clone"
import { updateAttribute } from "./updateAttribute"

export function updateElement(
  element,
  oldAttributes,
  attributes,
  lifecycle,
  isRecycling,
  isSVG
) {
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
        oldAttributes[name],
        isSVG
      )
    }
  }

  var cb = isRecycling ? attributes.oncreate : attributes.onupdate
  if (cb) {
    lifecycle.push(function() {
      cb(element, oldAttributes)
    })
  }
}
