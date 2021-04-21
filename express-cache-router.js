router.get('/users/:id', async function(req, res, next) {
    const userId = req.params.id;

    // try to fetch from cache
    let user = await cache.get(userId);

    if (!user) {
        // fetch from the database
        user = await db.users.get(userId);

        // handle 404
        if (!user) return res.status(404).end();

        // otherwise, cache the user for next time
        await cache.set(userId, user);
    }

    // we have a cached user
    res.json(user);
});
