var checkMathExprTypes = function(expr, env) {
    
	// if we have a string, it must have a value defined in the Environment.
	// Otherwise we have a number or object (array)
	// numbers are OK, and arrays will get eval'ed further
	for(var i = 0; i < expr.length; i++) {
		if(typeof expr[i] === 'string') {
			if(env[expr[i]]) { } // ok, there is a value defined
			else {return false;}
		}
	}

	return true;
};

var evalScheem = function (expr, env) {

    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    if (typeof expr === 'string') {
        return env[expr];
    }
    // Look at head of list for operation

    switch (expr[0]) {
        case 'define':
			expr.shift();
			if(expr.length != 2) { throw new Error("Wrong syntax for define. Expected exactly 2 arguments.");}
			if(!(typeof expr[0] === 'string')) {throw new Error("define " + expr[0] + " Must set! to a symbol.");}
            env[expr[0]] = evalScheem(expr[1], env);
            return 0;
        case 'set!':
			expr.shift();
			if(expr.length != 2) { throw new Error("Wrong syntax for set!. Expected exactly 2 arguments.");}
			if(!(typeof expr[0] === 'string')) {throw new Error("set! " + expr[0] + " Must set! to a symbol.");}
			if(!env[expr[0]] ) {throw new Error("set! " + expr[0] + " " + "is not defined");}
            env[expr[0]] = evalScheem(expr[1], env);
            return 0;
        case '+':
			expr.shift();
			if(! checkMathExprTypes(expr, env)) {throw new Error("Bad arguments to +");}
			return expr.reduce(function(a,b) {return evalScheem(a, env) + evalScheem(b, env);});
        case '-':
			expr.shift();
			if(! checkMathExprTypes(expr, env)) {throw new Error("Bad arguments to -");}
			if(expr.length === 1) {
				return expr.reduce(function(a,b) {return evalScheem(a, env) - evalScheem(b, env);},0);
			} else {
				return expr.reduce(function(a,b) {return evalScheem(a, env) - evalScheem(b, env);});
			}
        case '*':
			expr.shift();
			if(! checkMathExprTypes(expr, env)) {throw new Error("Bad arguments to *");}
            return expr.reduce(function(a,b) {return evalScheem(a, env) * evalScheem(b, env);});
        case '/':
			expr.shift();
			if(! checkMathExprTypes(expr, env)) {throw new Error("Bad arguments to /");}
			if(expr.length === 1) {
				return expr.reduce(function(a,b) {return evalScheem(a, env) / evalScheem(b, env);}, 1);
			} else {
				return expr.reduce(function(a,b) {return evalScheem(a, env) / evalScheem(b, env);});
			}
        case 'begin':
            var lasti = expr.length - 1;
            for(var i = 1; i < expr.length; i++) {
                if(i === lasti) {
                    return evalScheem(expr[i], env);
                } else {
                    evalScheem(expr[i], env);
                }
            }
        case 'quote':
			if(expr.length > 2) { throw new Error("Wrong number of arguments to quote.");}
            return expr[1];
        case '<':
			expr.shift();

			if(expr.length === 1) {
				throw new Error("Wrong number of arguments to <. Expected at least 2 arguments");
			} else {
			
				if(false === expr.reduce(function(a,b) {return evalScheem(a, env) < evalScheem(b, env) ? b : false; })) {
					return '#f';
				} else {
					return '#t'
				}
			}

        case '=':
            expr.shift();
			if(expr.length === 1) {
				throw new Error("Wrong number of arguments to =. Expected at least 2 arguments");
			} else {
			
				if(false === expr.reduce(function(a,b) {return evalScheem(a, env) === evalScheem(b, env) ? b : false; })) {
					return '#f';
				} else {
					return '#t'
				}
			}
        case 'cons':
            expr.shift();
            if(expr.length != 2) { throw new Error("Wrong number of arguments to cons. Expected exactly 2"); } 
            var a = evalScheem(expr[0], env);
            var b = evalScheem(expr[1], env);
            return [a].concat(b);
        case 'car':
            expr.shift();
            if(expr.length != 1) { throw new Error("Wrong number of arguments to car. Expected exactly 1"); } 
            return evalScheem(expr[0], env)[0];
        case 'cdr':
            expr.shift();
            if(expr.length != 1) { throw new Error("Wrong number of arguments to cdr. Expected exactly 1"); } 
            var v = evalScheem(expr[0], env);
            v.shift();
            return v;
        case 'if':
            expr.shift();
            if(expr.length != 3) { throw new Error("Wrong number of arguments to if. Expected exactly 3"); } 
            if(evalScheem(expr[0], env) === '#t') {
                return evalScheem(expr[1], env);
            } else {
                return evalScheem(expr[2], env);
            }
    }
};
