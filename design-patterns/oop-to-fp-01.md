# Design Patterns

## OOP to Functional Programming

We’ll construct a public interface for both the **OOP** and **FP** example and ignore side effects in both for now (i.e. HTTP calls) making the assumption the unit tests will use the public interface to call the internal private methods. Both will load the same text file and parse it.

Both examples will be parsing the following JSON string:

```json
[
  {
    "firstName": "jesse",
    "lastName": "warden",
    "type": "Human"
  },
  {
    "firstName": "albus",
    "lastName": "dumbledog",
    "type": "Dog"
  },
  {
    "firstName": "brandy",
    "lastName": "fortune",
    "type": "Human"
  }
]
```

### Object Oriented Programming Example

We’ll need 3 things: a class to read the file with default encoding, a class to parse it, and a Singleton to bring them all together into a public interface.

#### `readfile.js`

First, the reader will just abstract away the reading with optional encoding into a `Promise:`

```js
import fs from 'fs'
import { EventEmitter } from 'events'

export const DEFAULT_ENCODING = 'utf8'

export default class ReadFile {
  readFile(filename, encoding = DEFAULT_ENCODING) {
    return new Promise(function (success, failure) {
      fs.readFile(filename, encoding, function (error, data) {
        if (error) {
          failure(error)
          return
        }
        success(data)
      })
    })
  }
}
```

#### parser.js

Next, we need a parser class to take the raw `String` data from the read file and parse it into formatted names in an `Array`:

```js
import { startCase } from 'lodash'

class ParseFile {
  #fileData
  #names

  get names() {
    return this.#names
  }

  constructor(data) {
    this.#fileData = data
  }

  parseFileContents() {
    let people = JSON.parse(this.#fileData)
    this.#names = []
    let p
    for (p = 0; p < people.length; p++) {
      const person = people[p]
      if (person.type === 'Human') {
        const name = this._personToName(person)
        names.push(name)
      }
    }
  }

  _personToName(person) {
    const name = `${person.firstName} ${person.lastName}`
    return startCase(name)
  }
}

export default ParseFile
```

#### index.js

Finally, we need a `Singleton` to bring them all together into a single, static method:

```js
import ParseFile from './parsefile'
import ReadFile, { DEFAULT_ENCODING } from './readfile'

class PeopleParser {
  static async getPeople() {
    try {
      const reader = new ReadFile()
      const fileData = await reader.readFile('people.txt', DEFAULT_ENCODING)
      const parser = new ParseFile(data)
      parser.parseFileContents()
      return parser.names
    } catch (error) {
      console.error(error)
    }
  }
}

export default PeopleParser
```

#### Using `PeopleParser`

```js
import PeopleParser from './peopleparser'

PeopleParser.getPeople().then(console.log).catch(console.error)
```

### Functional Programming Example

For our _Functional Programming_ example we'll need a list of pure functions:

#### `getDefaultEncoding`

```js
export const getDefaultEncoding = () => 'utf8'
```

#### `readFile`

```js
const readFile = fsModule => encoding => filename =>
    new Promise((success, failure) =>
        fsModule.readFile(filename, encoding, (error, data) =>
            error
            ? failure(error)
            : success(data)
        )
```

#### `parseFile`

```js
const parseFile = (data) =>
  new Promise((success, failure) => {
    try {
      const result = JSON.parse(data)
      return result
    } catch (error) {
      return error
    }
  })
```

#### `filterHumans`

```js
const filterHumans = (peeps) =>
  peeps.filter((person) => person.type === 'Human')
```

#### `formatNames`

```js
const formatNames = (humans) =>
  humans.map((human) => `${human.firstName} ${human.lastName}`)
```

#### `startCaseNames`

```js
const startCaseNames = (names) => names.map(startCase)
```

#### `getPeople`

```js
export const getPeople = (fsModule) => (encoding) => (filename) =>
  readFile(fsModule)(encoding)(filename)
    .then(parseFile)
    .then(filterHumans)
    .then(formatNames)
    .then(startCaseNames)
```

#### Using `getPeople`

```js
import fs from 'fs'
import { getPeople, getDefaultEncoding } from './peopleparser'

getPeople(fs)(getDefaultEncoding())('people.txt')
  .then(console.log)
  .catch(console.error)
```

### Credits

From the article [Code Organization in Functional Programming vs Object Oriented Programming](https://dev.to/jesterxl/code-organization-in-functional-programming-vs-object-oriented-programming-79i) written by [@JesterXL](https://github.com/JesterXL)
