const path = require('path')

class Proxy {
  constructor(fs_subject) {
    this.fs = fs_subject
  }

  readFile(path, format = 'UTF-8', callback) {
    let markdownExtensionRegex = /.md$|.MD$/

    if (!path.match(markdownExtensionRegex)) {
      return callback(new Error(`Can only read Markdown files.`))
    }

    this.fs.readFile(path, format, (error, contents) => {
      if (error) {
        console.error(error)
        return callback(error)
      }

      return callback(null, contents)
    })
  }
}

const fs = new Proxy(require('fs'))

const file = path.join(__dirname, 'proxy-01-file.md')

let result = (error, contents) => {
  console.log('Reading...')
  if (error) console.error(error)
  else console.log(contents)
}

fs.readFile(file, 'UTF-8', result)
