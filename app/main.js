import fs from "fs";
import { printToken, tokenize } from "./tokenizer.js";
import { printAst } from "./parser.js";
import { interpret, evaluate } from "./evaluator.js";
const Commands = {
  "tokenize": ([fileName]) => {
    const fileContent = fs.readFileSync(fileName, "utf8");
    const {returnCode, tokens} = tokenize(fileContent);
    printToken(tokens);
    return returnCode;
  },
  "parse": ([fileName]) => {
    const fileContent = fs.readFileSync(fileName, "utf8");
    const { returnCode: tokenizerReturnCode, tokens} = tokenize(fileContent);

    return printAst(tokens);
  },
  "evaluate": ([fileName]) => {
    const fileContent = fs.readFileSync(fileName, "utf8");
    const { returnCode: tokenizerReturnCode, tokens} = tokenize(fileContent);

    return evaluate(tokens);

  },
  "run": ([fileName]) => {
    const fileContent = fs.readFileSync(fileName, "utf8");
    const { returnCode: tokenizerReturnCode, tokens} = tokenize(fileContent);
    return interpret(tokens);
  }
}

const [commandName, ...args] = process.argv.slice(2);

if (!args.length) {
  console.error("Usage: ./your_program.sh tokenize <filename>");
  process.exit(1);
} else {
  if (commandName in Commands) {
    const returnCode = Commands[commandName](args);
    process.exit(returnCode);
  } else {
    console.error(`Usage: Unknown command: ${commandName}.`);
    console.error(`List of available commands: ${Object.keys(Commands).join(",")}.`)
    process.exit(1);
  }
}


