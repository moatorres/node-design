class Result {
  constructor(isSuccess, error, value) {
    if (isSuccess && error) {
      throw new Error(
        'InvalidOperation: A result cannot be successful and contain an error'
      )
    }
    if (!isSuccess && !error) {
      throw new Error(
        'InvalidOperation: A failing result needs to contain an error message'
      )
    }

    this.isSuccess = isSuccess
    this.isFailure = !isSuccess
    this.error = error
    this.value = value

    Object.freeze(this)
  }

  getValue() {
    if (!this.isSuccess) {
      console.log(this.error)
      throw new Error(
        "Can't get the value of an error result. Use 'errorValue' instead."
      )
    }

    return this._value
  }

  errorValue() {
    return this.error
  }

  static ok(value) {
    return new Result(true, null, value)
  }

  static fail(error) {
    return new Result(false, error)
  }

  static combine(results) {
    for (let result of results) {
      if (result.isFailure) return result
    }
    return Result.ok()
  }
}

class Left {
  constructor(value) {
    this.value = value
  }

  isLeft() {
    return this.value instanceof Left
  }

  isRight() {
    return this.value instanceof Left
  }
}

class Right {
  constructor(value) {
    this.value = value
  }

  isLeft() {
    return this.value instanceof Right
  }

  isRight() {
    return this.value instanceof Right
  }
}

const left = (l) => {
  return new Left(l)
}

const right = (a) => {
  return new Right(a)
}

const guardResult = false

if (!guardResult) {
  console.log(
    Result.fail({
      message: 'bla',
    })
  )
}
