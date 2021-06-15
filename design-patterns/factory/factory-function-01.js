const criarPessoa = (nome) => {
  function andar() {
    console.log(nome + ' está andando')
  }

  // private
  function comer() {
    console.log(nome + ' está comendo')
  }

  return {
    nome: nome,
    andar: andar,
    falar: function () {
      console.log('Meu nome é ' + this.nome)
    },
  }
}

const pessoa = criarPessoa('Moa')

pessoa.falar() // => Meu nome é Moa
pessoa.andar() // => Moa está andando
pessoa.comer() // => TypeError: pessoa.comer is not a function
