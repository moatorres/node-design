# MongoDB Index API

### `getIndexes`

```js
db.persons.getIndexes()
```

### `dropIndex`

```js
db.persons.dropIndex({ age: 1 })
```

### `ensureIndex`

`field`

```js
db.persons.ensureIndex({ name: 1 })
```

`compound`

```js
db.persons.ensureIndex({ name: 1, age: -1 })
```

`multi-key`

```js
db.persons.ensureIndex({ name: 1, 'filiacao.mae': -1 })
```

`unique`

```js
db.persons.ensureIndex({ age: 1 }, { unique: true })
```

`text`

```js
db.posts.createIndex({ comments: 'text' })
```

`multi-key unique`

```js
db.persons.ensureIndex({ age: 1, 'address.zipcode': 1 }, { unique: true })
```

`multi-key text`

```js
db.posts.createIndex({
  titulo: 'text',
  descricao: 'text',
})
```

`unique partial`

```js
db.persons.createIndex(
  { name: 1 },
  { unique: true, partialFilterExpression: { peso: { $gte: 21 } } }
)
```

###### To see whether or not your queries are using an index, you can use the explain method on a cursor:

```js
db.persons.find().explain()
```

```js
db.persons.find({ name: 'John' }).explain()
```
