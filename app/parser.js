class Statement {
    accept(){
        
    }
}

class Expression {
    accept(){}
}
class ExpressionStatement extends Statement {
    constructor(expression){
        super();
        this.expression = expression;
    }
    accept(visitor){
        return visitor.visitExpressionStatement(this);
    }
}

class Visitor {
    visitExpressionStatement(){};
    visitPrint(){};

    visitLiteral(){};
    visitGrouping(){};
    visitUnary(){};
    visitBinary(){};
}


class AstPrinter extends Visitor {
    print(expression) {
        return expression.accept(this);
    }

    visitExpressionStatement(expressionStatement) {
        return this.print(expressionStatement.expression);
    }

    visitPrint(printStatement){
        return this.parenthesize(
            "PRINT",
            printStatement.expression,
        );
    }
    visitVar(varStatement) {
        return this.parenthesize(
            "VAR",
            varStatement.identifier,
            varStatement.expression,
        ); 
    }
    visitAssignment(assignmentStatement) {
        return this.parenthesize(
            "ASSIGN",
            assignmentStatement.identifier,
            assignmentStatement.expression,
        ); 
    }
    visitIdentifier(identifierExpression) {
        return identifierExpression.name
    }
    visitLiteral(expression){
        if (expression.type == "STRING") return expression.literal;
        else if (expression.type === "NUMBER") return expression.literal;
        return expression.value === null ? "nil" : expression.value.toString();
    }
    visitGrouping(expression){
        return this.parenthesize("group", expression.expression);
    }
    visitUnary(expression) {
        return this.parenthesize(expression.operator.lexeme, expression.right);
    }
    visitBinary(expression) {
        return this.parenthesize(expression.operator.lexeme, expression.left, expression.right);
    }
    visitLogicalOp(logicalOpExpression) {
        const {leftExpression, operator, rightExpression} = logicalOpExpression;
        return this.parenthesize(operator.lexeme, leftExpression, rightExpression);
    }
    visitIf(ifStatement) {
        return this.parenthesize(
            "IF",
            ifStatement.expression,
            ifStatement.statementIf,
            ifStatement.statementElse
        );
    }
    visitWhile(ifStatement) {
        return this.parenthesize(
            "WHILE",
            ifStatement.expression,
            ifStatement.statement,
        );
    }
    visitFor(forStatement) {
        return this.parenthesize(
            "FOR",
            forStatement.firstExpression,
            forStatement.secondExpression,
            forStatement.thirdExpression,
            forStatement.statement,
        );
    }
    visitReturn(forStatement) {
        return this.parenthesize(
            "RETURN",
            forStatement.expression,
        );
    }
    visitFunction(functionStatement) {
        return this.parenthesize(
            "FUNCTION",
            functionStatement.name,
            functionStatement.statement,
        );
    }
    visitCall(callExpression) {
        return this.parenthesize(
            "CALL",
            callExpression.expression,
            ...callExpression.args
        );
    }
    visitFunctionDeclaration(functionDeclarationExpression){
        const {name, parameters, statement} = functionDeclarationExpression;
        return this.parenthesize(
            "FN",
            name,
            ...parameters,
            statement,
        );
    }
    parenthesize(name, ...expressions){
        let string = `(${name} `;
        string += expressions.map(expression => expression.accept(this)).join(" ");
        return string + ")";
    }
}

class Print extends Statement {
    constructor(expression) {
        super();
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitPrint(this);
    }
}


class Var extends Statement {
    constructor(identifier, expression) {
        super();
        this.identifier = identifier;
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitVar(this);
    }
}

class Block extends Statement {
    constructor(statements){
        super();
        this.statements = statements;
    }
    accept(visitor) {
        return visitor.visitBlock(this);
    }
}

class If extends Statement {
    constructor(expression, statementIf, statementElse) {
        super();
        this.expression = expression;
        this.statementIf = statementIf;
        this.statementElse = statementElse;
    }
    accept(visitor) {
        return visitor.visitIf(this);
    }
}


