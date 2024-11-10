import fs from "fs";

const args = process.argv.slice(2); // Skip the first two arguments (node path and script path)

if (args.length < 2) {
  console.error("Usage: ./your_program.sh tokenize <filename>");
  process.exit(1);
}

const command = args[0];

if (command !== "tokenize") {
  console.error(`Usage: Unknown command: ${command}`);
  process.exit(1);
}

const filename = args[1];


const TOKENS = {
  "(": "LEFT_PAREN",
  ")": "RIGHT_PAREN",
  "{": "LEFT_BRACE",
  "}": "RIGHT_BRACE",
  ",": "COMMA",
  ".": "DOT",
  "-": "MINUS",
  "+": "PLUS",
  ";": "SEMICOLON",
  "*": "STAR",
}


const scan_chars = fileContent => {
  const lines = fileContent.split("\n");
  let inError = false;
  lines.forEach((line, line_index) => {
    [...line].forEach((char, char_index) => {
      const desc = TOKENS[char] || null;
      if (desc)
        console.log(`${desc} ${char} null`);
      else {
        console.error(`[line ${line_index + 1}] Error: Unexpected character: ${char}`)
        inError = true;
      }
    })
  })
  console.log("EOF  null");
  return inError ? 65 : 0;
}


const fileContent = fs.readFileSync(filename, "utf8");

process.exit(scan_chars(fileContent));
