/**
    Common text transformations.
*/
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var pep = require('apep');

var pep_trans = module.exports = function () {
    var proto = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    return Object.create(proto, Object.getOwnPropertyNames(pep_trans).reduce(function (p, c) {
        p[c] = Object.getOwnPropertyDescriptor(pep_trans, c);
        return p;
    }, {}));
};

var toLowerCase = function toLowerCase(x) {
    return ('' + x).toLowerCase();
};
var toUpperCase = function toUpperCase(x) {
    return ('' + x).toUpperCase();
};

var standardMapReplace = function standardMapReplace(whole, g1) {
    return g1 === undefined ? whole : g1;
};

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
pep_trans.match = function () {
    var cases = [];
    var matcher = function matcher(x) {
        x = '' + x;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = cases[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _step$value = _slicedToArray(_step.value, 2);

                var matcher = _step$value[0];
                var replacer = _step$value[1];

                var match = x.match(matcher);
                if (match) return replacer.apply(null, [x].concat(match.slice(1)));
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return x;
    };

    var self = function self(g) {
        return pep.map(g, matcher);
    };
    self.case = function (l) {
        var r = arguments.length <= 1 || arguments[1] === undefined ? standardMapReplace : arguments[1];

        cases.push([l, r]);
        return self;
    };
    return self;
};

/**
    Run `String.prototype.replace` on the result of a generator.
    
    Curried because you usually want to save off the mapping
    function as a named generator.
        
    @param target What to replace. Passed to String.prototype.replace
    @param replacer How to replace. Passed to String.prototype.replace
*/
pep_trans.replace = function (target, replacer) {
    return pep_trans.match().case(target, function (x) {
        return x.replace(target, replacer);
    });
};

/**
    Convert the result of `g` to upper case.
*/
pep_trans.upper = function (g) {
    return pep.map(g, toUpperCase);
};

/**
    Convert the result of `g` to lower case.
*/
pep_trans.lower = function (g) {
    return pep.map(g, toLowerCase);
};

/**
    Capitalize words in `g`.
    
    This is run for each yielded value. Use `pep.join` if you want proper
    capitalization spanning yielded values:    
    
        const p = pep.seq('ab c', 'd ef');
        
        pep.run(capitalize(p)) === 'Ab CD Ef';
        pep.run(capitalize(pep.join(p))) === 'Ab Cd Ef';
*/
pep_trans.capitalize = pep_trans.replace(/\b\w/g, toUpperCase);

/**
    Capitalize the first word in `g`.
*/
pep_trans.capitalizeFirst = pep_trans.replace(/\b\w/, toUpperCase);

/**
    Case sensitive dictionary map function.
    
    Curried because you usually want to save off the mapping
    function as a named generator.
     
    @param dictionary Object mapping string keys to values.
    @param def Default value returned if non match is found
*/
pep_trans.dict = function (dictionary) {
    var def = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

    var lookup = function lookup(x) {
        return dictionary.hasOwnProperty(x) ? dictionary[x] : def;
    };
    return function (g) {
        return pep.map(g, lookup);
    };
};

/**
    Case insensitive dictionary mapping.
    
    @see dict.
*/
pep_trans.dicti = function (dictionary) {
    var def = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

    var lookupTable = Object.keys(dictionary).reduce(function (p, c) {
        p[toLowerCase(c)] = dictionary[c];
        return p;
    }, {});

    var lookup = function lookup(x) {
        var key = toLowerCase(x);
        return dictionary.hasOwnProperty(key) ? dictionary[key] : def;
    };

    return function (g) {
        return pep.map(g, lookup);
    };
};
//# sourceMappingURL=index.js.map
