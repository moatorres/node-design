import map from './map'

function mapper(schemaOrData, schema) {
  if (!schema) return (value) => map(value, schemaOrData)
  return map(schemaOrData, schema)
}

export default mapper
