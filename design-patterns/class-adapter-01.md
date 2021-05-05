# Design Patterns

## Class Adapter

```js
import { v4 as uuidv4 } from 'uuid'

class UniqueID {
  generate() {
    return uuidv4()
  }
}

export default new UniqueID()
```

### Usage

```js
import UniqueID from './UniqueID.js'

const id = UniqueID.generate()
// =>
```

### Credits

From this [article](https://javascript.plainenglish.io/javascript-design-patterns-adapter-explained-cbcffbb4b8bc) written by [Arthur Frank]()
