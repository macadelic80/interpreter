import { Parser, Visitor } from "./parser";


class InterpreterVisitor extends Visitor {
    visitLiteral(expression){
        return expression.value;
    }
    interpret(expression){
        const value = expression.accept(this);
    }
}


class Interpreter {
    constructor(){

    }
}


const interpret = (tokens) => {
    const interpreter = new Interpreter();

    const parser = new Parser(tokens);
    const parsed = parser.parse();
    const value = interpreter 
    if (parsed === null) {
        //error
        console.log("erreur parser interpret()");
        return 65;
    }
    console.log(interpreter.interpret(parsed));
    return 0;
}