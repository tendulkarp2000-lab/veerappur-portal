const fs = require('fs');
const content = fs.readFileSync('public/app.jsx', 'utf8');

let braces = 0;
let parens = 0;
let brackets = 0;
let lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '{') braces++;
        else if (char === '}') braces--;
        else if (char === '(') parens++;
        else if (char === ')') parens--;
        else if (char === '[') brackets++;
        else if (char === ']') brackets--;
    }
    if (braces < 0) {
        console.log(`Braces negative at line ${i+1}: ${line}`);
        break;
    }
}

console.log(`Final count - Braces: ${braces}, Parentheses: ${parens}, Brackets: ${brackets}`);
