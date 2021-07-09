const chocolate = { hasChocolate: () => true }
const caramelSwirl = { hasCaramelSwirl: () => true }
const pecans = { hasPecans: () => true }

const iceCream = Object.assign({}, chocolate, caramelSwirl, pecans)
// or: const iceCream = { ...chocolate, ...caramelSwirl, ...pecans }

console.log(`
  hasChocolate: ${iceCream.hasChocolate()}
  hasCaramelSwirl: ${iceCream.hasCaramelSwirl()}
  hasPecans: ${iceCream.hasPecans()}
`)

const flying = (o) => {
  let isFlying = false
  return Object.assign({}, o, {
    fly() {
      isFlying = true
      return this
    },
    isFlying: () => isFlying,
    land() {
      isFlying = false
      return this
    },
  })
}

const bird = flying({})

console.log(bird.isFlying()) // => false
console.log(bird.fly().isFlying()) // => true
console.log(bird.land().isFlying()) // => false
