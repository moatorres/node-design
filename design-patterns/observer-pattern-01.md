# Design Patterns

## Observer Pattern

The Observer is a design pattern where an object (known as a subject) maintains a list of objects depending on it (observers), automatically notifying them of any changes to state.

When a subject needs to notify observers about something interesting happening, it broadcasts a notification to the observers (which can include specific data related to the topic of the notification).

When we no longer wish for a particular observer to be notified of changes by the subject they are registered with, the subject can remove them from the list of observers.

We can now expand on what we've learned to implement the Observer pattern with the following components:

- **Subject**
  Maintains a list of observers, facilitates adding or removing observers
- **Observer**
  Provides an update interface for objects that need to be notified of a _Subject_'s changes of state
- **ConcreteSubject**
  Broadcasts notifications to observers on changes of state, stores the state of _ConcreteObservers_
- **ConcreteObserver**
  Stores a reference to the _ConcreteSubject_, implements an update interface for the _Observer_ to ensure state is consistent with the _Subject_'s

First, let's model the list of dependent Observers a subject may have:

```js
function ObserverList() {
  this.observerList = []
}

ObserverList.prototype.add = (obj) => this.observerList.push(obj)

ObserverList.prototype.count = () => this.observerList.length

ObserverList.prototype.removeAt = (index) => this.observerList.splice(index, 1)

ObserverList.prototype.get = (index) => {
  if (index > -1 && index < this.observerList.length) {
    return this.observerList[index]
  }
}

ObserverList.prototype.indexOf = (obj, startIndex) => {
  var i = startIndex

  while (i < this.observerList.length) {
    if (this.observerList[i] === obj) {
      return i
    }
    i++
  }

  return -1
}
```

Next, let's model the `Subject` and the ability to `add`, `remove` or `notify` observers on the observer list.

```js
const Subject = () => (this.observers = new ObserverList())

Subject.prototype.addObserver = (observer) => this.observers.add(observer)

Subject.prototype.removeObserver = (observer) =>
  this.observers.removeAt(this.observers.indexOf(observer, 0))

Subject.prototype.notify = function (context) {
  let observerCount = this.observers.count()
  for (let i = 0; i < observerCount; i++) {
    this.observers.get(i).update(context)
  }
}
```

We then define a skeleton for creating new Observers. The `update` functionality here will be overwritten later with custom behaviour.

```js
// The Observer
function Observer() {
  this.update = function () {
    // ...
  }
}
```

In our sample application using the above Observer components, we now define:

- A button for adding new observable checkboxes to the page
- A control checkbox which will act as a subject, notifying other checkboxes they should be checked
- A container for the new checkboxes being added

We then define `ConcreteSubject` and `ConcreteObserver` handlers for both adding new observers to the page and implementing the updating interface. See below for inline comments on what these components do in the context of our example.

#### Helpers & DOM References

```js
const extend = (obj, extension) => {
  for (var key in extension) {
    obj[key] = extension[key]
  }
}

let controlCheckbox = document.getElementById('myCheckbox')
let addBtn = document.getElementById('myButton')
let container = document.getElementById('myContainer')
```

#### Concrete Subject

```js
// extend the controlling checkbox with the Subject class
extend(controlCheckbox, new Subject())

// clicking the checkbox will trigger notifications to its observers
controlCheckbox.onclick = () => controlCheckbox.notify(controlCheckbox.checked)

addBtn.onclick = addNewObserver
```

#### Concrete Observer

```js
function addNewObserver() {
  // create a new checkbox
  let check = document.createElement('input')
  check.type = 'checkbox'

  // extend the checkbox with the Observer class
  extend(check, new Observer())

  // override with custom update behaviour
  check.update = (value) => (this.checked = value)

  // add the new observer to our list of observers
  controlCheckbox.addObserver(check)

  // append the item to the container
  container.appendChild(check)
}
```

In this example, we looked at how to implement and utilize the **Observer pattern**, covering the concepts of a `Subject`, `Observer`, `ConcreteSubject` and `ConcreteObserver`.

### Credits

From the book [Essential JS Design Patterns](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript) written by [Addy Osmani](https://addyosmani.com)
