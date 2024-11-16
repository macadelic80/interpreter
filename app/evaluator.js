import { Parser, Visitor } from "./parser.js";


class Interpreter extends Visitor {
    static stringify(value){
        if (value === null) {
            return "nil";
        } else if (typeof value === "boolean") {
            return value;
        } else if (typeof value === "string") {
            return value;
        } else if (typeof value === "number") {
            return value;
        }
    }
    visitLiteral(expression){
        if (expression.type === "NUMBER") return +expression.literal;
        else if (expression.type === "STRING") return expression.literal;
        return expression.value;
    }
    visitGrouping(expression){
        return this.interpret(expression.expression);
    }
    visitUnary(expression){
        debugger;
        if (expression.operator.type == "MINUS") {
            return -this.interpret(expression.right);
        } else if (expression.operator.type == "BANG") {
            return !this.interpret(expression.right);
        }
    }
    visitBinary(expression) {
        const operator = expression.operator.type;
        const left = this.interpret(expression.left);
        const right = this.interpret(expression.right);
        if (operator === "STAR") {
            return left * right;
        } else if (operator ===  "SLASH") {
            return left / right;
        } else if (operator === "PLUS") {
            return left + right;
        } else if (operator === "MINUS") {
            return left - right;
        }
    }
    interpret(expression){
        const value = expression.accept(this);
        return value;
    }
}

const interpret = (tokens) => {
    const interpreter = new Interpreter();

    const parser = new Parser(tokens);
    const parsed = parser.parse();
    if (parsed === null) {
        //error
        console.log("erreur parser interpret()");
        return 65;
    }
    const value = interpreter.interpret(parsed);

    console.log(Interpreter.stringify(value));
    return 0;
}


export {
    interpret
}