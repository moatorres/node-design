# Functional Programming

## Custom Data Types

In JavaScript, the easiest way to compose is function composition, and a `function` is just an `object` you can add methods to. In other words, you can do this:

```js
const t = (value) => {
  const fn = () => value
  fn.toString = () => `t(${value})`
  return fn
}

const someValue = t(2)

console.log(
  someValue.toString() // "t(2)"
)
```

This is a factory that returns instances of a numerical data type, `t`. But notice that those instances aren’t simple objects. Instead, they’re functions, and like any other function, you can compose them.

```js
const assert = ({ given, should, actual, expected }) => {
  if (actual.toString() !== expected.toString()) {
    throw new Error(
      `NOT OK: Given ${given}, should ${should}
      Expected: ${expected} Actual: ${actual}`
    )
  }

  console.log(`OK: Given ${given}, should ${should}`)
}
```

#### Example A

```js
const given = 'a value `t(x)` composed with `t(0)`'
const should = 'be equivalent to `t(x)`'
const x = 20

const actual = t(x)(t(0))
const expected = t(x)

assert({
  given,
  should,
  actual,
  expected,
})
```

#### Example B

```js
const given = 'a value `t(x)` composed with `t(1)`'
const should = 'be equivalent to `t(x + 1)`'
const [a, b, c] = [1, 2, 3]

const actual = t(x)(t(1))
const expected = t(x + 1)
assert({
  given,
  should,
  actual,
  expected,
})
```

These examples will fail at first:

`NOT OK: a value t(x) composed with t(0) === t(x)`
`Expected: t(20)`
`Actual: 20`

But we can make them pass with 3 simple steps:

- Change the `fn` function into an `add` function that returns `t(value + n)` where `n` is the passed argument
- Add a `valueOf()` method to the `t` type so that the new `add()` function can take instances of `t()` as arguments. The `+` operator will use the result of `n.valueOf()` as the second operand
- Assign the methods to the `add()` function with `Object.assign()`

When you put it all together, it looks like this:

```js
const t = (value) => {
  const add = (n) => t(value + n)

  return Object.assign(add, {
    toString: () => `t(${value})`,
    valueOf: () => value,
  })
}
```

And then the tests pass:

```js
assert({
  given,
  should,
  actual,
  expected,
})

// => OK: a value t(x) composed with t(0) ==== t(x)
// => OK: a value t(x) composed with t(1) ==== t(x + 1)
```

Now you can compose values of `t()` with function composition:

```js
// compose from top to bottom
const pipe = (...fns) => (x) => fns.reduce((y, f) => f(y), x)

// sugar to kick off the pipeline with an initial value:
const add = (...fns) => pipe(...fns)(t(0))

const sum = add(t(2), t(4), t(-1))

console.log(sum.toString()) // => t(5)
```

It doesn’t matter what shape your data takes, as long as there is some composition operation that makes sense. For lists or strings, it could be concatenation. For Digital Signal Processing (DSP), it could be signal summing.

#### You can do this with any data type

Of course lots of different operations might make sense for the same data. The question is, _which operation best represents the concept of composition_?

In other words, _which operation would benefit most expressed like this_:

```js
const result = compose(value1, value2, value3)
```

### Credits

From the book [Composing Software](https://www.amazon.com/Composing-Software-Exploration-Programming-Composition/dp/1661212565) written by [@ericelliott](https://github.com/ericelliott)
