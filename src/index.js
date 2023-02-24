const helpers = {
  isBrowser: require("./is-browser"),
  loadCSV: require("./load-csv"),
  parse: require("./parse"),
  saveCSV: require("./save-csv"),
  unparse: require("./unparse"),
}

if (typeof window !== "undefined") {
  Object.keys(helpers).forEach(key => {
    window[key] = helpers[key]
  })
}

if (typeof module !== "undefined") {
  module.exports = helpers
}
