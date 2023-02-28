const { DataFrame, inferType, isEqual } = require("@jrc03c/js-math-tools")
const loadCSV = require("../src/load-csv")
const path = require("path")

test("tests that CSVs can be loaded from disk correctly", async () => {
  const dfTrue = new DataFrame(require("./test.json")).apply(
    col => inferType(col.values).values
  )

  const dfPred = await loadCSV(path.join(__dirname, "test.csv"), {
    inferTypes: true,
    header: true,
  })

  expect(isEqual(dfPred, dfTrue)).toBe(true)
})
