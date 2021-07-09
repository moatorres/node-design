# MongoDB

## Data Modelling

### `many-to-one`

<sub>Inserting `_id` explicitly for the sake of this example only</sub>

```js
db.staff.insert({
  _id: ObjectId('4d85c7039ab0fd70a117d730'),
  name: 'Leo',
})
```

Add `staff` managed by `Leo`

```js
db.staff.insert({
  _id: ObjectId('4d85c7039ab0fd70a117d731'),
  name: 'Peter',
  manager: ObjectId('4d85c7039ab0fd70a117d730'),
})

db.staff.insert({
  _id: ObjectId('4d85c7039ab0fd70a117d732'),
  name: 'John',
  manager: ObjectId('4d85c7039ab0fd70a117d730'),
})
```

Get `staff` managed by `Leo`

```js
db.staff.find({ manager: ObjectId('4d85c7039ab0fd70a117d730') })
```

### `many-to-many`

**Arrays** `[]`

```js
db.staff.insert({
  _id: ObjectId('4d85c7039ab0fd70a117d733'),
  name: 'Siona',
  manager: [
    ObjectId('4d85c7039ab0fd70a117d730'),
    ObjectId('4d85c7039ab0fd70a117d732'),
  ],
})
```

**Nested documents** `{ prop: { info: '' } }`

```js
db.staff.insert({
  _id: ObjectId('4d85c7039ab0fd70a117d734'),
  name: 'Juliana',
  parentage: {
    mother: 'Maria',
    father: 'Paulo',
    brother: ObjectId('4d85c7039ab0fd70a117d730'),
  },
})
```

<sup>Query nested docs using dot-notation: `db.staff.find({ 'parentage.mother': 'Maria' })`</sup>

**Arrays of documents** `[{}, {}, { prop: { info: '' } }]`

```js
db.staff.insert({
  _id: ObjectId('4d85c7039ab0fd70a117d735'),
  name: 'Maria',
  parentage: [
    { kinship: 'mother', name: 'Maria' },
    { kinship: 'father', name: 'Paulo' },
    { kinship: 'brother', name: 'Douglas' },
  ],
})
```

<sup>Nested docs or `objects` can have as many properties as needed:</sup>

```js
db.persons.insert({
  name: 'leto',
  email: 'leto@dune.gov',
  addresses: [
    {
      street: 'Av. Atlântica, 345',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipcode: '10036-010',
    },
    {
      street: '555 University',
      city: 'Palo Alto',
      state: 'CA',
      zipcode: '94107',
    },
  ],
})
```
