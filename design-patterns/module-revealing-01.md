# Design Patterns

## Revealing Module Pattern

In the **Revealing Module pattern** we define all of our functions and variables in the private scope and **return an anonymous object with pointers to the private functionality** we wished to reveal as public.

```js
const myRevealingModule = (function () {
  let privateVar = 'Ben Nevis'
  let publicVar = 'Hello!'

  function privateFunction() {
    console.log('Name:' + privateVar)
  }

  function publicSetName(strName) {
    privateVar = strName
  }

  function publicGetName() {
    privateFunction()
  }

  return {
    setName: publicSetName,
    greeting: publicVar,
    getName: publicGetName,
  }
})()

myRevealingModule.setName('Sidarta Gautama')
```

The pattern can also be used to reveal private functions and properties with a more specific naming scheme if we would prefer:

```js
const myRevealingModule = (function () {
  let privateCounter = 0

  function privateFunction() {
    privateCounter++
  }

  function publicFunction() {
    publicIncrement()
  }

  function publicIncrement() {
    privateFunction()
  }

  function publicGetCount() {
    return privateCounter
  }

  return {
    start: publicFunction,
    increment: publicIncrement,
    count: publicGetCount,
  }
})()

myRevealingModule.start()
```

**Advantages**

This pattern allows the syntax of our scripts to be more consistent. It also makes it more clear at the end of the module which of our functions and variables may be accessed publicly which eases readability.

**Disadvantages**

A disadvantage of this pattern is that if a private function refers to a public function, that public function can't be overridden if a patch is necessary. This is because the private function will continue to refer to the private implementation and the pattern doesn't apply to public members, only to functions.

Public object members which refer to private variables are also subject to the no-patch rule notes above.

As a result of this, modules created with the Revealing Module pattern may be more fragile than those created with the original Module pattern, so care should be taken during usage.

### Credits

From the book [Essential JS Design Patterns](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript) written by [Addy Osmani](https://addyosmani.com)
