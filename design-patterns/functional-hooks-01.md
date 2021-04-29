# Design Patterns

## Functional Hooks

Here, we’re creating a primitive clone of React’s `useState` hook. In our function, there are 2 inner functions, `state` and `setState`. state returns a local variable `_val` defined above and `setState` sets the local variable to the parameter passed into it (i.e. `newVal`).

### `useState`

Our implementation of `state` here is a `getter` function, which isn’t ideal, but we’ll fix that in a bit. What’s important is that with `foo` and `setFoo`, we are able to access and manipulate (or “close over”) the internal variable `_val`. They retain access to `useState` ‘s scope, and that reference is called closure.

```js
function useState(initialValue) {
  // private
  var _val = initialValue

  function state() {
    return _val
  }

  function setState(newVal) {
    _val = newVal
  }

  return [state, setState]
}

// usage
var [foo, setFoo] = useState(0)
console.log(foo()) // => 0

setFoo(1)
console.log(foo()) // => 1
```

Let’s apply our newly minted `useState` clone in a familiar looking setting. We’ll make a `Counter` component.

Here, instead of rendering to the DOM, we’ve opted to just `console.log` out our `state`. We’re also exposing a programmatic API for our `Counter` so we can run it in a script instead of attaching an event handler. With this design we are able to simulate our component rendering and reacting to user actions.

```js
function Counter() {
  const [count, setCount] = useState(0)
  return {
    click: () => setCount(count() + 1),
    render: () => console.log('render:', { count: count() }),
  }
}

const C = Counter()

C.render() // => render: { count: 0 }

C.click()

C.render() // => render: { count: 1 }
```

While this works, calling a getter to access state isn’t quite the API for the real `React.useState` hook. We can fix that using the **Module pattern** to make our tiny React clone. Like React, it keeps track of component state (in our example, it only tracks one component, with a state in `_val`).

```js
const MyReact = (function () {
  let _val // hold our state in module scope
  return {
    render(Component) {
      const Comp = Component()
      Comp.render()
      return Comp
    },
    useState(initialValue) {
      _val = _val || initialValue // assign a new every run
      function setState(newVal) {
        _val = newVal
      }
      return [_val, setState]
    },
  }
})()
```

This design allows MyReact to “render” your function component, which allows it to assign the internal `_val` value every time with the correct closure:

```js
function Counter() {
  const [count, setCount] = MyReact.useState(0)
  return {
    click: () => setCount(count + 1),
    render: () => console.log('render:', { count }),
  }
}

let App
App = MyReact.render(Counter) // render: { count: 0 }

App.click()

App = MyReact.render(Counter) // render: { count: 1 }
```

### `useEffect`

So far, we’ve covered `useState`, which is the first basic React Hook. The next most important hook is `useEffect`. Unlike `setState`, `useEffect` executes asynchronously, which means more opportunity for running into closure problems.

We can extend the tiny model of React we have built up so far to include this:

```js
const MyReact = (function () {
  let _val, _deps // hold our state and dependencies in scope
  return {
    render(Component) {
      const Comp = Component()
      Comp.render()
      return Comp
    },
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray
      const hasChangedDeps = _deps
        ? !depArray.every((el, i) => el === _deps[i])
        : true
      if (hasNoDeps || hasChangedDeps) {
        callback()
        _deps = depArray
      }
    },
    useState(initialValue) {
      _val = _val || initialValue
      function setState(newVal) {
        _val = newVal
      }
      return [_val, setState]
    },
  }
})()
```

###### `useEffect` Usage

```js
function Counter() {
  const [count, setCount] = MyReact.useState(0)

  MyReact.useEffect(() => {
    console.log('effect', count)
  }, [count])

  return {
    click: () => setCount(count + 1),
    noop: () => setCount(count),
    render: () => console.log('render', { count }),
  }
}

let App
App = MyReact.render(Counter)
// => effect 0, render { count: 0 }

App.click()
App = MyReact.render(Counter)
// => effect 1, render { count: 1 }

App.noop()
App = MyReact.render(Counter)
// => render { count: 1 }

App.click()
App = MyReact.render(Counter)
// => effect 2, render { count: 2 }
```

