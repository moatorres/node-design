# Design Patterns

## Class, Factory, and Object Prototypes in JavaScript

Object prototypical inheritance is at the heart of JavaScript. Building on what we learned in the previous post about functions, this post goes deeper into functions and the prototypical inheritance. Specifically, we will take a look at the **Class function and Factory function**.

### About `class` in JavaScript

JavaScript is a prototype-based and not a class-based language. Since ES6 added a `class` declaration to the language, JavaScript developers can create classes with an easier. However, the addition is only syntactical sugar over JavaScript’s prototype inheritance.

In short, JavaScript **Class** won’t behave as you’d expect in class-based languages. A `new()` class does not create a copy to be instantiated. It creates another object with links to the other object’s prototype.

It is crucial to understand that the ES6 Class masks the prototype mechanism under the hood. The two key differences to keep in mind are that:

1. JavaScript Class property inheritance follows the prototype chain, not the class chain
2. JavaScript Class properties can be added or removed dynamically at runtime

For more reading on this, check out '[Details of the object model.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Details_of_the_Object_Model)'

### Class Function

Before ES6, we’d use Constructor function in combination with delegating prototypes explicitly.

With ES6, we can simply use the class keyword. We can create a Class in two different ways, as a declaration or as an expression. For example, `class MyClass{}` and `const MyClass = class{}` are equivalent. Either way, the Class function is not hoisted, meaning we cannot reference it before its declaration.

Also, a Class function, in regards to the this keyword context, behaves like a regular function.

#### Basic Usage

We create a Class function, then define a `constructor` within it:

```js
class Employee {
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
```

We also have the use of **getter** and **setter** in the Class. Use the `new` keyword to create an instance of the Class.

```js
let employeeOne = new Employee('Amy', 20)
employeeOne.totalWage // => 'Amy total wages: 300'
```

#### Extend to Create Child Class

We can create a child Class with the `extend` keyword:

```js
class Contractor extends Employee {
  constructor(name, hours) {
    super(name, hours)
    this.wagePerHour = 8
  }
}

let employeeTwo = new Contractor('Tom', 20)
employeeTwo.totalWage // => 'Tom total wages: 160'
```

In the child constructor, we call the parent class with `super()`. Then assign `wagePerHour` to its new value.

In a child class, we must call `super()` before having access to the `this` keyword.

#### Static Method

A Class can also have static methods, which can be called only on the Class itself and not on a class instance. Static methods are useful as utility methods.

For example, if we wanted to add a utility class to calculate total wages by passing in arbitrary wage and hours:

```js
class Employee {
  // ...
  static calculateWage(wage, hours) {
    return wage * hours
  }
}
```

We can only call this by directly referencing the Class and not an instance:

```js
Employee.calculateWage(100, 5) // => 500

employeeOne.calculateWage(100, 5) // TypeError: employeeOne.calculateWage is not a function
```

And if we want to reference the `static` method from within a class, we must call it by class name (explicit reference) or to its Constructor (dynamic reference).

For example, if we rewrite the `getWageReport` class method to use the static `calculateWage` method:

- Explicit reference

```js
function getWageReport() {
  const totalWage = Employee.calculateWage(this.wagePerHour, this.hours)

  return `${this.employeeName} total wages: ${totalWage}`
}
```

- Dynamic reference

```js
function getWageReport() {
  const totalWage = this.constructor.calculateWage(this.wagePerHour, this.hours)
  return `${this.employeeName} total wages: ${totalWage}`
}
```

If you don’t intend the static method to change, then use explicit reference.

A static method’s this keyword is not bounded to the execution context or lexical scope automatically (auto-boxing). We would need to define or pass the this context to the method explicitly.

This is why I’d argue that instead of dynamically referencing a `static` method in the parent class, it would be far cleaner to use a simple `class` method. Then the method’s availability is apparent. We also don’t have the losing this context problem.

#### Private Fields and Methods (ES2019)

