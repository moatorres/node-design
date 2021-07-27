# Design Patterns

## Async-Await

Imagine we want to fetch information about books:

```js
const getBook = async (bookName) => {
  const book = await fetchBook(bookName)
  const author = await fetchAuthor(book.authorId)
  const rating = await fetchRating(book.id)

  return {
    ...book,
    author,
    rating,
  }
}
```

Let's write it with `Promise.all`

```js
const getBook = async (bookName) => {
  const book = await fetchBook(bookName)

  return Promise.all([fetchAuthor(book.authorId), fetchRating(book.id)]).then(
    (results) => ({
      ...book,
      author: results[0],
      rating: results[1],
    })
  )
}
```

Let's write a better option, for readability and performance, with `async`, `await`, `Promise.all` and **desctructuring**

```js
const getBook = async (bookName) => {
  const book = await fetchBook(bookName)

  const [author, rating] = await Promise.all([
    fetchAuthor(book.authorId),
    fetchRating(book.id),
  ])

  return {
    ...book,
    author,
    rating,
  }
}
```

### Credits

From this [repo](https://github.com/howardmann/node-design-patterns/blob/master/async-await/blog.js) written by [@howardmann](https://github.com/howardmann)
