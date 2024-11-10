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
  " ": "SPACE",
  "\t": "TAB",
  "\n": "NEWLINE",
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

  "/": {
    "default": "SLASH",
    "/": "COMMENT"
  },
  "<": {
    "default": "LESS",
    "=": "LESS_EQUAL",
  },
  ">": {
    "default": "GREATER",
    "=": "GREATER_EQUAL",
  },
  "!": {
    "default": "BANG",
    "=": "BANG_EQUAL",
  },
  "=" : {
    "default": "EQUAL",
    "=": "EQUAL_EQUAL"
  },
}


const scanChars = fileContent => {
  const lines = fileContent.split("\n");
  let inError = false;
  lines.forEach((line, lineIndex) => {
    let ignoredIndexes = [];
    let ignoredCurrentLine = false;
    [...line].forEach((char, charIndex) => {
      const tokenData = TOKENS[char] || null;
      let tokenName = null;
      let token = null;
      const isWhiteSpace = ["SPACE", "TAB", "NEWLINE"].includes(tokenData);
      if (
        isWhiteSpace ||
        ignoredCurrentLine ||
        ignoredIndexes.includes(charIndex)) {
        return ;
      }
      if (tokenData) {
        if (typeof tokenData === "string" || charIndex == line.length - 1) {
          tokenName = typeof tokenData === "string" ? tokenData : tokenData.default;
          token = char;
        }  else {
          const nextChar = line[charIndex + 1];
          tokenName = tokenData[nextChar] || tokenData.default;
          token = nextChar in tokenData ? `${char}${nextChar}`: char;
          if (nextChar in tokenData) {
            ignoredIndexes.push(charIndex + 1);
          }
        }
        if (tokenName === "COMMENT") {
          ignoredCurrentLine = true;
          return ;
        }
        console.log(`${tokenName} ${token} null`);
      } else {
        console.error(`[line ${lineIndex + 1}] Error: Unexpected character: ${char}`)
        inError = true;
      }
    })
  })
  console.log("EOF  null");
  return inError ? 65 : 0;
}


const fileContent = fs.readFileSync(filename, "utf8");

process.exit(scanChars(fileContent));
