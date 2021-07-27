# Utilities

## JavaScript `Stack` Custom Type

Stacks and queues are opposite methods of treating incoming data, particularly when they need to be removed in a particular order. They are generally considered less as data structures and more as abstract data types, meaning they represent a particular usage rather than an exact structure. So they are more of a pattern that is implementable in many different ways with other data structures like arrays, linked lists, and even trees.

### Stacks

Stacks are considered a LIFO structure, meaning last in first out. We add items to our stack and if some other condition is met, like a timer ran out or a task was completed, the most recently added item is the first to be removed and is the only one that we can interact with. I like to visualize this as washing and drying a stack of plates, as you add to the top of the stack you are restricted to only working with the topmost plate before you have access to the rest.

You’ve already been using stacks a lot, like with the recursion call stack or the standard JavaScript call stack when you make asynchronous requests. The need to strictly control the order of operations in this way is extremely common and will even help us in some less intuitive ways like traversing trees and ranking search results.

The most basic version of this would just be with a simple array. Stacks with an array implementation is only O(1), same as with a linked list since we’re only manipulating the tail and nothing needs to be re-indexed. We can just use our normal push and pop methods to get this done. As long as we only used these two functions to interact with our data we would technically have a functional stack, even if a bit lackluster.

```js
const stack = []

const add = (val) => stack.push(val)
const remove = () => stack.pop()

add('one')
add('two')
add('three')
remove()
console.log(stack) // ["one", "two"]
```

Linked lists are a bit more complicated, we have our normal nodes with only the one pointer and some add and remove methods. If there’s nothing in the list set it as the `head` and `tail` or `null`, else change the pointer on the item before it. It doesn’t matter if we’re adding/removing on the `head` or `tail`, as long as that’s the only one we’re interacting with.

This method would be preferred if you were hooked up to a database that contained a lot of nodes. Since arrays are loaded in at a fixed size, linked lists would be better to load-in only necessary chunks of data.

```js
class Node {
  constructor(val) {
    this.val = val
    this.next = null
  }
}

class Stack {
  constructor() {
    this.head = null
    this.tail = null
    this.length = 0
  }
  add(val) {
    const newNode = new Node(val)

    if (!this.head) {
      this.head = newNode
      this.tail = newNode
    } else {
      const temp = this.head
      this.head = newNode
      this.head.next = temp
    }

    this.length++
    return this
  }
  remove() {
    if (!this.head) return null

    let temp = this.head
    this.head = this.head.next

    this.length--
    return temp.val
  }
}
```

#### Usage

```js
let stack = new Stack()
stack.add('one')
stack.add('two')
stack.add('three')
stack.remove()
console.log(stack) // two -> one
```

### Queues

Queues are the reverse of stacks with a **FIFO** structure, meaning _first in first out_. This is exactly like standing in line, you showed up first so you get to go first.

Likewise we can still do an array implementation, but this time it’s different. Since we’re working from the beginning when we remove something, every removal means our computer needs to loop through the rest of the array and re-index everything, giving us O(n).

```js
const queue = []

const add = (val) => queue.push(val)
const remove = () => queue.shift()

add('one')
add('two')
add('three')
remove()
console.log(queue) // ["two", "three"]
```

In this case linked lists are almost always superior for dealing with larger amounts of data since it avoids the re-indexing problem.

It doesn’t matter which end we add to as long as we remove from the other, in this case we’ll add to the `tail` and remove the `head`.

```js
class Queue {
  constructor() {
    this.head = null
    this.tail = null
    this.length = 0
  }
  enqueue(val) {
    const newNode = new Node(val)

    if (!this.head) {
      this.head = newNode
      this.tail = newNode
    } else {
      this.tail.next = newNode
      this.tail = newNode
    }

    this.length++
    return this
  }
  dequeue() {
    if (!this.head) return null
    if (this.head === this.tail) this.last = null
    let temp = this.head
    this.head = this.head.next

    this.length--
    return temp.val
  }
}
```

#### Usage

```js
let queue = new Queue()

queue.enqueue('one')
queue.enqueue('two')
queue.enqueue('three')
queue.dequeue()

console.log(queue) // two -> three
```

### Closing Thoughts

This may seem like making splitting hairs from our normal linked lists and arrays, but as we progress to increasingly sophisticated structures, stacks and queues will become an essential component to how we structure and traverse data.

### Credits

From the article [Exploring Stacks and Queues via JavaScript](https://www.digitalocean.com/community/tutorials/js-stacks-queues) written by [@JoshuaHall](https://github.com/JoshuaHall)
