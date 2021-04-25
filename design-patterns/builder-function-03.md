# Design Patterns

## Builder Function

The **Builder pattern** is a design pattern to provide a flexible solution for creating objects. Builder pattern separates the construction of a complex object from its representation.

Builder pattern builds complex objects using simple objects by providing a step by step approach. It belongs to the creational patterns.

The following example uses a Builder pattern with `TaskBuilder`. In this example, we'll have a `TaskBuilder` which generates `Task` objects.

- **`Task`**
  Our `Task` object will have four attributes: `name`, `description`, `finished` and `dueDate`.

```js
let Task = function (name, description, finished, dueDate) {
  this.name = name
  this.description = description
  this.finished = finished
  this.dueDate = dueDate
}
```

- **`TaskBuilder`**
  Our `TaskBuilder` will return _setters_ to the four attributes. Note that each function returns `this`, the reference to the current object.

```js
let TaskBuilder = function () {
  let name
  let description
  let isFinished = false
  let dueDate

  return {
    setName: function (name) {
      this.name = name
      return this
    },
    setDescription: function (description) {
      this.description = description
      return this
    },
    setFinished: function (finished) {
      this.finished = finished
      return this
    },
    setDueDate: function (dueDate) {
      this.dueDate = dueDate
      return this
    },
    build: function () {
      return new Task(name, description, isFinished, dueDate)
    },
  }
}
```

### Usage

Now we can `chain` the function calls. The chain of function calls is also known as a fluent API.

```js
let task = new TaskBuilder()
  .setName('Task A')
  .setDescription('finish book')
  .setDueDate(new Date(2019, 5, 12))

console.log(task)
```

### Credits

From this [article](https://zetcode.com/javascript/builderpattern/) published on [zetcode.com](https://zetcode.com)
