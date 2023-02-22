const loadCSV = require("./load-csv")
const saveCSV = require("./save-csv")

if (typeof window !== "undefined") {
  window.loadCSV = loadCSV
  window.saveCSV = saveCSV
}

if (typeof module !== "undefined") {
  module.exports = {
    loadCSV,
    saveCSV,
  }
}
