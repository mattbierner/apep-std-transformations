"use strict";
const pep = require('apep');
const pep_trans = require('../index');
const assert = require('assert');

describe('upper', function () {
    it('Should extend.', () => {
        const pep2 = pep_trans(pep);
     
        const p = pep2.upper('a');
        assert.deepStrictEqual(['A'], Array.from(p));
    });

    it('Should upper case single values.', () => {     
        assert.deepStrictEqual(
            ['A1!PL - B'],
            Array.from(pep_trans.upper(pep.str('a1!pl - b'))));
    });
    
    it('Should wrap non generator values.', () => {     
        assert.deepStrictEqual(
            ['AB'],
            Array.from(pep_trans.upper('ab')));
    });
    
     it('Should upper all values in a sequence.', () => {     
        assert.deepStrictEqual(
            ['ABC', '1', '!PL', '- B'],
            Array.from(pep_trans.upper(['abc', '1', '!pl', '- b'])));
    });
});

