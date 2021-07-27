# Design Patterns

## Class Decorator

```js
class Book {
  constructor(object) {
    this.title = object.title
    this.author = object.author
    this.pages = object.pages
  }
}
```

```js
class BookFactory {
  static create(object) {
    return new Book(object)
  }

  static createFromDB(object) {
    const preparedBookJson = {
      title: object.name,
      author: object.by,
      pages: object.nr_of_pages,
    }

    return new Book(preparedBookJson)
  }
}
```

### Usage

```js
const bookObjectFromDB = {
  name: 'Clean Code',
  by: 'Robert Cecil Martin',
  nr_of_pages: 503,
}

const book = BookFactory.createFromDB(bookObjectFromDB)

if (book.pages > 100) {
  console.log(book.author)
}
```

### Credits

From this [article](https://javascript.plainenglish.io/javascript-design-patterns-the-factory-pattern-6b399656d710) written by [Arthur Frank]()
