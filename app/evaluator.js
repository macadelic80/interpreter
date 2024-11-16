import { Parser, Visitor } from "./parser.js";


class Interpreter extends Visitor {
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
    console.log(interpreter.interpret(parsed));
    return 0;
}


export {
    interpret
}