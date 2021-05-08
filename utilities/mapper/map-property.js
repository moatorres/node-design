import mapObject from './map-object'
import { isString, isFunction, isArray, isObject, getPropValue } from './utils'

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

export default mapProperty
