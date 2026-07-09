const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 5000;
const DB_PATH = path.join(__dirname, 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// Ensure uploads folder exists
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initial seed database schema
const seedData = {
    settings: {
        title: "வீரப்பூர் ஸ்ரீ பெரியகாண்டி அம்மன் திருக்கோவில்",
        subtitle: "வீரம் • பக்தி • பாரம்பரியம்",
        description: "பொன்னர் சங்கர் அண்ணன்மார் சாமிகளின் புனித பூமி"
    },
    liveUpdates: [
        { id: "lu1", date: "2026-07-06", time: "09:00 AM", message: "மாசி பெருந்திருவிழா கொடியேற்றம் வரும் மார்ச் 2ஆம் தேதி காலை 9.00 மணிக்கு நடைபெறும்.", type: "important" },
        { id: "lu2", date: "2026-07-05", time: "06:00 PM", message: "பக்தர்களின் வசதிக்காக புதிய தங்கும் விடுதி முன்பதிவு தற்பொழுது இணையதளத்தில் துவங்கப்பட்டுள்ளது.", type: "info" }
    ],
    festivals: [
        {
            id: "f1",
            title: "மாசி பெருந்திருவிழா",
            date: "2027-03-02",
            daysCount: 12,
            description: "வீரப்பூரின் மிக முக்கிய திருவிழா. லட்சக்கணக்கான பக்தர்கள் கூடும் தேர் மற்றும் குதிரை வாகன திருவிழா.",
            image: "/assets/images/srpkamn.PNG",
            schedule: [
                { id: "s1", event: "கொடியேற்றம்", date: "நாள் 1", time: "காலை 9:00", desc: "திருவிழாவின் அதிகாரப்பூர்வ துவக்கம், கொடிமரத்தில் புனித கொடியேற்றப்படும்." },
                { id: "s2", event: "சிறப்பு பூஜை", date: "நாள் 5", time: "மாலை 6:00", desc: "அம்மனுக்கு தங்க கவசம் சாத்தப்பட்டு சிறப்பு அபிஷேக ஆராதனைகள்." },
                { id: "s3", event: "வேடபரி", date: "நாள் 8", time: "இரவு 8:00", desc: "பொன்னர் குதிரை வாகனத்தில் வேட்டைக்கு செல்லும் வீர வரலாற்று நிகழ்வு." },
                { id: "s4", event: "தேர் திருவிழா", date: "நாள் 10", time: "மாலை 4:30", desc: "பெரியகாண்டி அம்மன் மற்றும் அண்ணன்மார் தேரோட்டம்." },
                { id: "s5", event: "தீர்த்த குடம்", date: "நாள் 12", time: "காலை 8:00", desc: "ஆற்றுக்கு சென்று தீர்த்தம் எடுத்து வந்து அம்மனுக்கு அபிஷேகம் செய்து விழா நிறைவு." }
            ]
        },
        {
            id: "f2",
            title: "ஆடி பதினெட்டாம் பெருக்கு",
            date: "2026-08-02",
            daysCount: 1,
            description: "ஆடி பதினெட்டு அன்று வீரமலை சுனை மற்றும் படுகளத்தில் சிறப்பு வழிபாடு நடைபெறும்.",
            image: "/assets/images/Capturecv h.PNG",
            schedule: []
        }
    ],
    rooms: [
        {
            id: "r1",
            name: "ஸ்ரீ பெரியகாண்டி அம்மன் தங்கும் இல்லம்",
            photos: ["/assets/images/Capture.PNG"],
            location: "கோவில் தெற்கு தெரு, வீரப்பூர்",
            distance: "100 மீட்டர்",
            ac: false,
            facilities: ["சுத்தமான குடிநீர்", "பயன்பாட்டு குளியலறை", "வாகன நிறுத்துமிடம் (Parking)", "குடும்பத்தினர் தங்குவதற்கு ஏற்றது"],
            available: true
        },
        {
            id: "r2",
            name: "அண்ணன்மார் தங்கும் விடுதி (AC)",
            photos: ["/assets/images/Capture.PNG"],
            location: "வீரமலை ரோடு, வீரப்பூர்",
            distance: "300 மீட்டர்",
            ac: true,
            facilities: ["AC வசதி", "சுத்தமான குடிநீர்", "சமையல் அறை", "பெரிய வாகன நிறுத்துமிடம்", "24 மணி நேர பாதுகாப்பு"],
            available: true
        }
    ],
    mandapams: [
        {
            id: "m1",
            name: "ஸ்ரீ பொன்னர் சங்கர் கல்யாண மண்டபம்",
            photos: ["/assets/images/srpkamn.PNG"],
            capacity: "1000 நபர்கள்",
            facilities: ["பெரிய சமையல் கூடம்", "உணவு அருந்தும் அறை (500 சீட்கள்)", "மணமகன் மணமகள் அறைகள் (AC)", "200 கார்கள் நிறுத்தலாம்"],
            location: "கோவில் மெயின் ரோடு, வீரப்பூர்"
        }
    ],
    bookings: [], // room requests, service requests, mandapam, transport
    complaints: [],
    reviews: [
        { id: "rev1", name: "செல்வராஜ்", place: "திருச்சி", rating: 5, experience: "அண்ணன்மார் அருள் பூமிக்கு வந்தாலே ஒரு தனி அமைதியும் வீர உணர்வும் கிடைக்கிறது. கோவில் நிர்வாகத்தின் இந்த புதிய இணையதள சேவை மிகவும் பயனுள்ளதாக உள்ளது.", approved: true },
        { id: "rev2", name: "கார்த்திகேயன்", place: "கோவை", rating: 5, experience: "வீரமலை தவ பூமிக்கு செல்வதற்கு முன்பு இந்த இணையதளத்தில் வழிகாட்டியை படித்தேன், மிகவும் பயனுள்ள வரலாற்று தகவல்கள் உள்ளன.", approved: true }
    ],
    gallery: [
        { id: "g1", category: "Temple", title: "கோவில் ராஜகோபுரம்", url: "/assets/images/srpkamn.PNG", approved: true },
        { id: "g2", category: "Deities", title: "கருப்பண்ணசாமி சிலை", url: "/assets/images/Capturecvgh.PNG", approved: true },
        { id: "g3", category: "Veeramalai", title: "வீரமலை தவ பூமி கோவில்", url: "/assets/images/cccc.PNG", approved: true },
        { id: "g4", category: "Veeramalai", title: "புனித சுனை", url: "/assets/images/dfgh.PNG", approved: true },
        { id: "g5", category: "Veeramalai", title: "ஆடி சுனை தீர்த்த குளம்", url: "/assets/images/Capturecv h.PNG", approved: true }
    ],
    adminConfig: {
        password: "veerappur2026"
    }
};

// PostgreSQL Pool configuration for 100% Free Ephemeral cloud hosting (like Render)
let pgPool = null;
if (process.env.DATABASE_URL) {
    try {
        const { Pool } = require('pg');
        const { parse } = require('pg-connection-string');
        const dbConfig = parse(process.env.DATABASE_URL);
        dbConfig.ssl = {
            rejectUnauthorized: false,
            servername: dbConfig.host
        };
        pgPool = new Pool(dbConfig);
        
        // Test connection and initialize tables
        pgPool.query("SELECT NOW()")
            .then(async () => {
                console.log("Connected to PostgreSQL Database via Pool successfully!");
                // Ensure tables exist
                await pgPool.query(`
                    CREATE TABLE IF NOT EXISTS temple_db (
                        id int PRIMARY KEY,
                        data jsonb
                    );
                `);
                await pgPool.query(`
                    CREATE TABLE IF NOT EXISTS temple_uploads (
                        name text PRIMARY KEY,
                        data text
                    );
                `);
                // Seed data if missing
                const checkRes = await pgPool.query("SELECT id FROM temple_db WHERE id = 1");
                if (checkRes.rows.length === 0) {
                    console.log("Seeding initial data into PostgreSQL...");
                    await pgPool.query("INSERT INTO temple_db (id, data) VALUES (1, $1)", [JSON.stringify(seedData)]);
                }
            })
            .catch(err => {
                console.error("PostgreSQL connection error, falling back to local file DB", err);
                pgPool = null;
            });
    } catch (e) {
        console.error("Failed to load PostgreSQL module, falling back to local file DB", e);
        pgPool = null;
    }
}

// Ensure local db.json exists if not using PG
if (!pgPool && !fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(seedData, null, 4));
}

