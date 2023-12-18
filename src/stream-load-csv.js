const { isBrowser, range } = require("@jrc03c/js-math-tools")

const fsx = (() => {
  try {
    return require("@jrc03c/fs-extras")
  } catch (e) {
    // ...
  }
})()

const parse = require("./parse")

async function* streamLoadCSVFromDisk(path, config) {
  const rowsPerChunk = config.rowsPerChunk || 100
  const stream = fsx.createFileStreamReader(path)
  let columns
  let rows = []
  let i = 0

  for await (const line of stream.read()) {
    if (!columns) {
      columns = line
    }

    rows.push(line)

    if (rows.length - 1 >= rowsPerChunk) {
      const raw = rows.join("\n")
      const df = parse(raw, config)

      if (!config.index) {
        df.index = range(i, i + rowsPerChunk).map(v => "row" + v.toString())
      }

      yield df
      rows = [columns]
      i += rowsPerChunk
    }
  }

  if (rows.length > 1) {
    const raw = rows.join("\n")
    const df = parse(raw, config)

    if (!config.index) {
      df.index = range(i, i + rows.length - 1).map(v => "row" + v.toString())
    }

    yield df
  }
}

function streamLoadCSV(path, config) {
  if (isBrowser()) {
    // ...
  } else {
    return streamLoadCSVFromDisk(path, config)
  }
}

module.exports = streamLoadCSV
