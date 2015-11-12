"use strict";
const pep = require('apep');
const pep_trans = require('../index');
const assert = require('assert');

describe('dict', function () {
    it('Should extend pep.', () => {
        const pep2 = pep_trans(pep);
     
        const p = pep2.dict({'a': 'b'});
        assert.deepStrictEqual(['b'], Array.from(p('a')));
    });

    it('Should map single value.', () => {     
        const mapper = pep_trans.dict({
            'a': 'apple',
            'b': 'banana',
            'c': 'cookie'
        }, false);
        assert.deepStrictEqual(['apple'], Array.from(mapper('a')));
        assert.deepStrictEqual(['banana'], Array.from(mapper('b')));
        assert.deepStrictEqual(['cookie'], Array.from(mapper('c')));
        
        assert.deepStrictEqual([false], Array.from(mapper('d')));
        assert.deepStrictEqual([false], Array.from(mapper('A')));
        assert.deepStrictEqual([false], Array.from(mapper('ax')));
        assert.deepStrictEqual([false], Array.from(mapper('xa')));
        assert.deepStrictEqual([false], Array.from(mapper(' a ')));
    });
    
    it('Map each value in a sequence.', () => {     
        const mapper = pep_trans.dict({
            'a': 'apple',
            'b': 'banana',
            'aa': 'aardvark'
        }, false);
        assert.deepStrictEqual(
            ['apple', 'apple', 'banana', 'aardvark', false, false],
            Array.from(mapper(['a', 'a', 'b', 'aa', 'c', 'ab'])));
    });
});

