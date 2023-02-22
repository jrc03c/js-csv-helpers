# Intro

This is a little helper library to complement [@jrc03c/js-math-tools](https://github.com/jrc03c/js-math-tools) and [@jrc03c/js-data-science-helpers](https://github.com/jrc03c/js-data-science-helpers). All it does is load CSV files as `DataFrame` objects and save `DataFrame` objects as CSV files.

# Installation

```bash
npm install --save https://github.com/jrc03c/js-csv-helpers
```

# Usage

Node & bundlers:

```js
const { loadCSV, saveCSV } = require("js-csv-helpers")

// load
loadCSV("path/to/my-data.csv").then(df => {
  // save
  saveCSV("path/to/other-data.csv", df).then(() => {
    console.log("Done!")
  })
})
```

Browser:

```html
<script src="path/to/dist/js-csv-helpers"></script>
<script>
  // load
  loadCSV("path/to/my-data.csv").then(df => {
    // save
    saveCSV("other-data.csv", df).then(() => {
      console.log("Done!")
    })
  })
</script>
```

> **NOTE:** Usage in both environments is basically identical except for one thing: In the browser, `saveCSV` takes a _filename_ and a `DataFrame`; but in Node, `saveCSV` takes a _path_ and a `DataFrame`. That's because the browser can only download files without specifying _where_ to save them.

# API

## `loadCSV`

```
loadCSV(
  path: string,
  config: object || null,
  callback: function || null,
)
```

Given a `path`, this function returns a `Promise` that resolves to a `DataFrame`. It also accepts a optional callback function, if you prefer that style. See [the section below](#configuration) for more information about the optional `config` object.

## `saveCSV`

```
saveCSV(
  path: string,
  data: DataFrame,
  config: object || null,
  callback: function || null,
)
```

Given a `path` (either a URL or a filesystem path depending whether you're in a browser or Node environment, as described in the [Usage](#usage) section above) and a `DataFrame` (`data`), this function returns a `Promise` that resolves to a boolean where `true` means "the file was saved" and `false` means "the file was not saved". It also accepts an optional callback function, if you prefer that style. See [the section below](#configuration) for more information about the optional `config` object.

### Configuration

This library is basically a thin wrapper around [`papaparse`](https://www.papaparse.com/). Any configuration object you could pass into this library's functions will be passed directly into `papaparse`'s functions. See [their configuration documentation](https://www.papaparse.com/docs#config) for more info. As of today, the default configuration values are:

```js
{
  delimiter: "", // auto-detect
  newline: "",   // auto-detect
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
  delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
}
```

This library only adds one extra option to the configuration object in the `loadCSV` function: setting `"inferTypes"` to `true` or `false` enables or disables dynamic type inference. By default, `papaparse` doesn't try to figure out what kinds of data your CSV file contains; it merely returns a matrix of strings. They provide an option called `"dynamicTyping"` which I think asks `papaparse` to try to infer data types, but I don't think it's quite as extensive as the one I've written here.

Here's an example of how to use it:

```js
// use this library's type inference
loadCSV("path/to/my-data.csv", { inferTypes: true })

// use papaparse's type inference
loadCSV("path/to/my-data.csv", { dynamicTyping: true })
```
