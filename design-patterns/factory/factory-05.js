// definition
class Url {
  constructor(
    protocol,
    username,
    password,
    hostname,
    port,
    pathname,
    search,
    hash
  ) {
    this.protocol = protocol
    this.username = username
    this.password = password
    this.hostname = hostname
    this.port = port
    this.pathname = pathname
    this.search = search
    this.hash = hash

    this.validate()
  }

  validate() {
    if (!this.protocol || !this.hostname) {
      throw new Error('Must specify at least a ' + 'protocol and a hostname')
    }
  }

  toString() {
    let url = ''
    url += `${this.protocol}://`
    if (this.username && this.password) {
      url += `${this.username}:${this.password}@`
    }
    url += this.hostname
    if (this.port) {
      url += this.port
    }
    if (this.pathname) {
      url += this.pathname
    }
    if (this.search) {
      url += `?${this.search}`
    }
    if (this.hash) {
      url += `#${this.hash}`
    }
    return url
  }
}

// builder
class UrlBuilder {
  setProtocol(protocol) {
    this.protocol = protocol
    return this
  }

  setAuthentication(username, password) {
    this.username = username
    this.password = password
    return this
  }

  setHostname(hostname) {
    this.hostname = hostname
    return this
  }

  setPort(port) {
    this.port = port
    return this
  }

  setPathname(pathname) {
    this.pathname = pathname
    return this
  }

  setSearch(search) {
    this.search = search
    return this
  }

  setHash(hash) {
    this.hash = hash
    return this
  }

  build() {
    return new Url(
      this.protocol,
      this.username,
      this.password,
      this.hostname,
      this.port,
      this.pathname,
      this.search,
      this.hash
    )
  }
}

// usage
const url = new UrlBuilder()
  .setProtocol('https')
  .setAuthentication('user', 'pass')
  .setHostname('example.com')
  .build()

console.log(url.toString())
