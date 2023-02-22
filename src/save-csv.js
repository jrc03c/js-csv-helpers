const fs = (() => {
  try {
    return require("fs")
  } catch (e) {
    return null
  }
})()

const isBrowser = require("./is-browser")
const papa = require("papaparse")

function download(filename, text) {
  let a = document.createElement("a")
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(text)
  a.download = filename
  a.dispatchEvent(new MouseEvent("click"))
}

module.exports = async function saveCSV(path, df) {
  const out = papa.unparse([df.columns].concat(df.values), {
    columns: df.columns,
  })

  if (isBrowser()) {
    download(path, out)
  } else {
    const dir = path.split("/").slice(0, -1).join("/")

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(path, df)
  }
}
