import { Parser, Visitor } from "./parser.js";


class Interpreter extends Visitor {
    static stringify(value){
        if (value === null) {
            return "nil";
        } else if (typeof value === "boolean") {
            return value;
        }
    }
    visitLiteral(expression){
        return expression.value;
    }
    interpret(expression){
        const value = expression.accept(this);
        return value;
    }
}


// class Interpreter {
//     constructor(){

//     }
// }


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