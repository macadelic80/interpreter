import fs from "fs";
import { printToken, tokenize } from "./tokenizer.js";
import { printAst } from "./parser.js";

const Commands = {
  "tokenize": ([fileName]) => {
    const fileContent = fs.readFileSync(fileName, "utf8");
    const {returnCode, tokens} = tokenize(fileContent);
    // if (returnCode) {
    //   console.log("TokenizerError. Can't print tokens");
    //   return returnCode;
    // }
    printToken(tokens);
    return returnCode;
  },
  "parse": ([fileName]) => {
    const fileContent = fs.readFileSync(fileName, "utf8");
    const { returnCode: tokenizerReturnCode, tokens} = tokenize(fileContent);
    // if (tokenizerReturnCode) {
    //   console.log("TokenizerError. Can't parse ast.");
    //   return tokenizerReturnCode;
    // }
    // const {returnCode, ast} = parse(tokens);
    // if (returnCode) {
    //   console.log("ParserError. Can't print tokens");
      
    //   return returnCode;
    // }
    // return printAst(ast);

    // console.log(parsed);
    // const {returnCode, toPrint}
    return printAst(tokens);
  },
  "evaluate": ([fileName]) => {

  },
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


