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


const RESERVED_WORDS = {
  "and": "AND",
  "class": "CLASS",
  "else": "ELSE",
  "false": "FALSE",
  "for": "FOR",
  "fun": "FUN",
  "if": "IF",
  "nil": "NIL",
  "or": "OR",
  "print": "PRINT",
  "return": "RETURN",
  "super": "SUPER",
  "this": "THIS",
  "true": "TRUE",
  "var": "VAR",
  "while": "WHILE",
};

const TOKENS = {
  " ": "SPACE",
  "\t": "TAB",
  "\n": "NEWLINE",
  "(": "LEFT_PAREN",
  ")": "RIGHT_PAREN",
  "{": "LEFT_BRACE",
  "}": "RIGHT_BRACE",

  "\"": "DQUOTE",

  "0": "NUMBER",
  "1": "NUMBER",
  "2": "NUMBER",
  "3": "NUMBER",
  "4": "NUMBER",
  "5": "NUMBER",
  "6": "NUMBER",
  "7": "NUMBER",
  "8": "NUMBER",
  "9": "NUMBER",

  "a": "IDENTIFIER",
  "b": "IDENTIFIER",
  "c": "IDENTIFIER",
  "d": "IDENTIFIER",
  "e": "IDENTIFIER",
  "f": "IDENTIFIER",
  "g": "IDENTIFIER",
  "h": "IDENTIFIER",
  "i": "IDENTIFIER",
  "j": "IDENTIFIER",
  "k": "IDENTIFIER",
  "l": "IDENTIFIER",
  "m": "IDENTIFIER",
  "n": "IDENTIFIER",
  "o": "IDENTIFIER",
  "p": "IDENTIFIER",
  "q": "IDENTIFIER",
  "r": "IDENTIFIER",
  "s": "IDENTIFIER",
  "t": "IDENTIFIER",
  "u": "IDENTIFIER",
  "v": "IDENTIFIER",
  "w": "IDENTIFIER",
  "x": "IDENTIFIER",
  "y": "IDENTIFIER",
  "z": "IDENTIFIER",
  "_": "IDENTIFIER",

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

const scanIdentifier = (string, lineIndex) => {
  let charIndex = 0;
  for (; charIndex < string.length; charIndex++) {
    const char = string[charIndex];
    const tokenData = TOKENS[char.toLowerCase()] || null;
    if (!["IDENTIFIER", "NUMBER"].includes(tokenData)) {
      break;
    }
  }
  const literal = string.substring(0, charIndex);
  return literal
}

const scanNumber = (string, lineIndex) => {
  let numberString = "";
  let charIndex = 0;
  for (charIndex = 0; charIndex < string.length; charIndex++){
    const char = string[charIndex];
    const tokenData = TOKENS[char] || null;
    if (tokenData === "NUMBER") {
      numberString += char;
    } else if (tokenData === "DOT") {
      if (numberString[numberString.length - 1] !== ".") {
        numberString += char;
      } else {
        //deux points consécutifs
        return new Error(`[line ${lineIndex + 1}] Error unexpected "." @ ${charIndex}`);
      }
    } else {
      break;
    }
  }
  const number = Number(numberString);
  if (Number.isNaN(number)) {
    return new Error(`[line ${lineIndex + 1}] Error unexpected number, "${numberString}" is ${number}`);
  } else {
    return [number, numberString, charIndex];
  }
}

const scanChars = fileContent => {
  const lines = fileContent.split("\n");
  let inError = false;
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++){
    const line = lines[lineIndex];
    for (let charIndex = 0; charIndex < line.length; charIndex++){
      const char = line[charIndex];
      const tokenData = TOKENS[char.toLowerCase()] || null;
      let tokenType = null;
      let lexeme = null;
      let literal = null;
      const isWhiteSpace = ["SPACE", "TAB", "NEWLINE"].includes(tokenData);

      if (isWhiteSpace) {
        continue ;
      }

      if (tokenData) {
        if (typeof tokenData === "string" || charIndex == line.length - 1) {
          if (tokenData === "DQUOTE") {
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
          } else if (tokenData === "NUMBER") {
            const res = scanNumber(line.substring(charIndex), lineIndex);
            if (res instanceof Error) {
              console.error(res.message);
              inError = true;
              break;
            } else {
              const [number, numberString, numberIndex] = res;
              tokenType = "NUMBER";
              literal = number % 1 ? number.toString() : number.toFixed(1);
              lexeme = numberString;
              charIndex += numberIndex - 1;
            }
          } else if (tokenData === "IDENTIFIER") {
            const res = scanIdentifier(line.substring(charIndex), lineIndex);
            if (res instanceof Error) {
              // Il doit pas y avoir d'erreur normalement
              console.error(res.message);
              inError = true;
              break;
            } else {
              const isReservedWord = RESERVED_WORDS[res];
              tokenType = isReservedWord || "IDENTIFIER";
              lexeme = res;
              // literal = res;
              charIndex += res.length - 1
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