// Read database file (asynchronous)
async function readDB() {
    if (pgPool) {
        try {
            const res = await pgPool.query("SELECT data FROM temple_db WHERE id = 1");
            if (res.rows.length > 0) {
                return res.rows[0].data;
            }
        } catch (e) {
            console.error("Error reading from PostgreSQL database, falling back to file", e);
        }
    }
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.error("Error reading database file, returning seed data", e);
        return seedData;
    }
}

// Write to database file (asynchronous)
async function writeDB(data) {
    if (pgPool) {
        try {
            await pgPool.query("UPDATE temple_db SET data = $1 WHERE id = 1", [JSON.stringify(data)]);
            return true;
        } catch (e) {
            console.error("Error writing to PostgreSQL database", e);
            return false;
        }
    }
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 4));
        return true;
    } catch (e) {
        console.error("Error writing database file", e);
        return false;
    }
}

// Helper to extract IP address
function getLocalIPs() {
    const interfaces = os.networkInterfaces();
    const addresses = [];
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                addresses.push(iface.address);
            }
        }
    }
    return addresses;
}

const server = http.createServer(async (req, res) => {
    // CORS configuration
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    // API: Diagnostical email test endpoint
    if (pathname === '/api/test-email' && req.method === 'GET') {
        const { RESEND_API_KEY, ADMIN_EMAIL } = process.env;
        
        console.log("Starting diagnostic email test via Resend...");
        if (!RESEND_API_KEY || !ADMIN_EMAIL) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: false, message: "RESEND_API_KEY or ADMIN_EMAIL is missing!" }));
            return;
        }

        const https = require('https');
        const postData = JSON.stringify({
            from: 'Veerappur Portal <onboarding@resend.dev>',
            to: ADMIN_EMAIL,
            subject: '🛕 Test Email Alert from Veerappur Portal',
            text: 'This is a diagnostic test email to verify that your Resend email settings are working successfully!'
        });

        const options = {
            hostname: 'api.resend.com',
            path: '/emails',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const reqPost = https.request(options, (resPost) => {
            let data = '';
            resPost.on('data', chunk => data += chunk);
            resPost.on('end', () => {
                res.writeHead(resPost.statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(data);
            });
        });

        reqPost.on('error', (err) => {
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ success: false, message: err.message }));
        });

        reqPost.write(postData);
        reqPost.end();
        return;
    }

    // API: Diagnostical database test endpoint
    if (pathname === '/api/test-db' && req.method === 'GET') {
        const { Pool } = require('pg');
        const { parse } = require('pg-connection-string');
        const dbConfig = parse(process.env.DATABASE_URL);
        dbConfig.ssl = {
            rejectUnauthorized: false,
            servername: dbConfig.host
        };
        const testPool = new Pool(dbConfig);
        
        try {
            console.log("Testing DB from API...");
            const dbRes = await testPool.query("SELECT NOW()");
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ 
                success: true, 
                message: "Successfully connected to PostgreSQL database!",
                serverTime: dbRes.rows[0].now,
                envUrlParsed: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:([^:@]+)@/, ":****@") : null
            }));
        } catch (err) {
            console.error("Diagnostic DB connection failed:", err);
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({
                success: false,
                message: "PostgreSQL Connection Failed!",
                errorName: err.name,
                errorMessage: err.message,
                errorStack: err.stack,
                envUrlParsed: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:([^:@]+)@/, ":****@") : null
            }));
        } finally {
            await testPool.end();
        }
        return;
    }

    // API: Increment visitor counter
    if (pathname === '/api/increment-visitors' && req.method === 'POST') {
        try {
            const db = await readDB();
            db.visitorCount = (db.visitorCount || 1540) + 1;
            await writeDB(db);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, visitorCount: db.visitorCount }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    // API: Get entire state
    if (pathname === '/api/db' && req.method === 'GET') {
        const db = await readDB();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(db));
        return;
    }

    // API: Save entire state or update properties
    if (pathname === '/api/db/save' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const newData = JSON.parse(body);
                const oldData = await readDB();
                
                // Detect new bookings to trigger email alert
                const newBookings = [];
                const oldBookings = (oldData && oldData.bookings) || [];
                const currentBookings = (newData && newData.bookings) || [];
                
                const oldIds = new Set(oldBookings.map(b => b.id));
                for (const b of currentBookings) {
                    if (!oldIds.has(b.id)) {
                        newBookings.push(b);
                    }
                }
                
                // If there are new bookings, send emails in background
                if (newBookings.length > 0) {
                    for (const booking of newBookings) {
                        sendBookingEmailNotification(booking).catch(err => {
                            console.error("Failed to send booking email notification:", err);
                        });
                    }
                }
                
                const success = await writeDB(newData);
                res.writeHead(success ? 200 : 500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
            }
        });
        return;
    }

    // API: Admin authentication
    if (pathname === '/api/admin/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const { password } = JSON.parse(body);
                const db = await readDB();
                const actualPassword = db.adminConfig ? db.adminConfig.password : 'veerappur2026';
                if (password === actualPassword) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'தவறான கடவுச்சொல்!' }));
                }
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid payload' }));
            }
        });
        return;
    }

    // API: Change admin password
    if (pathname === '/api/admin/change-password' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const { currentPassword, newPassword } = JSON.parse(body);
                const db = await readDB();
                const actualPassword = db.adminConfig ? db.adminConfig.password : 'veerappur2026';
                if (currentPassword === actualPassword) {
                    if (!db.adminConfig) db.adminConfig = {};
                    db.adminConfig.password = newPassword;
                    await writeDB(db);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'தற்போதைய கடவுச்சொல் தவறானது!' }));
                }
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid payload' }));
            }
        });
        return;
    }

    // API: Dynamic XML Sitemap for SEO Crawling
    if (pathname === '/sitemap.xml' && req.method === 'GET') {
        const host = req.headers.host || 'veerappurtempleofficial.in';
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const baseUrl = `${protocol}://${host}`;
        
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/#history</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${baseUrl}/#deities</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${baseUrl}/#festivals</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${baseUrl}/#services</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${baseUrl}/#helpdesk</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${baseUrl}/#gallery</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
</urlset>`;
        
        res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
        res.end(sitemap);
        return;
    }

    // API: Devotee image upload (base64)
    if (pathname === '/api/upload' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const payload = JSON.parse(body);
                if (!payload.name || !payload.data) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Missing file name or content" }));
                    return;
                }

                const matches = payload.data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                if (!matches || matches.length !== 3) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Invalid base64 payload format" }));
                    return;
                }

                const fileExt = path.extname(payload.name) || '.png';
                const filename = `uploaded_${Date.now()}${fileExt}`;

                if (pgPool) {
                    // Save to PG Database table
                    await pgPool.query("INSERT INTO temple_uploads (name, data) VALUES ($1, $2)", [filename, payload.data]);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ filePath: `/uploads/${filename}` }));
                } else {
                    // Fallback to local files
                    const buffer = Buffer.from(matches[2], 'base64');
                    const destPath = path.join(UPLOADS_DIR, filename);
                    fs.writeFileSync(destPath, buffer);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ filePath: `/uploads/${filename}` }));
                }
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // Serve static files
    let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);

    // Serve uploads separately if requested
    if (pathname.startsWith('/uploads/')) {
        const filename = pathname.split('/').pop();
        if (pgPool) {
            pgPool.query("SELECT data FROM temple_uploads WHERE name = $1", [filename])
                .then(result => {
                    if (result.rows.length > 0) {
                        const base64Data = result.rows[0].data;
                        const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                        if (matches && matches.length === 3) {
                            const contentType = matches[1];
                            const buffer = Buffer.from(matches[2], 'base64');
                            res.writeHead(200, { 'Content-Type': contentType });
                            res.end(buffer);
                        } else {
                            res.writeHead(404, { 'Content-Type': 'text/plain' });
                            res.end("Upload not found in database");
                        }
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end("Upload not found in database");
                    }
                })
                .catch(err => {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end(err.message);
                });
            return;
        } else {
            filePath = path.join(UPLOADS_DIR, filename);
        }
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname.toLowerCase()) {
        case '.js':
        case '.jsx':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
        case '.jpeg':
        case '.jfif':
            contentType = 'image/jpeg';
            break;
        case '.gif':
            contentType = 'image/gif';
            break;
        case '.svg':
            contentType = 'image/svg+xml';
            break;
        case '.ico':
            contentType = 'image/x-icon';
            break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Return index.html for SPA routing fallback
                fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, htmlContent) => {
                    if (err) {
                        res.writeHead(404);
                        res.end('File index.html not found');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(htmlContent, 'utf-8');
                    }
                });
            } else {
                res.writeHead(500);
                res.end(`Server error code: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});
