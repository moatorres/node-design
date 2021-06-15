let uuid = {
  v4: () => '123afb123',
}

class UniqueID {
  static generate() {
    return uuid.v4()
  }
}

const id = UniqueID.generate()

console.log(id)
