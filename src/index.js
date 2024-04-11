const JSCSVHelpers = {
  loadCSV: require("./load-csv"),
  parse: require("./parse"),
  saveCSV: require("./save-csv"),
  streamLoadCSV: require("./stream-load-csv"),
  unparse: require("./unparse"),

  dump(){
    Object.keys(JSCSVHelpers).forEach(key => {
      globalThis[key] = JSCSVHelpers[key]
    })
  },
}

if (typeof window !== "undefined") {
  window.JSCSVHelpers = JSCSVHelpers
}

if (typeof module !== "undefined") {
  module.exports = JSCSVHelpers
}
