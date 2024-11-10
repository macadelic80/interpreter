import fs from "fs";

const args = process.argv.slice(2); 

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

  "\"": "DQUOTE",
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


const scanString = (string, lineIndex) => {
  const unterminatedString = new Error(`[line ${lineIndex + 1}] Error: Unterminated string.`);
  if (!string.length) {
    return unterminatedString;
  }
  for (let charIndex = 0; charIndex < string.length; charIndex++) {
    const char = string[charIndex];
    if (char === "\"") {
      const literal = string.substring(0, charIndex); 
      return literal;
    }
  }
  return unterminatedString;
}


const scanChars = fileContent => {
  const lines = fileContent.split("\n");
  let inError = false;
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++){
    const line = lines[lineIndex];
    for (let charIndex = 0; charIndex < line.length; charIndex++){
      const char = line[charIndex];
      const tokenData = TOKENS[char] || null;
      let tokenType = null;
      let lexeme = null;
      let literal = null;
      const isWhiteSpace = ["SPACE", "TAB", "NEWLINE"].includes(tokenData);

      if (isWhiteSpace) {
        continue ;
      }

      if (tokenData) {
        if (typeof tokenData === "string" || charIndex == line.length - 1) {
          if (tokenData == "DQUOTE") {
            const res = scanString(line.substring(charIndex + 1), lineIndex);
            if (res instanceof Error) {
              console.error(res.message);
              inError = true;
              break;
            } else {
              tokenType = "STRING";
              literal = res;
              lexeme = `"${res}"`;
              charIndex += res.length + 1
            }
          } else {
            tokenType = typeof tokenData === "string" ? tokenData : tokenData.default;
            lexeme = char;
          }
        }  else {
          const nextChar = line[charIndex + 1];
          tokenType = tokenData[nextChar] || tokenData.default;
          lexeme = nextChar in tokenData ? `${char}${nextChar}`: char;
          if (nextChar in tokenData) {
            charIndex++;
          }
        }
        if (tokenType === "COMMENT") {
          break;
        }
        console.log(`${tokenType} ${lexeme} ${literal}`);
      } else {
        console.error(`[line ${lineIndex + 1}] Error: Unexpected character: ${char}`)
        inError = true;
      }
    }
  }
  console.log("EOF  null");
  return inError ? 65 : 0;
}


const fileContent = fs.readFileSync(filename, "utf8");

process.exit(scanChars(fileContent));
