# Funcional Programming

## Basic Composition

Let's write a compose function utility which takes two functions and makes one function.

```js
let compose = (fn2, fn1) => (origValue) => fn2(fn1(origValue))

const palavras = (str) =>
  String(str)
    .toLowerCase()
    .split(/\s/)
    .filter((v) => /[a-zA-Z0-9\u00C0-\u00ff]+/.test(v))

const unique = (lista) => {
  var uniqueList = []
  // value not yet in the new lista?
  for (let item of lista)
    if (uniqueList.indexOf(item) === -1) uniqueList.push(item)
  return uniqueList
}
```

### Usage

```js
const texto =
  'As palavras vão você você nana irão irá irã irão helicóptero como palavras carregar sentido'

let extrairPalavras = (str) => unique(palavras(str))

let exemplo = extrairPalavras(texto)
console.log(exemplo)

// equivalent to
let extrair = compose(unique, palavras)
let exemploDois = extrair(texto)
console.log(exemploDois)

let toUpperCase = (lista) => lista.map((el) => el.toUpperCase())

//
let extrairEmMaiscula = compose(toUpperCase, palavras)

let exemploTres = extrairEmMaiscula(texto)
console.log(exemploTres)
```
