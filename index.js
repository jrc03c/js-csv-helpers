const { print } = require("@jrc03c/js-math-tools")
const loadCSV = require("./res/js/src/load-csv")

async function run() {
  const temp1 = await loadCSV("temp1.csv", { header: false })
  print(temp1)

  const temp2 = await loadCSV("temp2.csv", { header: true })
  print(temp2)
}

run()
