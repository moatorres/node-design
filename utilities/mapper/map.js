import mapObject from './map-object'

function map(data, schema) {
  const execute = (a, b) => (isFunction(a) ? schema(b) : schema)
  const resolved = execute(schema, data)

  if (!isArray(data)) return mapObject(data, resolved)

  return data.map((object) => {
    const resolved = execute(schema, object)
    return mapObject(object, resolved)
  })
}

export default map