Class fields and methods are public by default. ES2019 added the ability to define a private member by prepending it with a `#`.

The support for private fields is not 100% yet. Private methods are in the proposal stage and only usable with Babel and a few other frameworks.

Assuming you have added support, using the `Employee` example, let’s add a private field and method:

```js
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
employeeThree.#minimumWage // error: Syntax error
employeeThree.totalWage // => "Bobby total wages: 350"
```

The above example is a bit contrived to have an extra layer in calculating the base wage based on minimum wage.

It is just to illustrate that static private methods have the same non-instance access restriction as regular static methods explained in the previous section.

#### Class Gotcha: Mutability

Objects created by Class are not immutable. Because the `class` object is just another JavaScript object. Consider:

```js
employeeTwo.employeeName = ‘Bob’;
employeeTwo.totalWage; // => 'Bob total wages: 160'
```

We’d use an immutable library or use `Object.freeze` in the Class function, but caveats abound once we start creating child/sub-classes.

For an in-depth look into immutability and Class, check out [Immutable Classes in JavaScript](https://www.everythingfrontend.com/posts/immutable-classes-in-javascript.html) on Everything Frontend. It’s worth a read!

#### Class Gotcha: Object Prototype Chain In Practice

To illustrate what prototypical inheritance or delegation means, consider these scenarios using the code examples from above.

These scenarios aren’t likely to occur by design. Because they aren’t good coding practice and can be considered an anti-pattern, don’t do it!

But, as a codebase gets more complex and immutability is not enforced well, accidental manipulation can happen.

#### Can Class Methods or Properties be Modified Post-Declaration? Yes

Continuing from the static method example above, if I redefined the `calculateWage` method after the Class declaration and that we had used the explicit reference `Employee.calculateWage`:

```js
// redefine the method in parent class
Employee.calculateWage = function () {
  return 'what?'
}

// redefine the method in child class
Contractor.calculateWage = function () {
  return 'what now?'
}

// get totalWage again, parent class used explicit reference
employeeOne.totalWage // => 'Amy total wages: what?'
employeeTwo.totalWage // => 'Tom total wages: what?'
```

Both the instances of parent and child class are now returning the value from the newly defined `calculateWage` method in parent `Employee` class — 'what?'. We should not expect the instance of child class to return 'what now?' since the declared reference is explicit to `Employee`.

If we had declared using the dynamic reference, `this.constructor.calculateWagewe` should see each class’ instance respecting its boundary:

```js
// get totalWage again, parent class used dynamic reference
employeeOne.totalWage // => 'Amy total wages: what?'
employeeTwo.totalWage // => 'Tom total wages: what now?'
```

#### Can I Add a New Parent Method Post-Declaration? Yes

If I modify the parent `Employee` class aka object prototype by adding a new `getShift` method:

```js
// randomly generate and return a shift number with employee name
Employee.prototype.getShift = function () {
  const shift = lastShiftNumber + 1
  return `${this.employeeName} is on shift number ${shift}.`
}
```

And then we invoke this method on the two previously created objects:

```js
employeeOne.getShift(1) // => 'Amy is on shift number 2.'
employeeTwo.getShift(2) // => 'Tom is on shift number 3.'
```

We will get corresponding results that print the employee names and the correct shift number.

This works because of prototype delegation.

When `employeeTwo` couldn’t find the method in its prototype, it traverses up the delegation chain to the parent prototype and executes the `getShift` method from there.

#### Conclusion on Class

Prototype delegation is a powerful feature in JavaScript. The Class syntax makes creating object with inheritance behavior easier.

However, fitting a class-oriented paradigm onto a prototype-based language can cause confusion. We need to understand Class in the context of prototypical inheritance to fully leverage object prototypes in designing an OOP system.

### Factory function

ES6 Class or Constructor function is not the only approach to creating reusable or composable objects in JavaScript. Another widely used approach is the Factory functions.

The mental models for Class and Factory functions are not similar. One is approaching from an object-oriented pattern while the other is closer to functional programming.

A Factory function is a (non-constructor) function that returns an object. The object can be an object literal or object prototype.

Taking the `Employee` example from the previous section to illustrate the use of factory function to create an object literal (no inheritance):

```js
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
```

**We can use a regular or arrow function.** Here we use an arrow function `CreateEmployee` that takes in the `name` and `hoursWorked` argument (like the Class example). Finally, it takes in `model` as an argument, which defines the structure of the object we want to create.

From there, we call the function to create an object for an employee:

```js
const employeeOne = CreateEmployee('Amy', 20, RegularEmployeeModel)
const employeeTwo = CreateEmployee('Tom', 20, ContractorModel)

employeeOne.totalWage // => 'Amy total wages: 300'
employeeTwo.totalWage // => 'Tom total wages: 160'
```

It’s straightforward — given input, we have an expected output. And this pattern offers a lot of flexibility.

The beautiful thing is that we can easily wrap the return statement in an Object.freeze or other immutable utility to ensure that any object created is immutable.

Since the function returns a new object each time, there is no delegation or inheritance.

We can also have a factory function to create an object with prototype inheritance. To do so, we’d use `Object.create` in the function:

```js
const RegularEmployee = {
  wagePerHour: 15,
  getWageReport: function () {
    const totalWage = calculateWage(this.wagePerHour, this.hours)
    return `${this.name} total wages: ${totalWage}`
  },
}
const Employee = (name, hoursWorked, model) => {
  let newEmployee = Object.create(model)
  newEmployee.name = name
  newEmployee.hours = hoursWorked
  newEmployee.totalWage = newEmployee.getWageReport()
  return Object.freeze(newEmployee)
}
const employeeThree = Employee('Amy', 20, RegularEmployeeModel)
employeeThree.totalWage // => "Amy total wages: 300"
```

We can check for the prototype delegation:

```js
Object.getPrototypeOf(employeeThree) === RegularEmployeeModel // => true

// don't really do this mutation, anti-pattern!
RegularEmployeeModel.say = 'hello'
employeeThree.say // => 'hello';
```

In the above example, we see that behavior for a frozen/immutable employeeThree changed when we modified the delegated prototype, `RegularEmployeeModel` with a new method. The immutability only goes as far as the object properties created from calling the factory function.

#### Private Data and Encapsulation

As we can see from the previous two examples, unless a variable or method is deliberately exposed (returned), then it cannot be accessed outside the function. Therefore, all variables and methods are private by default in a factory function. Of course, that doesn’t apply to methods on the object prototype.

#### Conclusion on Factory

Factory function is flexible. They are easy to follow and the execution context is always clear. You don’t have the ambiguous this keyword problem.

We can adapt it to embrace different implementation patterns, especially using for the OOLO (Objects Linking to Other Objects) pattern with `Object.create`.

It can support creating simple object literals. And if we break the factory functions into small functional chunks, they can become the basis of a composition pattern.

### Class/Constructor vs. Object.create with Factory

We see both factory function and Class/Constructor can both create object prototypes with inheritance. The Factory function is not limited to that and can be useful in generating object literals or simple data objects.

ES6 syntax for Class makes using the Constructor to create new objects much easier to write. The one advantage Class/Constructor has over Object.create is in performance.

JavaScript Engines do more to optimize performance on using new keyword and Class to create new object prototype over `Object.create`.

Then again, the performance difference primarily lies in how a system is constructed. Is it, or does it need to be designed with an OOP approach? Code clarity and maintainability also cannot be overlooked.

More often than not, the choice between using Class/Constructor and Factory with Object.Create comes down to personal preference and how it fits within your larger pattern.

### Credits

From the article [Class, Factory, and Object Prototypes in JavaScript](https://javascript.plainenglish.io/class-factory-and-object-prototypes-b4a7fff7dba8) written by [@cherihung](https://github.com/cherihung)
