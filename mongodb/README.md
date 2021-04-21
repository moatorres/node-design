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
db.pessoas.update(
  { nome: 'Tita' },
  { $inc: { peso: 10 } },
  { upsert: true }
)
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

#### Method `getIndexes` on collection `pessoas`

```js
const getIndexesPessoas = () => db.pessoas.getIndexes()
const getIndexesResponse = db.pessoas.getIndexes()

const indexes = getIndexesPessoas()

let returnedArray = [
  {
    v: 2,
    key: {
      _id: 1,
    },
    name: '_id_',
  },
  {
    v: 2,
    key: {
      psicologa: 1,
    },
    name: 'PsicologaIndex',
    background: true,
  },
  {
    v: 2,
    key: {
      paciente: 1,
    },
    name: 'PacienteIndex',
    background: true,
  },
]
```