class While extends Statement {
    constructor(expression, statement) {
        super();
        this.expression = expression;
        this.statement = statement;
    }
    accept(visitor) {
        return visitor.visitWhile(this);
    }
}


class For extends Statement {
    constructor(firstExpression, secondExpression, thirdExpression, statement) {
        super();
        this.firstExpression = firstExpression;
        this.secondExpression = secondExpression;
        this.thirdExpression = thirdExpression;
        this.statement = statement;
    }
    accept(visitor) {
        return visitor.visitFor(this);
    }
}


class Return extends Statement {
    constructor(value) {
        super();
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitReturn(this);
    }
}



class FunctionDeclaration extends Statement {
    constructor(name, parameters, statement) {
        super();
        this.name = name;
        this.parameters = parameters;
        this.statement = statement;
    }
    accept(visitor) {
        return visitor.visitFunctionDeclaration(this);
    }
}


class Call extends Expression {
    constructor(expression, args) {
        super();
        this.expression = expression;
        this.args = args;
    }
    accept(visitor) {
        return visitor.visitCall(this);
    }
}


class Assignment extends Expression {
    constructor(identifier, expression) {
        super();
        this.identifier = identifier;
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitAssignment(this);
    }
}

class Literal extends Expression {
    constructor(value, literal, type) {
        super();
        this.value = value;
        this.literal = literal;
        this.type = type
    }

    accept(visitor) {
        return visitor.visitLiteral(this);
    }

}

class Binary extends Expression {
    constructor(leftExpression, operator, rightExpression) {
        super();
        this.left = leftExpression;
        this.operator = operator;
        this.right = rightExpression;
    }

    accept(visitor) {
        return visitor.visitBinary(this);
    }
}
class LogicalOp extends Expression {
    constructor(leftExpression, operator, rightExpression) {
        super();
        this.leftExpression = leftExpression;
        this.operator = operator;
        this.rightExpression = rightExpression;
    }

    accept(visitor) {
        return visitor.visitLogicalOp(this);
    }
}
class Identifier extends Expression {
    constructor(name) {
        super();
        this.name = name;
    }

    accept(visitor) {
        return visitor.visitIdentifier(this);
    }
}
class Grouping extends Expression {
    constructor(expression){
        super();
        this.expression = expression;
    }

    accept(visitor){
        return visitor.visitGrouping(this);
    }
    
}

class Unary extends Expression {
    constructor(operator, rightExpression){
        super();
        this.operator = operator;
        this.right = rightExpression;
    }

    accept(visitor) {
        return visitor.visitUnary(this);
    }
}



const printAst = (tokens) => {
    const printer = new AstPrinter();

    const parser = new Parser(tokens, true);
    const stmts = parser.parse();
    if (stmts.length === 0) {
        return 65;
    }
    for (const stmt of stmts) {
        console.log(printer.print(stmt));
    }
    return 0;
}

class Parser {
    constructor(tokens, evaluateMode = false){
        this.tokens = tokens;
        this.current = 0;
        this.evaluateMode = evaluateMode;
    }

    get program() {
        const declarations = [];
        while(!this.isAtEnd){
            const stmt = this.declaration;
            declarations.push(stmt);
        }
        return declarations;
    }
    
    get declaration() {
        if (this.match("VAR")) {
            this.consume("IDENTIFIER", "Expect variable name after 'var'.");
            let expression = null;
            const identifier = new Identifier(this.previous.lexeme);
            if (this.match("EQUAL")) {
                expression = this.expression;
            } else {
                expression = new Literal(null);
            }
            this.consume("SEMICOLON", "Expect ';' after expression.");
            return new Var(identifier, expression);
        }
        if (this.match("FUN")){
            const fn = this.function;
            return fn;
        }
        return this.statement;
    }
    
