declare namespace jest {
  interface Matchers<R> {
    toMatchDOM(value: any): CustomMatcherResult
  }
}
