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


const scan_parenthesis = fileContent => {
  const lines = fileContent.split("\n");
  lines.forEach(line => {
    [...line].forEach(char => {
      if ("()".includes(char))
        console.log(`${char === "(" ? "LEFT" : "RIGHT"}_PAREN ${char} null`);
    })
  })
  console.log("EOF  null");
}


// Uncomment this block to pass the first stage
//
const fileContent = fs.readFileSync(filename, "utf8");

if (fileContent.length !== 0) {
  scan_parenthesis(fileContent);
} else {
  console.log("EOF  null");
}
