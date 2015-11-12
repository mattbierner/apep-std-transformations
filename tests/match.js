"use strict";
const pep = require('apep');
const pep_trans = require('../index');
const assert = require('assert');

describe('match', function () {
    it('Should extend pep.', () => {
        const pep2 = pep_trans(pep);
     
        const p = pep2.match()
            .case(/a(b)/);
        assert.deepStrictEqual(['b'], Array.from(p('ab')));
    });
    
    it('Empty matcher is identity function.', () => {     
        const p = pep_trans.match()
        assert.deepStrictEqual(['ab'], Array.from(p('ab')));
        assert.deepStrictEqual([''], Array.from(p('')));
        assert.deepStrictEqual([' a b 2 '], Array.from(p(' a b 2 ')));
    });

    it('Should match single regular expressions and return first group.', () => {     
        const mapper = pep_trans.match()
            .case(/a(.)c$/)
            .case(/a(.x)$/);
        assert.deepStrictEqual(['b'], Array.from(mapper('abc')));
        assert.deepStrictEqual(['dx'], Array.from(mapper('adx')));
    });
    
     it('Should match with functions expressions.', () => {     
        const mapper = pep_trans.match()
            .case(/(.*)y$/,   (_, x) => x + 'ies')
            .case(/(.*s)$/,   (_, x) => x + 'es')
            .case(/.*/,       (x) => x + 's');
            
        assert.deepStrictEqual(['candies'], Array.from(mapper('candy')));
        assert.deepStrictEqual(['cakes'], Array.from(mapper('cake')));
        assert.deepStrictEqual(['basses'], Array.from(mapper('bass')));
    });
});
