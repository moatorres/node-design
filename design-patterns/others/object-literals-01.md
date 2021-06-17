# Design Pattern

## Object Literals

In object literal notation, an object is described as a set of comma-separated name/value pairs enclosed in curly braces `{}`. Names inside the object may be either strings or identifiers that are followed by a colon. There should be no comma used after the final name/value pair in the object as this may result in errors.

```js
var myObjectLiteral = {
  variableKey: variableValue,

  functionKey: function () {
    // ...
  },
}
```

Object literals don't require instantiation using the `new` operator but shouldn't be used at the start of a statement as the opening `{` may be interpreted as the beginning of a block. Outside of an object, new members may be added to it using assignment as follows `myModule.property = "someValue"`.

Below we can see a more complete example of a module defined using object literal notation:

```js
export const myModule = {
  myProperty: 'someValue',

  // object for module configuration
  myConfig: {
    useCaching: true,
    language: 'en',
  },

  // basic method
  saySomething: function () {
    console.log('Where in the world is Paul Irish today?')
  },

  // output a value based on the current configuration
  reportMyConfig: function () {
    console.log(
      'Caching is: ' + (this.myConfig.useCaching ? 'enabled' : 'disabled')
    )
  },

  // override the current configuration
  updateMyConfig: function (newConfig) {
    if (typeof newConfig === 'object') {
      this.myConfig = newConfig
      console.log(this.myConfig.language)
    }
  },
}
```

### Usage

```js
myModule.saySomething()
// => 'Where in the world is Paul Irish today?'

myModule.reportMyConfig()
// => 'Caching is: enabled'

myModule.updateMyConfig({
  language: 'fr',
  useCaching: false,
})
// => 'fr'

myModule.reportMyConfig()
// => 'Caching is: disabled'
```

### Credits

From the book [Essential JS Design Patterns](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript) written by [Addy Osmani](https://addyosmani.com)
