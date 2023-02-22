const loadCSV = require("./load-csv")

async function run() {
  const temp1 = await loadCSV("temp1.csv")
  temp1.print()

  const temp2 = await loadCSV("temp2.csv", { header: true })
  temp2.print()
}

run()
