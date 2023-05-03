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

    // I'm adding this option in case a dataset has (or should have) an index
    // column (i.e., a first column filled with row names).
    index: false,
  }

  df = df.copy()
  config = config ? { ...defaults, ...config } : defaults

  if (config.header) {
    config.columns = config.columns || df.columns

    if (config.index) {
      df = df.assign("(index)", df.index)
      config.columns.splice(0, 0, "(index)")
      df = df.get(config.columns)
    }
  } else {
    config.columns = null

    if (config.index) {
      const columns = ["(index)"].concat(df.columns)
      df = df.assign("(index)", df.index)
      df = df.get(columns)
    }
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

  const values = config.header ? [df.columns].concat(df.values) : df.values
  return papa.unparse(values, config).trim()
}
