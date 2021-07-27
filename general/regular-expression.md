# Utilities

## Regular Expression

Regular expressions are used for text searching and more advanced text manipulation. Regular expressions are built-in tools like `grep`, `sed`, text editors like `vi`, `emacs`, programming languages like JavaScript, Perl, and Python.

In JavaScript, we build regular expressions either with slashes `//` or a `RegExp` object.

A **pattern** is a regular expression that defines the text we are searching for or manipulating. It **consists of text literals and metacharacters**.

Metacharacters are special characters that control how the regular expression is going to be evaluated. For instance, with `\s` we search for white spaces.

After we have created a pattern, we can use one of the functions to apply the pattern on a text string. The funcions include `test()`, `match()`, `search()`, and `replace()`.

<details><summary>Check this table for some regular expressions</summary>

| Regex    | Meaning                                                     |
| -------- | ----------------------------------------------------------- | ------------------------ |
| `.`      | Matches **any** single character                            |
| `?`      | Matches the preceding element **once** or not at all        |
| `+`      | Matches the preceding element **once or more** times        |
| `*`      | Matches the preceding element **zero or more** times        |
| `^`      | Matches the **starting position** within the string         |
| `$`      | Matches the **ending position** within the string           |
| `        | `                                                           | **Alternation** operator |
| `[abc]`  | Matches `a`, `b`, or `c`                                    |
| `[a-c]`  | Range, matches `a`, `b`, or `c`                             |
| `[^abc]` | Negation, matches **everything except** `a`, `b`, or `c`    |
| `\s`     | Matches **white space** characters                          |
| `\w`     | Matches a **word** character (equivalent to `[a-zA-Z_0-9]`) |

</details>

### `test()`

The `test()` method executes a search for a match between a `regular expression` and a specified `string` and returns either `true` or `false`

In this example, we have an array of words. The pattern will look for a `'book'` string in each of the words.

```js
let words = ['book', 'bookworm', 'Bible', 'bookish', 'cookbook']

let pattern = /book/

words.forEach((word) => {
  if (pattern.test(word)) {
    console.log(`the ${word} matches`)
  }
})
```

We created our pattern using `slashes`. The regular expression consists of four normal characters.

```js
let pattern = /book/
```

We can go through the array of `words` and call the `test()` function, which returns `true` if the pattern matches the `word`.

```js
words.forEach((word) => {
  if (pattern.test(word)) {
    console.log(`the ${word} matches`)
  }
})
```

### `search()`

The `search()` function **returns the index of the first match** between the regular expression and the given `string` or `-1` if no match is not found.

In this example, we find out the index of the first match of the `'fox'` term

```js
let text = 'I saw a fox in the wood. The fox had red fur.'

let pattern = /fox/

let idx = text.search(pattern)
console.log(`the term was found at index: ${idx}`)
```

### `exec()`

The `exec()` function **executes a search for a match** in a specified string and returns an `object` with information about the match.

In this example, we apply the pattern on the input strings with `exec()`. We print the information about the match. It includes the index where the match begins.

```js
let words = [
  'book',
  'bookworm',
  'Bible',
  'bookish',
  'cookbook',
  'bookstore',
  'pocketbook',
]

let pattern = /book/

words.forEach((word) => {
  let res = pattern.exec(word)

  if (res) {
    console.log(`${res} matches ${res.input} at index: ${res.index}`)
  }
})
```

### `match()`

The `match()` function retrieves the matches when matching a pattern against an input string.

In this example, we find out the number of occurrences of the `'fox'` term. The `g` character is **a flag that finds all occurrences** of a term. Normally, the search ends when the first occurrence is found.

```js
let text = 'I saw a fox in the wood. The fox had red fur.'

let pattern = /fox/g

let found = text.match(pattern)

console.log(`There are ${found.length} matches`)
```

### `replace()`

The `replace()` function returns a new string with **some or all matches** of a pattern replaced by a replacement string

In the example, we create a new string from an input string, where we replace `'gray'` words with `'grey'`. The `g` character is a **flag that finds all occurrences** of a term.

```js
let text = 'He has gray hair; gray clouds gathered above us.'

let pattern = /gray/g

let newText = text.replace(pattern, 'grey')

console.log(newText)
```

#### `i` flag

To enable case insensitive search, we can use the `i` flag

In the example, we apply the pattern on words regardless of the case. Appending the `i` flag, we do **case insensitive search**.

```js
let words = ['dog', 'Dog', 'DOG', 'Doggy']

let pattern = /dog/i

words.forEach((word) => {
  if (pattern.test(word)) {
    console.log(`the ${word} matches`)
  }
})
```

#### `.` dot

The `.` metacharacter stands for any single character in the text

In this example, we have eight words in an array. We apply a pattern containing two dot metacharacters. There will be two words that match the pattern.

```js
let words = [
  'seven',
  'even',
  'prevent',
  'revenge',
  'maven',
  'eleven',
  'amen',
  'event',
]

let pattern = /..even/

words.forEach((word) => {
  if (pattern.test(word)) {
    console.log(`the ${word} matches`)
  }
})
```

#### `?` question mark

The `?` meta character is a quantifier that **matches the previous element zero or one time**

In this example, we add a question mark after the `.` character. This means that in the pattern we can have **one arbitrary character or no character**. This time the `even` and `event` words, which do not have a preceding character, match as well.

```js
let words = [
  'seven',
  'even',
  'prevent',
  'revenge',
  'maven',
  'eleven',
  'amen',
  'event',
]

let pattern = /.?even/

words.forEach((word) => {
  if (pattern.test(word)) {
    console.log(`the ${word} matches`)
  }
})
```

#### Anchors

Anchors **match positions of characters** inside a given text. When using the **`^` anchor** the match must occur at the **beginning** of the string and when using the **`$` anchor** the match must occur at the **end** of the string.

