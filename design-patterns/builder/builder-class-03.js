class Course {
  constructor(name, sales, isFree = false, price, isCampain = false) {
    this.name = name
    this.sales = sales || 0
    this.isFree = isFree
    this.price = price || 0
    this.isCampain = isCampain // ad campaign
  }

  toString() {
    return console.log(JSON.stringify(this))
  }
}

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

const firstCourse = new CourseBuilder('Design Patterns 1')
  .makePaid(100)
  .makeCampain()
  .build()

const secondCourse = new CourseBuilder('Design Patterns 2').build()

console.log(firstCourse)
console.log(secondCourse)
firstCourse.toString()
secondCourse.toString()
