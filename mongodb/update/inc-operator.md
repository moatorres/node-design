<sup>[node-design-patterns](https://github.com/moatorres/node-design-patterns/blob/master/) / [mongodb](https://github.com/moatorres/node-design-patterns/blob/master/mongodb/) / [update](https://github.com/moatorres/node-design-patterns/blob/master/mongodb/update/) / [`$inc`](https://github.com/moatorres/node-design-patterns/blob/master/mongodb/update/inc-operator.md)</sup>

### MongoDB [`$inc`](https://docs.mongodb.com/manual/reference/operator/update/inc/#mongodb-update-up.-inc) operator

- The `$min` updates the value of the field to a specified value if the specified value is less than the current value of the field
- The `$inc` operator accepts positive and negative values
- If the field does not exist, `$inc` creates the field and sets the field to the specified value
- Use of the `$inc` operator on a field with a `null` value will generate an error
- `$inc` is an atomic operation within a single document

**Insert a document**

```js
db.produtos.insertOne({ _id: 1, highScore: 800, lowScore: 200 }

)
```

**Perform the update**

```js
db.products.update(
   { sku: "abc123" },
   { $inc: { quantidade: -2, "metricas.compras": 1 } }
)
```

**Retrieve the document**

```js
let doc = db.produtos.find().pretty()

console.log(doc)

const doc = {
   "_id" : 1,
   "sku" : "abc123",
   "quantidade" : 8,
   "metricas" : {
      "compras" : 3,
      "avaliacao" : 3.5
   }
}
```
