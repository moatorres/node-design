const Semaforo = function (direcao, timer) {
  this.state = {
    cor: 'vermelho',
    direcao,
  }

  this.proximaCor = null
  this.setProximaCor = (fn) => (this.proximaCor = fn)

  this.executar = function () {
    let verde = new Cor(this.state, '🟢', 10)
    let amarelo = new Cor(this.state, '🟡', 5)
    let vermelho = new Cor(this.state, '🔴', 0)

    verde.setProximaCor(amarelo)
    amarelo.setProximaCor(vermelho)
    vermelho.setProximaCor(this.proximaCor)

    verde.executar()
  }
}

const Cor = function (semaforo, cor, segundos) {
  this.semaforo = semaforo
  this.proximaCor = null
  this.setProximaCor = (fn) => (this.proximaCor = fn)
  this.executar = function () {
    this.semaforo.cor = cor
    console.log(this.semaforo.cor, this.semaforo.direcao)
    setTimeout(() => this.proximaCor.executar(), segundos * 1000)
  }
}

const Timer = function () {
  this.segundos = 0
  this.iniciar = () => {
    setInterval(() => {
      this.segundos += 1
      console.log(this.segundos)
    }, 1000)
  }
}

const ativar = () => {
  let NS = new Semaforo('Norte/Sul')
  let LO = new Semaforo('Leste/Oeste')

  NS.setProximaCor(LO)
  LO.setProximaCor(NS)
  NS.executar()

  let timer = new Timer()
  timer.iniciar()
}

ativar()

module.exports = { Timer, Semaforo, Cor }
