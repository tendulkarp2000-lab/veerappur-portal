const fs = require('fs');
const path = require('path');

const templateHtmlPath = path.join(__dirname, 'public', 'index-template.html');
const indexHtmlPath = path.join(__dirname, 'public', 'index.html');
const appJsxPath = path.join(__dirname, 'public', 'app.jsx');

console.log("Combining index-template.html and app.jsx into public/index.html...");

if (!fs.existsSync(templateHtmlPath) || !fs.existsSync(appJsxPath)) {
    console.error("Error: index-template.html or app.jsx does not exist!");
    process.exit(1);
}

const templateContent = fs.readFileSync(templateHtmlPath, 'utf8');
const appContent = fs.readFileSync(appJsxPath, 'utf8');

const targetScriptTag = '<script type="text/babel" src="app.jsx"></script>';
const replacement = `<script type="text/babel">\n// Combined React App JSX Code\n${appContent}\n</script>`;

if (!templateContent.includes(targetScriptTag)) {
    console.error("Error: target script placeholder tag not found in index-template.html!");
    process.exit(1);
}

const newIndexContent = templateContent.replace(targetScriptTag, replacement);
fs.writeFileSync(indexHtmlPath, newIndexContent, 'utf8');

console.log("Success! public/index.html is now fully self-contained with updated code.");
