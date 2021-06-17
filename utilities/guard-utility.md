### JavaScript Functional Programming

Creates a `function` that exposes the `Guard` methods

```js
function makeGuard() {
  const success = {
    success: true,
  }

  const combine = (guardResults) => {
    for (let result of guardResults) {
      if (result.success === false) return result
    }

    return success
  }

  const againstNullOrUndefined = (value, key) => {
    const notValid = value === null || value === undefined || value === ''

    if (notValid) {
      return {
        success: false,
        message: `${key} is null or undefined`,
      }
    } else {
      return success
    }
  }

  const againstNullOrUndefinedBulk = (args) => {
    for (let arg of args) {
      const result = againstNullOrUndefined(arg.value, arg.key)
      if (!result.success) return result
    }

    return success
  }

  const isOneOf = (value, validValues, key) => {
    let isValid = false

    for (let validValue of validValues) {
      if (value === validValue) {
        isValid = true
      }
    }

    if (isValid) {
      return success
    } else {
      return {
        success: false,
        message: `${key} isn't oneOf the correct types in ${JSON.stringify(
          validValues
        )}. Got "${value}".`,
      }
    }
  }

  const inRange = (num, min, max, key) => {
    const isInRange = num >= min && num <= max

    if (!isInRange) {
      return {
        success: false,
        message: `${key} is not within range ${min} to ${max}.`,
      }
    } else {
      return success
    }
  }

  const allInRange = (numbers, min, max, key) => {
    let failingResult = null

    for (let num of numbers) {
      const numIsInRangeResult = inRange(num, min, max, key)

      if (!numIsInRangeResult.success) failingResult = numIsInRangeResult
    }

    if (failingResult) {
      return {
        success: false,
        message: `${key} is not within the range.`,
      }
    } else {
      return success
    }
  }

  return Object.freeze({
    combine,
    againstNullOrUndefined,
    againstNullOrUndefinedBulk,
    isOneOf,
    inRange,
    allInRange,
  })
}

const Guard = makeGuard()

const props = {
  firstName: 'Moka',
  lastName: 'Floca',
  email: 'moka@moka.com',
  isEmailVerified: false,
  age: 10,
}

const guardedProps = [
  {
    value: props.firstName,
    key: 'firstName',
  },
  {
    value: props.lastName,
    key: 'lastName',
  },
  {
    value: props.email,
    key: 'email',
  },
  {
    value: props.isEmailVerified,
    key: 'isEmailVerified',
  },
]

const teste = Guard.againstNullOrUndefinedBulk(guardedProps)
console.log(teste) // => { success: true }

const testa = Guard.againstNullOrUndefined(props.lastName, 'lastName')
console.log(testa) // => { success: true }

const taste = Guard.isOneOf(props.email, ['moka@moka.com', 'jabuti'], 'email')
console.log(taste) // => { success: true }

const toast = Guard.inRange(props.age, 4, 10, 'age')
console.log(toast) // => { success: true }

const tosta = Guard.allInRange([5, 6, 7], 4, 10, 'age')
console.log(tosta) // => { success: true }
```

### JavaScript OOP

Creates a `class` that exposes the `Guard` methods

```js
export class Guard {

  public static combine (guardResults) {
    for (let result of guardResults) {
      if (result.success === false) return result;
    }

    return { success: true };
  }

  public static againstNullOrUndefined (value, key) {
    if (value === null || value === undefined) {
      return { success: false, message: `${key} is null or undefined` }
    } else {
      return { success: true }
    }
  }

  public static againstNullOrUndefinedBulk(args) {
    for (let arg of args) {
      const result = this.againstNullOrUndefined(arg.value, arg.key);
      if (!result.success) return result;
    }

    return { success: true }
  }

  public static isOneOf (value, validValues, key)  {
    let isValid = false;
    for (let validValue of validValues) {
      if (value === validValue) {
        isValid = true;
      }
    }

    if (isValid) {
      return { success: true }
    } else {
      return {
        success: false,
        message: `${key} isn't oneOf the correct types in ${JSON.stringify(validValues)}. Got "${value}".`
      }
    }
  }

  public static inRange (num, min, max, key)  {
    const isInRange = num >= min && num <= max

    if (!isInRange) {
      return { success: false, message: `${key} is not within range ${min} to ${max}.`}
    } else {
      return { success: true }
    }
  }

  public static allInRange (numbers, min, max, key)  {
    let failingResult = null
    for(let num of numbers) {
      const numIsInRangeResult = this.inRange(num, min, max, key)
      if (!numIsInRangeResult.success) failingResult = numIsInRangeResult
    }

    if (failingResult) {
      return { success: false, message: `${key} is not within the range.`}
    } else {
      return { success: true }
    }
  }
}
```

### TypeScript OOP

Creates a `class` that exposes the `Guard` methods with `types` and `interfaces`

```ts
export interface IGuardResult {
  success: boolean
  message?: string
}

export interface IGuardArgument {
  value: any
  key: string
}

export type GuardArgumentCollection = IGuardArgument[]

export class Guard {
  public static combine(guardResults: IGuardResult[]): IGuardResult {
    for (let result of guardResults) {
      if (result.success === false) return result
    }

    return { success: true }
  }

  public static againstNullOrUndefined(value: any, key: string): IGuardResult {
    if (value === null || value === undefined) {
      return { success: false, message: `${key} is null or undefined` }
    } else {
      return { success: true }
    }
  }

  public static againstNullOrUndefinedBulk(
    args: GuardArgumentCollection
  ): IGuardResult {
    for (let arg of args) {
      const result = this.againstNullOrUndefined(arg.value, arg.key)
      if (!result.success) return result
    }

    return { success: true }
  }

  public static isOneOf(
    value: any,
    validValues: any[],
    key: string
  ): IGuardResult {
    let isValid = false
    for (let validValue of validValues) {
      if (value === validValue) {
        isValid = true
      }
    }

    if (isValid) {
      return { success: true }
    } else {
      return {
        success: false,
        message: `${key} isn't oneOf the correct types in ${JSON.stringify(
          validValues
        )}. Got "${value}".`,
      }
    }
  }

  public static inRange(
    num: number,
    min: number,
    max: number,
    key: string
  ): IGuardResult {
    const isInRange = num >= min && num <= max
    if (!isInRange) {
      return {
        success: false,
        message: `${key} is not within range ${min} to ${max}.`,
      }
    } else {
      return { success: true }
    }
  }

  public static allInRange(
    numbers: number[],
    min: number,
    max: number,
    key: string
  ): IGuardResult {
    let failingResult: IGuardResult = null
    for (let num of numbers) {
      const numIsInRangeResult = this.inRange(num, min, max, key)
      if (!numIsInRangeResult.success) failingResult = numIsInRangeResult
    }

    if (failingResult) {
      return { success: false, message: `${key} is not within the range.` }
    } else {
      return { success: true }
    }
  }
}
```
