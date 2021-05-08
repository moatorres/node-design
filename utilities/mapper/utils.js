export const isArray = (value) => value instanceof Array && Array.isArray(value)

export const isString = (value) => typeof value === 'string'

export const isObject = (value) =>
  value instanceof Object && typeof value === 'object'

export const isFunction = (value) =>
  value instanceof Function && typeof value === 'function'

export function getPropValue(current, parent, path) {
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
