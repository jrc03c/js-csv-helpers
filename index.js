const loadCSV = require("./res/js/src/load-csv")

async function run() {
  const temp1 = await loadCSV("temp1.csv", {
    hasHeaderRow: false,
    hasIndexColumn: false,
  })

  temp1.print()

  const temp2 = await loadCSV("temp2.csv", {
    hasHeaderRow: true,
    hasIndexColumn: false,
  })

  temp2.print()

  const temp3 = await loadCSV("temp3.csv", {
    hasHeaderRow: false,
    hasIndexColumn: true,
  })

  temp3.print()

  const temp4 = await loadCSV("temp4.csv", {
    hasHeaderRow: true,
    hasIndexColumn: true,
  })

  temp4.print()
}

run()
