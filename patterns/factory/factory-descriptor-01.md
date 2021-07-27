# Utilities

## Descriptor `Symbol`

A little while ago my colleagues and I came across a fairly interesting problem that we couldn’t immediately solve. We use the Immutable library quite extensively — especially records since they have the nicety of allowing for dot accessors and object destructuring.

So let’s say we have a record of the following shape:

```js
const record = Record({
  a: 1,
  b: 2,
  c: 3,
})()
```

We wanted to pull out one of the properties off this record and organize the `rest` in a separate object, so we destructured as we normally do:

```js
const { a, ...rest } = record
```

Do you see the problem with what we did? We didn’t. And it wasn’t until a lot of digging that we were able to come up with **why rest was always undefined**.

The answer was that while Immutable records allow for dot accessing and destructuring, **none of the properties on a record are enumerable**.

What kind of properties the `...` object **rest operator** groups together? **Enumerable properties**. So we will always get an object `undefined` using this method.

#### Let's see how we can configure an object’s properties and customize its functionality using vanilla JS so that we can increase the basic functionality of our objects’ default behavior.

To work with a concrete example **we’ll create a possible database entry that includes calculated properties, pre- and post-processing on accessing and setting properties, and some meta-programmatic features** to give our entry some self-awareness of its execution context.

### Getting Started

To begin we’ll scope out the features of our entry. It would be nice to implement `a(n)`:

- Id
- Name
- Last accessed date
- Last modified date
- Birthdate
- SSN

So let’s create our database entry:

```js
const dbEntry = Object.create(null)
```

Let's use `Object.create` instead of the more familiar `{}` syntax because the former entry allows us to specify what the object’s prototype should be, and by passing in `null` we can de-link this object from any prototype. In effect this object will have absolute no functionality other than what we define on it.

### Property Data Descriptors

A **property data descriptor is an object assigned to an object’s property** (one descriptor per property) that dictates how the JavaScript engine will behave regarding that property.

The four keys a data descriptor can have are:

- `value`: the actual **value** we want the property to be (defaults `undefined`)
- `enumerable`: whether the property should show up in operations that enumerate over an object’s keys, such as `for...in` loops or `Object.keys()` (defaults `false`)
- `configurable`: indicates if we can later change the descriptor settings or be able to delete the property off the object (defaults `false`)
- `writable`: tells if the value of the property can be changed (defaults `false`)

Now, when we normally set an object’s property, these values are automatically established in a way that gives us complete control over that property.

```js
const obj = {}

obj.a = 1

Object.getOwnPropertyDescriptor(obj, 'a')

// => { value: 1,
//   writable: true,
//   enumerable: true,
//   configurable: true }
```

So how do we go about restricting what can be done when we set a property? Use `Object.defineProperty` and pass in the configuration we want.

Let’s set an ID on our `dbEntry` object. Since this represents the primary key it would have in a database, once it’s set we should not be able to change it, but we would probably like to be able to access it if we loop across our entry’s keys.

So we’ll do the following:

```js
Object.defineProperty(dbEntry, 'id', {
  value: 1,
  enumerable: true,
})
```

We are setting the value of `dbEntry.id` to `1` and specifying we want to be able to enumerate it.

We didn’t need to pass in the **configurable** or **writable** flags because when we define a property and don’t specify a descriptor setting JavaScript will use the respective defaults specified above (`false` in these cases).

From now on, wq’ll specify all descriptor options, even when the defaults are what we want.

Let’s also add properties for `SSN` and `birthdate`:

```js
Object.defineProperties(dbEntry, {
  ssn: {
    value: '123-45-6789',
    writable: false,
    enumerable: true,
    configurable: false,
  },
  birthdate: {
    value: '01/21/1980',
    writable: false,
    enumerable: true,
    configurable: false,
  },
})
```

This time we used the `Object.defineProperties` method **to add multiple properties at the same time** rather than having to call `Object.defineProperty` twice. The second parameter is merely an object whose keys will become the properties on the designated object and whose values are the descriptors.

### Property Accessor Descriptors

There's still quite a bit of additional power we can exert if we move away **from data descriptors (static) to accessor descriptors**, (dynamic object properties).