    get function(){
        this.consume("IDENTIFIER", "Expect function name after 'fun'.");
        const name = this.previous.lexeme;
        this.consume("LEFT_PAREN", "Expect '(' after identifier in function declaration.");
        const parameters = this.parameters;
        this.consume("LEFT_BRACE", "Expect '{' after parameters in function declaration.");
        const block = new Block(this.block)
        this.consume("RIGHT_BRACE", "Expect '}' after function block.");
        return new FunctionDeclaration(name, parameters, block);
    }

    get parameters(){
        const parameters = [];
        if (this.match("RIGHT_PAREN")) {
            return parameters;
        }
        this.consume("IDENTIFIER", "Expect identifier after '(' in function parameters declaration.")
        parameters.push(this.previous.lexeme);
        while (this.match("COMMA")) {
            this.consume("IDENTIFIER", "Expect identifier after comma in function parameters declaration.")
            const param = this.previous.lexeme;
            parameters.push(param);
        }
        this.consume("RIGHT_PAREN", "Expect ')' after call arguments.")
        return parameters;
    }
    get statement() {
        if (this.match("PRINT")) {
            const expression = this.expression;
            this.consume("SEMICOLON", "Expect ';' after expression.");
            return new Print(expression);
        }
        if (this.match("RETURN")) {
            let value = null;

            if (!this.check("SEMICOLON")) {
                value = this.expression;
            }
            this.consume("SEMICOLON", "Expect ';' after return statement value.");
            return new Return(value);
        }
        if (this.match("IF")) {
            this.consume("LEFT_PAREN", "Expect '(' after if statement.");
            const expression = this.expression;
            this.consume("RIGHT_PAREN", "Expect ')' after if expression.");
            const statementIf = this.statement;
            let statementElse = null;
            if (this.match("ELSE")) {
                statementElse = this.statement;
            }
            return new If(expression, statementIf, statementElse);
        }
        if (this.match("WHILE")) {
            this.consume("LEFT_PAREN", "Expect '(' after while statement.");
            const expression = this.expression;
            this.consume("RIGHT_PAREN", "Expect ')' after while expression.");
            const statement = this.statement;
            return new While(expression, statement);
        }
        if (this.match("FOR")) {
            this.consume("LEFT_PAREN", "Expect '(' after while statement.");
            let firstExpression;
            if (this.match("SEMICOLON")) {
                firstExpression = null;
            } else if (this.check("VAR")) {
                firstExpression = this.declaration
            } else {
                firstExpression = this.expressionStatement;
            }
            let secondExpression = null;
            if (!this.check("SEMICOLON")) {
                secondExpression = this.expression;
            }
            let thirdExpression = null;
            this.consume("SEMICOLON", "Expect ';' after FOR condition.");
            if (!this.check("RIGHT_PAREN")) {
                thirdExpression = this.expression;
            }
            this.consume("RIGHT_PAREN", "Expect ')' after FOR expression.");

            const statement = this.statement;
            return new For(firstExpression, secondExpression, thirdExpression, statement);
        }
        if (this.match("LEFT_BRACE")) {
            const block = new Block(this.block);
            this.consume("RIGHT_BRACE", "Expect '}' after block.");
            return block;
        }
        
        return this.expressionStatement;
    }
    get block(){
        const statements = [];
        while (!this.isAtEnd && !this.check("RIGHT_BRACE")) {
            const statement = this.declaration;
            statements.push(statement);
        }
        return statements;
    }
    get expressionStatement(){
        const expression = this.expression;
        this.consume("SEMICOLON", "Expect ';' after expression.")
        return new ExpressionStatement(expression);
    }
    get expression(){
        return this.assignment;
    }
    get or(){
        let and = this.and;
        while (this.match("OR")) {
            const operator = this.previous;
            const right = this.and;
            and = new LogicalOp(and, operator, right);
        }
        return and;
    }
    get and(){
        let equality = this.equality;
        while (this.match("AND")) {
            const operator = this.previous;
            const right = this.equality;
            equality = new LogicalOp(equality, operator, right);
        }
        return equality;
    }
    get assignment(){
        const or = this.or;
        if (this.match("EQUAL")) {
            const expression = this.assignment;
            return new Assignment(or.name, expression);
        }
        return or;
    }
    get equality() {
        let expression = this.comparison;
        while (this.match("BANG_EQUAL", "EQUAL_EQUAL")) {
            const operator = this.previous;
            const right = this.comparison;
            expression = new Binary(expression, operator, right);
        }

        return expression;
    }

