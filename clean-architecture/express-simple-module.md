# Clean Architecture

## Express JavaScript Module

When you have a large codebase entirely made up of files such as the one below, it can very quickly feel as though you're dealing with a big ball of unrelated scripts, rather than a well-architected software application. You may end up with directories full of vaguely grouped 'services'; individually exporting and importing single functions, often vaguely named, and not obviously belonging to any domain.

```js
const { getUser, removeUser } = require('services/user')
const { sendEmail } = require('helpers/email')
const { pushNotification } = require('helpers/notifications')
const { removeFilesByUserId } = require('services/files')

const removeUserHandler = async (userId) => {
  const message = 'Your account has been deleted'

  try {
    const user = await getUser(userId)
    await removeUser(userId)
    await sendEmail(userId, message)
    await pushNotification(userId, message)
  } catch (e) {
    console.error(e)
    sendLogs('removeUserHandler', e)
  }

  return true
}
```

We could use `module.exports` to create domain-based services.

- `ScheduledJobs.run(jobId)`
- `User.create(userInfo)`

```js
const run = ({ jobId }) => {}

const stop = ({ jobId }) => {}

const pause = ({ jobId }) => {}

const get = ({ jobId }) => {}

const ScheduledJobs = { run, stop, pause, get }

module.exports = ScheduledJobs
```

Let's refactor our example to use another approach inspired by domain-driven design patterns.

```js
const UserModel = require('models/user')
const EmailService = require('services/email')
const NotificationService = require('services/notification')
const FileModel = require('models/file')
const Logger = require('services/logger')

const removeUserHandler = async (userId) => {
  const message = 'Your account has been deleted'

  try {
    const user = await UserModel.getUser(userId)
    await UserModel.removeUser(userId)
    await EmailService.send(userId, message)
    await NotificationService.push(userId, message)
    return true
  } catch (e) {
    console.error(e)
    Logger.send('removeUserHandler', e)
  }

  return true
}
```

### Credits

From this [article](https://dzone.com/articles/domain-driven-design-in-javascript) published on [dzone.com](https://dzone.com)
