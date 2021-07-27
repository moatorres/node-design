const greeterFactory = (
  greeting = 'Hello',
  name = 'World',
  punctuation = '!'
) => ({
  greet: () => `${greeting}, ${name}${punctuation}`,
})

const unhappy = (greeter) => (greeting, name) => greeter(greeting, name, ':(')

console.log(unhappy(greeterFactory)('Hello', 'everyone').greet())
// => Hello, everyone :(

const enthusiastic = (greeter) => (greeting, name) => ({
  greet: () => greeter(greeting, name, '!!').greet().toUpperCase(),
})

console.log(enthusiastic(greeterFactory)().greet())
// => HELLO, WORLD!!

const aggressiveGreeterFactory = enthusiastic(unhappy(greeterFactory))

console.log(aggressiveGreeterFactory("You're late", 'Jim').greet())
