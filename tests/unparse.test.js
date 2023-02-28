const { DataFrame } = require("@jrc03c/js-math-tools")
const fs = require("fs")
const path = require("path")
const unparse = require("../src/unparse")

test("tests that the test DataFrame can be converted to a CSV string correctly", () => {
  const stringTrue = fs
    .readFileSync(path.join(__dirname, "test.csv"), "utf8")
    .trim()

  const stringPred = unparse(new DataFrame(require("./test.json")))
  expect(stringPred).toBe(stringTrue)
})
