# Apep-std-transformations

Common generators and combinators for transforming text in [Apep Javascript text generation library][apep].

## Usage
```sh
$ npm install apep-std-transformations
```

You can either use `apep-std-transformations` as its own include:

```js
const pep = require('apep');
const pep_trans = require('apep-std-transformations');

const p = pep_vars.store(...);
```

Or by extending an Apep instance:

```js
let pep = require('apep');
pep = require('apep-std-transformations')(pep);

const p = pep.store(...);
```

Extension does not alter the original Apep include but creates a simple proxy that also has the std-var functionality. 

## Documentation

#### `upper(generator)`
Convert the results of a generator to uppercase.

```js
const p = pep_trans..upper(pep.seq('foo', 'a1b2c', ' 3d '));

Array.from(p) === ['FOO', 'A1B2C', ' 3D '];
```

#### `lower(generator)`
Convert the results of a generator to lowercase.

```js
const p = pep_trans.lower(pep.seq('FOO', 'A1B2C', ' 3D '));

Array.from(p) === ['foo', 'a1b2c', ' 3d '];
```

#### `capitalize(generator)`
Capitalize the results of a generator.

This is run for each yielded value. Use `pep.join` if you want proper capitalization spanning yielded values:    

```js    
const p = pep.seq('ab c', 'd ef');

pep.run(pep_trans.capitalize(p)) === 'Ab CD Ef';
pep.run(pep_trans.capitalize(pep.join(p))) === 'Ab Cd Ef';
```

#### `dict(map, default = '')(generator)`
Create a text mapping combinator. 

* `map` - Object mapping string keys to values.
* `default` - Value returned if no match is found.
* `generator` - Generator to map.

This function is auto curried as you usually want to use it to declare a top level mapping function that can be applied to any generator.

Keys must exactly match for `dict`. Use `dicti` if you don't care about case.

```js
const pep_vars = require('apep-std-var');

const possessive = pep_trans.dict({
    Alice: 'her',
    Bob: 'his', 
}, 'their');

// Make sure we compute name just once and cache the result.
const name = pep_vars.store('name', pep.choice('Alice', 'Bob', 'Charlie'));

const p = pep.seq(
    "This is ", name, ', and this is ', possessive(name), ' dog.');

p.run() === "This is Bob, and this is his dog.";
p.run() === "This is Charlie, and this is their dog.";
p.run() === "This is Alice, and this is her dog.";
```

#### `dicti(map, default = '')(generator)`
Same as `dict` but keys are case intensive.

* `map` - Object mapping string keys to values.
* `default` - Value returned if no match is found.
* `generator` - Generator to map.

#### `match()[.case(l, r)....case(l2, r2)](generator)`
Generic text matching. Attempt to match against one or more regular expression and use an optional mapping functions to process result.

`match` is designed to be used for declarations:
    
```js
const m = pep_trans.match()
    .case(/ab(c)/)
    .case(/ax/, x => x + x)
    ...
    .case(...);
```

The result can then be applied to a generator.

```js  
m(pep.str('abc'));
```

The first value of `case` is a regular expression. If the regular expression succeeds against the target value, the mapping function is run:

```js
const pluralize = pep_trans.match()
    .case(/(.*)y$/,   (_, x) => x + 'ies')
    .case(/(.*s)$/,   (_, x) => x + 'es')
    .case(/.*/,       (x) => x + 's');

pluralize('candy').run() === 'candies';
pluralize('cake').run() === 'cake';
pluralize('class').run() === 'classes';
```

The mapping function is invoked with the entire string, plus the match capture groups as arguments.

If no mapping function is provides, a successfully matched case returns 
the first capture group of the match.

Matches are on yielded values, use `pep.join` to match against all values.

#### `replace(target, replacer)(generator)`
Run `String.prototype.replace` on the result of a generator.

* `matcher` - What to replace. Passed to `String.prototype.replace`.
* `replacer` - How to replace. Passed to `String.prototype.replace`.

Curried because you usually want to save off the mapping function as a named generator.
        
   


[apep]: https://github.com/mattbierner/apep
