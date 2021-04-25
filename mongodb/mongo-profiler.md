# MongoDB Advanced

## Profiler

We can enable the MongoDB profiler by executing:

```js
db.setProfilingLevel(2)
```

With it enabled, we can run a command:

```js
db.pessoas.find({ peso: { $gt: 60 } })
```

And then examine the profiler:

```js
db.system.profile.find()
```

The output tells us what was run and when, how many documents were scanned, and how much data was returned. We can disable the profiler by calling `setProfilingLevel` again but changing the parameter to `0`. Specifying `1` as the first parameter will *profile queries that take more than 100 milliseconds*. The default threshold is **100 milliseconds**, but you can specify a different minimum time, in milliseconds, with a second parameter:

```js
// profile anything that takes more than 1 second
db.setProfilingLevel(1, 1000)
```
