# MongoDB

## Data Modelling

<summary></sumary>

### `many-to-one`

##### Exemplo A

- Inserir `_id` explicitamente pra dar coerência ao exemplo

```js
db.funcionarios.insert({
  _id: ObjectId('4d85c7039ab0fd70a117d730'),
  nome: 'Léo',
})
```

- Adicionar novos `funcionarios` gerenciados por `'Léo'`

```js
db.funcionarios.insert({
  _id: ObjectId('4d85c7039ab0fd70a117d731'),
  nome: 'Pedro',
  gerente: ObjectId('4d85c7039ab0fd70a117d730'),
})

db.funcionarios.insert({
  _id: ObjectId('4d85c7039ab0fd70a117d732'),
  nome: 'João',
  gerente: ObjectId('4d85c7039ab0fd70a117d730'),
})
```

- Retornar os funcionários de `'Léo'`

```js
db.funcionarios.find({ gerente: ObjectId('4d85c7039ab0fd70a117d730') })
```

### `many-to-many` relationships

- **Arrays** `[]`

```js
db.funcionarios.insert({
  _id: ObjectId('4d85c7039ab0fd70a117d733'),
  nome: 'Siona',
  gerente: [
    ObjectId('4d85c7039ab0fd70a117d730'),
    ObjectId('4d85c7039ab0fd70a117d732'),
  ],
})
```

- **Nested documents\*** `{ prop: { info: '' } }`

```js
db.funcionarios.insert({
  _id: ObjectId('4d85c7039ab0fd70a117d734'),
  nome: 'Juliana',
  filiacao: {
    mae: 'Maria',
    pai: 'Paulo',
    irmão: ObjectId('4d85c7039ab0fd70a117d730'),
  },
})
```

<sup>**\*Nested documents can be queried using dot-notation:** `db.funcionarios.find({ 'filiacao.mae': 'Maria' })`</sup>

- **Arrays of documents** `[{}, {}, { prop: { info: '' } }]`

```js
db.funcionarios.insert({
  _id: ObjectId('4d85c7039ab0fd70a117d735'),
  nome: 'Maria',
  filiacao: [
    { parentesco: 'mae', nome: 'Maria' },
    { parentesco: 'pai', nome: 'Paulo' },
    { parentesco: 'irmão', nome: 'Douglas' },
  ],
})
```

<sup>**\*Nested documents** or nested `objects` can have as many properties as needed:</sup>

```js
db.pessoas.insert({
  nome: 'leto',
  email: 'leto@dune.gov',
  enderecos: [
    {
      logradouro: 'Av. General San Martin. 345',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      cep: '10036-010',
    },
    {
      logradouro: '555 University',
      cidade: 'Palo Alto',
      estado: 'CA',
      cep: '94107',
    },
  ],
})
```
