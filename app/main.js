import fs from "fs";
import { printToken, tokenize } from "./tokenizer.js";
import { printAst } from "./parser.js";

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error("Usage: ./your_program.sh tokenize <filename>");
  process.exit(1);
}

// const command = args[0];

const Commands = {
  "tokenize": ([fileName]) => {
    // const filename = args[1];
    const fileContent = fs.readFileSync(filename, "utf8");
    const {returnCode, tokens} = tokenize(fileContent);
    if (returnCode) {
      console.log("TokenizerError. Can't print tokens");
      return returnCode;
    }
    printToken(tokens);
    return returnCode;
  },
  "parse": ([fileName]) => {
    const fileContent = fs.readFileSync(filename, "utf8");
    const { returnCode: tokenizerReturnCode, tokens} = tokenize(fileContent);
    if (tokenizerReturnCode) {
      console.log("TokenizerError. Can't parse ast.");
      return tokenizerReturnCode;
    }
    const {returnCode, ast} = parse(tokens);
    if (returnCode) {
      console.log("ParserError. Can't print tokens");

      return returnCode;
    }
    return printAst(ast);
  }
}

const command = Commands[args[0]];
if (command) {
  console.log(args);
  const returnCode = command(args.slice(1));
  process.exit(returnCode);
} else {
  console.error(`Usage: Unknown command: ${command}.`);
  console.error(`List of available commands: ${Object.keys(Commands).join(",")}.`)
  process.exit(1);
}


