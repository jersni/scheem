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
            env[expr[1]] = evalScheem(expr[2], env);
            return 0;
        case 'set!':
            env[expr[1]] = evalScheem(expr[2], env);
            return 0;
        case '+':
            return evalScheem(expr[1], env) + 
                   evalScheem(expr[2], env);
        case '-':
            return evalScheem(expr[1], env) - 
                   evalScheem(expr[2], env);
        case '*':
            return evalScheem(expr[1], env) * 
                   evalScheem(expr[2], env);
        case '/':
            return evalScheem(expr[1], env) / 
                   evalScheem(expr[2], env);
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
            return expr[1];
        case '<':
            var lt =
                (evalScheem(expr[1], env) <
                evalScheem(expr[2], env));
            if (lt) return '#t';
            return '#f'
        case '=':
            var eq =
                (evalScheem(expr[1], env) ===
                evalScheem(expr[2], env));
            if (eq) return '#t';
            return '#f'
        case 'cons':
            var a = evalScheem(expr[1], env);
            var b = evalScheem(expr[2], env);
            return [a].concat(b);
        case 'car':
            return evalScheem(expr[1], env)[0];
        case 'cdr':
            var v = evalScheem(expr[1], env);
            v.shift();
            return v;
        case 'if':
            if(evalScheem(expr[1], env) === '#t') {
                return evalScheem(expr[2], env);
            } else {
                return evalScheem(expr[3], env);
            }
    }
};
