const createPerson = (name) => {
  const props = {}

  const person = {
    setName(name) {
      if (!name) throw new Error('A person must have a name')
      props.name = name
    },
    getName: () => props.name,
  }

  person.setName(name)
  return person
}

const person = createPerson('John Wick')

console.log(person.getName(), person)