### Not Magic, just Arrays

We have a pretty good clone of the `useState` and `useEffect` functionality, but both are badly implemented singletons. To do anything interesting (and to make the final stale closure example possible), we need to generalize them to take arbitrary numbers of state and effects. Fortunately, as Rudi Yardley has written, React Hooks are not magic, just arrays. So we’ll have a `hooks` array. We’ll also take the opportunity to collapse both `_val` and `_deps` into our `hooks` array since they never overlap:

#### `MyReact` function

```js
const MyReact = (function () {
  let hooks = []
  let currentHook = 0 // array of hooks, and an iterator

  return {
    render(Component) {
      const Comp = Component() // run effects
      Comp.render()

      currentHook = 0 // reset for next render
      return Comp
    },

    useEffect(callback, depArray) {
      const hasNoDeps = !depArray
      const deps = hooks[currentHook] // type: array | undefined

      const hasChangedDeps = deps
        ? !depArray.every((el, i) => el === deps[i])
        : true

      if (hasNoDeps || hasChangedDeps) {
        callback()
        hooks[currentHook] = depArray
      }

      currentHook++ // done with this hook
    },

    useState(initialValue) {
      hooks[currentHook] = hooks[currentHook] || initialValue // type: any

      const setStateHookIndex = currentHook // for setState's closure
      const setState = (newState) => (hooks[setStateHookIndex] = newState)

      return [hooks[currentHook++], setState]
    },
  }
})()
```

Note our usage of `setStateHookIndex` here, which doesn’t seem to do anything, but is used to prevent `setState` from closing over the `currentHook` variable! If you take that out, `setState` again stops working because the closed-over `currentHook` is stale.

#### `Counter` component

```js
function Counter() {
  const [count, setCount] = MyReact.useState(0)
  const [text, setText] = MyReact.useState('foo')

  MyReact.useEffect(() => {
    console.log('effect', count, text)
  }, [count, text])

  return {
    click: () => setCount(count + 1),
    type: (txt) => setText(txt),
    noop: () => setCount(count),
    render: () => console.log('render', { count, text }),
  }
}
```

###### `Counter` Usage

So the basic intuition is having an array of `hooks` and an index that just increments as each hook is called and reset as the component is rendered.

```js
let App
App = MyReact.render(Counter)
// => effect 0 foo, render { count: 0, text: 'foo' }

App.click()
App = MyReact.render(Counter)
// => effect 1 foo, render { count: 1, text: 'foo' }

App.type('bar')
App = MyReact.render(Counter)
// => effect 1 bar, render { count: 1, text: 'bar' }

App.noop()
App = MyReact.render(Counter)
// => render { count: 1, text: 'bar' }

App.click()
App = MyReact.render(Counter)
// => effect 2 bar => render { count: 2, text: 'bar' }
```

#### `useSplitUrl` hook

You also get **custom hooks** for free:

```js
function Component() {
  const [text, setText] = useSplitURL('www.netlify.com')

  return {
    type: (txt) => setText(txt),
    render: () => console.log({ text }),
  }
}

function useSplitURL(str) {
  const [text, setText] = MyReact.useState(str)
  const masked = text.split('.')
  return [masked, setText]
}

let App
App = MyReact.render(Component)
// => { text: [ 'www', 'netlify', 'com' ] }

App.type('www.reactjs.org')
App = MyReact.render(Component)
// => { text: [ 'www', 'reactjs', 'org' ] }}
```

**This truly underlies how “not magic” hooks are** – Custom Hooks simply fall out of the primitives provided by the framework – whether it is React, or the tiny clone we’ve been building.

### Credits

From the article [Deep dive: How do React hooks really work?](https://www.netlify.com/blog/2019/03/11/deep-dive-how-do-react-hooks-really-work/) written by [@swyx](https://www.netlify.com/authors/swyx/)
