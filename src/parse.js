const { DataFrame, inferType, median, range } = require("@jrc03c/js-math-tools")
const papa = require("papaparse")

function leftPad(x, n) {
  x = x.toString()
  while (x.length < n) x = "0" + x
  return x
}

module.exports = function parse(raw, config) {
  config = config || {
    delimiter: "",
    newline: "",
    quoteChar: '"',
    escapeChar: '"',
    transformHeader: undefined,
    dynamicTyping: false,
    preview: 0,
    encoding: "",
    worker: false,
    comments: false,
    step: undefined,
    complete: undefined,
    error: undefined,
    download: false,
    downloadRequestHeaders: undefined,
    downloadRequestBody: undefined,
    skipEmptyLines: false,
    chunk: undefined,
    chunkSize: undefined,
    fastMode: undefined,
    beforeFirstChunk: undefined,
    withCredentials: undefined,
    transform: undefined,
    delimitersToGuess: [",", "\t", "|", ";", papa.RECORD_SEP, papa.UNIT_SEP],

    // I'm also adding my own options to infer types using my `inferTypes`
    // function in @jrc03c/js-math-tools. Papa offers a "dynamicTyping" option,
    // but I think maybe mine is a little more extensive. I'm willing to be
    // wrong about that, though.
    inferTypes: false,

    // I'm changing this from its default value of `false`:
    header: true,
  }

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
