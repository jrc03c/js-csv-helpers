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
  const { data } = papa.parse(
    raw
      .split("\n")
      .map(line => line.trim())
      .join("\n")
      .trim()
  )

  let values, columns, index

  if (!options.hasHeaderRow && !options.hasIndexColumn) {
    values = data
    const medianRowLength = median(values.map(row => row.length))
    values.forEach(row => (row.length = medianRowLength))

    columns = range(0, medianRowLength).map(
      i => `col${leftPad(i, medianRowLength.toString().length)}`
    )

    index = range(0, values.length).map(
      i => `row${leftPad(i, values.length.toString().length)}`
    )
  }

  if (options.hasHeaderRow && !options.hasIndexColumn) {
    values = data.slice(1)
    columns = data[0]

    index = range(0, values.length).map(
      i => `row${leftPad(i, values.length.toString().length)}`
    )
  }

  if (!options.hasHeaderRow && options.hasIndexColumn) {
    values = data
    const medianRowLength = median(values.map(row => row.length))
    values.forEach(row => (row.length = medianRowLength))

    index = values.map(row => row.splice(0, 1)[0])

    columns = range(0, medianRowLength).map(
      i => `col${leftPad(i, medianRowLength.toString().length)}`
    )
  }

  if (options.hasHeaderRow && options.hasIndexColumn) {
    values = data
    columns = values[0].slice(1)
    index = values.slice(1).map(row => row[0])
    values = values.slice(1).map(row => row.slice(1))
  }

  const out = new DataFrame(values)
  out.columns = columns
  out.index = index
  return out
}

module.exports = async function loadCSV(path, options) {
  options = options || {
    hasHeaderRow: true,
    hasIndexColumn: false,
  }

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
