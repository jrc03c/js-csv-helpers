const { DataFrame, inferType, median, range } = require("@jrc03c/js-math-tools")

const fs = (() => {
  try {
    return require("fs")
  } catch (e) {
    return null
  }
})()

const papa = require("papaparse")

const isBrowser = new Function(
  "try { return this === window } catch(e) { return false }"
)

function getPapaDefaultOptions() {
  return {
    delimiter: "", // auto-detect
    newline: "", // auto-detect
    quoteChar: '"',
    escapeChar: '"',
    header: false,
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
    // but I think maybe mine is a little more extensive.
    inferTypes: false,
  }
}

function leftPad(x, n) {
  x = x.toString()
  while (x.length < n) x = "0" + x
  return x
}

function parseCSVString(raw, options) {
  options = options || getPapaDefaultOptions()

  const results = papa.parse(raw.trim(), options)
  let data, columns

  if (options.header) {
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

  return options && options.inferTypes
    ? out.apply(col => inferType(col).values)
    : out
}

module.exports = async function loadCSV(path, options) {
  const raw = await (async () => {
    if (isBrowser()) {
      const response = await fetch(path)
      return await response.text()
    } else {
      return fs.readFileSync(path, "utf8")
    }
  })()

  return parseCSVString(raw, options)
}
