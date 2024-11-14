class Expression {
    
    accept(){

    }
}

class Visitor extends Expression {

    
}

class AstPrinter extends Visitor {
    print(expression) {
        return expression.accept(this);
    }
    visitLiteral(expression){
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
    parenthesize(name, ...expressions){
        let string = `(${name} `;
        string += expressions.map(expression => expression.accept(this)).join(" ");
        return string + ")";
    }
}
class Literal extends Expression {
    constructor(value) {
        super();
        this.value = value;
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

    const parser = new Parser(tokens);
    const parsed = parser.parse();
    console.log(printer.print(parsed));
}


class Parser {
    constructor(tokens){
        this.tokens = tokens;
        this.current = 0;
    }

    get expression() {
        return this.equality;
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
        return this.primary;
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
            return new Literal(this.previous.literal);
        }
        if (this.match("LEFT_PAREN")) {
            const expression = this.expression;
            this.consume("RIGHT_PAREN", "Expect ')' after expression.")
            return new Grouping(expression);
        }
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
        throw new Error(this.peek, message);
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
            return this.expression;
        } catch (e) {
            console.log("ERROR", e);
            return null;
        }
    }
}



export {
    // Parser,
    printAst,
    // AstPrinter
}