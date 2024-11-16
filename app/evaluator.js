import { error, Parser, Visitor } from "./parser.js";


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
        if (expression.type != "NUMBER") {
            throw error(expression.operator, "Operand must be a number.")
        }
        const right = this.interpret(expression.right);
        if (expression.operator.type == "MINUS") {
            return -this.interpret(right);
        } else if (expression.operator.type == "BANG") {
            return !this.interpret(right);
        }
    }
    visitBinary(expression) {
        const operator = expression.operator.type;
        const left = this.interpret(expression.left);
        const right = this.interpret(expression.right);
        const operations = {
            "STAR": (l, r) => l * r,
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
            return operations[operator](left, right);
        } else {
            throw new Error("fatal operator error");
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