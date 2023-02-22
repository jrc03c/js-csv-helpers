const loadCSV = require("./res/js/src/load-csv")

loadCSV("temp.csv").then(data => {
  data.print()
})
