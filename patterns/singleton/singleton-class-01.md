# Design Patterns

## Singleton Class

The **Singleton Pattern** is a design pattern that **restricts the instantiation of a class to one object**. After the first object is created, it will return the reference to the same one whenever called for an object.

Let's build a `ScoreBoard` singleton class.

```js
class ScoreBoard {
  constructor() {
    this.board = []
  }

  join(name) {
    this.board.push({
      name,
      scores: 0,
    })
  }

  leave(name) {
    this.board = this.board.filter((player) => player.name !== name)
  }

  update(name, scores) {
    const playerIdx = this.board.findIndex((player) => player.name === name)
    if (playerIdx > -1) {
      this.board[playerIdx].scores += scores
    }
  }

  showScores() {
    return this.board
  }

  getWinner() {
    return this.sort()[0]
  }

  sort() {
    return this.board.sort((p1, p2) => p2.scores - p1.scores)
  }
}

module.exports = new ScoreBoard()
```

Our `ScoreBoard` has a `board` that contains all `players` and their `scores`. Everytime a player joins a `Game`, the player will be added to the `board`.

```js
const ScoreBoard = require('./ScoreBoard')

class Game {
  constructor(name) {
    this.name = name
  }

  getName() {
    return this.name
  }

  join(player) {
    ScoreBoard.join(player.getName())
  }
}

module.exports = Game
```

As we `require('./ScoreBoard')` throughout our code, all players' scores will be stored at our `ScoreBoard` object.

```js
const ScoreBoard = require('./ScoreBoard')

class Player {
  constructor(name) {
    this.name = name
  }

  getName() {
    return this.name
  }

  win(scores) {
    ScoreBoard.update(this.name, scores)
  }

  lose(scores) {
    ScoreBoard.update(this.name, -scores)
  }
}

module.exports = Player
```

Let's create two `Game` objects with different players to join the game. Each `Player` wins and loses its `scores` in separated games.

Notice that `Game` is not a Singleton.

```js
// classes
const ScoreBoard = require('./ScoreBoard')
const Game = require('./Game')
const Player = require('./Player')

// games
const MondayGame = new Game('Monday Game')
const SundayGame = new Game('Sunday Game')

// players
const jack = new Player('Jack')
const adam = new Player('Adam')
const katherin = new Player('Katherin')

// 1st game
MondayGame.join(jack)
MondayGame.join(adam)

jack.win(100)
jack.win(100)
jack.lose(50)
adam.lose(100)
adam.win(200)

console.log(MondayGame.getName())
// => 'Monday Game'

SundayGame.join(katherin)
katherin.win(100)
katherin.win(200)

console.log(SundayGame.getName())
// => 'Sunday Game'

const scores = ScoreBoard.showScores()

const scoresLog = console.log('Scores: ', scores)
// => Scores: [ { name: 'Jack', scores: 150 },
//   { name: 'Adam', scores: 100 },
//   { name: 'Katherin', scores: 300 } ]

const winnerLog = console.log(
  `Winner: ${ScoreBoard.getWinner().name}. Winner's scores: ${
    ScoreBoard.getWinner().scores
  }`
)
// => Winner: Katherin Winner's scores: 300
```

### Credits

From this [article](https://grokonez.com/node-js/how-to-implement-singleton-in-node-js-example) published on [grokonez.com](https://grokonez.com/)
