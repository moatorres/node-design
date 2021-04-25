<sup>[node-design-patterns](https://github.com/moatorres/node-design-patterns/blob/master/) / [mongodb](https://github.com/moatorres/node-design-patterns/blob/master/mongodb/)</sup>

### MongoDB Cheatsheet

Here are some of the most common queries for MongoDB databases

#### Method `insert` on collection `pessoas`

```js
db.pessoas.insert({
  nome: 'Bia',
  nascimento: new Date(2001, 9, 8, 14, 53),
  tags: ['maçã', 'melancia'],
  peso: 60,
  genero: 'feminino',
  altura: 133,
})
```

#### Method `insertMany` on collection `pessoas`

```js
const pessoas = [
  {
    nome: 'Francisco',
    nascimento: new Date(1997, 2, 1, 5, 3),
    tags: ['maçã', 'melancia'],
    peso: 65,
    genero: 'masculino',
    altura: 154,
  },
  {
    nome: 'Isabel',
    nascimento: new Date(1999, 11, 20, 16, 15),
    tags: ['uva', 'cenoura'],
    peso: 54,
    genero: 'feminino',
  },
  {
    nome: 'Antonio',
    nascimento: new Date(1976, 6, 18, 18, 18),
    tags: ['uva', 'melancia'],
    peso: 70,
    genero: 'masculino',
    altura: 185,
  },
]

db.pessoas.inserMany(pessoas)
```

#### Method `find` on collection `pessoas`

```js
// the method below
db.pessoas.find()

// is equivalent to
db.getCollection('pessoas').find()

// .find() with arguments
db.pessoas.find({ nome: 'Antonio' })
db.pessoas.find({ genero: 'masculino' })
db.pessoas.find({ nome: 'Antonio', genero: 'feminino' })
```

#### Method `find` special operators `$eq`, `$ne`, `$lt`, `$lte`, `$gt`, `$gte`

```js
db.pessoas.find({ genero: { $ne: 'feminino' }, peso: { $gte: 70 } })
```

#### Method `find` with `$exists` operator

```js
db.pessoas.find({
  altura: { $exists: false },
})
```

#### Method `find` with `$in` operator

```js
const pessoas = db.pessoas.find({
  tags: { $in: ['maçã', 'laranja'] },
})
```

#### Method `find` with `$or` operator

```js
db.pessoas.find({
  genero: 'feminino',
  $or: [{ tags: 'maçã' }, { peso: { $lt: 70 } }],
})
```

#### Sorting results with `.sort`

```js
// ordenar por ordem decrescente (do mais pesado para o mais leve)
db.pessoas.find().sort({ peso: -1 })

// ordenar por nome (crescente) e peso (decrescente)
db.pessoas.find().sort({ nome: 1, peso: -1 })
```

#### Pagination with `.limit` and `.skip`

```js
db.unicorns.find().sort({ peso: -1 }).limit(2).skip(1)
```

#### Method `update` on collection `pessoas`

```js
db.pessoas.update({ nome: 'Antonio' }, { peso: 96 })
```

#### Method `update` with `$set` operator

```js
db.pessoas.update({ nome: 'Antonio' }, { $set: { peso: 85 } })
```

#### Method `update` with `$inc` operator

<sub>`$inc` comes from **increments**</sub>

```js
db.pessoas.update({ nome: 'Bia' }, { $inc: { peso: -2 } })
```

#### Method `update` with `$push` operator

<sub>`$push` applies only to **arrays**</sub>

```js
db.pessoas.update({ nome: 'Ana' }, { $push: { tags: 'açúcar' } })
```

#### Method `update` with `upsert` option

<sub>When `upsert` is passed the document will be added if it doesn't exists</sub>

```js
db.pessoas.update({ nome: 'Tita' }, { $inc: { peso: 10 } }, { upsert: true })
```

#### Method `updateMany` on collection `pessoas`

<sub>You can use filters as with the method `find()` to match certain documents</sub>

```js
// the query below
db.pessoas.update({}, { $set: { vacinada: true } })

// is equivalent to
db.pessoas.updateMany({}, { $set { vacinada: true } })

// with filters
db.pessoas.updateMany(
  { peso: { $gte: 50 } },
  { $set { vacinada: true } }
)
```

[Click here](https://github.com/moatorres/node-design-patterns/blob/master/mongodb/update/operators.md) to check other update operators with examples

#### Stats

You can obtain statistics on a database by typing **`db.stats()`**. Most of the information deals with the size of your database. You can also get statistics on a collection, say `pessoas`, by typing **`db.pessoas.stats()`**. Most of this information relates to the size of your collection and its indexes.
