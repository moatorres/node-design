class User {
  constructor(firstName, lastName, title) {
    this.firstName = firstName
    this.lastName = lastName
    this.title = title
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`
  }
}

class UserDecorator {
  constructor(user) {
    this.user = user
  }

  getFullName() {
    return this.user.getFullName()
  }
}

class UserFullNameWithTitleDecorator extends UserDecorator {
  getFullName() {
    return `${this.user.title} ${this.user.getFullName()}`
  }
}

const user = new User('Moka', 'Floca', 'Mr')

const decoratedUser = new UserFullNameWithTitleDecorator(user)

console.log(decoratedUser.getFullName())
