<sup>[master](https://github.com/moatorres/node-design-patterns/blob/master/mongodb/update/current-date-operator.md) / [mongodb](https://github.com/moatorres/node-design-patterns/blob/master/mongodb/update/current-date-operator.md) / [update](https://github.com/moatorres/node-design-patterns/blob/master/mongodb/update/min-operator.md) / [`$min`](https://github.com/moatorres/node-design-patterns/blob/master/mongodb/update/min-operator.md)</sup>

### MongoDB [`$min`](https://docs.mongodb.com/manual/reference/operator/update/min/#mongodb-update-up.-min) operator

#### Usage

The `$min` updates the value of the field to a specified value if the specified value is less than the current value of the field

**Insert a document**

```js
db.scores.insertOne({ _id: 1, highScore: 800, lowScore: 200 })
```

**Perform the update**

```js
db.scores.update({ _id: 1 }, { $min: { lowScore: 150 } })
```

**Retrieve the document**

```js
let doc = db.scores.find().pretty()

console.log(doc)

const doc = { _id: 1, highScore: 800, lowScore: 150 }
```

The next operation has no effect since the current value of the field `lowScore`, i.e `150`, is less than `250`

```js
const doc = db.scores.update({ _id: 1 }, { $min: { lowScore: 250 } })

console.log(doc)

const doc = { _id: 1, highScore: 800, lowScore: 150 }
```

#### Use `$min` to Compare Dates

Consider the following document in the collection `tags`

```js
const doc = {
  _id: 1,
  desc: 'crafts',
  dateEntered: ISODate('2013-10-01T05:00:00Z'),
  dateExpired: ISODate('2013-10-01T16:38:16Z'),
}
```

The following operation compares the current value of the `dateEntered` field, i.e. `ISODate("2013-10-01T05:00:00Z")`, with the specified date `new Date("2013-09-25")` to determine whether to update the field

```js
db.tags.update(
  { _id: 1 },
  { $min: { dateEntered: new Date('2013-09-25') } }
)
```

The operation updates the `dateEntered` field

```js
const doc = {
  _id: 1,
  desc: 'crafts',
  dateEntered: ISODate('2013-09-25T00:00:00Z'), // updated field
  dateExpired: ISODate('2013-10-01T16:38:16Z'),
}
```