#### The main difference between an accessor descriptor and a data descriptor is that accessors replace the earlier `value` and `writable` configuration flags with `get` and `set` functions.

Let’s put them to use to define a `name` property.

Behind the scenes we would like to store first, middle, and last names separately but present the user with the actual full name.

This allows the database to selectively be able to search on whichever parts of the name we want while allowing a user to see a more readable form. This is also a perfect way to use `get` and `set`.

#### In a sense, getters and setters are virtual. If we have an `obj.prop` that was defined with `get` and `set` accessors, `get` and `set` must use a different storage location to hold the actual data we are getting/setting.

The reason for this is if we call `obj.prop` anywhere in our code, the JavaScript engine will call the `get` function defined on it, but because `get` pulls data from `obj.prop`, we enter another loop of `obj.prop` calling its getter which then calls itself again, ad infinitum.

This ends in a `Maximum call stack size exceeded` error as we enter into an infinitely recursing set of function calls.

Let’s define a new property on our dbEntry to house the “backend” data for all of our getters/setters to work with.

```js
Object.defineProperty(dbEntry, '_', {
  value: {},
  writable: false,
  enumerable: false,
  configurable: false,
})
```

On this we’ll create `firstname`, `middlename`, and `lastname` properties to actually store name data.

```js
Object.defineProperties(dbEntry._, {
  firstname: {
    value: 'John',
    writable: true,
    enumerable: false,
    configurable: false,
  },
  middlename: {
    value: 'Jack',
    writable: true,
    enumerable: false,
    configurable: false,
  },
  lastname: {
    value: 'Doe',
    writable: true,
    enumerable: false,
    configurable: false,
  },
})
```

With this done, we can finally put together our `dbEntry.name` property. We will assume every name passed in has exactly a first, middle, and last name to keep the code simple. We will also set `configurable: true` this will be important later.

```js
Object.defineProperty(dbEntry, 'name', {
  enumerable: true,
  configurable: true,
  get() {
    const { firstname, middlename, lastname } = this._
    return `${firstname} ${middlename} ${lastname}`
  },
  set(newName) {
    const [firstname, middlename, lastname] = newName.split(' ')
    this._.firstname = firstname
    this._.middlename = middlename
    this._.lastname = lastname
  },
})
```

Now, if we retrieve `dbEntry.name` we will get `“John Jack Doe”` and if we set `dbEntry.name = 'John Stuart Mill'` we can see that our name data in `dbEntry._` does indeed change.

One of the really nice things about accessor descriptors is that they allow for side effects. In either the `get` or `set` functions we could have performed API calls, logged to the console, or done some kind of processing on the input/output (to name just a few) each time it was called.

So let’s do that. Whenever `dbEntry.name` is set or retrieved, we will set the respective `lastAccessed` and `lastModified` properties on that object. Since we said `dbEntry.name` was still **configurable**, adding this functionality is simply a matter of redefining its property descriptor.

```js
Object.defineProperties(dbEntry, {
  lastAccessed: {
    value: Date.now(),
    writable: true,
    configurable: false,
    enumerable: true,
  },
  lastModified: {
    value: Date.now(),
    writable: true,
    configurable: false,
    enumerable: true,
  },
  name: {
    enumerable: true,
    configurable: false,
    get() {
      this.lastAccessed = Date.now()
      const { firstname, middlename, lastname } = this._
      return `${firstname} ${middlename} ${lastname}`
    },
    set(newName) {
      this.lastModified = Date.now()
      const [firstname, middlename, lastname] = newName.split(' ')
      this._.firstname = firstname
      this._.middlename = middlename
      this._.lastname = lastname
    },
  },
})
```

Now every time we retrieve or set our entry’s **name**, we will initiate a side effect to update when that record was last modified or accessed.

Also, we set `configurable: false` on our `name` property so now we can no longer change it. Furthermore, had we not made `birthdate` and `ssn` non-configurable we could change them to getters and setters to similarly update `lastAccessed` and `lastModified`.

### Adding Metaprogramming With Symbols

