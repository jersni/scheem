var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('parser.peg', 'utf-8');
// Show the PEG grammar file
console.log(data);
// Create my parser
var parse = PEG.buildParser(data).parse;
// Do a test
assert.deepEqual( parse("atom"), "atom" );
assert.deepEqual( parse("( )"), [] );
assert.deepEqual( parse("(inneratom)"), ["inneratom"] );

assert.deepEqual( parse("( a b c )"), ["a", "b", "c"] );
assert.deepEqual( parse("(+ (+ 1 2) 2)"), ["+", ["+", "1", "2"], "2"] );
assert.deepEqual( parse("(car\t(\nquote 1 2 3)\n)"), ["car", ["quote","1","2","3"]] );
assert.deepEqual( parse("(   car ( cdr\t(\nquote   1 2 (+ 1 2)   3)   \n  ))"), 
         ["car", ["cdr", ["quote", "1", "2", ["+", "1", "2"], "3"]]]);
assert.deepEqual( parse("'a"), ["quote", "a"] );
assert.deepEqual( parse("'(a b c)"), ["quote", ["a", "b", "c"]] );
assert.deepEqual( parse(";; Comment\na"), "a" );

var commentIn = ";; comment\n" + "(1 2 3);; comment after";
assert.deepEqual( parse(commentIn), ["1", "2", "3"] );
