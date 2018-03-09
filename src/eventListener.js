export function eventListener(event) {
  return event.currentTarget.events[event.type](event)
}
