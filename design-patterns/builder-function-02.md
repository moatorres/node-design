# Functional Programming

## Builder Pattern

As a use-case for the **Builder Pattern**, imagine that you have to perform a lot of common HTTP requests to the same server with the same header and would like to simplify the API.

```js
function executeWithFetch(request) {
  // EXERCISE FOR THE READER
}

function executeWithAxios(request) {
  // EXERCISE FOR THE READER
}

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

function Client(baseUrl, headers, executor) {
  this.baseUrl = baseUrl;
  this.headers = headers;
  this.executor = executor;

  this.post = function(endpoint, data) {
    const url = `${this.baseUrl}${endpoint}`;
    return this.executor({
      url,
      data,
      method: 'POST',
      headers: this.headers
    });
  }

  this.get = function(endpoint, params) {
    const url = `${this.baseUrl}${endpoint}`;
    return this.executor({
      url,
      params,
      method: 'GET',
      headers: this.headers
    });
  }
}
```

First, note the ClientBuilder function. It returns an object that holds all the building logic. It exposes functions forBaseUrl, withHeaders, usingFetch, usingAxios, and, build. You use these functions to specify the desired behaviour and then use build to get the complete client. The Client function is a constructor function, that accepts baseUrl, headers and executor, binds it via this and exposes functions post and get. You will then use these functions like this:

### Usage

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
