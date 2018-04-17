import { clone } from "./clone"
import { updateAttribute } from "./updateAttribute"

export function updateElement(
  element,
  oldAttributes,
  attributes,
  lifecycle,
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

  if (attributes.onupdate) {
    lifecycle.push(function() {
      attributes.onupdate(element, oldAttributes)
    })
  }
}