We’ve shown a number of interesting ways we can empower our objects to do more than we normally do using just typical assignment (e.g., `obj.a = 3`), and the fact that we can do anything we want in a getter or setter is a pretty powerful feature.

But **we can improve our database entry even further** by tacking on to it well-known symbols. I won’t go into what a `Symbol` is, but the well-known (i.e., `global`) symbols allow for an object’s behavior to change depending on the context of the code it finds itself in.

#### `Symbol.iterator`

In a prior article, I talked about how to make objects iterable using `Symbol.iterator`. That will be handy functionality to have so let’s open up iterability:

```js
Object.defineProperty(dbEntry, Symbol.iterator, {
  value: function* () {
    yield this.id
    yield this.name
    yield this.birthdate
    yield this.ssn
    yield this.lastAccessed
    yield this.lastModified
  },
})
```

#### Now we can programmatically cycle through our keys in a well defined order.

We could have also used `Object.keys` rather than defining `Symbol.iterator`, but because `Object.keys` **doesn’t guarantee an order**, it has less utility to us when it comes to a feature we want to build on top of this one.

#### Symbol-based properties are not writable, enumerable, or configurable — even if you pass those flags as true in the descriptor.

The real advantage on having iterability is because there is a very neat `Symbol` that **allows us to coerce an object into string or numeric primitives based on a “hint” supplied by the JavaScript engine** (a `hint` that is determined by what type of operation is being performed on the object).

#### `Symbol.toPrimitive`

Having worked with **Python** and **Ruby**, I have always loved being able to define custom behavior for adding two classes together, and this is a step in the same direction.

So, let’s define how to primitivize our object.

```js
Object.defineProperty(dbEntry, Symbol.toPrimitive, {
  value: function (hint) {
    if (hint === 'string') {
      return [...this].join(', ')
    }
    return NaN
  },
})
```

Now, when our `dbEntry` finds itself in a “stringifying” environment, it will return a comma-separated list of all the properties we defined in the `Symbol.iterator` property. As far as I know, the only such environment is string interpolation. I.e., executing something like:

```js
console.log(`${dbEntry}`)
```

All other situations will return `NaN`. Which makes sense, because it doesn’t really make much sense to define behavior for something like `dbEntry + 1`, although if it did we would want to add something for `hint === 'number'`.

### Coming Full Circle

We initially started this trek because we couldn’t use the `...` rest operator in object destructuring.

Let’s now see what we get when we try to use it:

```js
const { id, ...rest } = dbEntry

console.log(id)
// => 1

console.log(rest)
// => {
//     birthdate: '01/21/1980',
//     lastAccessed: 1540940075708,
//     lastModified: 1540940079708,
//     name: 'John Stuart Mill',
//     ssn: '123-45-6789'
// }
```

Note that neither our `_` property nor our well-known symbols are in our `rest` object because they are all non-enumerable.

However it is possible to specifically pluck them off our object.

```js
const { [Symbol.iterator]: iterator, _ } = dbEntry

console.log(iterator)
// => f* () { ... }

console.log(_)
// => {
//  firstname: 'John',
//  middlename: 'Stuart',
//  lastname: 'Mill'
// }
```

### A Couple Last Words

If you define a property to be **writable but not configurable**, you can actually go back and update that property’s configuration and turn off writability (as well as set for one last time its value).

If you try to **reassign a value to a property whose writable flag is set to false**, the operation fails silently unless you are in strict mode — in which case you’ll get a `TypeError`.

We could have defined our well-known symbol properties directly on our object rather than using `Object.defineProperty` and we would get the exact same configuration of the property descriptor.

There is a lot of freedom in implementing out own custom property descriptors (especially accessors), and the things you could do with them is really only limited by your imagination.

Features we didn’t have time to implement would be much more elaborate post-processing of data after we set it on a property (e.g., data sanitization/validation) or pre-processing it for a get (e.g., checking a user’s security credentials and masking it if they are not authorized to view that piece of data).

### Credits

From the article [Enhancing JavaScript Objects with Descriptors and Symbols](https://itnext.io/enhancing-javascript-objects-with-descriptors-and-symbols-2cdc95e9b422) written by [@ryandabler](https://github.com/ryandabler)
