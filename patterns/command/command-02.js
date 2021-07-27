class Invoker {
  constructor() {
    this.history = []
  }
  run(cmd) {
    this.history.push(cmd)
    cmd()
    console.log('Command executed', cmd.serialize())
  }

  delay(cmd, delay) {
    setTimeout(() => {
      this.run(cmd)
    }, delay)
  }

  undo() {
    const cmd = this.history.pop()
    cmd.undo()
    console.log('Command undone', cmd.serialize())
  }

  runRemotely(cmd) {
    request.post(
      'http://localhost:7000/cmd',
      { json: cmd.serialize() },
      (err) => {
        console.log('Command executed remotely', cmd.serialize())
      }
    )
  }
}

// --> target
const statusUpdateService = {
  statusUpdates: {},
  sendUpdate: function (status) {
    console.log('Status sent: ' + status)
    let id = Math.floor(Math.random() * 1000000)
    statusUpdateService.statusUpdates[id] = status
    return id
  },
  destroyUpdate: (id) => {
    console.log('Status removed: ' + id)
    delete statusUpdateService.statusUpdates[id]
  },
}

// --> command
function createSendStatusCmd(service, status) {
  let postId = null
  const command = () => {
    postId = service.sendUpdate(status)
  }
  command.undo = () => {
    if (postId) {
      service.destroyUpdate(postId)
      postId = null
    }
  }
  command.serialize = () => {
    return { type: 'status', action: 'post', status: status }
  }
  return command
}

// --> client
const invoker = new Invoker()
const command = createSendStatusCmd(statusUpdateService, 'Hi!')

function test() {
  invoker.run(command)
  invoker.undo()
  invoker.delay(command, 1000 * 60 * 60)
  invoker.runRemotely(command)
}

test()
