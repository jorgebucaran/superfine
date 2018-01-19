const gzip_size = require("gzip-size")

test("file size constraint", () => {
  const LIMIT = 1024

  return gzip_size.file("./dist/picodom.js").then(size => {
    if (size > LIMIT) {
      let overage = size - LIMIT
      console.warn(`File size: ${ size } (${ overage} over ${ LIMIT } limit)`)
    }
  })
})
