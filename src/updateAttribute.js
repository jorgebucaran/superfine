import { clone } from "./clone"
import { eventListener } from "./eventListener"

export function updateAttribute(element, name, value, oldValue, isSVG) {
  if (name === "key") {
  } else if (name === "style") {
    for (var i in clone(oldValue, value)) {
      var style = value == null || value[i] == null ? "" : value[i]
      if (i[0] === "-") {
        element[name].setProperty(i, style)
      } else {
        element[name][i] = style
      }
    }
  } else {
    if (name[0] === "o" && name[1] === "n") {
      if (!element.events) {
        element.events = {}
      }
      element.events[(name = name.slice(2))] = value
      if (value) {
        if (!oldValue) {
          element.addEventListener(name, eventListener)
        }
      } else {
        element.removeEventListener(name, eventListener)
      }
    } else if (name in element && name !== "list" && !isSVG) {
      element[name] = value == null ? "" : value
    } else if (value != null && value !== false) {
      element.setAttribute(name, value)
    }

    if (value == null || value === false) {
      element.removeAttribute(name)
    }
  }
}
