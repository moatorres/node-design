const Task = function (name, description, finished = false, dueDate) {
  this.name = name
  this.description = description
  this.isFinished = finished
  this.dueDate = dueDate
}

const TaskBuilder = function () {
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
      this.isFinished = finished
      return this
    },
    setDueDate: function (dueDate) {
      this.dueDate = dueDate
      return this
    },
    build: function () {
      return new Task(
        this.name,
        this.description,
        this.isFinished,
        this.dueDate
      )
    },
  }
}

let task = new TaskBuilder()
  .setName('Task A')
  .setDescription('finish book')
  .setDueDate(new Date(2019, 5, 12))
  .build()

console.log(task)
