# Design Patterns

## Methods, Prototypes and Classes

### Encapsulation

The core idea in object-oriented programming is to divide programs into smaller pieces and make each piece responsible for managing its own state.

This way, some knowledge about the way a piece of the program works can be kept local to that piece. Someone working on the rest of the program does not have to remember or even be aware of that knowledge. Whenever these local details change, only the code directly around it needs to be updated.

Different pieces of such a program interact with each other through interfaces, limited sets of functions or bindings that provide useful functionality at a more abstract level, hiding their precise implementation.

Such program pieces are modeled using objects. Their interface consists of a specific set of methods and properties. Properties that are part of the interface are called public. The others, which outside code should not be touching, are called private.

Many languages provide a way to distinguish public and private properties and prevent outside code from accessing the private ones altogether. JavaScript, once again taking the minimalist approach, does not—not yet at least. There is work underway to add this to the language.

Even though the language doesn’t have this distinction built in, JavaScript programmers are successfully using this idea. Typically, the available interface is described in documentation or comments. It is also common to put an underscore (\_) character at the start of property names to indicate that those properties are private.

Separating interface from implementation is a great idea. It is usually called encapsulation.

### Methods

Methods are nothing more than properties that hold function values. This is a simple method:

```js
let rabbit = {}
rabbit.speak = function (line) {
  console.log(`The rabbit says '${line}'`)
}

rabbit.speak("I'm alive.")
// → The rabbit says 'I'm alive.'
```

Usually a method needs to do something with the object it was called on. When a function is called as a method—looked up as a property and immediately called, as in object.method()—the binding called this in its body automatically points at the object that it was called on.

```js
function speak(line) {
  console.log(`The ${this.type} rabbit says '${line}'`)
}
let whiteRabbit = { type: 'white', speak }
let hungryRabbit = { type: 'hungry', speak }

whiteRabbit.speak('Oh my ears and whiskers, ' + "how late it's getting!")
// → The white rabbit says 'Oh my ears and whiskers, how
//   late it's getting!'
hungryRabbit.speak('I could use a carrot right now.')
// → The hungry rabbit says 'I could use a carrot right now.'
```

You can think of this as an extra parameter that is passed in a different way. If you want to pass it explicitly, you can use a function’s call method, which takes the this value as its first argument and treats further arguments as normal parameters.

```js
speak.call(hungryRabbit, 'Burp!')
// → The hungry rabbit says 'Burp!'
```

Since each function has its own this binding, whose value depends on the way it is called, you cannot refer to the this of the wrapping scope in a regular function defined with the function keyword.

Arrow functions are different—they do not bind their own `this` but can see the `this` binding of the scope around them. Thus, you can do something like the following code, which references `this` from inside a local function:

```js
function normalize() {
  console.log(this.coords.map((n) => n / this.length))
}
normalize.call({ coords: [0, 2, 3], length: 5 })
// → [0, 0.4, 0.6]
```

If I had written the argument to map using the function keyword, the code wouldn’t work.

### Prototypes

Watch closely. I pulled a property out of an empty object. Magic!

```js
let empty = {}
console.log(empty.toString)
// → function toString(){…}
console.log(empty.toString())
// → [object Object]
```

Well, not really. I have simply been withholding information about the way JavaScript objects work. In addition to their set of properties, most objects also have a prototype. A prototype is another object that is used as a fallback source of properties. When an object gets a request for a property that it does not have, its prototype will be searched for the property, then the prototype’s prototype, and so on.

So who is the prototype of that empty object? It is the great ancestral prototype, the entity behind almost all objects, `Object.prototype`.

```js
console.log(Object.getPrototypeOf({}) == Object.prototype)
// → true
console.log(Object.getPrototypeOf(Object.prototype))
// → null
```

As you guess, `Object.getPrototypeOf` returns the prototype of an object.

The prototype relations of JavaScript objects form a tree-shaped structure, and at the root of this structure sits `Object.prototype`. It provides a few methods that show up in all objects, such as `toString`, which converts an object to a string representation.

Many objects don’t directly have `Object.prototype` as their prototype but instead have another object that provides a different set of default properties. Functions derive from `Function.prototype`, and arrays derive from `Array.prototype`.

```js
console.log(Object.getPrototypeOf(Math.max) == Function.prototype)
// → true
console.log(Object.getPrototypeOf([]) == Array.prototype)
// → true
```

Such a prototype object will itself have a prototype, often `Object.prototype`, so that it still indirectly provides methods like `toString`.

You can use `Object.create` to create an object with a specific prototype.

