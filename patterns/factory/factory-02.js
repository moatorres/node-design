class TextFile {
  constructor(path) {
    this.path = path
  }
}

class Markdown extends TextFile {
  constructor(path) {
    if (!path.match(/\.md/)) {
      throw new Error(`${path} is not a Markdown file`)
    }
    super(path)
  }
}

class Txt extends TextFile {
  constructor(path) {
    if (!path.match(/\.txt/)) {
      throw new Error(`${path} is not a TXT file`)
    }
    super(path)
  }
}

function createTextFile(name) {
  if (name.match(/\.txt$/)) {
    return new Txt(name)
  } else if (name.match(/\.md$/)) {
    return new Markdown(name)
  } else {
    throw new Error('Unsupported format')
  }
}

const file1 = createTextFile('journal.txt')
const file2 = createTextFile('journal.md')

console.log(file1, file2)
