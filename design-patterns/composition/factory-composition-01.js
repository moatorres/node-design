const beber = (tipo) => {
  const bebida = tipo || 'Água'
  return {
    beberAgora: () => console.log('Começou a beber ' + bebida),
  }
}

const comer = (tipo) => {
  const comida = tipo || 'Arroz'
  return {
    comerAgora: () => console.log('Começou a comer ' + comida),
  }
}

const criarPessoa = (bebida, comida) => {
  // merge our 'behaviour' objects
  return Object.assign({}, beber(bebida), comer(comida))
}

const pessoa = criarPessoa('vinho', 'noodles')

pessoa.beberAgora() // => "Começou a beber vinho"
pessoa.comerAgora() // => "Começøu a comer noodles"
