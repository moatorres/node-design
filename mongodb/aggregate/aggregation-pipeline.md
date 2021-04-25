# MongoDB

## Aggregation Pipeline

**Aggregation pipeline** gives you a way to **transform and combine documents** in your collection. You do it by passing the documents through a pipeline that’s somewhat analogous to the **Unix** “pipe” `|` where you send output from one command to another to a third, etc.

- **Operators**
  ##### **`$group`, `$match`, `$sort`, `$project`, `$unwind`, `$lookup`, `$geoNear`, `$out`**

The simplest aggregation you are probably already familiar with is the SQL `group by` expression. We already saw the simple `.count()` method, but what if we want to see how many pessoas are male and how many are female?

```js
db.pessoas.aggregate([
  {
    $group: {
      _id: '$genero',
      total: { $sum: 1 },
    },
  },
])
```

In the shell we have the `aggregate` helper which takes an array of **pipeline operators**. For a simple count grouped by something, we only need one such operator and it’s called **`$group`**. This is the exact analog of **`GROUP BY`** in SQL where we create a new document with `_id` field indicating what field we are grouping by (here it’s `gender`) and other _fields usually getting assigned_ results of some aggregation, in this case we **`$sum`** for each document that matches a particular `gender`. You probably noticed that the `_id` field was assigned **`$gender`** and not `gender`. The **`$`** before a field name indicates that the value of this field on the incoming document will be substituted.

The most common one to use before (and frequently after) **`$group`** would be **`$match`** - this is exactly like the find method and it allows us to aggregate only a matching subset of our documents, or to exclude some documents from our result.

```js
db.pessoas.aggregate([
  { $match: { peso: { $lt: 70 } } },
  {
    $group: {
      _id: '$genero',
      total: { $sum: 1 },
      pesoMedio: { $avg: '$peso' },
    },
  },
  { $sort: { pesoMedio: -1 } },
])
```

Here we introduced another pipeline operator **`$sort`** which does exactly what you would expect, along with it we also get **`$skip`** and **`$limit`**. We also used a `$group` operator **`$avg`**.

We can also aggregate on values that are stored inside of them. We do need to be able to “flatten” them to properly count everything. Here we will find out which `tag` is most famous between `pessoas` and we will also get the list of `$nome` of all the `pessoas` with the `tag`. Combining **`$sort`** and **`$limit`** allows us to get answers to “top N” types of questions.

```js
db.pessoas.aggregate([
  { $unwind: '$tags' },
  {
    $group: {
      _id: '$tags',
      total: { $sum: 1 },
      pessoas: { $addToSet: '$nome' },
    },
  },
  { $sort: { total: -1 } },
  { $limit: 1 },
])
```

#### **`$project`**

There is another powerful pipeline operator called **`$project`** to _create or calculate new fields based on values in existing fields_. For example, you can use math operators to add together values of several fields before finding out the average, or you can use string operators to create a new field that’s a concatenation of some existing fields.

#### **`$geoNear`**

The **`$geoNear`** pipeline operator takes advantage of a geospatial index. When using **`$geoNear`**, the **`$geoNear`** pipeline operation must appear as the first stage in an aggregation pipeline.

#### **`$unwind`**

Deconstructs an array field from the input documents to output a document for each element. Each output document is the input document with the value of the array field replaced by the element.

The **aggregate** command **can write your results into a new collection**, using the **`$out`** pipeline operator.
