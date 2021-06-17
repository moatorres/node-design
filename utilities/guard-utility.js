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
    let bulk = []
    for (let arg of args) {
      const result = againstNullOrUndefined(arg.value, arg.key)

      if (!result.success) bulk.push(result)
      // if (!result.success) return result
    }

    return bulk
    // return success
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
  firstName: '',
  lastName: '',
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
// const arr = Guard.combine(teste)
console.log(teste) // => { success: true }
// console.log(arr) // => { success: true }

// const testa = Guard.againstNullOrUndefined(props.lastName, 'lastName')
// console.log(testa) // => { success: true }

// const taste = Guard.isOneOf(props.email, ['moka@moka.com', 'jabuti'], 'email')
// console.log(taste) // => { success: true }

// const toast = Guard.inRange(props.age, 4, 10, 'age')
// console.log(toast) // => { success: true }

// const tosta = Guard.allInRange([5, 6, 7], 4, 10, 'age')
// console.log(tosta) // => { success: true }
