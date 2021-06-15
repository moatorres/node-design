# Design Patterns

## Builder Class

A **Builder pattern** is generally in charge of:

- Simplifying the construction of an object
- Separating the construction and representation of that object
- Composition
- Creating different representations for the constructed object

To build and example of a **builder pattern** we should:

- Create a `constructor` with required parameters
- Use default values for best practice
- Create a function with meaningful names for the parameters used in the `constructor`
- Return the values used within the function. (i.e `return this`)
- Create a method that will return the instance of the class for which the Builder class is made.

```js
class Course {
  constructor(name, sales, isFree = false, price, isCampain = false) {
    this.name = name
    this.sales = sales || 0
    this.isFree = isFree
    this.price = price || 0
    this.isCampain = isCampain // Advertising Campaign
  }

  toString() {
    return console.log(JSON.stringify(this))
  }
}

module.exports = Course
```

In our example, we are creating a builder pattern for `Course`, so we will make a function that will return an instance of the `Course` class with the values. We'll name it `build()`.

```js
const Course = require('./Course')

class CourseBuilder {
  constructor(name, sales = 0, price = 0) {
    this.name = name
    this.sales = sales
    this.price = price
  }

  makePaid(price) {
    this.isFree = false
    this.price = price
    return this
  }

  makeCampain() {
    this.isCampain = true
    return this
  }

  build() {
    return new Course(this)
  }
}

module.exports = CourseBuilder
```

### Usage

Now, in the main file instead of `Course` class, import the `CourseBuilder` class. Then, create an `instance` of it.

```js
const CourseBuilder = require('./CourseBuilder')

const firstCourse = new CourseBuilder('Design Patterns 1')
  .makePaid(100)
  .makeCampain()
  .build()

const secondCourse = new CourseBuilder('Design Patterns 2').build()

firstCourse.toString()
secondCourse.toString()
```

### Credits

From this [article](https://dzone.com/articles/builder-pattern-in-javascript) written by [Souradip Panja](https://dzone.com/users/3690501/souradip.html)
