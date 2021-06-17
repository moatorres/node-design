# Functional Programming

## Mapper

Converts one type of object to another, in this case to/from our Models to plain API response objects.

### `mappingReducer`

- **`sourceObj`**
  The source object, either a Model or a plain API response object

- **`mapping`**
  An array of arrays, the inner arrays containing key mappings between objects. Inner arrays can be either `['modelPropertyKey', ['apiPropertyKey']` or `['modelPropertyKey', apiToModelTransformer(), modelToApiTransformer()]`

- **`isMappingModelToApi`**
  True if we are taking a Model object an mapping to an API response object, otherwise false.

```js
import assign from 'lodash/assign'

function mappingReducer(sourceObj, mapping, isMappingModelToApi) {
  const sourceMapIndex = isMappingModelToApi ? 0 : 1
  const targetMapIndex = isMappingModelToApi ? 1 : 0
  const lambdaMapIndex = isMappingModelToApi ? 2 : 1

  // map the source property to the target property
  return mapping.reduce((targetObj, mapEl) => {
    if (mapEl.length === 3) {
      if (mapEl[lambdaMapIndex] !== null) {
        const result = mapEl[lambdaMapIndex](sourceObj)
        assign(targetObj, result)
      }
    } else {
      targetObj[mapEl[targetMapIndex]] = sourceObj[mapEl[sourceMapIndex]]
    }

    return targetObj
  }, {})
}
```

### `mapModelToApi`

- **`model`**
  The model to convert to a POJO

- **`modelMap`**
  An array of arrays, the inner arrays containing key mappings between objects. Inner arrays can be either `['modelPropertyKey', ['apiPropertyKey']` or `['modelPropertyKey', apiToModelTransformer(), modelToApiTransformer()]`

```js
export function mapModelToApi(model, modelMap) {
  return mappingReducer(model, modelMap, true)
}
```

### `mapApiToModel`

- **`apiObject`**
  The API response to convert to a Model

- **`modelMap`**
  An array of arrays, the inner arrays containing key mappings between objects. Inner arrays can be either `['modelPropertyKey', ['apiPropertyKey']` or `['modelPropertyKey', apiToModelTransformer(), modelToApiTransformer()]`

- **`modelPrototype`**
  The type of model we are creating (e.g., User)

```js
export function mapApiToModel(apiObject, modelMap, modelPrototype) {
  const data = mappingReducer(apiObject, modelMap, false)
  return new modelPrototype(data)
}
```

#### Usage

```js
import User, { userToApiMap } from './User.js'
import { mapModelToApi, mapApiToModel } from '../modelMapper.js'

const apiResponse = {
  id: 123,
  userName: 'Bob',
  user_perms: ['admin', 'update'],
}

// console.log(apiResponse)

const modelExample = new User({
  id: 456,
  username: 'Joe',
  isAdmin: true,
  permissions: ['read', 'delete'],
})

// console.log(modelExample)

const convertedModel = mapApiToModel(apiResponse, userToApiMap, User)
console.log(convertedModel)

const apiObject = mapModelToApi(modelExample, userToApiMap)
console.log(apiObject)
```

### Credits

From this [repo](https://github.com/jlyman/simple-model-mapper) written by [@jlyman](https://github.com/jlyman)
