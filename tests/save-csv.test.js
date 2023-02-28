const { DataFrame } = require("@jrc03c/js-math-tools")
const { saveCSV } = require("..")
const fs = require("fs")
const path = require("path")

const fileTrue = path.join(__dirname, "test.csv")
const filePred = path.join(__dirname, "test-saved.csv")

test("tests that CSVs can be written correctly to disk", async () => {
  const stringTrue = fs.readFileSync(fileTrue, "utf8").trim()
  const df = new DataFrame(require("./test.json"))

  await saveCSV(filePred, df)

  const stringPred = fs.readFileSync(filePred, "utf8").trim()
  expect(stringPred).toBe(stringTrue)
})

afterAll(() => {
  fs.unlinkSync(filePred)
})
