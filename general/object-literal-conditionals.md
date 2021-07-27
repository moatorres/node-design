# Utilities

## Object Literal Conditionals

Writing complex conditionals in JavaScript has always had the potential to create some pretty messy code. Long lists of `if/else` statements or `switch` cases can get bloated quickly.

### `if/else`

This isn’t great. Not only is it not very readable, but we are also repeating `toLowerCase()` for every statement.

```js
function getTranslation(rhyme) {
  if (rhyme.toLowerCase() === 'apples and pears') {
    return 'Stairs'
  } else if (rhyme.toLowerCase() === 'hampstead heath') {
    return 'Teeth'
  } else if (rhyme.toLowerCase() === 'loaf of bread') {
    return 'Head'
  } else if (rhyme.toLowerCase() === 'pork pies') {
    return 'Lies'
  } else if (rhyme.toLowerCase() === 'whistle and flute') {
    return 'Suit'
  }

  return 'Rhyme not found'
}
```

### `switch`

We could avoid that repetition by assigning the lowercased rhyme to a variable at the start of the function or alternatively use a `switch` statement, which would look like this:

```js
function getTranslation(rhyme) {
  switch (rhyme.toLowerCase()) {
    case 'apples and pears':
      return 'Stairs'
    case 'hampstead heath':
      return 'Teeth'
    case 'loaf of bread':
      return 'Head'
    case 'pork pies':
      return 'Lies'
    case 'whistle and flute':
      return 'Suit'
    default:
      return 'Rhyme not found'
  }
}
```

### `object-literal`

You can use **an object to achieve the same functionality** as above in a much neater way. Let’s have a look at the example below.

The final part of *line 10* `?? “Rhyme not found”` uses [**nullish coalescing**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator) to assign a default response.

```js
// nullish coalescing
function getTranslationMap(rhyme) {
  const rhymes = {
    'apples and pears': 'Stairs',
    'hampstead heath': 'Teeth',
    'loaf of bread': 'Head',
    'pork pies': 'Lies',
    'whistle and flute': 'Suit',
  }

  return rhymes[rhyme.toLowerCase()] ?? 'Rhyme not found'
}
```

There are times when you might need to do some more complex logic inside your conditions. To achieve this, **you can pass a function as the value to your object keys** and execute the response:

We are selecting the calculation we want to do and executing the response, passing the two numbers. You can use [**optional chaining**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) (the `?.` in the last line of code) to only execute the response if it is defined. Otherwise, fall through to the default return string.

```js
// optional chaining
function calculate(num1, num2, action) {
  const actions = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b,
  }

  return actions[action]?.(num1, num2) ?? 'Calculation is not recognised'
}
```

This means that if `rhymes[rhyme.toLowercase()]` is `null` or `undefined` (but not `false` or `0`), then the default string `“Rhyme not found”` is returned.

This is important because we might legitimately want to return `false` or `0` from our conditional. For example:

```js
function stringToBool(str) {
  const boolStrings = {
    true: true,
    false: false,
  }

  return boolStrings[str] ?? 'String is not a boolean value'
}
```

### Credits

From the article [Don’t Use If-Else and Switch in JavaScript, Use Object Literals](https://betterprogramming.pub/dont-use-if-else-and-switch-in-javascript-use-object-literals-c54578566ba0) written by [@jogilvyt](https://github.com/jogilvyt)
