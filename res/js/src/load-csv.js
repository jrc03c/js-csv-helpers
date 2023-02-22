const { DataFrame, median, range } = require("@jrc03c/js-math-tools")

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

function leftPad(x, n) {
  x = x.toString()
  while (x.length < n) x = "0" + x
  return x
}

function parseCSVString(raw, options) {
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
  return out
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
