"use strict";
const pep = require('apep');
const pep_trans = require('../index');
const assert = require('assert');

describe('lower', function () {
    it('Should extend.', () => {
        const pep2 = pep_trans(pep);
     
        const p = pep2.lower('A');
        assert.deepStrictEqual(['a'], Array.from(p));
    });

    it('Should lower case single values.', () => {     
        assert.deepStrictEqual(
            ['a1!pl - b'],
            Array.from(pep_trans.lower(pep.str('A1!PL - B'))));
    });
    
    it('Should wrap non generator values.', () => {     
        assert.deepStrictEqual(
            ['ab'],
            Array.from(pep_trans.lower('AB')));
    });
    
     it('Should lower case all values in a sequence.', () => {     
        assert.deepStrictEqual(
            ['abc', '1', '!pl', '- b'],
            Array.from(pep_trans.lower(['ABC', '1', '!PL', '- B'])));
    });
});

