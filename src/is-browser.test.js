const isBrowser = require("./is-browser")

test("tests that `isBrowser` correctly returns `false` in Node environments", () => {
  expect(isBrowser()).toBe(false)
})
