import mapProperty from './map-property'

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

export default mapObject
