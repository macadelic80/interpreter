import { error, Parser, Visitor } from "./parser.js";

class Callable {
    get arity(){}
    get toString(){}
    call(){}
}

const NativesFunction = {
    clock: () => {
        return ~~(Date.now() / 1000);
    },
    addition: (a, b) => {
        return a + b;
    },
    log: (...args) => console.log(...args),
    floor: Math.floor,
};

class CallableNativeFunction extends Callable {
    get toString(){
        return `<Native Function>`
    }
}

class CallableFunction extends Callable {
    constructor(interpreter, name, parameters, expression){
        super();
        this.parameters = parameters;
        this.name = name;
        this.interpreter = interpreter;
        this.expression = expression;
        this.interpreter.env.define(name, this);
    }
    get arity(){
        return this.parameters.length;
    }
    get toString(){
        return `<fn ${this.name}>`
    }
    call(...args){
        const localEnv = new Environment(this.interpreter.env); 
        for (const [index, name] of this.parameters.entries()) {
            localEnv.define(name, args[index]);
        }
        try {
            this.interpreter.executeBlock(this.expression.statements, localEnv);
        } catch (e) {
            if (e instanceof ReturnError) {
                return e.returnExpression;
            }
        }
        return null;
    }
}

class ReturnError extends Error {
    constructor(value) {
        super("");
        this.returnExpression = value;
    }
}

class Environment {
    constructor(parent = null){
        this.parent = parent;
        this.values = new Map();
    }

    get(variableName) {
        if (this.values.has(variableName)) {
            return this.values.get(variableName);
        }
        if (this.parent !== null) {
            return this.parent.get(variableName);
        }
        throw new Error(`Error: ${variableName} is undefined`);
    }
    assign(variableName, value){
        if (this.values.has(variableName)) {
            return this.values.set(variableName, value);
        }
        if (this.parent !== null) {
            return this.parent.assign(variableName, value);
        }

        throw new Error(`Error: ${variableName} is undefined`);
    }
    define(variableName, value) {
        this.values.set(variableName, value);
        return value;
    }
}

class Interpreter extends Visitor {
    constructor(){
        super();
        this.globals = new Environment();
        this.env = this.globals;
        this.defineNativeFunctions();
    }
    defineNativeFunctions(){
        for (const fnName in NativesFunction) {
            const fn = NativesFunction[fnName];
            const nativeFn = new CallableNativeFunction();
            nativeFn._arity = fn.length;
            nativeFn.call = fn;
            this.globals.define(fnName, nativeFn);
        }
    }
    static stringify(value){
        if (value === null) {
            return "nil";
        } else if (typeof value === "boolean") {
            return value;
        } else if (typeof value === "string") {
            return value;
        } else if (typeof value === "number") {
            return value;
        } else if (value instanceof Callable) {
            return value.toString;
        }
    }

    visitExpressionStatement(expressionStatement){
        return this.execute(expressionStatement.expression);
    }
    visitPrint(printStatement){
        const value = this.execute(printStatement.expression);
        return console.log(Interpreter.stringify(value));
    }
    visitVar(varStatement) {
        const {expression, identifier} = varStatement;
        const value = this.execute(expression);

        this.env.define(identifier.name, value);
    }
    visitAssignment(assignmentExpression) {
        const {expression, identifier} = assignmentExpression

        const value = this.execute(expression);
        this.env.assign(identifier, value);
        return value;
    }
    executeBlock(statements, env) {
        const previous = this.env;

        try {
            this.env = env;
            for (const statement of statements) {
                this.execute(statement);
            }
        } finally {
            this.env = previous;
        }

    }
    visitBlock(blockStatement){
        const {statements} = blockStatement;
        this.executeBlock(statements, new Environment(this.env));
        return null;
    }

    visitIf(ifStatement){
        const {expression, statementIf, statementElse} = ifStatement;
        const expressionValue = this.execute(expression);
        if (expressionValue){
            this.execute(statementIf);
        } else if (statementElse) {
            this.execute(statementElse);
        }
        return null;
    }

