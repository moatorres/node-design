function PersonBuilder() {
  this.person = {}

  this.setName = (name) => {
    this.person.name = name
    return this
  }

  this.setAge = (age) => {
    this.person.age = age
    return this
  }

  this.setLocation = (location) => {
    this.person.location = location
    return this
  }

  this.setLanguages = (languages) => {
    this.person.languages = languages
    return this
  }

  this.buildInfo = () => this.person
}

const jack = new PersonBuilder()
  .setName('Jack')
  .setAge(25)
  .setLanguages(['English', 'German'])
  .buildInfo()

console.log(jack)
