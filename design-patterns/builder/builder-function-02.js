function ClientBuilder() {
  return {
    forBaseUrl: function (baseUrl) {
      this.baseUrl = baseUrl
      return this
    },

    withHeaders: function (headers) {
      this.headers = headers
      return this
    },

    usingFetch: function () {
      this.executor = executeWithFetch
      return this
    },

    usingAxios: function () {
      this.executor = executeWithAxios
      return this
    },

    build: function () {
      return new Client(this.baseUrl, this.headers, this.executor)
    },
  }
}

function executeWithFetch(request) {
  // ...
}

function executeWithAxios(request) {
  // ...
}

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

const client = ClientBuilder()
  .forBaseUrl('https://some-api.com/api/')
  .withHeaders({ Authorization: 'Bearer ABACABA' })
  .usingAxios()
  .build()

client.post('UpdateData', { data: 'new data' })

console.log(client)
