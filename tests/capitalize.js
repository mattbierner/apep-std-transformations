"use strict";
const pep = require('apep');
const pep_trans = require('../index');
const assert = require('assert');

describe('capitalize', function () {
    it('Should extend.', () => {
        const pep2 = pep_trans(pep);
     
        const p = pep2.capitalize('a');
        assert.deepStrictEqual(['A'], Array.from(p));
    });

    it('Should capitalize case single values.', () => {     
        assert.strictEqual('A', pep_trans.capitalize('a').run());
        assert.strictEqual('A', pep_trans.capitalize('A').run());
        assert.strictEqual('Abc', pep_trans.capitalize('abc').run());
        assert.strictEqual('AbC', pep_trans.capitalize('abC').run());
        
        assert.strictEqual('A Bc', pep_trans.capitalize('a bc').run());
        assert.strictEqual('A.Bc', pep_trans.capitalize('a.bc').run());
    });
    
     it('Should capitalize case all values in a sequence.', () => {     
        assert.deepStrictEqual(
            ['AbC', '1', '!Pl', '- B'],
            Array.from(pep_trans.capitalize(['abC', '1', '!pl', '- b'])));
    });
});

