const isObject = (value) => value instanceof Object && typeof value === 'object'
const isFunction = (value) =>
  value instanceof Function && typeof value === 'function'
const isArray = (value) => value instanceof Array && Array.isArray(value)
const isString = (value) => typeof value === 'string'

function getPropValue(current, parent, path) {
  let value = parent

  if (path.startsWith('$.')) {
    path = path.substr(2)
    value = current
  }

  const nestedProps = path.split('.')

  for (let prop of nestedProps) {
    if (!isObject(value)) return
    value = value[prop]
  }

  return value
}

function mapProperty(value, schema, parent, current, path) {
  if (schema === true) return value
  if (isString(schema)) return getPropValue(current, parent, schema)
  if (isFunction(schema)) return schema(value, parent, current, path)

  if (isArray(schema) && isArray(value)) {
    const result = []
    const itemSchema = schema[0]

    value.forEach((item, index) => {
      const itemPath = path.concat(index)
      const mappedItem = mapProperty(item, itemSchema, value, current, itemPath)
      if (mappedItem === undefined) return
      result.push(mappedItem)
    })

    return result
  }

  if (isObject(schema)) return mapObject(value, schema, current, path)
}

function mapObject(obj, schema, current = obj, path = []) {
  const result = {}
  let props = Object.keys(schema)

  props.forEach((prop) => {
    const propSchema = schema[prop]
    const propValue = obj && obj[prop]
    const propPath = path.concat(prop)
    const mappedProp = mapProperty(
      propValue,
      propSchema,
      obj,
      current,
      propPath
    )
    if (mappedProp !== undefined) result[prop] = mappedProp
  })

  return result
}

function map(data, schema) {
  const execute = (a, b) => (isFunction(a) ? schema(b) : schema)
  const resolved = execute(schema, data)

  if (!isArray(data)) return mapObject(data, resolved)

  return data.map((object) => {
    const resolved = execute(schema, object)
    return mapObject(object, resolved)
  })
}

function mapper(schemaOrData, schema) {
  if (!schema) return (value) => map(value, schemaOrData)
  return map(schemaOrData, schema)
}

export default mapper

// // usage
// const user = {
//   id: 1,
//   firstName: 'Jack',
//   lastName: 'Johnson',
//   company: {
//     name: 'Moka',
//     cargo: 'DevOps Eng.',
//   },
//   email: 'jack@moka.com',
//   socialNetworks: {
//     twitter: 'https://twitter.com/jack.johnson',
//     facebook: 'https://www.facebook.com/jack.johnson',
//   },
//   friends: [
//     {
//       id: 2,
//       firstName: 'Anne',
//       lastName: 'Marie',
//     },
//     {
//       id: 3,
//       firstName: 'Franz',
//       lastName: 'Post',
//     },
//   ],
// }

// const userSchema = {
//   id: true,
//   name: (firstName, user) => user.firstName + ' ' + user.lastName,
//   companyName: 'company.name',
//   contacts: {
//     email: '$.email',
//     facebook: (facebook, contato, user, path) => user.socialNetworks.facebook,
//     twitter: '$.socialNetworks.twitter',
//   },
//   friends: [
//     {
//       id: true,
//       firstName: (firstName, friend) => friend.firstName + ' ' + friend.lastName,
//     },
//   ],
// }

// const mappedUser = mapper(user, userSchema)

// console.log(mappedUser)
