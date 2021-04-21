### Error Handling clean architecture implementation in TypeScript

#### Value object

```ts
class CityName {
  static readonly MIN_LEN_NAME: number = 3
  static readonly MAX_LEN_NAME: number = 100

  private constructor(private _name: string) {}

  // factory method with validation rules
  static create(name: string): [CityName, Error] {
    if (
      name == null ||
      name.trim().length < CityName.MIN_LEN_NAME ||
      name.trim().length > CityName.MAX_LEN_NAME
    ) {
      return [null, new InvalidNameError(name)]
    }

    // no validation errors
    return [new CityName(name), null]
  }

  get name(): string {
    return this._name
  }
}
```

#### Validation error

```ts
class InvalidNameError extends Error {
  constructor(name: string) {
    super(`The name "${name}" is not valid!`)
  }
}
```

#### Usage

```ts
// input
const text = prompt('Type the city name: ')

// how to use
const [city, error] = CityName.create(text)

if (error != null) {
  alert(`Error: ${error.message}`)
} else {
  alert(`Welcome to ${city.name}`)
}
```

### Credits

From this [gist](https://gist.github.com/pauloafpjunior/053375a6821d7e305a31d13d0b12345c) written by [@pauloafpjunior](https://github.com/pauloafpjunior/)
