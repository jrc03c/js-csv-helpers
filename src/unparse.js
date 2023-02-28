const { isUndefined } = require("@jrc03c/js-math-tools")
const papa = require("papaparse")

const defaultConfig = {
  quotes: false,
  quoteChar: '"',
  escapeChar: '"',
  delimiter: ",",
  header: true,
  skipEmptyLines: false,
  columns: null,

  // I'm modifying this from its default value of "\r\n":
  newline: "\n",
}

module.exports = function unparse(df, config) {
  config = config || structuredClone(defaultConfig)

  if (!config.columns) {
    config.columns = df.columns
  }

  df = df.copy()

  df.values = df.values.map(row => {
    return row.map(v => {
      if (isUndefined(v)) {
        return ""
      }

      if (typeof v === "number" && isNaN(v)) {
        return ""
      }

      if (typeof v === "object") {
        if (v instanceof Date) {
          return v.toJSON()
        } else {
          return JSON.stringify(v)
        }
      }

      return v
    })
  })

  return papa.unparse([df.columns].concat(df.values), config).trim()
}
