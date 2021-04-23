### `notReact.js`

#### JavaScript

```js
export const notReact = (function () {
  let _root
  let _templateCallback

  let hooks = []
  let idx = 0

  const _eventArray = []

  function useState(initValue) {
    let state
    state = hooks[idx] !== undefined ? hooks[idx] : initValue
    const _idx = idx

    const setState = (newValue) => {
      hooks[_idx] = newValue
      render()
    }

    idx++
    return [state, setState]
  }

  function useEffect(callback, dependencyArray) {
    const oldDependencies = hooks[idx]

    let hasChanged = true
    if (oldDependencies) {
      hasChanged = dependencyArray.some(
        (dep, i) => !Object.is(dep, oldDependencies[i])
      )
    }
    hooks[idx] = dependencyArray
    idx++
    if (hasChanged) callback()
  }

  function init(rootElement, templateCallback) {
    _root = rootElement
    _templateCallback = templateCallback
    render()
  }

  function render() {
    idx = 0
    _eventArray.length = 0
    _root.innerHTML = _templateCallback()
  }

  document.addEventListener('click', (e) => handleEventListeners(e))

  function handleEventListeners(e) {
    _eventArray.forEach((target) => {
      if (e.target.id === target.id) {
        e.preventDefault()
        target.callback()
      }
    })
  }

  function addOnClick(id, callback) {
    _eventArray.push({ id, callback })
  }

  return { useState, useEffect, init, render, addOnClick }
})()
```

#### TypeScript

```ts
export const notReact = (function () {
  let _root: Element
  let _templateCallback: ITemplateCallback

  let hooks: Array<any> = []
  let idx: number = 0

  const _eventArray: IEventArray = []

  function useState(initValue: any) {
    let state
    state = hooks[idx] !== undefined ? hooks[idx] : initValue
    const _idx = idx
    const setState = (newValue: any) => {
      hooks[_idx] = newValue
      render()
    }
    idx++
    return [state, setState]
  }
  function useEffect(callback: any, dependencyArray: Array<any>) {
    const oldDependencies = hooks[idx]
    let hasChanged = true
    if (oldDependencies) {
      hasChanged = dependencyArray.some(
        (dep, i) => !Object.is(dep, oldDependencies[i])
      )
    }
    hooks[idx] = dependencyArray
    idx++
    if (hasChanged) callback()
  }
  function init(rootElement: Element, templateCallback: ITemplateCallback) {
    _root = rootElement
    _templateCallback = templateCallback
    render()
  }
  function render() {
    idx = 0
    _eventArray.length = 0
    _root.innerHTML = _templateCallback()
  }
  //event Listeners
  //@ts-ignore
  document.addEventListener('click', (e) => handleEventListeners(e))
  function handleEventListeners(e: any) {
    _eventArray.forEach((target: any) => {
      if (e.target.id === target.id) {
        e.preventDefault()
        target.callback()
      }
    })
  }
  function addOnClick(id: string, callback: any) {
    _eventArray.push({ id, callback })
  }

  return { useState, useEffect, init, render, addOnClick }
})()

type ITemplateCallback = { (): string }
type IEventArray = [{ id: string; callback: any }] | Array<any>
```

#### Credits

From this [repo](https://github.com/maturc/notReact) created by [@maturc](https://github.com/maturc)
