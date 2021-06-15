class Book {
  constructor(object) {
    this.title = object.title
    this.author = object.author
    this.pages = object.pages
  }
}

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

const bookObjectFromDB = {
  name: 'Clean Code',
  by: 'Robert Cecil Martin',
  nr_of_pages: 503,
}

const book = BookFactory.createFromDB(bookObjectFromDB)

if (book.pages > 100) {
  console.log(book)
}
