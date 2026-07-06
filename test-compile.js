const fs = require('fs');
const path = require('path');

console.log("Loading local babel.min.js...");
const babelCode = fs.readFileSync(path.join(__dirname, 'public', 'babel.min.js'), 'utf8');

const sandbox = {};
const windowMock = {
    navigator: { userAgent: 'node' },
    location: { href: 'http://localhost' }
};

const fn = new Function('window', 'exports', 'module', babelCode);

try {
    fn(windowMock, sandbox, sandbox);
} catch (e) {
    console.error("Error evaluating Babel code:", e);
    process.exit(1);
}

// Find where transform function is bound
const transformFn = sandbox.transform || windowMock.Babel?.transform;

if (typeof transformFn !== 'function') {
    console.error("Babel transform function not found!");
    process.exit(1);
}

console.log("Babel transform loaded successfully. Compiling app.jsx...");

const appCode = fs.readFileSync(path.join(__dirname, 'public', 'app.jsx'), 'utf8');

try {
    const result = transformFn(appCode, {
        presets: ['react']
    });
    console.log("Babel compilation successful! No syntax errors in JSX.");
} catch (err) {
    console.error("\n=======================================================");
    console.error("Babel compilation FAILED with syntax error:");
    console.error("=======================================================");
    console.error(err.message);
    console.error("=======================================================\n");
    process.exit(1);
}