    visitWhile(whileStatement){
        const {expression, statement} = whileStatement;
        while (this.execute(expression)) {
            this.execute(statement);
        }
        return null;
    }
    visitFor(forStatement) {
        const {
            firstExpression,
            secondExpression,
            thirdExpression,
            statement,
        } = forStatement;
        if (firstExpression) this.execute(firstExpression);
        while (secondExpression && this.execute(secondExpression)) {
            this.execute(statement);
            if (thirdExpression) this.execute(thirdExpression);
        }
    }
    visitReturn(returnStatement) {
        let value = null;
        if (returnStatement.value !== null) value = this.execute(returnStatement.value);
        throw new ReturnError(value);
    }
    visitIdentifier(identifierExpression) {
        const {name} = identifierExpression;
        const value = this.env.get(name);
        return value;
    }
    visitCall(callExpression){
        const {args, expression} = callExpression;
        const callee = this.execute(expression);
        if (callee instanceof CallableFunction && args.length != callee.arity) {
            throw new Error(`Expected ${callee.arity} arguments for ${callee.name} call but got ${args.length}.`);
        }
        if (!(callee instanceof Callable)) {
            throw new Error(`Can only call function and classes, not ${callee.constructor.name} (${expression.constructor.name}).`);
        }
        const argsValue = args.map(arg => this.execute(arg));
        return callee.call(...argsValue);
    }
    visitFunctionDeclaration(functionDeclaration) {
        const {name, parameters, statement} = functionDeclaration;
        const fn = new CallableFunction(this, name, parameters, statement);
        return fn;
    }
    visitLiteral(expression){
        if (expression.type === "NUMBER") return +expression.literal;
        else if (expression.type === "STRING") return expression.literal;
        return expression.value;
    }
    visitGrouping(expression){
        return this.execute(expression.expression);
    }
    visitUnary(expression){
        debugger;
        const right = this.execute(expression.right);
        const operator = expression.operator.type;
        if (operator === "MINUS" && typeof right != "number") {
            throw error(expression.operator, "Operand must be a number.")
        }
        if (operator == "MINUS") {
            return -right;
        } else if (operator == "BANG") {
            return !right;
        }
    }
    visitLogicalOp(logicalOpExpression) {
        const {leftExpression, operator, rightExpression} = logicalOpExpression;
        const left = this.execute(leftExpression);
        const isLeftTruthly = left || typeof left === "string";
        if (operator.type === "OR") {
            if (isLeftTruthly) return left;
        } else {
            if (!isLeftTruthly) return left;
        }
        return this.execute(rightExpression);
    }
    visitBinary(expression) {
        const operator = expression.operator.type;
        const left = this.execute(expression.left);
        const right = this.execute(expression.right);
        const operations = {
            "STAR": (l, r) => l * r,
            "MODULO": (l, r) => l % r,
            "SLASH": (l, r) => l / r,
            "PLUS": (l, r) => l + r,
            "MINUS": (l, r) => l - r,
            "LESS": (l, r) => l < r,
            "LESS_EQUAL": (l, r) => l <= r,
            "GREATER": (l, r) => l > r,
            "GREATER_EQUAL": (l, r) => l >= r,
            "EQUAL_EQUAL": (l, r) => l === r,
            "BANG_EQUAL": (l, r) => l != r,
        };
        if (operator in operations) {
            if (["SLASH", "STAR", "MINUS", "MODULO"].includes(operator)) {
                if (typeof left !== "number"){
                    throw error(expression.operator, `Left operand must be number, actually (${left}): ${typeof left}`);
                } else if (typeof right !== "number") {
                    throw error(expression.operator, `Right operand must be number, actually (${right}): ${typeof right}`);            
                }
            }
            if (["PLUS"].includes(operator)) {
                const isSameType = typeof right === typeof left;
                const isAllStringOrNumber = [left, right].every(item => ["string", "number"].includes(typeof item));
                if (!isAllStringOrNumber || !isSameType) {
                    throw error(expression.operator, `Operands must be both string or numbers, actually left (${left}): ${typeof left} and right (${right}): ${typeof right}`);               
                }
            }
            if (["GREATER", "GREATER_EQUAL", "LESS", "LESS_EQUAL"].includes(operator)) {
                if (typeof left !== "number"){
                    throw error(expression.operator, `Left operand must be number, actually (${left}): ${typeof left}`);
                } else if (typeof right !== "number") {
                    throw error(expression.operator, `Right operand must be number, actually (${right}): ${typeof right}`);            
                }
            }
            return operations[operator](left, right);
        } else {
            throw new Error("fatal operator error");
        }
    }
    execute(expression){
        const value = expression.accept(this);
        return value;
    }
    interpret(statements){
        statements.forEach(statement => {
            this.execute(statement);
        })
    }
}

const evaluate = (tokens) => {
    const interpreter = new Interpreter();

    const parser = new Parser(tokens, true);
    const parsed = parser.parse();
    if (parsed === null) {
        return 70;
    }
    try {
        const value = interpreter.execute(parsed[0]);
        console.log(Interpreter.stringify(value));
        return 0;
    } catch (e) {
        debugger;
        console.error(e.message);
        return 70;
    }
}

const interpret = (tokens) => {
    const interpreter = new Interpreter();

    const parser = new Parser(tokens);
    const parsed = parser.parse();
    if (parsed.length === 0) {
        return 65;
    }
    try {
        const value = interpreter.interpret(parsed);      
        Interpreter.stringify(value);
        return 0;
    } catch(e){
        return 70;
    }
}


export {
    interpret,
    evaluate,
}