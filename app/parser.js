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
    tokens.forEach(token => {
        if (["TRUE", "FALSE", "NIL"].includes(token.tokenType)){
            const expression = new Literal(token.lexeme);
            const printed = printer.print(expression);
            console.log(printed);
        }
    })
}





export {
    printAst,
}