    get comparison() {
        let expression = this.term;

        while (this.match("GREATER", "GREATER_EQUAL", "LESS", "LESS_EQUAL")) {
            const operator = this.previous;
            const right = this.term;
            expression = new Binary(expression, operator, right);
        }

        return expression;
    }

    get term() {
        let expression = this.factor;

        while (this.match("PLUS", "MINUS")) {
            const operator = this.previous;
            const right = this.factor;
            expression = new Binary(expression, operator, right);
        }

        return expression;
    }

    get factor() {
        let expression = this.unary;
        // while (this.match("SLASH", "STAR", "MODULO")) {
        while (this.match("SLASH", "STAR")) {
                const operator = this.previous;
            const right = this.unary;
            expression = new Binary(expression, operator, right); 
        }
        return expression;
    }

    get unary() {
        if (this.match("BANG", "MINUS")) {
            const operator = this.previous;
            const expression = this.unary;
            return new Unary(operator, expression);
        }
        return this.call;
    }

    get call() {
        let primary = this.primary;

        while (true) {
            if (this.match('LEFT_PAREN')) {
                const args = this.arguments;
                primary = new Call(primary, args);
            } else {
                break;
            }
        }
        
        return primary;
    }

    get arguments(){
        const args = [];
        if (this.match("RIGHT_PAREN")) {
            return args;
        }
        args.push(this.expression);
        while (this.match("COMMA")) {
            const arg = this.expression;
            args.push(arg);
        }
        this.consume("RIGHT_PAREN", "Expect ')' after call arguments.")
        return args;
    }

    get primary() {
        const primaryValues = {
            "FALSE": false,
            "TRUE": true,
            "NIL": null,
        };
        for (const value in primaryValues) {
            if (this.match(value)) return new Literal(primaryValues[value]);
        }
        if (this.match("NUMBER", "STRING")) {
            return new Literal(this.previous.lexeme, this.previous.literal, this.previous.type);
        }
        if (this.match("LEFT_PAREN")) {
            const expression = this.expression;
            this.consume("RIGHT_PAREN", "Expect ')' after expression.")
            return new Grouping(expression);
        }
        if (this.match("IDENTIFIER")) {
            return new Identifier(this.previous.lexeme);
        }
        throw error(this.peek, "Expect expression.");
    }

    match(...types){
        for (const type of types) {
            if (this.check(type)) {
                this.advance;
                return true;
            }
        }
        return false;
    }
    consume(type, message) {
        if (this.check(type)) return this.advance;
        if (type == "SEMICOLON" && this.evaluateMode) return ;
        throw error(this.peek, message);
    }
    check(type) {
        if (this.isAtEnd) return false;
        return this.peek.type == type;
    }
    get advance() {
        if (!this.isAtEnd) this.current++;
        return this.previous;
    }
    get peek() {
        return this.tokens[this.current];
    }
    get previous() {
        return this.tokens[this.current - 1];
    }
    get isAtEnd() {
        return this.peek.type === "EOF";
    }

    parse() {
        try {
            const stmts = this.program
            return stmts;
        } catch (e) {
            return [];
        }
    }
}


const error = (token, message) => {
    if (token.type === "EOF") throw new Error(`[line ${token.line}] Error at end: ${message}`);
    else  throw new Error(`[line ${token.line}] Error at '${token.lexeme}': ${message}`);
}


export {
    printAst,
    Parser,
    Visitor,
    error,
}