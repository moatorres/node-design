// class with `constructor`
class SimpleEmployee {
  constructor(name, hoursWorked) {
    this.wagePerHour = 15
    this.hours = hoursWorked
    this.employeeName = name
  }

  // method
  getWageReport() {
    const totalWage = this.hours * this.wagePerHour
    return `${this.employeeName} total wages: ${totalWage}`
  }

  // getter
  get totalWage() {
    return this.getWageReport()
  }
}

let employeeOne = new SimpleEmployee('Amy', 20)
employeeOne.totalWage // => “Amy total wages: 300”

class Contractor extends SimpleEmployee {
  constructor(name, hours) {
    super(name, hours)
    this.wagePerHour = 8
  }
}

let employeeTwo = new Contractor('Tom', 20)
employeeTwo.totalWage // => “Tom total wages: 160”

class NewEmployee {
  static calculateWage(wage, hours) {
    return wage * hours
  }
}

// We can only call this by directly referencing the Class and not an instance:

NewEmployee.calculateWage(100, 5) // => 500

// employeeOne.calculateWage(100, 5) // TypeError: employeeOne.calculateWage is not a function

class Employee {
  #minimumWage

  constructor(name, hoursWorked) {
    this.#minimumWage = 7
    this.wagePerHour = this.#calculateBaseWage()
    this.hours = hoursWorked
    this.employeeName = name
  }

  // method
  getWageReport() {
    const totalWage = this.hours * this.wagePerHour
    return `${this.employeeName} total wages: ${totalWage}`
  }

  // getter
  get totalWage() {
    return this.getWageReport()
  }
  // private static method
  static #assignBaseWage(min) {
    return min * 2
  }

  // private method
  #calculateBaseWage() {
    return Employee.#assignBaseWage(this.#minimumWage)
  }
}

const employeeThree = new Employee('Bobby', 25)
// employeeThree.#minimumWage // error: Syntax error
employeeThree.totalWage // => "Bobby total wages: 350"

// randomly generate and return a shift number with employee name
Employee.prototype.getShift = function () {
  const shift = lastShiftNumber + 1
  return `${this.employeeName} is on shift number ${shift}.`
}

// And then we invoke this method on the two previously created objects:
// console.log(employeeOne)
// employeeOne.getShift(1) // => “Amy is on shift number 2.”
// employeeTwo.getShift(2) // => “Tom is on shift number 3.”

// #### Conclusion on Class

// Fitting a class-oriented paradigm onto a prototype-based language can cause confusion. We need to understand Class in the context of prototypical inheritance to fully leverage object prototypes in designing an OOP system.

const RegularEmployeeModel = { wagePerHour: 15 }
const ContractorModel = { wagePerHour: 8 }

// utility function
const calculateWage = (wage, hours) => wage * hours

// factory function
const CreateEmployee = (name, hoursWorked, model) => {
  const hours = hoursWorked
  const employeeName = name
  const wagePerHour = model.wagePerHour

  const getWageReport = () => {
    const totalWage = calculateWage(wagePerHour, hours)
    return `${employeeName} total wages: ${totalWage}`
  }

  return Object.freeze({
    totalWage: getWageReport(),
    name: employeeName,
    hours,
  })
}

const employeeOne1 = CreateEmployee('Amy', 20, RegularEmployeeModel)
const employeeTwo2 = CreateEmployee('Tom', 20, ContractorModel)

employeeOne1.totalWage // => “Amy total wages: 300”
employeeTwo2.totalWage // => “Tom total wages: 160”

const RegularEmployee = {
  wagePerHour: 15,
  getWageReport: function () {
    const totalWage = calculateWage(this.wagePerHour, this.hours)
    return `${this.name} total wages: ${totalWage}`
  },
}

const EmployeeConst = (name, hoursWorked, model) => {
  console.log(model)
  let newEmployee = Object.create(model)
  newEmployee.name = name
  newEmployee.hours = hoursWorked
  newEmployee.totalWage = newEmployee.getWageReport()
  return Object.freeze(newEmployee)
}

const employeeThree3 = EmployeeConst('Amy', 20, RegularEmployee)

employeeThree.totalWage // => "Amy total wages: 300"

Object.getPrototypeOf(employeeThree3) === RegularEmployee // => true

console.log(employeeOne)
console.log(employeeTwo)
console.log(employeeThree)
