const loadCSV = require("./load-csv")

loadCSV("temp.csv").then(data => {
  data.print()
})
