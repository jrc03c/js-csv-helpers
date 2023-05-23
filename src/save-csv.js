const fs = (() => {
  try {
    return require("fs/promises")
  } catch (e) {
    return null
  }
})()

const { isBrowser } = require("@jrc03c/js-math-tools")
const unparse = require("./unparse")

function download(filename, text) {
  let a = document.createElement("a")
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(text)
  a.download = filename
  a.dispatchEvent(new MouseEvent("click"))
}

module.exports = async function saveCSV(path, df, config) {
  const raw = unparse(df, config)

  if (isBrowser()) {
    download(path, raw)
  } else {
    const dir = path.split("/").slice(0, -1).join("/")

    try {
      await fs.mkdir(dir, { recursive: true })
    } catch (e) {}

    await fs.writeFile(path, raw, { encoding: "utf8" })
  }
}
