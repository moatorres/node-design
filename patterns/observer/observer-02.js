// const Subject = function () {
//   let observers = []

//   this.subscribe = function (observer) {
//     observers.push(observer)
//   }

//   this.unsubscribe = function (observer) {
//     let index = observers.indexOf(observer)
//     if (index > -1) {
//       observers.splice(index, 1)
//     }
//   }

//   this.notify = function (observer) {
//     let index = observers.indexOf(observer)
//     if (index > -1) {
//       observers[index].notify(index)
//     }
//   }

//   this.broadcast = function () {
//     for (let i = 0; i < observers.length; i++) {
//       observers[i].notify(i)
//     }
//   }
// }

// const Observer = function () {
//   this.notify = function (index) {
//     console.log('Observer ' + index + ' is notified!')
//   }
// }

// let subject = new Subject()
// let observer = new Observer()

// console.log(subject)
// console.log(observer)

// subject.subscribe(observer)
// subject.notify(observer)
// subject.broadcast()

// class Subject {
//   constructor() {
//     this.observers = []
//   }

//   subscribe(observer) {
//     this.observers.push(observer)
//   }

//   unsubscribe(observer) {
//     let index = this.observers.indexOf(observer)
//     if (index > -1) {
//       this.observers.splice(index, 1)
//     }
//   }

//   notify(observer) {
//     let index = this.observers.indexOf(observer)
//     if (index > -1) {
//       this.observers[index].notify(index)
//     }
//   }

//   broadcast() {
//     for (let i = 0; i < this.observers.length; i++) {
//       this.observers[i].notify(i)
//     }
//   }
// }

// class Observer {
//   notify(index) {
//     console.log('Observer ' + index + ' is notified!')
//   }
// }

// let subject = new Subject()
// let observer = new Observer()

// console.log(subject) // => Subject {}
// console.log(observer) // => Observer {}

// subject.subscribe(observer)
// subject.notify(observer)
// subject.broadcast()

const Subject = function () {
  let observers = []

  return {
    subscribe: function (observer) {
      observers.push(observer)
    },
    unsubscribe: function (observer) {
      let index = observers.indexOf(observer)
      if (index > -1) {
        observers.splice(index, 1)
      }
    },
    notify: function (observer) {
      let index = observers.indexOf(observer)
      if (index > -1) {
        observers[index].notify(index)
      }
    },
    broadcast: function () {
      for (let i = 0; i < observers.length; i++) {
        observers[i].notify(i)
      }
    },
  }
}

const Observer = function () {
  return {
    notify: function (index) {
      console.log('Observer ' + index + ' is notified!')
    },
  }
}

let subject = new Subject()
let observer = new Observer()

console.log(subject)
console.log(observer)

subject.subscribe(observer)
subject.notify(observer)
subject.broadcast()