// Helper to send email alerts for new bookings using SMTP
async function sendBookingEmailNotification(booking) {
    console.log("Processing email alert for booking request:", booking.id);
    
    const { RESEND_API_KEY, ADMIN_EMAIL } = process.env;
    if (!RESEND_API_KEY || !ADMIN_EMAIL) {
        console.log("Resend API Key or Admin Email is not set. Skipping email send (falling back to mock console output).");
        return;
    }
    
    try {
        const nodemailer = null;
        const transportConfig = null;
        const transporter = null;
        
        let detailsText = '';
        if (booking.details.roomOption) detailsText = `விடுதி: ${booking.details.roomOption}`;
        else if (booking.details.offeringServices) detailsText = `சேவைகள்: ${booking.details.offeringServices.join(', ')}`;
        else if (booking.details.vehicle) detailsText = `வாகனம்: ${booking.details.vehicle} (${booking.details.pickupType})`;
        else if (booking.details.guideLanguage) detailsText = `கைடு மொழி: ${booking.details.guideLanguage}`;
        else if (booking.details.nakshatram) detailsText = `அர்ச்சனை: ${booking.details.nakshatram} (${booking.details.rasi}) - முகவரி: ${booking.details.deliveryAddress}`;
        
        const mailOptions = {
            from: "Veerappur Temple Digital Seva <onboarding@resend.dev>",
            to: ADMIN_EMAIL,
            subject: `🔔 புதிய பக்தி சேவை முன்பதிவு: ${booking.name}`,
            text: `வீரப்பூர் திருக்கோவில் இணையதளத்தில் புதிய முன்பதிவு கோரிக்கை வந்துள்ளது!
            
விவரங்கள்:
----------------------------------
பக்தர் பெயர்: ${booking.name}
போன் எண்: ${booking.phone}
சேவை வகை: ${booking.type}
முன்பதிவு தேதி: ${booking.date}
நபர்கள்: ${booking.count}
கூடுதல் தகவல்கள்: ${detailsText}

நிர்வாகி பேனலில் உள்நுழைந்து இதை அங்கீகரிக்கவும்:
https://veerappurtempleofficial.in
`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #d4af37; padding: 20px; border-radius: 8px; background-color: #800000; color: #ffffff;">
                <h2 style="color: #ffd700; border-bottom: 2px solid #ffd700; padding-bottom: 10px; margin-top: 0;">🛕 புதிய பக்தி சேவை முன்பதிவு</h2>
                <p style="font-size: 15px;">வீரப்பூர் திருக்கோவில் இணையதளத்தில் புதிய முன்பதிவு கோரிக்கை சமர்ப்பிக்கப்பட்டுள்ளது.</p>
                <div style="background-color: #ffffff; color: #1c1c1c; padding: 15px; border-radius: 6px; margin-top: 15px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 8px 0; font-weight: bold; width: 140px;">பக்தர் பெயர்:</td>
                            <td style="padding: 8px 0;">${booking.name}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 8px 0; font-weight: bold;">போன் எண்:</td>
                            <td style="padding: 8px 0; color: #800000; font-weight: bold;">${booking.phone}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 8px 0; font-weight: bold;">சேவை வகை:</td>
                            <td style="padding: 8px 0; text-transform: uppercase; font-size: 11px; background-color: #f7f7f7; padding-left: 5px; border-radius: 4px;">${booking.type}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 8px 0; font-weight: bold;">முன்பதிவு தேதி:</td>
                            <td style="padding: 8px 0;">${booking.date}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 8px 0; font-weight: bold;">நபர்கள்:</td>
                            <td style="padding: 8px 0;">${booking.count}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold;">விவரங்கள்:</td>
                            <td style="padding: 8px 0; color: #555;">${detailsText}</td>
                        </tr>
                    </table>
                </div>
                <div style="margin-top: 25px; text-align: center;">
                    <a href="https://veerappurtempleofficial.in" style="background-color: #ffd700; color: #800000; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">அட்மின் பேனல் செல்லவும்</a>
                </div>
            </div>
            `
        };
        
        const https = require('https');
        const postData = JSON.stringify({
            from: 'Veerappur Portal <onboarding@resend.dev>',
            to: ADMIN_EMAIL,
            subject: mailOptions.subject,
            html: mailOptions.html
        });

        const options = {
            hostname: 'api.resend.com',
            path: '/emails',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        await new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        console.log("Email notification sent successfully to", ADMIN_EMAIL, "via Resend:", data);
                        resolve();
                    } else {
                        reject(new Error(`Resend API status ${res.statusCode}: ${data}`));
                    }
                });
            });
            req.on('error', reject);
            req.write(postData);
            req.end();
        });
    } catch (err) {
        console.error("Error sending email notification via Resend:", err.message || err);
    }
}


server.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`Veerappur Digital Seva Portal Server Started!`);
    console.log(`-------------------------------------------------------`);
    console.log(`Local Dashboard URL: http://localhost:${PORT}`);
    
    const localIPs = getLocalIPs();
    if (localIPs.length > 0) {
        console.log(`Devotees on same network can access via:`);
        localIPs.forEach(ip => {
            console.log(`   http://${ip}:${PORT}`);
        });
    }
    console.log(`=======================================================`);
});
