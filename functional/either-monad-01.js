class Left {
  constructor(val) {
    this._value = val
  }

  map() {
    return this
  }

  join() {
    return this
  }

  chain() {
    return this
  }

  ap() {
    return this
  }

  toString() {
    const str = this._value.toString()
    return `Left(${$str})`
  }

  static of(val) {
    return new Left(val)
  }
}

class Right {
  constructor(val) {
    this._value = val
  }

  map(fn) {
    return new Right(fn(this._value))
  }

  join() {
    if (this._value instanceof Left || this._value instanceof Right) {
      return this._value
    }
    return this
  }

  chain(fn) {
    return fn(this._value)
  }

  ap(otherEither) {
    const functionToRun = otherEither._value
    return this.map(functionToRun)
  }

  toString() {
    const str = this._value.toString()
    return `Right(${str})`
  }

  static of(val) {
    return new Right(val)
  }
}

function left(x) {
  return Left.of(x)
}

function right(x) {
  return Right.of(x)
}

function either(leftFunc, rightFunc, e) {
  return e instanceof Left ? leftFunc(e._value) : rightFunc(e._value)
}

function liftA2(func) {
  return function runApplicativeFunc(a, b) {
    return b.ap(a.map(func))
  }
}

function splitFields(row) {
  return row.replace(/"(.*)"/, '$1').split('","')
}

function zipRow(headerFields) {
  return function zipRowWithHeaderFields(fieldData) {
    const lengthMatch = headerFields.length == fieldData.length
    return !lengthMatch
      ? left(new Error('Row has an unexpected number of fields'))
      : right(_.zipObject(headerFields, fieldData))
  }
}

function addDateStr(messageObj) {
  const errMsg = 'Unable to parse date stamp in message object'
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const d = new Date(messageObj.datestamp)
  if (isNaN(d)) {
    return left(new Error(errMsg))
  }

  const datestr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  return right({ datestr, ...messageObj })
}

const rowToMessage = _.template(`<li class="Message Message--<%= viewed %>">
<a href="<%= href %>" class="Message-link"><%= content %></a>
<time datetime="<%= datestamp %>"><%= datestr %></time>
<li>`)

const showError = _.template(`<li class="Error"><%= message %></li>`)

function processRow(headerFields, row) {
  const rowObjWithDate = right(row)
    .map(splitFields)
    .chain(zipRow(headerFields))
    .chain(addDateStr)
  return either(showError, rowToMessage, rowObjWithDate)
}

function splitCSVToRows(csvData) {
  return csvData.indexOf('\n') < 0
    ? left(new Error('No header row found in CSV data'))
    : right(csvData.split('\n'))
}

function processRows(headerFields) {
  return function processRowsWithHeaderFields(dataRows) {
    //  Array map here, not Either map
    return dataRows.map((row) => processRow(headerFields, row))
  }
}

function showMessages(messages) {
  return `<ul class="Messages">${messages.join('\n')}</ul>`
}

function csvToMessages(csvData) {
  const csvRows = splitCSVToRows(csvData)
  const headerFields = csvRows.map(_.head).map(splitFields)
  const dataRows = csvRows.map(_.tail)
  const processRowsA = liftA2(processRows)
  const messagesArr = processRowsA(headerFields, dataRows)
  return either(showError, showMessages, messagesArr)
}

const csvData = `"datestamp","content","viewed","href"
"2018-09-27T05:33:34+00:00","@madhatter invited you to tea","unread","https://example.com/invite/tea/3801"
"2018-11-26T13:47:12+00:00","@queenofhearts mentioned you in 'Croquet Tournament' discussion","viewed","https://example.com/discussions/croquet/1168"
"2018-12-25T03:50:08+00:00","@cheshirecat sent you a grin","unread","https://example.com/interactions/grin/88"`

document.querySelector('#messages').innerHTML = csvToMessages(csvData)
