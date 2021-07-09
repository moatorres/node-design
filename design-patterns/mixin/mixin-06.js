const criarPersonagem = (nome, nivelInicial = 1) => {
  const setHP = (nivel) => nivel * 10
  const setAgi = (agilidade) => agilidade + 3
  return {
    nome,
    nivel: nivelInicial,
    agilidade: nivelInicial,
    subirNivel: function () {
      // tem acesso à props de outros mixins!
      // if(this.classe === 'Archer') return
      this.nivel++
      this.hp = setHP(this.nivel)
      this.agilidade = setAgi(this.nivel)
    },
    hp: setHP(nivelInicial),
  }
}

const genero = (genero) => (personagem) => ({
  genero,
  ...personagem,
})

const arqueiro = (personagem) => ({
  classe: 'Archer',
  habilidades: ['Arrow Strike', 'Wind Walker'],
  roupa: 'Macacão',
  ...personagem,
})

const padre = (personagem) => ({
  classe: 'Priest',
  habilidades: ['Heal', 'Blessing'],
  roupa: 'Bata',
  ...personagem,
})

const nordics = pipe(criarPersonagem, padre, genero('Masculino'))('Orwell')
const xulepa = pipe(criarPersonagem, arqueiro, genero('Masculino'))('Hunts')

console.log(nordics)
console.log(xulepa)

nordics.subirNivel()
xulepa.subirNivel()

console.log(nordics)
console.log(xulepa)
