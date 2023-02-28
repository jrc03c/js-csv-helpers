const { DataFrame, inferType, median, range } = require("@jrc03c/js-math-tools")
const papa = require("papaparse")

function leftPad(x, n) {
  x = x.toString()
  while (x.length < n) x = "0" + x
  return x
}

module.exports = function parse(raw, config) {
  const defaults = {
    beforeFirstChunk: undefined,
    chunk: undefined,
    chunkSize: undefined,
    comments: false,
    complete: undefined,
    delimiter: "",
    delimitersToGuess: [",", "\t", "|", ";", papa.RECORD_SEP, papa.UNIT_SEP],
    download: false,
    downloadRequestBody: undefined,
    downloadRequestHeaders: undefined,
    dynamicTyping: false,
    encoding: "",
    error: undefined,
    escapeChar: '"',
    fastMode: undefined,
    newline: "",
    preview: 0,
    quoteChar: '"',
    skipEmptyLines: false,
    step: undefined,
    transform: undefined,
    transformHeader: undefined,
    withCredentials: undefined,
    worker: false,

    // This is the only value that's been changed from the Papa defaults
    // because, for my purposes, I anticipate that most datasets will include a
    // header row.
    header: true,

    // I'm also adding my own options to infer types using my `inferType`
    // function in @jrc03c/js-math-tools. Papa offers a "dynamicTyping" option,
    // but I think maybe mine is a little more extensive (i.e., I think it
    // infers more data types, but may not necessarily be more robust). I'm
    // willing to be wrong about that, though. By default, this value is set to
    // `false`, which means that the returned `DataFrame` will only contain
    // strings.
    inferTypes: false,
  }

  config = config ? { ...defaults, ...config } : defaults

  const results = papa.parse(raw.trim(), config)
  let data, columns

  if (config.header) {
    data = {}

    columns = results.meta.fields

    columns.forEach(col => {
      data[col] = results.data.map(row => row[col])
    })
  } else {
    const medianRowLength = median(results.data.map(row => row.length))

    columns = range(0, medianRowLength).map(
      i => `col${leftPad(i, medianRowLength.toString().length)}`
    )

    data = results.data
  }

  const out = new DataFrame(data)
  out.columns = columns

  return config && config.inferTypes
    ? out.apply(col => inferType(col).values)
    : out
}
