# Design Patterns

## Builder Function

As a use-case for the **Builder Pattern**, imagine that you have to perform a lot of common HTTP requests to the same server with the same header and would like to simplify the API.

### `ClientBuilder`

Note that on this example `ClientBuilder` returns an object that holds all the building logic.

It exposes the functions `forBaseUrl`, `withHeaders`, `usingFetch`, `usingAxios` and `build`.

We use these functions to specify the desired behaviour and then use build to get the complete `client`.

```js
function ClientBuilder() {
  return {
    forBaseUrl: function(baseUrl) {
      this.baseUrl = baseUrl;
      return this;
    }

    withHeaders: function(headers) {
      this.headers = headers;
      return this;
    }

    usingFetch: function() {
      this.executor = executeWithFetch;
      return this;
    }

    usingAxios: function() {
      this.executor = executeWithAxios;
      return this;
    }

    build: function() {
      return new Client(this.baseUrl, this.headers, this.executor);
    }
  }
}

function executeWithFetch(request) {
  // ...
}

function executeWithAxios(request) {
  // ...
}
```

### `Client`

The `Client` function is a constructor function, that:

- Accepts `baseUrl`, `headers` and `executor` methods, which are binded via `this` operator
- Exposes functions `post` and `get`

```js
function Client(baseUrl, headers, executor) {
  this.baseUrl = baseUrl
  this.headers = headers
  this.executor = executor

  this.post = function (endpoint, data) {
    const url = `${this.baseUrl}${endpoint}`
    return this.executor({
      url,
      data,
      method: 'POST',
      headers: this.headers,
    })
  }

  this.get = function (endpoint, params) {
    const url = `${this.baseUrl}${endpoint}`
    return this.executor({
      url,
      params,
      method: 'GET',
      headers: this.headers,
    })
  }
}
```

### Usage

We can then use these functions as below

```js
const client = ClientBuilder()
  .forBaseUrl('https://some-api.com/api/')
  .withHeaders({ Authorization: 'Bearer ABACABA' })
  .usingAxios()
  .build()

client.post('UpdateData', { data: 'new data' })
```

### Credits

From this [article](https://everyday.codes/javascript/builder-pattern-in-javascript-without-classes/) written by [@r3dm1ke](https://github.com/r3dm1ke)
