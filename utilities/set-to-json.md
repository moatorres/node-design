# Utilities

## Set `toJSON`

A few weeks ago I was working on a really odd bug. An object was being assembled that contained some user data, and when we went to send that object up to the server as JSON, it was always incomplete - it was missing data in one of the properties.

I tried all kinds of things to track down what was causing this: was an object merge acting unexpectedly? Was there an event somewhere that removed this data that I didn't know about?

It was actually much simpler than this. The problem, was `JSON.stringify()` and a `Set` contained within the object being stringified.

For an example, I'll create a user with some "lucky numbers", which I'm just making up as an example where the entries should be unique, so a `Set` would (in theory) be better than an `Array`.

```js
const userData = {
  name: 'Haleema Greer',
  id: 7252,
  luckyNumbers: new Set([55, 45, 62, 21]),
}

JSON.stringify(userData)

// > "{\"name\":\"Haleema Greer\",\"id\":7252,\"luckyNumbers\":{}}"
```

Apparently Set data just isn't in a format that can convert to JSON without some extra work.

One good solution is presented on [Stack Overflow](https://stackoverflow.com/a/46491780/325674).

```js
function Set_toJSON(key, value) {
  if (typeof value === 'object' && value instanceof Set) {
    return [...value]
  }
  return value
}

JSON.stringify(userData, Set_toJSON)

// > "{\"name\":\"Haleema Greer\",\"id\":7252,\"luckyNumbers\":[55,45,62,21]}"
```

Many guides will either state or imply `Set` can be used as a drop-in for `Array`, but they do not act the same and can have some unexpected consequences if you treat them the same.

Be aware these two types are different, and what works for one, may not work for the other.

### Credits

From the article [A cautionary note about use of Javascript's Set and Map objects](https://dev.to/rgeraldporter/a-cautionary-note-about-use-of-javascript-s-set-and-map-objects-1kpc) written by [@rgeraldporter](https://github.com/rgeraldporter)
