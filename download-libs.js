const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const libs = [
    {
        name: 'react.min.js',
        url: 'https://unpkg.com/react@18.3.1/umd/react.production.min.js' // Direct target version to minimize redirects
    },
    {
        name: 'react-dom.min.js',
        url: 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js'
    },
    {
        name: 'babel.min.js',
        url: 'https://unpkg.com/@babel/standalone@7.24.8/babel.min.js'
    },
    {
        name: 'tailwind.min.js',
        url: 'https://cdn.tailwindcss.com/3.4.5'
    }
];

function download(url, dest) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                let redirectUrl = res.headers.location;
                try {
                    // Resolve relative redirects
                    if (!redirectUrl.startsWith('http')) {
                        const parsedOriginal = new URL(url);
                        redirectUrl = `${parsedOriginal.protocol}//${parsedOriginal.host}${redirectUrl}`;
                    }
                    download(redirectUrl, dest).then(resolve).catch(reject);
                } catch (err) {
                    reject(new Error(`Failed to parse redirect location "${redirectUrl}": ${err.message}`));
                }
                return;
            }

            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download: status code ${res.statusCode}`));
                return;
            }

            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded: ${path.basename(dest)}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function run() {
    console.log("Starting download of React, ReactDOM, Babel, and Tailwind CDN files for offline capability...");
    for (const lib of libs) {
        const dest = path.join(__dirname, 'public', lib.name);
        try {
            await download(lib.url, dest);
        } catch (e) {
            console.error(`Error downloading ${lib.name}:`, e.message);
        }
    }
    console.log("Libraries download process complete.");
}

run();
