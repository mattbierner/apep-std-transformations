/**
    Common text transformations.
*/
"use strict";
const pep = require('apep');

module.exports = (proto = {}) => 
    Object.create(proto, {
        'match': { value: match },
        'replace': { value: replace },
        'upper': { value: upper },
        'lower': { value: lower },
        'capitalize': { value: capitalize },
        'dict': { value: dict },
        'dicti': { value: dicti },
    });

const toLowerCase = x => ('' + x).toLowerCase();
const toUpperCase = x => ('' + x).toUpperCase();

const standardMapReplace = (whole, g1) => g1 === undefined ? whole : g1;

/**
    Try to match against one or more regular expressions.
    
    Match is designed to be used for declarations:
    
        const m = match()
            .case(/ab(c)/)
            .case(/ax/, x => x + x)
            ...
            .case(...);
            
    The result can then be applied to a generator.
    
        m(pep.str('abc'));
        
    Matches are on yielded values, use `pep.join` to match against all values.
    
    If no mapping function is provides, a successfully matched case returns 
    the first capture group of the match
    
    If a mapping function is provided, the function is invoked with the entire
    string plus the match capture groups as arguments.
*/
const match = module.exports.match = () => {
    let cases = [];
    const matcher = x => {
        x = ('' + x);
        for (const [matcher, replacer] of cases) {
            const match = x.match(matcher);
            if (match)
                return replacer.apply(null, [x].concat(match.slice(1)));
        }
        return x;
    };
    
    const self = g => pep.map(g, matcher);
    self.case = (l, r = standardMapReplace) => {
        cases.push([l, r]);
        return self;
    };
    return self
};

/**
    Run `String.prototype.replace` on the result of a generator.
    
    Curried because you usually want to save off the mapping
    function as a named generator.
        
    @param target What to replace. Passed to String.prototype.replace
    @param replacer How to replace. Passed to String.prototype.replace
*/
const replace = module.exports.replace = (target, replacer) =>
    match()
        .case(target, x => x.replace(target, replacer));

/**
    Convert the result of `g` to upper case.
*/
const upper = module.exports.upper = (g) =>
    pep.map(g, toUpperCase);

/**
    Convert the result of `g` to lower case.
*/
const lower = module.exports.lower = (g) =>
    pep.map(g, toLowerCase);

/**
    Capitalize words in `g`.
    
    This is run for each yielded value. Use `pep.join` if you want proper
    capitalization spanning yielded values:    
    
        const p = pep.seq('ab c', 'd ef');
        
        pep.run(capitalize(p)) === 'Ab CD Ef';
        pep.run(capitalize(pep.join(p))) === 'Ab Cd Ef';
*/
const capitalize = module.exports.capitalize =
    replace(/\b\w/g, toUpperCase);

/**
    Case sensitive dictionary map function.
    
    Curried because you usually want to save off the mapping
    function as a named generator.
     
    @param dictionary Object mapping string keys to values.
    @param def Default value returned if non match is found
*/
const dict = module.exports.dict = (dictionary, def = '') => {
    const lookup = x =>
        (dictionary.hasOwnProperty(x) ? dictionary[x] : def);
    return (g) => pep.map(g, lookup);
}

/**
    Case insensitive dictionary mapping.
    
    @see dict.
*/
const dicti = module.exports.dicti = (dictionary, def = '') => {
    const lookupTable = Object.keys(dictionary).reduce((p, c) => {
        p[toLowerCase(c)] = dictionary[c];
        return p;
    }, {});

    const lookup = x => {
        const key = toLowerCase(x);
        return (dictionary.hasOwnProperty(key) ? dictionary[key] : def);
    };
    
    return (g) => pep.map(g, lookup);
};