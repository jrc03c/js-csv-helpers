const papa = require("papaparse")

const defaultConfig = {
  quotes: false,
  quoteChar: '"',
  escapeChar: '"',
  delimiter: ",",
  header: true,
  newline: "\r\n",
  skipEmptyLines: false,
  columns: null,
}

module.exports = function unparse(df, config) {
  config = config || structuredClone(defaultConfig)

  if (!config.columns) {
    config.columns = df.columns
  }

  papa.unparse([df.columns].concat(df.values), config)
}
