export function h(tag, data, ...stack) {
  var node;
  var stack = flatten(stack);

  var children = stack.reduce((p,n)=>{
    if(n != null && n !== true && n !== false) {
          if(typeof n === 'number') n = n + '';
          var endIndex = p.length - 1;
          if(typeof p[endIndex] === 'string' && typeof n === 'string') {
              p[endIndex] = p[endIndex]+n;
          } else {
              p.push(n);
          }
      }
      return p;
  },[])

  return typeof tag === "string"
    ? {
        tag: tag,
        data: data || {},
        children: children
      }
    : tag(data, children)
}

function flatten(arr) {
  return arr.reduce((flat, toFlatten) => {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}