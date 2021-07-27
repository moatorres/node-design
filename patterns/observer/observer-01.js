function ObserverList() {
  this.observerList = []
}

ObserverList.prototype.add = function (obj) {
  this.observerList.push(obj)
}
ObserverList.prototype.count = function () {
  this.observerList.length
}
ObserverList.prototype.removeAt = function (index) {
  this.observerList.splice(index, 1)
}
ObserverList.prototype.get = function (index) {
  if (index > -1 && index < this.observerList.length) {
    return this.observerList[index]
  }
}

ObserverList.prototype.indexOf = function (obj, startIndex) {
  var i = startIndex

  while (i < this.observerList.length) {
    if (this.observerList[i] === obj) return i
    i++
  }

  return -1
}

function Subject() {
  this.observers = new ObserverList()
}

Subject.prototype.addObserver = function (observer) {
  this.observers.add(observer)
}
Subject.prototype.removeObserver = function (observer) {
  this.observers.removeAt(this.observers.indexOf(observer, 0))
}
Subject.prototype.notify = function (context) {
  let observerCount = this.observers.count()
  for (let i = 0; i < observerCount; i++) this.observers.get(i).update(context)
}

// The Observer
function Observer() {
  this.update = function () {
    // ...
  }
}

const extend = (obj, extension) => {
  for (var key in extension) {
    obj[key] = extension[key]
  }
}

// let controlCheckbox = document.getElementById('myCheckbox')
// let addBtn = document.getElementById('myButton')
// let container = document.getElementById('myContainer')
let controlCheckbox = {}
let addBtn = {}
let container = {}

// extend the controlling checkbox with the Subject class
extend(controlCheckbox, new Subject())

// clicking the checkbox will trigger notifications to its observers
controlCheckbox.onclick = () => controlCheckbox.notify(controlCheckbox.checked)

addBtn.onclick = addNewObserver

function addNewObserver() {
  // create a new checkbox
  let check = document.createElement('input')
  check.type = 'checkbox'

  // extend the checkbox with the Observer class
  extend(check, new Observer())

  // override with custom update behaviour
  check.update = function (value) {
    this.checked = value
  }

  // add the new observer to our list of observers
  controlCheckbox.addObserver(check)

  // append the item to the container
  container.appendChild(check)
}

console.log(controlCheckbox)
console.log(addBtn)
console.log(container)
