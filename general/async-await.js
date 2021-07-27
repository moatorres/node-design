// see: https://github.com/howardmann/node-design-patterns/tree/master/async-await

// native implementation (slow)
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

// better but hard to read
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

// best of both worlds (destructuring)
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