In this example, we have three sentences. The search pattern is `^Jane`. The pattern checks if the `"Jane"` string is located at the beginning of the text. The pattern `Jane\.` would look for `"Jane"` at the end of the sentence.

```js
let sentences = [
  'I am looking for Jane.',
  'Jane was walking along the river.',
  'Kate and Jane are close friends.',
]

let pattern = /^Jane/

sentences.forEach((sentence) => {
  if (pattern.test(sentence)) {
    console.log(`${sentence}`)
  }
})
```

#### Exact match

An exact match can be performed by placing the term between the anchors: `^` and `$`.

In the example, we look for an exact match for the `'even'` term.

```js
let words = [
  'seven',
  'even',
  'prevent',
  'revenge',
  'maven',
  'eleven',
  'amen',
  'event',
]

let pattern = /^even$/

words.forEach((word) => {
  if (pattern.test(word)) {
    console.log(`the ${word} matches`)
  }
})
```

#### Character classes

A character class defines a set of characters, any one of which can occur in an input string for a match to succeed.

In this example, we use a **character class** to include both `gray` and `grey` words. The `[ea]` class allows to use either `'e'` or `'a'` character in the pattern.

```js
let words = ['a gray bird', 'grey hair', 'great look']

let pattern = /gr[ea]y/

words.forEach((word) => {
  if (pattern.test(word)) {
    console.log(`${word}`)
  }
})
```

#### Named character classes

There are some predefined character classes. The `\s` matches a whitespace character `[\t\n\t\f\v]`, the `\d` a digit `[0-9]`, and the `\w` a word character `[a-zA-Z0-9_]`.

In the example, we search for numbers in the text.

```js
let text = 'We met in 2013. She must be now about 27 years old.'

let pattern = /\d+/g

while ((found = pattern.exec(text)) !== null) {
  console.log(`found ${found} at index ${found.index}`)
}
```

The `\d+` pattern looks for any number of digit sets in the text. The `g` flag makes the search not stop at first occurrence. To find all the matches, we use the `exec()` function in a _while loop_.

```js
let pattern = /\d+/g

while ((found = pattern.exec(text)) !== null) {
  console.log(`found ${found} at index ${found.index}`)
}
```

In the following example, we have an alternative solution using the `match()` function. To count numbers, we use the `\d` named class.

```js
let text = 'I met her in 2012. She must be now about 27 years old.'

let pattern = /\d+/g

var found = text.match(pattern)

console.log(`There are ${found.length} numbers`)

found.forEach((num, i) => {
  console.log(`match ${++i}: ${num}`)
})
```

#### Counting words

In the next example, we count words in the text. The `\w` name set stands for a word character. The pattern uses a quantifier `+` to search for one or more word characters. The `g` flag makes the search look for all words in the string. We then print the number of words to the console.

```js
let text = 'The Sun was shining; I went for a walk.'

let pattern = /\w+/g

let found = text.match(pattern)

console.log(`There are ${found.length} words`)
```

#### Alternations

The alternation operator `|` creates a regular expression with several choices. Our regular expression looks for `"Jane"`, `"Beky"`, or `"Robert"` strings.

```js
let words = [
  'Jane',
  'Thomas',
  'Robert',
  'Lucy',
  'Beky',
  'John',
  'Peter',
  'Andy',
]

let pattern = /Jane|Beky|Robert/

words.forEach((word) => {
  if (pattern.test(word)) {
    console.log(`the ${word} matches`)
  }
})
```

#### Capturing groups

Capturing groups is a way to **treat multiple characters as a single unit**. They are created by placing charactes inside a set of round brackets. For instance, `book` is a single group containing `b`, `o`, `o`, `k`, characters.

The **capturing groups** technique allows us to **find out those parts of a string that match the regular expression pattern**.

This example prints all HTML tags from the supplied string by capturing a group of characters. In order to find all tags, we use the `match()` method.

```js
content = `<p>The <code>Pattern</code> is a compiled
representation of a regular expression.</p>`

let pattern = /(<\/?[a-z]*>)/g

let found = content.match(pattern)

found.forEach((tag) => {
  console.log(tag)
})
```

#### Email `RegEx` example

In the following example, we create a regex pattern for checking email addresses.

```js
let emails = [
  'luke@gmail.com',
  'andy@yahoocom',
  '34234sdfa#2345',
  'f344@gmail.com',
]

let pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,18}$/

emails.forEach((email) => {
  if (pattern.test(email)) {
    console.log(`${email} matches`)
  } else {
    console.log(`${email} does not match`)
  }
})
```

The first `^` and the last `$` characters provide an exact pattern match. No characters before and after the pattern are allowed. The email is divided into five parts. The first part is the local part. This is usually a name of a company, individual, or a nickname. The `[a-zA-Z0-9._-]+` lists all possible characters that we can use in the local part. They can be used one or more times.

The second part consists of the literal `@` character. The third part is the domain part. It is usually the domain name of the email provider such as `yahoo`, or `gmail`. The `[a-zA-Z0-9-]+` is a character class providing all characters that can be used in the domain name. The `+` quantifier allows to use of one or more of these characters.

The fourth part is the `.` character; it is preceded by the escape character `\` to get a literal dot.

The final part is the top level domain name: `[a-zA-Z.]{2,18}`. Top level domains can have from 2 to 18 characters, such as `sk`, `net`, `info`, `travel`, `cleaning`, `travelinsurance`. The maximum lenght can be 63 characters, but most domain are shorter than 18 characters today. There is also a dot literal character. This is because some top level domains have two parts; for instance co.uk

### Credits

From this [article](https://zetcode.com/javascript/regularexpressions/) written by [@janbodnar](https://github.com/janbodnar)
