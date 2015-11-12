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
const p = pep.upper(pep.seq('foo', 'a1b2c', ' 3d '));

Array.from(p) === ['FOO', 'A1B2C', ' 3D '];
```

#### `lower(generator)`
Convert the results of a generator to lowercase.

```js
const p = pep.upper(pep.seq('FOO', 'A1B2C', ' 3D '));

Array.from(p) === ['foo', 'a1b2c', ' 3d '];
```

#### `capitalize(generator)`
Capitalize the results of a generator.

This is run for each yielded value. Use `pep.join` if you want proper capitalization spanning yielded values:    

```js    
const p = pep.seq('ab c', 'd ef');

pep.run(capitalize(p)) === 'Ab CD Ef';
pep.run(capitalize(pep.join(p))) === 'Ab Cd Ef';
```



[apep]: https://github.com/mattbierner/apep
