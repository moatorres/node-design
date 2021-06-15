const fs = require('fs')

class LocalStorage {
  constructor() {
    if (fs.existsSync('localStorage.json')) {
      console.log('Loading items from localStorage.json')
      const txt = fs.readFileSync('localStorage.json')
      this.items = JSON.parse(txt)
    } else {
      this.items = {}
    }
  }

  get length() {
    return Object.keys(this.items).length
  }

  getItem(key) {
    return this.items[key]
  }

  setItem(key, value) {
    this.items[key] = value
    fs.writeFile('localStorage.json', JSON.stringify(this.items), (error) => {
      if (error) {
        console.error(error)
      }
    })
  }

  clear() {
    this.items = {}
    fs.unlink('localStorage.json', () => {
      console.log('localStorage file removed')
    })
  }
}

// module.exports = new LocalStorage()

const localStorage = new LocalStorage()

console.log('localStorage length: ', localStorage.length)

const uid = localStorage.getItem('user_id')

console.log('user_id: ', uid)

if (!uid) {
  console.log('ID not found. Setting the user id and token...')
  localStorage.setItem('token', 'TJVA95OrMh7HgQ')
  localStorage.setItem('user_id', '12345')
} else {
  console.log('User ID found.', uid)
  console.log('clearing the User ID...')
  localStorage.clear()
}

console.log(localStorage)
