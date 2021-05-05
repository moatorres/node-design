# Design Patterns

## Class Decorator

```js
class User {
  constructor(firstName, lastName, title) {
    this.firstName = firstName
    this.lastName = lastName
    this.title = title
  }

  getFullName() {
    return `${this.firstName} ${this.lasName}`
  }
}
```

```js
class UserDecorator {
  constructor(user) {
    this.user = user
  }

  getFullName() {
    return this.user.getFullName()
  }
}
```

```js
class UserFullNameWithTitleDecorator extends UserDecorator {
  getFullName() {
    return `${this.user.title} ${this.user.getFullName()}`
  }
}
```

### Usage

```js
const user = new User('Moka', 'Floca', 'Mr')
user.getFullName()

const decoratedUser = new UserFullNameWithTitleDecorator(user)
decoratedUser.getFullName()
```

### Credits

From this [article](https://javascript.plainenglish.io/javascript-design-patterns-the-decorator-pattern-eaf6adc77cb7) written by [Arthur Frank]()