```js
let protoRabbit = {
  speak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`)
  },
}
let killerRabbit = Object.create(protoRabbit)
killerRabbit.type = 'killer'
killerRabbit.speak('SKREEEE!')
// → The killer rabbit says 'SKREEEE!'
```

A property like `speak(line)` in an object expression is a shorthand way of defining a method. It creates a property called `speak` and gives it a function as its value.

The “proto” rabbit acts as a container for the properties that are shared by all rabbits. An individual rabbit object, like the killer rabbit, contains properties that apply only to itself—in this case its type—and derives shared properties from its prototype.

### Classes

JavaScript’s prototype system can be interpreted as a somewhat informal take on an object-oriented concept called classes. A **class** defines the shape of a type of object—what methods and properties it has. Such an object is called an instance of the class.

Prototypes are useful for defining properties for which all instances of a **class** share the same value, such as methods. Properties that differ per instance, such as our rabbits’ type property, need to be stored directly in the objects themselves.

So to create an instance of a given **class**, you have to make an object that derives from the proper prototype, but you also have to make sure it, itself, has the properties that instances of this class are supposed to have. This is what a constructor function does.

```js
function makeRabbit(type) {
  let rabbit = Object.create(protoRabbit)
  rabbit.type = type
  return rabbit
}
```

JavaScript provides a way to make defining this type of function easier. If you put the keyword `new` in front of a function call, the function is treated as a constructor. This means that an object with the right prototype is automatically created, bound to this in the function, and returned at the end of the function.

The prototype object used when constructing objects is found by taking the prototype property of the constructor function.

```js
function Rabbit(type) {
  this.type = type
}
Rabbit.prototype.speak = function (line) {
  console.log(`The ${this.type} rabbit says '${line}'`)
}

let weirdRabbit = new Rabbit('weird')
```

Constructors (all functions, in fact) automatically get a property named prototype, which by default holds a plain, empty object that derives from `Object.prototype`. You can overwrite it with a new object if you want. Or you can add properties to the existing object, as the example does.

By convention, the names of constructors are capitalized so that they can easily be distinguished from other functions.

It is important to understand the distinction between the way a prototype is associated with a constructor (through its prototype property) and the way objects have a prototype (which can be found with `Object.getPrototypeOf`). The actual prototype of a constructor is `Function.prototype` since constructors are functions. Its prototype property holds the prototype used for instances created through it.

```js
console.log(Object.getPrototypeOf(Rabbit) == Function.prototype)
// → true
console.log(Object.getPrototypeOf(weirdRabbit) == Rabbit.prototype)
// → true
```

### Class notation

So JavaScript classes are constructor functions with a prototype property. That is how they work, and until 2015, that was how you had to write them. These days, we have a less awkward notation.

```js
class Rabbit {
  constructor(type) {
    this.type = type
  }
  speak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`)
  }
}

let killerRabbit = new Rabbit('killer')
let blackRabbit = new Rabbit('black')
```

The `class` keyword starts a class declaration, which allows us to define a constructor and a set of methods all in a single place. Any number of methods may be written inside the declaration’s braces. The one named constructor is treated specially. It provides the actual constructor function, which will be bound to the name Rabbit. The others are packaged into that constructor’s prototype. Thus, the earlier class declaration is equivalent to the constructor definition from the previous section. It just looks nicer.

Class declarations currently allow only methods—properties that hold functions—to be added to the prototype. This can be somewhat inconvenient when you want to save a non-function value in there. The next version of the language will probably improve this. For now, you can create such properties by directly manipulating the prototype after you’ve defined the class.

Like function, `class` can be used both in statements and in expressions. When used as an expression, it doesn’t define a binding but just produces the constructor as a value. You are allowed to omit the class name in a class expression.

```js
let object = new (class {
  getWord() {
    return 'hello'
  }
})()

console.log(object.getWord()) // → hello
```

### Overriding derived properties

When you add a property to an object, whether it is present in the prototype or not, the property is added to the object itself. If there was already a property with the same name in the prototype, this property will no longer affect the object, as it is now hidden behind the object’s own property.

```js
Rabbit.prototype.teeth = 'small'
console.log(killerRabbit.teeth) // → small

killerRabbit.teeth = 'long, sharp, and bloody'
console.log(killerRabbit.teeth) // → long, sharp, and bloody

console.log(blackRabbit.teeth) // → small
console.log(Rabbit.prototype.teeth) // → small
```

The following diagram sketches the situation after this code has run. The `Rabbit` and Object prototypes lie behind `killerRabbit` as a kind of backdrop, where properties that are not found in the object itself can be looked up.

Overriding properties that exist in a prototype can be a useful thing to do. As the rabbit teeth example shows, overriding can be used to express exceptional properties in instances of a more generic class of objects, while letting the nonexceptional objects take a standard value from their prototype.

Overriding is also used to give the standard function and array prototypes a different toString method than the basic object prototype.

```js
console.log(Array.prototype.toString == Object.prototype.toString)
// → false

console.log([1, 2].toString()) // → 1,2
```

Calling `toString` on an array gives a result similar to calling `.join(",")` on it—it puts commas between the values in the array. Directly calling `Object.prototype.toString` with an array produces a different string. That function doesn’t know about arrays, so it simply puts the word object and the name of the type between square brackets.

```js
console.log(Object.prototype.toString.call([1, 2]))
// → [object Array]
```

### Credits

From the book [Eloquent JavaScript](https://eloquentjavascript.net) written by [@marijnh](https://github.com/marijnh)
