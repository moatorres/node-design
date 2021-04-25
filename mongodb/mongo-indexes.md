# MongoDB Indexes

## Summary

| Command       | Description                   |
| ------------- | :---------------------------- |
| `getIndexes`  | Listar indexes de uma coleção |
| `dropIndex`   | Remover index existente       |
| `ensureIndex` | Criar um novo index           |

### `getIndexes`

```js
db.pessoas.getIndexes()
```

### `dropIndex`

```js
db.pessoas.dropIndex({ cpf: 1 })
```

### `ensureIndex`

- **`field`**

  ```js
  db.pessoas.ensureIndex({ nome: 1 })
  ```

- **`compound`**

  ```js
  db.pessoas.ensureIndex({ nome: 1, cpf: -1 })
  ```

- **`multi-key`**

  ```js
  db.pessoas.ensureIndex({ nome: 1, 'filiacao.mae': -1 })
  ```

- **`unique`**

  ```js
  db.pessoas.ensureIndex({ cpf: 1 }, { unique: true })
  ```

- **`text`**

  ```js
  db.postagens.createIndex({ comentarios: 'text' })
  ```

**Others**

- **`multi-key unique`**

```js
db.pessoas.ensureIndex({ cpf: 1, 'endereco.cep': 1 }, { unique: true })
```

- **`multi-key text`**

```js
db.postagens.createIndex({
  titulo: 'text',
  descricao: 'text',
})
```

- **`unique partial`**

```js
db.pessoas.createIndex(
  { nome: 1 },
  { unique: true, partialFilterExpression: { peso: { $gte: 21 } } }
)
```

###### To see whether or not your queries are using an index, you can use the explain method on a cursor:

```js
db.pessoas.find().explain()
```

```js
db.pessoas.find({ nome: 'Foni' }).explain()
```
