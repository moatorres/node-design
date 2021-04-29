# Design Patterns

## Functional Hooks

You can write **custom hooks** that cover a wide range of use cases like form handling, animation, declarative subscriptions, timers, and probably many more we haven’t considered. Start spotting cases where a custom hook could hide complex logic behind a simple interface, or help untangle a messy component.

### `useYourImagination()` hook

Maybe you have a complex component that contains a lot of local state that is managed in an ad-hoc way. `useState` doesn’t make centralizing the update logic any easier so you might prefer to write it as a `Redux` reducer:

```js
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [
        ...state,
        {
          text: action.text,
          completed: false,
        },
      ]
    default:
      return state
  }
}
```

Reducers are very convenient to test in isolation, and scale to express complex update logic. You can further break them apart into smaller reducers if necessary.

So what if we could write a `useReducer` Hook that lets us manage the local state of our component with a reducer? A simplified version of it might look like this:

```js
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState)

  function dispatch(action) {
    const nextState = reducer(state, action)
    setState(nextState)
  }

  return [state, dispatch]
}
```

Now we could use it in our component, and let the reducer drive its state management:

```js
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, [])

  function handleAddClick(text) {
    dispatch({ type: 'add', text })
  }
}
```

### Credits

From the [Official React Docs](https://reactjs.org/docs/hooks-custom.html)
