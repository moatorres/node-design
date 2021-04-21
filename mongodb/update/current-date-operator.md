### MongoDB [`$currentDate`](https://docs.mongodb.com/manual/reference/operator/update/currentDate/#mongodb-update-up.-currentDate) operator

The `$currentDate` operator sets the value of a field to the current date, either as a `Date` or a `timestamp`. The default type is `Date`.

**Insert a document**

```js
db.clientes.insertOne({
  _id: 1,
  status: 'pendente',
  ultima_atualizacao: ISODate('2013-10-02T01:11:18.965Z'),
})
```

**Perform the update**

```js
db.clientes.updateOne(
  { _id: 1 },
  {
    $currentDate: {
      ultima_atualizacao: true,
      'cancelamento.data': { $type: 'timestamp' },
    },
    $set: {
      'cancelamento.motivo': 'solicitado pelo usuário',
      status: 'ok',
    },
  }
)
```

**Retrieve the document**

```js
let doc = db.clientes.find().pretty()

console.log(doc)

const doc = {
  _id: 1,
  status: 'ok',
  ultima_atualizacao: ISODate('2020-01-22T21:21:41.052Z'),
  cancelamento: {
    data: Timestamp(1579728101, 1),
    motivo: 'solicitado pelo usuario',
  },
}
```

Aternativa usando `$$NOW` e/ou `$$CLUSTER_TIME`
<sub>**CLUSTER_TIME** is available only on replica sets and sharded clusters</sub>

```js
db.clientes.updateOne({ _id: 1 }, [
  {
    $set: {
      ultima_atualizacao: '$$NOW',
      cancelamento: {
        data: '$$CLUSTER_TIME',
        motivo: 'solicitado pelo usuário',
      },
      status: 'ok',
    },
  },
])
```
