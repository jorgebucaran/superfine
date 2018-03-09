export function clone(target, source) {
  var obj = {}

  for (var i in target) obj[i] = target[i]
  for (var i in source) obj[i] = source[i]

  return obj
}
