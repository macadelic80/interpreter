class Expression {
    
    accept(){

    }
}

class Visitor extends Expression {

    parenthesize(){

    }

}


class AstPrinter extends Visitor {
    print(expression) {
        return expression.accept(this);
    }
    visitLiteral(expression){
        return expression.value === null ? "nil" : expression.value.toString();
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
        this.left = leftExpression;
        this.operator = operator;
        this.right = rightExpression;
    }
}

class Grouping extends Expression {
    constructor(expression){
        this.expression = expression;
    }
    
}

class Unary extends Expression {
    constructor(operator, rightExpression){
        this.operator = operator;
        this.right = rightExpression;
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

    get equality(){
        return this.primary;
    }

    primary() {
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
            return this.expression();
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