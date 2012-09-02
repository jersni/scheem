var evalScheem = function (expr, env) {

    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    if (typeof expr === 'string') {
        return lookup(env, expr);
    }
    // Look at head of list for operation

    switch (expr[0]) {
        case 'define':
            
            if(expr.length != 3) { throw new Error("Wrong syntax for define. Expected exactly 2 arguments.");}
            if(!(typeof expr[1] === 'string')) {throw new Error("define " + expr[1] + " Must define to a symbol.");}
            
            add_binding(env, expr[1], evalScheem(expr[2], env));
            
            return 0;
        case 'set!':
            
            if(expr.length != 3) { throw new Error("Wrong syntax for set!. Expected exactly 2 arguments.");}
            if(!(typeof expr[1] === 'string')) {throw new Error("set! " + expr[1] + " Must set! to a symbol.");}
            update(env, expr[1], evalScheem(expr[2], env));
            
            return 0;
        case '+':
            return evalScheem(expr[1], env) + evalScheem(expr[2], env);
        case '-':
            return evalScheem(expr[1], env) - evalScheem(expr[2], env);
        case '*':
             return evalScheem(expr[1], env) * evalScheem(expr[2], env);
        case '/':
            return evalScheem(expr[1], env) / evalScheem(expr[2], env);
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
            if( evalScheem(expr[1], env) < evalScheem(expr[2], env) ) {
                    return '#t';
            } else {
                return '#f'
            }

        case '=':
            if( evalScheem(expr[1], env) === evalScheem(expr[2], env) ) {
                return "#t";
            } else {
                return "#f";
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
            if(evalScheem(expr[1], env) === '#t') {
                return evalScheem(expr[2], env);
            } else {
                return evalScheem(expr[3], env);
            }
        case 'let-one':
            var _var = expr[1];
            var _expr = evalScheem(expr[2], env);
            var _body = expr[3];
            var bnds = {};
            bnds[_var] = _expr;
            var e = { bindings: bnds, outer: env };
            return evalScheem(_body, e);
        case 'lambda-one':
            return function(arg) {
                var bnds = {};
                bnds[expr[1]] = arg;
                var newenv = {bindings: bnds, outer: env};
                return evalScheem(expr[2], newenv);
            };
        default:
            var func = evalScheem(expr[0], env);
            var arg = evalScheem(expr[1], env);
            return func(arg);
    }
};


var lookup = function (env, v) {
    if (!(env.hasOwnProperty('bindings')))
        throw new Error(v + " not found");
    if (env.bindings.hasOwnProperty(v))
        return env.bindings[v];
    return lookup(env.outer, v);
};

var update = function (env, v, val) {
    if (!(env.hasOwnProperty('bindings')))
        throw new Error(v + " not found");
     if(typeof env.bindings[v] === "undefined") {
        update(env.outer, v, val);
    } else {
        env.bindings[v] = val;
    }
};

var add_binding = function (env, v, val) {
    env.bindings[v] = val;
};

var evalScheemString = function(s, env) {
    return evalScheem(SCHEEM.parse(s), env)
};
