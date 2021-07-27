let compose = (fn2, fn1) => (origValue) => fn2(fn1(origValue))

const palavras = (str) =>
  String(str)
    .toLowerCase()
    .split(/\s/)
    .filter((v) => /[a-zA-Z0-9\u00C0-\u00ff]+/.test(v))

const unique = (lista) => {
  var uniqueList = []
  for (let item of lista)
    if (uniqueList.indexOf(item) === -1) uniqueList.push(item)
  return uniqueList
}

const texto = 'As palavras vão como palavras carregar sentido'

let extrairPalavras = (str) => unique(palavras(str))
let exemplo = extrairPalavras(texto)
console.log(exemplo)

let extrair = compose(unique, palavras)
let exemploDois = extrair(texto)
console.log(exemploDois)

let toUppercase = (lista) => lista.map((item) => item.toUpperCase())

let arrayPalavrasEmMaisculta = compose(toUppercase, palavras)
let exemploTres = arrayPalavrasEmMaisculta(texto)
console.log(exemploTres)
