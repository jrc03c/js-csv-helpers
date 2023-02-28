const { isUndefined } = require("@jrc03c/js-math-tools")
const papa = require("papaparse")

module.exports = function unparse(df, config) {
  const defaults = {
    columns: null,
    delimiter: ",",
    escapeChar: '"',
    header: true,
    quoteChar: '"',
    quotes: false,
    skipEmptyLines: false,

    // This is the only value that's been changed from Papa's defaults.
    newline: "\n",
  }

  config = config ? { ...defaults, ...config } : defaults

  if (!config.columns) {
    config.columns = df.columns
  }

  if (typeof config.header === "boolean" && !config.header) {
    config.columns = null
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
