// base class
class Customer {
  constructor(builder) {
    this.name = builder.name
    this.age = builder.age
    this.location = builder.location
    this.languages = builder.languages
  }

  showInfo() {
    console.log(this)
  }
}

// builder
class CustomerBuilder {
  constructor(name) {
    this.name = name
  }

  setAge(age) {
    this.age = age
    return this
  }

  setLocation(location) {
    this.location = location
    return this
  }

  setLanguages(languages) {
    this.languages = languages
    return this
  }

  buildInfo() {
    return new Customer(this)
  }
}

// usage
const jack = new CustomerBuilder('Jack')
  .setAge(25)
  .setLanguages(['English', 'German'])
  .buildInfo()

jack.showInfo()

const adam = new CustomerBuilder('Adam')
  .setLocation('US')
  .setLanguages(['English'])
  .buildInfo()

adam.showInfo()
