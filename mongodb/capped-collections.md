# MongoDB

## `capped` collections

#### One area where MongoDB can fit a specialized role is in logging

MongoDB has something called a **capped collection**. We can create a capped collection by using the `db.createCollection` command and flagging it as **`capped`**

```js
// limit our capped collection to 1 megabyte
db.createCollection('logs', { capped: true, size: 1048576 })
```

There are two aspects of MongoDB which make writes quite fast.

1. We can send a write command and have it return immediately without waiting for the write to be acknowledged
2. We can control the write behavior with respect to data durability

These settings, in addition to specifying how many servers should get our data _before being considered successful_, are configurable **per-write**, giving we a great level of control over write performance and data durability.

When our `capped collection` reaches its 1MB limit, old documents are automatically purged. A limit on the number of documents, rather than the size, can be set using **`max`**.

Capped collections have some interesting properties:

- We can update a document but it can’t change in size.
- The insertion order is preserved, so we don’t need to add an extra index to get proper time-based sorting.
- We can “tail” a `capped collection` the way we tail a file in **Unix** via `tail -f <filename>` which allows us to get new data as it arrives, without having to re-query it.

**If we want to “expire” our data based on time** rather than overall collection size, we can use **TTL Indexes** where TTL stands for “time-to-live”.
