// React State & API Integration
const { useState, useEffect, useRef } = React;

// ----------------------------------------------------
// Synthesized Temple Bell Audio (Web Audio API)
// ----------------------------------------------------
const playBellChime = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const playTone = (freq, startTime, duration, volume) => {
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.type = freq > 400 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, startTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.98, startTime + duration);
            
            gainNode.gain.setValueAtTime(volume, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.start(startTime);
            osc.stop(startTime + duration);
        };
        
        playTone(293.66, ctx.currentTime, 3.0, 0.4); // D4
        playTone(440.00, ctx.currentTime, 2.5, 0.2); // A4
        playTone(587.33, ctx.currentTime, 2.5, 0.15); // D5
        
        playTone(329.63, ctx.currentTime + 0.3, 2.7, 0.35); // E4
        playTone(493.88, ctx.currentTime + 0.3, 2.2, 0.18); // B4
        playTone(659.25, ctx.currentTime + 0.3, 2.2, 0.1); // E5
    } catch (e) {
        console.warn("Audio Context blocked or not supported yet", e);
    }
};

// ----------------------------------------------------
// Tamil Voice Narrator (Web Speech API)
// ----------------------------------------------------
const speakTamilText = (text, isSpeaking, setIsSpeaking) => {
    if (!('speechSynthesis' in window)) {
        alert("உங்களது உலாவி (Browser) குரல் வாசிப்பு வசதியை ஆதரிக்கவில்லை.");
        return;
    }

    if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ta-IN';
    
    const voices = window.speechSynthesis.getVoices();
    const tamilVoice = voices.find(v => v.lang.includes('ta') || v.lang.includes('TA'));
    if (tamilVoice) {
        utterance.voice = tamilVoice;
    }
    
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
};

// ----------------------------------------------------
// Custom SVG Icon Helper
// ----------------------------------------------------
const Icon = ({ name, className = "w-6 h-6", onClick }) => {
    const paths = {
        bell: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
        volume: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />,
        volumeMute: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zm12.364-6.364l-4.243 4.243m0-4.243l4.243 4.243" />,
        calendar: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
        clock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
        home: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
        book: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
        shield: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
        services: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
        photo: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
        help: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />,
        star: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.17 0l-3.971 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 10.1c-.783-.57-.38-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z" />,
        settings: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
        mapPin: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></>,
        user: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
        lock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
        check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
        alert: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
        chevronRight: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />,
        chevronLeft: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />,
        menu: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />,
        x: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
        plus: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />,
        search: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
        whatsapp: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.94 5.86L2.68 22l4.31-1.12C8.52 21.57 10.21 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1.85 14.88c-1.57-1.57-2.31-3.66-2.07-5.01l1.52.26c-.16.92.36 2.37 1.45 3.46 1.09 1.09 2.54 1.61 3.46 1.45l.26 1.52c-1.35.24-3.44-.5-5.01-2.07z" />
    };

    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className} onClick={onClick}>
            {paths[name] || null}
        </svg>
    );
};

// ----------------------------------------------------
// Main App Root Component
// ----------------------------------------------------
function App() {
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState('home');
    const [language, setLanguage] = useState('ta');
    const [db, setDb] = useState(null);
    const [adminLoggedIn, setAdminLoggedIn] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Fetch state from server database
    const fetchState = () => {
        fetch('/api/db')
            .then(res => res.json())
            .then(data => {
                const upgradedData = upgradeDbSchema(data);
                setDb(upgradedData);
                localStorage.setItem('veerappur_db', JSON.stringify(upgradedData));
            })
            .catch(err => {
                console.warn("Could not reach backend API, loading from LocalStorage", err);
                const local = localStorage.getItem('veerappur_db');
                if (local) {
                    setDb(JSON.parse(local));
                }
            });
    };

    // Database schema migration/updater
    const upgradeDbSchema = (data) => {
        let upgraded = false;
        
        // Notices upgrade
        if (!data.notices) {
            data.notices = [
                "வீரப்பூர் கோவில் ராஜகோபுரம் மற்றும் கோவில் பராமரிப்பு பணிகள் கருவறை சார்ந்த பொன்னர் சங்கர் என்பவர்களால் நிதி உதவியுடன் செயல்படுகிறது. எனவே மக்கள் யாரும் ராஜகோபுரத்திற்காக நன்கொடை எங்கும் செலுத்த வேண்டாம்."
            ];
            upgraded = true;
        }

        // Hero slides upgrade
        if (!data.heroSlides) {
            data.heroSlides = [
                { id: "hs1", url: "/assets/images/srpkamn.PNG", title: "வீரப்பூர்", subtitle: "ஸ்ரீ பெரியகாண்டி அம்மன் திருக்கோவில்", description: "அண்ணன்மார் சாமிகளின் புனித பூமி" },
                { id: "hs2", url: "/assets/images/Capturecv%20h.PNG", title: "ஆடி தவ பூமி", subtitle: "வீரமலை புனித திருத்தலம்", description: "அம்மன் தவம் புரிந்த வரலாற்று மலை குன்று" },
                { id: "hs3", url: "/assets/images/cccc.PNG", title: "அண்ணன்மார் வரலாறு", subtitle: "பொன்னர் - சங்கர் வீர காவியம்", description: "கொங்கு நாட்டின் தர்மம், வீரம், தியாகத்தின் சாட்சி" }
            ];
            upgraded = true;
        }

        // History chapters upgrade
        if (!data.history) {
            data.history = [
                { num: 1, title: "வீரப்பூர் என்னும் புனித பூமி", image: "/assets/images/srpkamn.PNG", content: "திருச்சிராப்பள்ளி மாவட்டம் மணப்பாறை அருகே அமைந்துள்ள புனித தலமான வீரப்பூர், பல நூற்றாண்டுகளாக பக்தர்களின் நம்பிக்கையும், வீர வரலாற்றின் அடையாளமாகவும் திகழ்கிறது." },
                { num: 2, title: "ஸ்ரீ பெரியகாண்டி அம்மன் வரலாறு", image: "/assets/images/Capturecvgh.PNG", content: "மக்கள் நம்பிக்கையின்படி, ஐந்து தலை நாகத்தின் தவத்தின் பலனாக பார்வதி தேவியின் அம்சமாக பெரியகாண்டி அம்மன் அவதரித்ததாக கூறப்படுகிறது. அம்மன் வீரமலையில் தவம் செய்ததாகவும், ஆறு கன்னிமார்கள் மற்றும் வீரமகா முனிவர் அம்மனுக்கு துணையாக இருந்ததாகவும் பக்தி மரபுகள் கூறுகின்றன." },
                { num: 3, title: "வீரமலை தவ பூமி", image: "/assets/images/Capturecv%20h.PNG", content: "வீரமலை பெரியகாண்டி அம்மனின் தவத்துடன் தொடர்புடைய புனித இடமாக பக்தர்களால் போற்றப்படுகிறது." },
                { num: 4, title: "பொன்னி வளநாட்டின் வீர சகோதரர்கள்", image: "/assets/images/cccc.PNG", content: "கொங்கு நாட்டில் தலைமுறை தலைமுறையாக பாடப்பட்டு வரும் வீர காவியம் அண்ணன்மார் சாமி கதை. குன்னுடையான் மற்றும் தாமரை நாச்சியாருக்கு அருளால் பிறந்த வீர சகோதரர்களாக பொன்னர் சங்கர் போற்றப்படுகின்றனர். அவர்கள் வீரம், நேர்மை, தர்மம், மக்கள் பாதுகாப்பின் அடையாளமாக விளங்கினர்." },
                { num: 5, title: "அருக்காணி தங்காளின் பாசம்", image: "/assets/images/dfgh.PNG", content: "அண்ணன் தங்கை பாசத்தின் உயர்ந்த அடையாளமாக அருக்காணி தங்காள் இன்றும் போற்றப்படுகிறார்." },
                { num: 6, title: "படுகளம்", image: "/assets/images/srpkamn.PNG", content: "தலையூர் காளியுடன் ஏற்பட்ட மோதல் பெரும் போருக்கு வழிவகுத்ததாக அண்ணன்மார் காவியம் கூறுகிறது. பொன்னர் சங்கரின் வீரமும், தியாகமும் நினைவுகூரப்படும் புனித இடமே படுகளம்." }
            ];
            upgraded = true;
        }

        // Deities upgrade
        if (!data.deities) {
            data.deities = [
                {
                    id: "dei1",
                    name: "பெரியகாண்டி அம்மன்",
                    title: "அவதார தாய் / பார்வதி தேவியின் அம்சம்",
                    photo: "/assets/images/srpkamn.PNG",
                    history: "ஸ்ரீ பெரியகாண்டி அம்மன் வீரமலையின் தவ பூமியில் மக்கள் நலனுக்காகவும் தர்மத்தை நிலைநாட்டவும் தவம் புரிந்த பார்வதி தேவியின் அம்சமாக போற்றப்படுகிறார். இவரே வீரப்பூரின் முதன்மை காவல் தெய்வம் ஆவார்.",
                    gallery: ["/assets/images/srpkamn.PNG", "/assets/images/Capturecv%20h.PNG"]
                },
                {
                    id: "dei2",
                    name: "பொன்னர்",
                    title: "வீர சகோதரர் / அண்ணன்மார் சாமிகள்",
                    photo: "/assets/images/cccc.PNG",
                    history: "பொன்னி வளநாட்டின் மூத்த அரசர். மக்களின் பாதுகாப்பிற்காகவும், நீதிக்காகவும் அநீதிகளுக்கு எதிராக வாள் ஏந்தி போரிட்டவர். தன் தம்பி சங்கருடன் தர்மத்தை காத்தவர்.",
                    gallery: ["/assets/images/cccc.PNG"]
                },
                {
                    id: "dei3",
                    name: "சங்கர்",
                    title: "வீர சகோதரர் / இளைய அண்ணன்மார்",
                    photo: "/assets/images/cccc.PNG",
                    history: "பொன்னரின் இளைய சகோதரர். வில்லாற்றலிலும் வீரத்திலும் நிகரற்றவர். அண்ணனின் வாளுக்கு இணையாக கொங்கு மண்ணில் தர்மத்தை நிலைநாட்டிய தியாக தீபம்.",
                    gallery: ["/assets/images/cccc.PNG"]
                },
                {
                    id: "dei4",
                    name: "அருக்காணி தங்காள்",
                    title: "பாசத்தின் இலக்கணம் / அண்ணன்மார் தங்கை",
                    photo: "/assets/images/dfgh.PNG",
                    history: "அண்ணன் தங்கை பாசத்தின் உயர்ந்த அடையாளமாக அருக்காணி தங்காள் இன்றும் போற்றப்படுகிறார். அண்ணன்மார்களின் வீரப்போர்களிலும், அவர்களின் தியாகத்திலும் துணை நின்ற தங்காளின் வேண்டுதல்கள் மற்றும் பாச வரலாறு இன்றும் பக்தர்களால் கண்ணீர் மல்க நினைவுகூரப்படுகிறது.",
                    gallery: ["/assets/images/dfgh.PNG"]
                },
                {
                    id: "dei5",
                    name: "மகாமுனி",
                    title: "அம்மனின் தவ காவலர்",
                    photo: "/assets/images/Capturecvgh.PNG",
                    history: "பெரியகாண்டி அம்மன் வீரமலையில் தவம் செய்யும்போது அம்மனுக்கு காவலாக நின்ற முனிவர். தீய சக்திகளை அழித்து பக்தர்களை காக்கும் உக்கிர தெய்வம்.",
                    gallery: ["/assets/images/Capturecvgh.PNG"]
                },
                {
                    id: "dei6",
                    name: "கருப்பண்ணசாமி",
                    title: "எல்லை காவல் தெய்வம்",
                    photo: "/assets/images/Capture.PNG",
                    history: "வீரப்பூர் எல்லைகளையும், திருத்தலத்திற்கு வரும் பக்தர்களையும் தீய சக்திகளிடம் இருந்து காக்கும் எல்லை காவல் தெய்வம். இவருக்கு சிறப்பு வழிபாடுகள் நடைபெறுகின்றன.",
                    gallery: ["/assets/images/Capture.PNG"]
                }
            ];
            upgraded = true;
        }

        if (upgraded) {
            // Write upgrade back immediately
            fetch('/api/db/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).catch(e => console.error("Upgrade save failed", e));
        }

        return data;
    };

    // Save updated state to server + local storage
    const saveState = (updatedDb) => {
        setDb(updatedDb);
        localStorage.setItem('veerappur_db', JSON.stringify(updatedDb));
        
        fetch('/api/db/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedDb)
        })
        .then(res => res.json())
        .then(data => {
            if (!data.success) console.error("Server failed to save database state");
        })
        .catch(err => console.error("Network error saving database state", err));
    };

    useEffect(() => {
        fetchState();
    }, []);

    const handleStart = () => {
        playBellChime();
        setLoading(false);
    };

    if (loading) {
        return <WelcomeScreen onStart={handleStart} lang={language} setLang={setLanguage} />;
    }

    if (!db) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-stone text-gold">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold mb-4"></div>
                <p>தரவுகள் ஏற்றப்படுகின்றன...</p>
            </div>
        );
    }

    const t = {
        ta: {
            title: "வீரப்பூர் ஸ்ரீ பெரியகாண்டி அம்மன்",
            subtitle: "டிஜிட்டல் சேவை தளம்",
            home: "முகப்பு",
            history: "வரலாறு",
            deities: "தெய்வங்கள்",
            festivals: "திருவிழா",
            services: "சேவைகள்",
            helpdesk: "உதவி மையம்",
            gallery: "புகைப்படங்கள்",
            admin: "நிர்வாகி",
            viewHistory: "வரலாறு காண",
            viewFestivals: "திருவிழா காண",
            getServices: "சேவைகள் பெற",
            whatsappHelp: "வாட்ஸ்அப் உதவி",
            languageLabel: "English"
        },
        en: {
            title: "Veerappur Sri Periyakandi Amman",
            subtitle: "Digital Seva Portal",
            home: "Home",
            history: "Heritage",
            deities: "Deities",
            festivals: "Festivals",
            services: "Services",
            helpdesk: "Help Desk",
            gallery: "Gallery",
            admin: "Admin",
            viewHistory: "Explore History",
            viewFestivals: "Explore Festivals",
            getServices: "Book Services",
            whatsappHelp: "WhatsApp Support",
            languageLabel: "தமிழ்"
        }
    }[language];

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'ta' ? 'en' : 'ta');
    };

    return (
        <div className="min-h-screen flex flex-col justify-between text-slate-100 selection:bg-kumkum selection:text-gold">
            
            {/* Moving Notices Marquee bar */}
            {db.notices && db.notices.length > 0 && (
                <div className="bg-kumkum border-b border-gold/30 text-gold text-xs sm:text-sm py-2 overflow-hidden relative">
                    <marquee scrollamount="4" className="font-tamil font-semibold">
                        {db.notices.join(" | ")}
                    </marquee>
                </div>
            )}

            {/* Header / Navbar */}
            <header className="sticky top-0 z-40 bg-stone-dark/95 border-b border-gold/30 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage('home')}>
                        <div className="w-12 h-12 rounded-full border border-gold bg-kumkum flex items-center justify-center shadow-gold">
                            <span className="text-xl font-bold text-gold font-tamil">ஸ்ரீ</span>
                        </div>
                        <div>
                            <h1 className="text-base sm:text-lg font-bold font-tamil text-gold-gradient tracking-wide">{t.title}</h1>
                            <p className="text-xs text-turmeric/80 font-tamil tracking-widest">{t.subtitle}</p>
                        </div>
                    </div>

                    <nav className="hidden lg:flex items-center gap-6">
                        {['home', 'history', 'deities', 'festivals', 'services', 'helpdesk', 'gallery'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`text-sm font-medium transition-all duration-300 font-tamil hover:text-gold ${
                                    page === p ? 'text-gold border-b-2 border-gold pb-1' : 'text-slate-300'
                                }`}
                            >
                                {t[p]}
                            </button>
                        ))}
                    </nav>

                    <div className="hidden lg:flex items-center gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="text-xs border border-gold/50 text-gold hover:bg-gold hover:text-stone-dark px-3 py-1 rounded-full transition-all duration-300"
                        >
                            {t.languageLabel}
                        </button>
                        <button
                            onClick={() => setPage('admin')}
                            className="bg-kumkum hover:bg-kumkum-light text-gold font-bold text-xs py-2 px-4 rounded-md border border-gold/40 transition shadow-kumkum"
                        >
                            {adminLoggedIn ? "Dashboard" : "Admin Panel"}
                        </button>
                    </div>

                    <div className="flex items-center gap-3 lg:hidden">
                        <button
                            onClick={toggleLanguage}
                            className="text-xs border border-gold/50 text-gold px-2.5 py-1 rounded-full"
                        >
                            {t.languageLabel}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(prev => !prev)}
                            className="text-gold p-1 focus:outline-none"
                        >
                            <Icon name={mobileMenuOpen ? "x" : "menu"} className="w-7 h-7" />
                        </button>
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className="lg:hidden bg-stone-dark/95 border-b border-gold/20 px-4 pt-2 pb-6 space-y-2">
                        {['home', 'history', 'deities', 'festivals', 'services', 'helpdesk', 'gallery'].map((p) => (
                            <button
                                key={p}
                                onClick={() => {
                                    setPage(p);
                                    setMobileMenuOpen(false);
                                }}
                                className={`block w-full text-left py-2.5 px-4 font-tamil text-sm rounded-md transition-all ${
                                    page === p ? 'bg-kumkum/40 text-gold border-l-4 border-gold' : 'text-slate-300 hover:bg-stone/50'
                                }`}
                            >
                                {t[p]}
                            </button>
                        ))}
                        <div className="pt-4 border-t border-stone-light flex justify-between gap-4">
                            <button
                                onClick={() => {
                                    setPage('admin');
                                    setMobileMenuOpen(false);
                                }}
                                className="flex-1 text-center bg-kumkum hover:bg-kumkum-light text-gold text-xs py-2 rounded-md font-tamil border border-gold/30"
                            >
                                {adminLoggedIn ? "Admin Dashboard" : "Admin Login"}
                            </button>
                            <a
                                href="https://wa.me/910000000000"
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 text-center bg-green-700 hover:bg-green-600 text-white text-xs py-2 rounded-md flex items-center justify-center gap-1 font-tamil"
                            >
                                <Icon name="whatsapp" className="w-4 h-4" />
                                {t.whatsappHelp}
                            </a>
                        </div>
                    </div>
                )}
            </header>

            <main className="flex-grow page-transition">
                {page === 'home' && <HomePage setPage={setPage} t={t} language={language} db={db} saveState={saveState} />}
                {page === 'history' && <HistoryPage t={t} language={language} db={db} />}
                {page === 'deities' && <DeitiesPage t={t} language={language} db={db} />}
                {page === 'festivals' && <FestivalsPage t={t} language={language} db={db} saveState={saveState} adminLoggedIn={adminLoggedIn} />}
                {page === 'services' && <ServicesPage t={t} language={language} db={db} saveState={saveState} />}
                {page === 'helpdesk' && <HelpDeskPage t={t} language={language} db={db} saveState={saveState} />}
                {page === 'gallery' && <GalleryPage t={t} language={language} db={db} saveState={saveState} />}
                {page === 'admin' && (
                    <AdminPanel
                        t={t}
                        language={language}
                        db={db}
                        saveState={saveState}
                        adminLoggedIn={adminLoggedIn}
                        setAdminLoggedIn={setAdminLoggedIn}
                    />
                )}
            </main>

            <footer className="bg-stone-dark border-t border-gold/30 pt-12 pb-6 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-gold font-tamil font-bold text-lg mb-4">ஸ்ரீ பெரியகாண்டி அம்மன் திருக்கோவில்</h3>
                        <p className="text-sm text-slate-400 font-tamil leading-relaxed mb-4">
                            வீரப்பூர், மணப்பாறை வட்டம், திருச்சிராப்பள்ளி மாவட்டம்.<br />
                            கொங்கு நாட்டின் வீர வரலாறும், அண்ணன்மார் சாமி வழிபாடும் கொண்ட புனித திருத்தலம்.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-gold font-tamil font-bold text-base mb-4">விரைவு இணைப்புகள்</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                            <button onClick={() => setPage('home')} className="text-left hover:text-gold transition font-tamil">முகப்பு</button>
                            <button onClick={() => setPage('history')} className="text-left hover:text-gold transition font-tamil">வரலாறு</button>
                            <button onClick={() => setPage('deities')} className="text-left hover:text-gold transition font-tamil">தெய்வங்கள்</button>
                            <button onClick={() => setPage('festivals')} className="text-left hover:text-gold transition font-tamil">திருவிழாக்கள்</button>
                            <button onClick={() => setPage('services')} className="text-left hover:text-gold transition font-tamil">சேவைகள்</button>
                            <button onClick={() => setPage('helpdesk')} className="text-left hover:text-gold transition font-tamil">உதவி மையம்</button>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-gold font-tamil font-bold text-base mb-4">பகவத சேவா தகவல்கள்</h3>
                        <p className="text-sm text-slate-400 font-tamil mb-4 leading-relaxed">
                            தங்குமிட முன்பதிவு, அர்ச்சனை பிரசாதம், போக்குவரத்து உதவிகளுக்கு இந்த தளத்தைப் பயன்படுத்தவும்.
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="text-xs text-gold/70 flex items-center gap-1.5 font-tamil">
                                <Icon name="mapPin" className="w-4 h-4 text-gold" /> வீரப்பூர், மணப்பாறை.
                            </div>
                            <div className="text-xs text-gold/70 flex items-center gap-1.5 font-tamil">
                                <Icon name="whatsapp" className="w-4 h-4 text-green-500" /> Virtual Virtual-Line Seva Support
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto border-t border-stone-light mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
                    <p className="font-tamil">© 2026 வீரப்பூர் திருக்கோவில். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
                </div>
            </footer>
        </div>
    );
}

// ----------------------------------------------------
// Component: Welcome Loader Screen
// ----------------------------------------------------
function WelcomeScreen({ onStart, lang, setLang }) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const t1 = setTimeout(() => setStep(1), 1000);
        const t2 = setTimeout(() => setStep(2), 2200);
        const t3 = setTimeout(() => {
            onStart();
        }, 5500);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [onStart]);

    return (
        <div className="h-screen w-screen bg-stone-dark flex flex-col items-center justify-center relative overflow-hidden select-none">
            <div className="absolute w-[600px] h-[600px] rounded-full bg-kumkum/15 blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute w-[400px] h-[400px] rounded-full bg-gold/10 blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

            <div className="z-10 text-center max-w-lg px-6 flex flex-col items-center">
                <div className="w-24 h-24 mb-8 pulse-logo cursor-pointer flex items-center justify-center" onClick={onStart}>
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]">
                        <path d="M50,10 C42,10 35,16 35,25 L35,45 C30,48 20,53 20,65 C20,70 24,75 30,75 L70,75 C76,75 80,70 80,65 C80,53 70,48 65,45 L65,25 C65,16 58,10 50,10 Z M50,75 C45,75 42,85 50,85 C58,85 55,75 50,75 Z" />
                    </svg>
                </div>

                <div className="h-28 flex flex-col items-center justify-center">
                    {step >= 1 && (
                        <h1 className="text-4xl sm:text-5xl font-black text-gold-gradient font-tamil tracking-wider animate-bounce-slow mb-4">
                            வீரப்பூர்
                        </h1>
                    )}

                    {step >= 2 && (
                        <p className="text-base sm:text-lg text-slate-300 font-tamil tracking-widest leading-relaxed px-4 opacity-0 animate-pulse-slow" style={{ animationFillMode: 'forwards', animationDelay: '0.1s', opacity: 1 }}>
                            அண்ணன்மார் அருள் பூமிக்கு வரவேற்கிறோம்
                        </p>
                    )}
                </div>

                <button
                    onClick={onStart}
                    className="mt-12 bg-kumkum/40 hover:bg-kumkum text-gold px-6 py-2 rounded-full border border-gold/40 text-xs sm:text-sm font-tamil tracking-widest transition duration-300 shadow-kumkum flex items-center gap-2"
                >
                    <Icon name="bell" className="w-4 h-4 animate-swing" />
                    உள்நுழைய / Enter Portal
                </button>
            </div>
        </div>
    );
}

// ----------------------------------------------------
// Component: Home Page
// ----------------------------------------------------
function HomePage({ setPage, t, language, db, saveState }) {
    const [sliderIndex, setSliderIndex] = useState(0);

    // Hero slides loaded from dynamic database
    const slides = db.heroSlides && db.heroSlides.length > 0 ? db.heroSlides : [
        { id: "hs1", url: "/assets/images/srpkamn.PNG", title: "வீரப்பூர்", subtitle: "ஸ்ரீ பெரியகாண்டி அம்மன் திருக்கோவில்", description: "அண்ணன்மார் சாமிகளின் புனித பூமி" }
    ];

    // Loop through slider cleanly, addressing blank slide bug
    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setSliderIndex(prev => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    // Approved reviews
    const approvedReviews = db.reviews ? db.reviews.filter(r => r.approved) : [];

    return (
        <div className="flex flex-col gap-16 pb-20">
            
            {/* Hero Banner Slider */}
            <section className="relative h-[80vh] w-full overflow-hidden bg-stone-dark">
                {slides.map((slide, idx) => (
                    <div
                        key={slide.id || idx}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                            sliderIndex === idx ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                        }`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-dark via-stone-dark/35 to-transparent z-10"></div>
                        <img
                            src={slide.url}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />

                        {/* Slide Content */}
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                            <span className="text-gold font-tamil font-semibold text-xs sm:text-sm tracking-widest bg-stone-dark/70 border border-gold/30 px-4 py-1.5 rounded-full mb-4">
                                {slide.title}
                            </span>
                            <h2 className="text-2xl sm:text-5xl lg:text-6xl font-black font-tamil text-gold-gradient tracking-wide mb-3 drop-shadow-md">
                                {slide.subtitle}
                            </h2>
                            <p className="text-xs sm:text-base lg:text-lg text-slate-300 font-tamil tracking-wider mb-8 drop-shadow max-w-xl">
                                {slide.description}
                            </p>

                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <button
                                    onClick={() => setPage('history')}
                                    className="bg-kumkum hover:bg-kumkum-light text-gold font-tamil font-bold px-6 py-2.5 rounded-full border border-gold/50 shadow-kumkum transition text-xs sm:text-sm"
                                >
                                    {language === 'ta' ? "வரலாறு காண" : "View History"}
                                </button>
                                <button
                                    onClick={() => setPage('festivals')}
                                    className="bg-stone-dark/80 hover:bg-stone/95 text-gold font-tamil font-bold px-6 py-2.5 rounded-full border border-gold/50 transition text-xs sm:text-sm"
                                >
                                    {language === 'ta' ? "திருவிழா காண" : "View Festivals"}
                                </button>
                                <button
                                    onClick={() => setPage('services')}
                                    className="bg-turmeric hover:bg-turmeric-dark text-stone-dark font-tamil font-bold px-6 py-2.5 rounded-full border border-gold/50 transition text-xs sm:text-sm"
                                >
                                    {language === 'ta' ? "சேவைகள் பெற" : "Get Services"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Dots indicator */}
                {slides.length > 1 && (
                    <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSliderIndex(idx)}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${
                                    sliderIndex === idx ? 'bg-gold w-6' : 'bg-slate-500/50'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Quick stats board */}
            <section className="max-w-7xl mx-auto px-4 w-full -mt-24 z-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-stone-light/95 border border-gold/30 p-5 rounded-lg flex items-center gap-4 shadow-gold">
                        <div className="p-3 bg-kumkum/40 border border-gold text-gold rounded-full">
                            <Icon name="bell" />
                        </div>
                        <div>
                            <h4 className="text-slate-400 text-xs font-tamil">பூஜை காலங்கள்</h4>
                            <p className="text-gold font-semibold font-tamil text-xs sm:text-sm">தினசரி 6 கால பூஜை</p>
                        </div>
                    </div>
                    <div className="bg-stone-light/95 border border-gold/30 p-5 rounded-lg flex items-center gap-4 shadow-gold">
                        <div className="p-3 bg-kumkum/40 border border-gold text-gold rounded-full">
                            <Icon name="calendar" />
                        </div>
                        <div>
                            <h4 className="text-slate-400 text-xs font-tamil">அடுத்த திருவிழா</h4>
                            <p className="text-gold font-semibold font-tamil text-xs sm:text-sm">மாசி பெருந்திருவிழா</p>
                        </div>
                    </div>
                    <div className="bg-stone-light/95 border border-gold/30 p-5 rounded-lg flex items-center gap-4 shadow-gold">
                        <div className="p-3 bg-kumkum/40 border border-gold text-gold rounded-full">
                            <Icon name="services" />
                        </div>
                        <div>
                            <h4 className="text-slate-400 text-xs font-tamil">தங்கும் விடுதிகள்</h4>
                            <p className="text-gold font-semibold font-tamil text-xs sm:text-sm">ஆன்லைன் முன்பதிவு</p>
                        </div>
                    </div>
                    <div className="bg-stone-light/95 border border-gold/30 p-5 rounded-lg flex items-center gap-4 shadow-gold">
                        <div className="p-3 bg-kumkum/40 border border-gold text-gold rounded-full">
                            <Icon name="user" />
                        </div>
                        <div>
                            <h4 className="text-slate-400 text-xs font-tamil">தர்ம பூமி</h4>
                            <p className="text-gold font-semibold font-tamil text-xs sm:text-sm">ஆயிரமாண்டு பாரம்பரியம்</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tourist Guide Booking Promotion Block */}
            <section className="max-w-7xl mx-auto px-4 w-full">
                <div className="bg-stone-light border border-gold/30 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-gold border-pillar-left border-pillar-right">
                    <div className="space-y-2">
                        <h3 className="text-lg sm:text-xl font-bold font-tamil text-gold-gradient">சுற்றுலா வழிகாட்டி வசதி (Tourist Guide Service)</h3>
                        <p className="text-xs sm:text-sm text-slate-300 font-tamil leading-relaxed">
                            பக்தர்களுக்கு கைடு (Tourist Guide) தேவைப்பட்டால் பதிவு செய்யலாம், தங்களுக்கு குறைந்த கட்டணத்தில் கைடு ஏற்பாடு செய்து தரப்படும்.
                        </p>
                    </div>
                    <button
                        onClick={() => setPage('services')}
                        className="bg-turmeric hover:bg-turmeric-dark text-stone-dark font-tamil font-bold px-6 py-2.5 rounded text-xs sm:text-sm whitespace-nowrap transition"
                    >
                        கைடு முன்பதிவு செய்ய (Book Guide)
                    </button>
                </div>
            </section>

            {/* Free Prasatham & Theertham online registration Promotion Block */}
            <section className="max-w-7xl mx-auto px-4 w-full">
                <div className="bg-gradient-to-r from-kumkum-dark to-stone-light border border-gold/30 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-kumkum">
                    <div className="space-y-2">
                        <span className="text-[10px] bg-gold text-stone-dark font-bold px-2 py-0.5 rounded font-tamil">புதிய சேவை (New Seva)</span>
                        <h3 className="text-lg sm:text-xl font-bold font-tamil text-gold-gradient">அர்ச்சனை பிரசாதம் & தீர்த்தம் இல்லம் தேடி (Free Prasatham Delivery)</h3>
                        <p className="text-xs sm:text-sm text-slate-300 font-tamil leading-relaxed">
                            கோவில் பிரசாதம் மற்றும் தீர்த்தம் உங்கள் வீட்டில் இருந்தே பெற்றுக்கொள்ளுங்கள்! ஆன்லைனில் பதிவு செய்தால், கோவிலில் அர்ச்சனை செய்து பிரசாதம் உங்கள் வீட்டிற்கே இலவசமாக அனுப்பி வைக்கப்படும்.
                        </p>
                    </div>
                    <button
                        onClick={() => setPage('services')}
                        className="bg-gold hover:bg-gold-light text-stone-dark font-tamil font-bold px-6 py-2.5 rounded text-xs sm:text-sm whitespace-nowrap transition"
                    >
                        இலவச பிரசாதம் பெற (Order Prasatham)
                    </button>
                </div>
            </section>

            {/* Temple Introduction */}
            <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
                <div className="lg:col-span-7 space-y-6">
                    <span className="text-xs bg-kumkum/30 border border-gold/40 text-gold px-3.5 py-1 rounded-full font-tamil">வரலாற்று பெருமை</span>
                    <h2 className="text-2xl sm:text-4xl font-bold font-tamil text-gold-gradient leading-snug">
                        ஸ்ரீ பெரியகாண்டி அம்மன் & பொன்னர் சங்கர் திருக்கோவில்
                    </h2>
                    <p className="text-slate-300 font-tamil leading-relaxed text-sm sm:text-base">
                        மணப்பாறை வட்டத்தில் அமைந்துள்ள வீரப்பூர் திருத்தலம் கொங்கு நாட்டின் மாபெரும் தியாகத்திற்கும் வீரத்திற்கும் மகுடமாக விளங்கும் தலம். 
                        ஐந்து தலை நாகத்தின் தவத்தின் பலனாக அவதரித்த பெரியகாண்டி அம்மனும், கொங்கு மக்களை காக்க தம்முயிரை நீத்த பொன்னர் சங்கர் அண்ணன்மார்களும் இங்கு குடிகொண்டு அருள் பாலிக்கிறார்கள்.
                    </p>
                    <button
                        onClick={() => setPage('history')}
                        className="border border-gold text-gold hover:bg-gold hover:text-stone-dark font-tamil font-bold px-6 py-2.5 rounded transition duration-300 flex items-center gap-1 text-sm shadow-gold"
                    >
                        முழுமையான வரலாற்றை படிக்க
                        <Icon name="chevronRight" className="w-4 h-4" />
                    </button>
                </div>
                <div className="lg:col-span-5 relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-gold to-kumkum rounded-lg opacity-40 blur-sm"></div>
                    <div className="relative bg-stone-light p-2 rounded-lg border border-gold/30">
                        <img
                            src="/assets/images/srpkamn.PNG"
                            alt="Temple Tower"
                            className="w-full h-[320px] object-cover rounded-md"
                        />
                    </div>
                </div>
            </section>

            {/* Live Announcements Bulletin Board */}
            <section className="max-w-7xl mx-auto px-4 w-full">
                <div className="bg-stone-light border border-gold/30 rounded-lg p-6 shadow-gold relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-kumkum/15 rounded-full blur-xl"></div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-light pb-4 mb-4">
                        <div className="flex items-center gap-2.5">
                            <span className="p-2 rounded bg-kumkum text-gold">
                                <Icon name="bell" className="w-5 h-5" />
                            </span>
                            <h3 className="font-tamil font-bold text-lg text-gold-gradient">திருக்கோவில் நேரலை அறிவிப்புகள் (Live Bulletins)</h3>
                        </div>
                        <span className="text-xs bg-stone text-gold px-2.5 py-1 rounded border border-gold/20">
                            {new Date().toLocaleDateString('ta-IN')}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {db.liveUpdates && db.liveUpdates.length > 0 ? (
                            db.liveUpdates.map((ann, idx) => (
                                <div key={idx} className="flex gap-3.5 items-start p-3 bg-stone rounded border-l-4 border-kumkum hover:border-gold transition">
                                    <span className="text-xs font-tamil bg-kumkum/40 border border-gold/30 text-gold px-2.5 py-0.5 rounded mt-0.5 whitespace-nowrap">
                                        {ann.time}
                                    </span>
                                    <div>
                                        <p className="text-slate-200 text-sm font-tamil leading-relaxed">{ann.message}</p>
                                        <span className="text-[10px] text-slate-500 font-tamil mt-1 block">பதிவிட்ட தேதி: {ann.date}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 text-sm font-tamil text-center py-4">தற்போது புதிய தகவல்கள் ஏதும் இல்லை.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* Upcoming Festival Countdown */}
            <section className="bg-stone-light/40 border-y border-gold/20 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center space-y-6 flex flex-col items-center">
                    <span className="text-xs bg-kumkum/30 border border-gold/40 text-gold px-3.5 py-1 rounded-full font-tamil">மாசி திருவிழா எஞ்சிய நாட்கள்</span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-tamil text-gold-gradient">மாசி பெருந்திருவிழா துவக்கம் (2027)</h2>
                    <FestivalCountdown date="2027-03-02" />
                    <button
                        onClick={() => setPage('festivals')}
                        className="bg-kumkum hover:bg-kumkum-light text-gold border border-gold/40 font-tamil font-bold px-6 py-2 rounded text-sm transition"
                    >
                        முழு அட்டவணை பார்க்க
                    </button>
                </div>
            </section>

            {/* Reviews list */}
            <section className="max-w-7xl mx-auto px-4 w-full">
                <div className="text-center space-y-3 mb-10">
                    <span className="text-xs bg-kumkum/30 border border-gold/40 text-gold px-3 py-1 rounded-full font-tamil">பக்தர்களின் அனுபவம்</span>
                    <h2 className="text-2xl sm:text-3xl font-bold font-tamil text-gold-gradient">பக்தர் கருத்துக்கள் (Reviews)</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {approvedReviews.map((rev, idx) => (
                        <div key={idx} className="bg-stone-light border border-gold/20 p-6 rounded-lg relative hover:border-gold/50 transition">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-slate-100 font-tamil text-xs sm:text-sm">{rev.name}</h4>
                                    <span className="text-[10px] text-gold/75 font-tamil">{rev.place}</span>
                                </div>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Icon
                                            key={i}
                                            name="star"
                                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-gold text-gold' : 'text-slate-600'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-slate-400 text-xs sm:text-sm font-tamil leading-relaxed italic">
                                "{rev.experience}"
                            </p>
                        </div>
                    ))}
                </div>
                
                <div className="text-center mt-8">
                    <button
                        onClick={() => setPage('helpdesk')}
                        className="text-xs bg-stone border border-gold/40 text-gold px-4 py-2 rounded hover:bg-kumkum/20 transition font-tamil"
                    >
                        தங்கள் அனுபவத்தை பகிர (Write Review)
                    </button>
                </div>
            </section>
        </div>
    );
}

// ----------------------------------------------------
// Component: Countdown Timer
// ----------------------------------------------------
function FestivalCountdown({ date }) {
    const calculateTimeLeft = () => {
        const difference = +new Date(date) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const formatNumber = (num) => String(num || 0).padStart(2, '0');

    return (
        <div className="flex gap-4 sm:gap-6 justify-center my-6">
            {[
                { label: "நாட்கள்", val: timeLeft.days, word: "Days" },
                { label: "மணிநேரம்", val: timeLeft.hours, word: "Hours" },
                { label: "நிமிடங்கள்", val: timeLeft.minutes, word: "Mins" },
                { label: "விநாடிகள்", val: timeLeft.seconds, word: "Secs" }
            ].map((unit, i) => (
                <div key={i} className="flex flex-col items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone border border-gold/40 rounded-lg flex items-center justify-center font-bold text-2xl sm:text-3xl text-gold-gradient shadow-gold font-mono">
                        {formatNumber(unit.val)}
                    </div>
                    <span className="text-[10px] sm:text-xs text-slate-400 font-tamil mt-2">{unit.label}</span>
                </div>
            ))}
        </div>
    );
}

// ----------------------------------------------------
// Component: Temple History Page (Dynamic Chapters)
// ----------------------------------------------------
function HistoryPage({ t, language, db }) {
    const chapters = db.history || [];

    const [speakingChapter, setSpeakingChapter] = useState(null);

    const handleVoicePlay = (chapNum, text) => {
        const isCurrentlySpeaking = speakingChapter === chapNum;
        speakTamilText(text, isCurrentlySpeaking, (speakingStatus) => {
            if (speakingStatus) {
                setSpeakingChapter(chapNum);
            } else {
                setSpeakingChapter(null);
            }
        });
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col gap-16">
            <div className="text-center space-y-4">
                <span className="text-xs bg-kumkum/40 border border-gold/40 text-gold px-3.5 py-1 rounded-full font-tamil">புராணக் காவியம்</span>
                <h2 className="text-3xl sm:text-5xl font-bold font-tamil text-gold-gradient">திருக்கோவில் தல வரலாறு</h2>
                <p className="text-slate-400 font-tamil text-sm max-w-xl mx-auto leading-relaxed">
                    தலைமுறை தலைமுறையாக போற்றப்படும் வீரப்பூர் பெரியகாண்டி அம்மனின் அவதார திருவிளையாடல்கள் மற்றும் அண்ணன்மார்களின் வீர வரலாற்றுப் பதிவுகள்.
                </p>
            </div>

            <div className="flex flex-col gap-24">
                {chapters.map((chap) => {
                    const isEven = chap.num % 2 === 0;
                    return (
                        <div
                            key={chap.num}
                            className={`flex flex-col lg:flex-row items-center gap-10 ${
                                isEven ? 'lg:flex-row-reverse' : ''
                            }`}
                        >
                            <div className="w-full lg:w-1/2 relative group">
                                <div className="absolute -inset-2 bg-gradient-to-r from-gold/50 to-kumkum/50 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition duration-300"></div>
                                <div className="relative bg-stone-light p-2 rounded-lg border border-gold/30">
                                    <img
                                        src={chap.image}
                                        alt={chap.title}
                                        className="w-full h-80 object-cover rounded"
                                    />
                                    <div className="absolute top-4 left-4 bg-kumkum text-gold border border-gold/50 font-bold px-3 py-1 rounded shadow-kumkum text-xs">
                                        அத்தியாயம் {chap.num}
                                    </div>
                                </div>
                            </div>

                            <div className="w-full lg:w-1/2 space-y-4 border-l-2 lg:border-l-0 lg:px-4 border-gold/40 pl-4">
                                <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient font-tamil">
                                    {chap.title}
                                </h3>
                                
                                <button
                                    onClick={() => handleVoicePlay(chap.num, `${chap.title}. ${chap.content}`)}
                                    className={`inline-flex items-center gap-2 text-xs py-1.5 px-3 rounded-full transition border font-tamil ${
                                        speakingChapter === chap.num
                                            ? 'bg-gold text-stone-dark border-gold animate-pulse'
                                            : 'bg-stone hover:bg-stone-light text-gold border-gold/30'
                                    }`}
                                >
                                    <Icon name={speakingChapter === chap.num ? "volumeMute" : "volume"} className="w-4 h-4" />
                                    {speakingChapter === chap.num ? "குரலை நிறுத்த" : "குரல் வழி கேட்க (Tamil Audio)"}
                                </button>

                                <p className="text-slate-300 font-tamil leading-relaxed text-xs sm:text-sm text-justify">
                                    {chap.content}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-stone-light/40 border border-gold/30 p-8 rounded-lg text-center max-w-2xl mx-auto space-y-6 mt-12 shadow-gold border-pillar-left border-pillar-right">
                <div className="flex justify-center gap-4 text-gold font-tamil font-bold text-lg">
                    <span>வீரம்</span> • <span>பாசம்</span> • <span>தர்மம்</span>
                </div>
                <p className="text-slate-300 font-tamil text-sm">
                    இவற்றின் அடையாளமாக வீரப்பூர் என்றும் விளங்குகிறது.
                </p>
                <p className="text-gold-gradient font-tamil font-semibold text-base sm:text-lg">
                    🙏 ஸ்ரீ பெரியகாண்டி அம்மன் அருள் அனைவருக்கும் கிடைக்கட்டும் 🙏
                </p>
            </div>
        </div>
    );
}

// ----------------------------------------------------
// Component: Deities Page
// ----------------------------------------------------
function DeitiesPage({ t, language, db }) {
    const deities = db.deities || [];

    const [selectedDeity, setSelectedDeity] = useState(null);

    return (
        <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col gap-12">
            <div className="text-center space-y-4">
                <span className="text-xs bg-kumkum/40 border border-gold/40 text-gold px-3.5 py-1 rounded-full font-tamil">வழிபாட்டு மூர்த்திகள்</span>
                <h2 className="text-3xl sm:text-5xl font-bold font-tamil text-gold-gradient">திருக்கோவில் தெய்வங்கள்</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {deities.map((deity) => (
                    <div
                        key={deity.id}
                        onClick={() => setSelectedDeity(deity)}
                        className="bg-stone-light border border-gold/20 hover:border-gold/60 p-5 rounded-lg flex flex-col justify-between cursor-pointer transition-all duration-300 transform hover:-translate-y-1 shadow-gold group"
                    >
                        <div className="space-y-4">
                            <div className="w-full h-64 overflow-hidden rounded relative">
                                <img
                                    src={deity.photo}
                                    alt={deity.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-dark/70 to-transparent"></div>
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-gold font-tamil mb-1">{deity.name}</h3>
                                <span className="text-xs text-slate-400 font-tamil">{deity.title}</span>
                            </div>
                            <p className="text-slate-300 font-tamil text-xs line-clamp-3">
                                {deity.history}
                            </p>
                        </div>
                        <button className="mt-5 text-xs text-gold font-tamil flex items-center gap-1 font-semibold group-hover:text-white transition">
                            விவரங்கள் அறிய
                            <Icon name="chevronRight" className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>

            {selectedDeity && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-stone-dark border border-gold/40 rounded-lg max-w-2xl w-full p-6 relative shadow-gold-lg max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setSelectedDeity(null)}
                            className="absolute top-4 right-4 text-gold hover:text-white"
                        >
                            <Icon name="x" className="w-6 h-6" />
                        </button>

                        <div className="space-y-6 pt-4">
                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                <img
                                    src={selectedDeity.photo}
                                    alt={selectedDeity.name}
                                    className="w-full sm:w-48 h-64 sm:h-56 object-cover rounded border border-gold/20"
                                />
                                <div className="space-y-3">
                                    <h3 className="text-xl sm:text-2xl font-bold font-tamil text-gold-gradient">{selectedDeity.name}</h3>
                                    <span className="text-xs bg-kumkum/40 border border-gold/30 text-gold px-2.5 py-1 rounded inline-block font-tamil">{selectedDeity.title}</span>
                                    <p className="text-slate-300 font-tamil text-xs sm:text-sm leading-relaxed text-justify">
                                        {selectedDeity.history}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-gold font-tamil font-semibold text-xs mb-3">புகைப்பட தொகுப்பு (Gallery)</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {selectedDeity.gallery.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img}
                                            alt={selectedDeity.name}
                                            className="w-full h-20 sm:h-24 object-cover rounded border border-stone-light hover:border-gold transition cursor-pointer"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------
// Component: Festivals Page (Auto clean finished events)
// ----------------------------------------------------
function FestivalsPage({ t, language, db }) {
    const festivalsList = db.festivals || [];
    
    // Auto filter upcoming festivals (past events removed from active listings, except Main ones)
    const todayStr = new Date().toISOString().split('T')[0];
    
    const activeFestivals = festivalsList.filter(fest => {
        if (fest.isMain) return true; // Main festival always stays visible
        return fest.date >= todayStr;  // Only show future/upcoming events
    });

    return (
        <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col gap-16">
            <div className="text-center space-y-4">
                <span className="text-xs bg-kumkum/40 border border-gold/40 text-gold px-3.5 py-1 rounded-full font-tamil">திருவிழா சிறப்புகள்</span>
                <h2 className="text-3xl sm:text-5xl font-bold font-tamil text-gold-gradient">பெருந்திருவிழாக்கள் & பூஜைகள்</h2>
            </div>

            {/* List active festivals dynamically */}
            <div className="space-y-12">
                {activeFestivals.map((fest) => (
                    <div key={fest.id} className="bg-stone-light border border-gold/30 rounded-lg p-6 lg:p-10 shadow-gold grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
                        {fest.isMain && (
                            <span className="absolute top-4 right-4 bg-kumkum border border-gold/40 text-gold text-[10px] px-2.5 py-0.5 rounded font-tamil">முதன்மை பெருவிழா (Main Festival)</span>
                        )}
                        <div className="lg:col-span-7 space-y-6">
                            <h3 className="text-2xl sm:text-3xl font-bold font-tamil text-gold-gradient">{fest.title}</h3>
                            <p className="text-slate-300 font-tamil leading-relaxed text-xs sm:text-sm">
                                {fest.description}
                            </p>

                            <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-tamil">
                                <div>📅 நாட்கள்: <span className="text-gold font-semibold">{fest.daysCount} நாட்கள்</span></div>
                                <div>🚀 திருவிழா தேதி: <span className="text-gold font-semibold">{fest.date}</span></div>
                            </div>

                            {/* Schedule steps if any */}
                            {fest.schedule && fest.schedule.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="text-gold font-tamil font-semibold text-xs border-b border-stone pb-2">விழா நிகழ்வுகள் கால அட்டவணை:</h4>
                                    <div className="relative border-l border-gold/30 ml-3.5 pl-5 space-y-6">
                                        {fest.schedule.map((item, idx) => (
                                            <div key={idx} className="relative">
                                                <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-gold border border-stone-dark shadow-gold"></div>
                                                <div>
                                                    <div className="flex gap-2 items-center flex-wrap">
                                                        <span className="font-bold text-slate-200 font-tamil text-xs sm:text-sm">{item.event}</span>
                                                        <span className="text-[9px] bg-kumkum/40 border border-gold/20 text-gold px-2 py-0.5 rounded font-tamil">{item.date} • {item.time}</span>
                                                    </div>
                                                    <p className="text-slate-400 text-xs font-tamil mt-1">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-5">
                            <img
                                src={fest.image}
                                alt={fest.title}
                                className="w-full h-72 sm:h-96 object-cover rounded border border-gold/20"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "அமாவாசை பூஜைகள்", time: "மாதந்தோறும்", desc: "அமாவாசை தோறும் மாலை பெரியகாண்டி அம்மனுக்கு சிறப்பு அபிஷேகம் மற்றும் ஊஞ்சல் உற்சவம் ஆராதனை நடைபெறும்." },
                    { title: "பௌர்ணமி பூஜைகள்", time: "மாதந்தோறும்", desc: "பௌர்ணமி அன்று மாலையில் அம்பாளுக்கு 108 விளக்கு பூஜை மற்றும் மாவிளக்கு மாபெரும் நேர்த்திக்கடன் வழிபாடு." },
                    { title: "சிறப்பு பூஜைகள் & பிரதோஷம்", time: "வாராந்திர / மாதாந்திர", desc: "பிரதோஷங்கள் மற்றும் செவ்வாய், வெள்ளிக்கிழமைகளில் அம்மன் சன்னதியிலும் எல்லை சாமிகளுக்கும் சிறப்பு அலங்காரம்." }
                ].map((puja, idx) => (
                    <div key={idx} className="bg-stone border border-gold/20 p-6 rounded-lg space-y-3 hover:border-gold/50 transition shadow-gold">
                        <span className="text-[10px] bg-kumkum text-gold px-2.5 py-1 rounded font-tamil inline-block">{puja.time}</span>
                        <h4 className="text-gold font-bold font-tamil text-xs sm:text-sm">{puja.title}</h4>
                        <p className="text-slate-400 text-xs font-tamil leading-relaxed">{puja.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ----------------------------------------------------
// Component: Services Booking & Facility Page
// ----------------------------------------------------
function ServicesPage({ t, language, db, saveState }) {
    const [tab, setTab] = useState('rooms');
    const [statusMsg, setStatusMsg] = useState("");

    // Form inputs state
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [date, setDate] = useState("");
    const [count, setCount] = useState("");
    const [reqs, setReqs] = useState("");

    // Nakshatram & Address for Prasatham Seva
    const [nakshatram, setNakshatram] = useState("");
    const [rasi, setRasi] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");

    // Special Offerings checkbox checklist
    const [selectedServices, setSelectedServices] = useState({
        goat: false,
        cook: false,
        utensil: false,
        oven: false,
        water: false,
        shed: false,
        audio: false,
        chairTable: false,
        decor: false
    });

    // Transport vehicle selection
    const [vehicle, setVehicle] = useState("car");
    const [pickupType, setPickupType] = useState("railway");

    const resetForm = () => {
        setName("");
        setPhone("");
        setDate("");
        setCount("");
        setReqs("");
        setNakshatram("");
        setRasi("");
        setDeliveryAddress("");
        setSelectedServices({
            goat: false, cook: false, utensil: false, oven: false, water: false, shed: false, audio: false, chairTable: false, decor: false
        });
    };

    const handleRoomSelectChange = (val) => {
        setReqs(val);
    };

    // Load dynamic rooms from database
    const roomList = db.rooms || [];
    
    // Auto-select first room in form state
    useEffect(() => {
        if (roomList.length > 0 && !reqs) {
            setReqs(roomList[0].name);
        }
    }, [roomList, reqs]);

    const selectedRoomDetails = roomList.find(r => r.name === reqs);

    const handleSubmitRequest = (e, requestType) => {
        e.preventDefault();
        if (!name || !phone || !date) {
            alert("பெயர், போன் எண் மற்றும் தேதி கட்டாயம் நிரப்பப்பட வேண்டும்.");
            return;
        }

        let details = {};
        if (requestType === 'room') {
            details = { roomOption: reqs };
        } else if (requestType === 'mandapam') {
            details = { mandapamName: "ஸ்ரீ பொன்னர் சங்கர் கல்யாண மண்டபம்" };
        } else if (requestType === 'offering') {
            const list = Object.keys(selectedServices).filter(k => selectedServices[k]);
            details = { offeringServices: list };
        } else if (requestType === 'transport') {
            details = { vehicle, pickupType };
        } else if (requestType === 'guide') {
            details = { guideLanguage: reqs || "Tamil" };
        } else if (requestType === 'prasatham') {
            details = { nakshatram, rasi, deliveryAddress };
        }

        const newRequest = {
            id: "req_" + Date.now(),
            type: requestType,
            name,
            phone,
            date,
            count: count || "1",
            details,
            status: "pending",
            createdAt: new Date().toISOString().split('T')[0]
        };

        const updatedDb = { ...db };
        updatedDb.bookings = [newRequest, ...(updatedDb.bookings || [])];
        saveState(updatedDb);

        setStatusMsg(language === 'ta' ? "முன்பதிவு கோரிக்கை வெற்றிகரமாக அனுப்பப்பட்டது! நிர்வாகி உங்களை தொடர்புகொள்வார்." : "Request submitted! Admin will contact you.");
        resetForm();
        setTimeout(() => setStatusMsg(""), 5000);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col gap-12">
            <div className="text-center space-y-4">
                <span className="text-xs bg-kumkum/40 border border-gold/40 text-gold px-3.5 py-1 rounded-full font-tamil">பக்தர் சேவைகள்</span>
                <h2 className="text-3xl sm:text-5xl font-bold font-tamil text-gold-gradient">திருக்கோவில் சேவைகள் முன்பதிவு</h2>
            </div>

            <div className="flex flex-wrap border-b border-gold/30">
                {[
                    { id: "rooms", title: "தங்குமிடம் (Rooms)" },
                    { id: "mandapam", title: "மண்டபம் (Mandapam)" },
                    { id: "offerings", title: "நேர்த்திக்கடன் (Offerings)" },
                    { id: "transport", title: "போக்குவரத்து (Transport)" },
                    { id: "guide", title: "கைடு (Tourist Guide)" },
                    { id: "prasatham", title: "இலவச பிரசாதம் (Prasatham Delivery)" }
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => {
                            setTab(t.id);
                            resetForm();
                        }}
                        className={`py-3 px-4 sm:px-6 text-xs sm:text-sm font-semibold font-tamil border-b-2 transition-all ${
                            tab === t.id ? 'border-gold text-gold bg-kumkum/10' : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        {t.title}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Details left panel */}
                <div className="lg:col-span-7 space-y-6">
                    {tab === 'rooms' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gold font-tamil">தங்கும் விடுதிகள் விவரம்</h3>
                            <div className="space-y-4">
                                {roomList.map((room) => (
                                    <div key={room.id} className="bg-stone-light border border-gold/20 p-5 rounded-lg space-y-4">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                            <div className="flex gap-4 items-start">
                                                {room.photos && room.photos[0] && (
                                                    <img src={room.photos[0]} alt={room.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded border border-gold/20" />
                                                )}
                                                <div>
                                                    <h4 className="font-bold text-slate-100 font-tamil text-xs sm:text-sm">{room.name}</h4>
                                                    <p className="text-xs text-gold font-tamil mt-1 flex items-center gap-1">
                                                        <Icon name="mapPin" className="w-3.5 h-3.5" />
                                                        {room.location} • {room.distance}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] px-2.5 py-1 rounded font-tamil border ${
                                                room.ac ? 'bg-kumkum/40 border-gold text-gold' : 'bg-stone border-slate-600 text-slate-300'
                                            }`}>
                                                {room.ac ? "AC அறை" : "Non-AC அறை"}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                                            {room.facilities.map((fac, idx) => (
                                                <div key={idx} className="flex items-center gap-1.5 font-tamil">
                                                    <span className="text-gold">•</span> {fac}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {tab === 'mandapam' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-gold font-tamil">திருமண மண்டபங்கள்</h3>
                            {db.mandapams && db.mandapams.map((man) => (
                                <div key={man.id} className="bg-stone-light border border-gold/20 p-5 rounded-lg space-y-4">
                                    <h4 className="font-bold text-slate-100 font-tamil text-sm">{man.name}</h4>
                                    <p className="text-xs text-gold font-tamil flex items-center gap-1">
                                        <Icon name="mapPin" className="w-3.5 h-3.5" />
                                        {man.location}
                                    </p>
                                    <div className="text-xs text-slate-300 font-tamil">
                                        <div><strong>கொள்ளளவு:</strong> {man.capacity}</div>
                                        <div className="mt-2 font-semibold text-gold">வசதிகள்:</div>
                                        <div className="grid grid-cols-2 gap-2 mt-1">
                                            {man.facilities.map((fac, idx) => (
                                                <div key={idx} className="flex items-center gap-1">
                                                    <span className="text-gold">•</span> {fac}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {tab === 'offerings' && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gold font-tamil">நெர்த்திக்கடன் ஏற்பாடுகள்</h3>
                            <p className="text-slate-300 font-tamil text-xs sm:text-sm leading-relaxed">
                                திருவிழா அல்லது அமாவாசை நாட்களில் பக்தர்கள் மேற்கொள்ளும் சமையல், கிடா வெட்டுதல் போன்ற நேர்த்திக்கடன்களுக்கு தேவையான உபகரணங்கள் மற்றும் மாஸ்டர்களை ஏற்பாடு செய்து தரும் சேவை.
                            </p>
                        </div>
                    )}

                    {tab === 'transport' && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gold font-tamil">போக்குவரத்து வசதிகள்</h3>
                            <p className="text-slate-300 font-tamil text-xs sm:text-sm leading-relaxed">
                                இரயில் அல்லது பேருந்து நிலையங்களில் இறங்கி திருத்தலத்திற்கு வரவும் எல்லை கோவில்களுக்கு செல்லவும் வாகனங்கள் ஏற்பாடு செய்யப்படுகிறது.
                            </p>
                        </div>
                    )}

                    {tab === 'guide' && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gold font-tamil">சுற்றுலா வழிகாட்டி (Tourist Guide Helper)</h3>
                            <p className="text-slate-300 font-tamil text-xs sm:text-sm leading-relaxed">
                                வீரப்பூர் பெரியகாண்டி அம்மன் கோவில், வீரமலை தவ பூமி, படுகளம், மற்றும் அண்ணன்மார் சாமிகளின் புனித வரலாறுகளைப் பக்தர்கள் தெளிவாகப் புரிந்துகொள்ளவும், சுற்றியுள்ள பகுதிகளைச் சுற்றிப் பார்க்கவும் தமிழ் மற்றும் ஆங்கில வழிகாட்டிகள் மிகக் குறைந்த கட்டணத்தில் ஏற்பாடு செய்து தரப்படும்.
                            </p>
                        </div>
                    )}

                    {tab === 'prasatham' && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-gold font-tamil">அர்ச்சனை பிரசாதம் இலவச ஹோம் டெலிவரி</h3>
                            <p className="text-slate-300 font-tamil text-xs sm:text-sm leading-relaxed">
                                தூரத்தில் வசிக்கும் பக்தர்கள் கோவிலுக்கு வர முடியாத பட்சத்தில், அவர்கள் பெயரில் அர்ச்சனை அபிஷேகம் செய்யப்பட்டு, குங்குமம், விபூதி, தீர்த்தம், மற்றும் பிரசாதங்கள் அவர்களின் வீட்டு முகவரிக்கு தபால்/கொரியர் மூலம் முற்றிலும் இலவசமாக அனுப்பி வைக்கப்படும்.
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Form panel */}
                <div className="lg:col-span-5 bg-stone-light border border-gold/30 p-6 rounded-lg shadow-gold">
                    <h3 className="font-bold font-tamil text-gold text-lg mb-4 border-b border-stone pb-3">முன்பதிவு கோரிக்கை படிவம்</h3>
                    
                    <form onSubmit={(e) => handleSubmitRequest(e, tab === 'rooms' ? 'room' : tab === 'mandapam' ? 'mandapam' : tab === 'offerings' ? 'offering' : tab === 'transport' ? 'transport' : tab === 'guide' ? 'guide' : 'prasatham')} className="space-y-4 text-xs sm:text-sm">
                        
                        <div>
                            <label className="block text-slate-300 font-tamil text-xs mb-1">தங்கள் பெயர் (Name) *</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold font-tamil"
                                placeholder="பெயர்"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 font-tamil text-xs mb-1">போன் எண் (Mobile Phone) *</label>
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold"
                                placeholder="98XXXXXXXX"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1">தேதி (Date) *</label>
                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1">நபர்கள் எண்ணிக்கை</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={count}
                                    onChange={(e) => setCount(e.target.value)}
                                    className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold"
                                    placeholder="1"
                                />
                            </div>
                        </div>

                        {/* Dynamic Rooms Selection */}
                        {tab === 'rooms' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-slate-300 font-tamil text-xs mb-1">தங்கும் விடுதி தேர்ந்தெடுக்கவும் (Select Room) *</label>
                                    <select
                                        value={reqs}
                                        onChange={(e) => handleRoomSelectChange(e.target.value)}
                                        className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold font-tamil"
                                    >
                                        {roomList.map((room) => (
                                            <option key={room.id} value={room.name}>{room.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Room Amenities / Specialties displayed below dropdown */}
                                {selectedRoomDetails && (
                                    <div className="bg-stone border border-gold/25 p-3 rounded space-y-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gold font-tamil font-bold">வசதிகள் மற்றும் விபரங்கள்:</span>
                                            <span className="text-[10px] text-slate-400 font-tamil">{selectedRoomDetails.distance} கோவில் தூரம்</span>
                                        </div>
                                        <ul className="text-[11px] text-slate-300 font-tamil space-y-1 pl-1">
                                            {selectedRoomDetails.facilities.map((f, i) => (
                                                <li key={i}>• {f}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Guide Selection */}
                        {tab === 'guide' && (
                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1">தேவைப்படும் மொழி (Language Needed)</label>
                                <select
                                    value={reqs}
                                    onChange={(e) => setReqs(e.target.value)}
                                    className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold font-tamil"
                                >
                                    <option value="Tamil">தமிழ் (Tamil)</option>
                                    <option value="English">ஆங்கிலம் (English)</option>
                                    <option value="Bilingual">இரு மொழிகள் (Both)</option>
                                </select>
                            </div>
                        )}

                        {/* Prasatham delivery fields */}
                        {tab === 'prasatham' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-300 font-tamil text-xs mb-1">நட்சத்திரம் (Nakshatram)</label>
                                        <input
                                            type="text"
                                            value={nakshatram}
                                            onChange={(e) => setNakshatram(e.target.value)}
                                            className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold font-tamil"
                                            placeholder="நட்சத்திரம்"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-300 font-tamil text-xs mb-1">ராசி (Rasi)</label>
                                        <input
                                            type="text"
                                            value={rasi}
                                            onChange={(e) => setRasi(e.target.value)}
                                            className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold font-tamil"
                                            placeholder="ராசி"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-tamil text-xs mb-1">பிரசாதம் அனுப்ப வேண்டிய முகவரி (Delivery Address) *</label>
                                    <textarea
                                        required
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        rows={3}
                                        className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold font-tamil"
                                        placeholder="கதவு எண், தெரு பெயர், ஊர் மற்றும் பின்கோடு..."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Offerings specific Checklist */}
                        {tab === 'offerings' && (
                            <div className="space-y-2 border border-stone p-3 rounded">
                                <label className="block text-slate-300 font-tamil text-xs font-semibold mb-2">தேவைப்படும் சேவைகள்:</label>
                                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 font-tamil">
                                    {[
                                        { id: "goat", label: "🐐 கிடா ஏற்பாடு" },
                                        { id: "cook", label: "👨🍳 சமையல் மாஸ்டர்" },
                                        { id: "utensil", label: "🍽 பாத்திரங்கள்" },
                                        { id: "oven", label: "🔥 அடுப்பு" },
                                        { id: "water", label: "💧 தண்ணீர்" },
                                        { id: "shed", label: "⛺ தற்காலிக கொட்டகை" },
                                        { id: "audio", label: "🔊 ஆடியோ ஸ்பீக்கர்" },
                                        { id: "chairTable", label: "🪑 நாற்காலி மேசைகள்" },
                                        { id: "decor", label: "🌸 மேடை அலங்காரம்" }
                                    ].map((item) => (
                                        <label key={item.id} className="flex items-center gap-1.5 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedServices[item.id]}
                                                onChange={(e) => setSelectedServices(prev => ({ ...prev, [item.id]: e.target.checked }))}
                                                className="rounded bg-stone border-gold/30 text-kumkum focus:ring-0"
                                            />
                                            {item.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Transport specific fields */}
                        {tab === 'transport' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 font-tamil text-xs mb-1">வாகனம் (Vehicle)</label>
                                    <select
                                        value={vehicle}
                                        onChange={(e) => setVehicle(e.target.value)}
                                        className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold font-tamil"
                                    >
                                        <option value="car">கார் (Car)</option>
                                        <option value="van">வேன் (Van)</option>
                                        <option value="bus">பேருந்து (Mini Bus)</option>
                                        <option value="auto">ஆட்டோ (Auto)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-tamil text-xs mb-1">ஏற்றுமிடம் (Pickup)</label>
                                    <select
                                        value={pickupType}
                                        onChange={(e) => setPickupType(e.target.value)}
                                        className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold font-tamil"
                                    >
                                        <option value="railway">இரயில் நிலையம் (Railway)</option>
                                        <option value="busstand">பேருந்து நிலையம் (Busstand)</option>
                                        <option value="tour">சுற்றுலா தலம் (Temple Tour)</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="bg-stone border border-gold/20 p-3 rounded text-[10px] text-slate-400 font-tamil leading-relaxed">
                            ⚠️ <strong>தனியுரிமை கொள்கை:</strong> இந்த தளத்தில் உரிமையாளர் தொலைபேசி எண்கள் நேரடியாக வெளியிடப்படுவதில்லை. தங்களின் முன்பதிவுகள் நிர்வாகிக்கு மட்டுமே அனுப்பப்படும்.
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gold hover:bg-gold-dark text-stone-dark font-tamil font-bold py-3 rounded-md transition duration-300"
                        >
                            கோரிக்கையை சமர்ப்பிக்க (Submit Request)
                        </button>

                        {statusMsg && (
                            <div className="text-center font-tamil text-xs text-green-500 font-semibold py-2">
                                {statusMsg}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

// ----------------------------------------------------
// Component: Devotee Help Desk & Feedback Page
// ----------------------------------------------------
function HelpDeskPage({ t, language, db, saveState }) {
    const [subTab, setSubTab] = useState('complaint');
    const [statusMsg, setStatusMsg] = useState("");

    // Review inputs
    const [name, setName] = useState("");
    const [place, setPlace] = useState("");
    const [rating, setRating] = useState(5);
    const [exp, setExp] = useState("");

    // Complaint inputs
    const [category, setCategory] = useState("Temple cleanliness");
    const [complaintMsg, setComplaintMsg] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [base64Img, setBase64Img] = useState("");
    const [phone, setPhone] = useState("");

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!name || !exp) {
            alert("பெயர் மற்றும் கருத்து கட்டாயம் தேவை.");
            return;
        }

        const newReview = {
            id: "rev_" + Date.now(),
            name,
            place: place || "உள்ளூர்",
            rating,
            experience: exp,
            approved: false
        };

        const updatedDb = { ...db };
        updatedDb.reviews = [...(updatedDb.reviews || []), newReview];
        saveState(updatedDb);

        setName("");
        setPlace("");
        setRating(5);
        setExp("");
        setStatusMsg("கருத்து சமர்ப்பிக்கப்பட்டது! நிர்வாகி அனுமதிக்குப் பின் இணையதளத்தில் தோன்றும்.");
        setTimeout(() => setStatusMsg(""), 5000);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setBase64Img(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleComplaintSubmit = (e) => {
        e.preventDefault();
        if (!complaintMsg) {
            alert("புகார் செய்தியை உள்ளிடவும்.");
            return;
        }

        const submitComplaint = (imgUrl) => {
            const newComplaint = {
                id: "comp_" + Date.now(),
                name: name || "அநாமதேயர் (Anonymous)",
                phone: phone || "அநாமதேயர்",
                category,
                message: complaintMsg,
                imageUrl: imgUrl || "",
                status: "open",
                date: new Date().toISOString().split('T')[0]
            };

            const updatedDb = { ...db };
            updatedDb.complaints = [...(updatedDb.complaints || []), newComplaint];
            saveState(updatedDb);

            setName("");
            setPhone("");
            setComplaintMsg("");
            setImageFile(null);
            setBase64Img("");
            setStatusMsg("உங்களது புகார் பதிவு செய்யப்பட்டது. இது முற்றிலும் தனிப்பட்ட முறையில் நிர்வாகிக்கு மட்டுமே பகிரப்படும்.");
            setTimeout(() => setStatusMsg(""), 5000);
        };

        if (base64Img) {
            fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: imageFile.name, data: base64Img })
            })
            .then(res => res.json())
            .then(data => {
                submitComplaint(data.filePath);
            })
            .catch(err => {
                console.error("Image upload failed, falling back to inline base64", err);
                submitComplaint(base64Img);
            });
        } else {
            submitComplaint("");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col gap-12">
            <div className="text-center space-y-4">
                <span className="text-xs bg-kumkum/40 border border-gold/40 text-gold px-3.5 py-1 rounded-full font-tamil">உதவி மையம்</span>
                <h2 className="text-3xl sm:text-4xl font-bold font-tamil text-gold-gradient">பக்தர் உதவி மையம் (Help Center)</h2>
            </div>

            <div className="flex justify-center border-b border-stone-light">
                <button
                    onClick={() => {
                        setSubTab('complaint');
                        setStatusMsg("");
                    }}
                    className={`py-3 px-8 text-xs sm:text-sm font-semibold font-tamil border-b-2 transition-all ${
                        subTab === 'complaint' ? 'border-gold text-gold' : 'border-transparent text-slate-400'
                    }`}
                >
                    🚨 புகார் பதிவு (Submit Complaint)
                </button>
                <button
                    onClick={() => {
                        setSubTab('review');
                        setStatusMsg("");
                    }}
                    className={`py-3 px-8 text-xs sm:text-sm font-semibold font-tamil border-b-2 transition-all ${
                        subTab === 'review' ? 'border-gold text-gold' : 'border-transparent text-slate-400'
                    }`}
                >
                    ⭐ கருத்து பகிர்வு (Add Review)
                </button>
            </div>

            <div className="bg-stone-light border border-gold/30 p-6 sm:p-8 rounded-lg shadow-gold">
                {subTab === 'complaint' ? (
                    <form onSubmit={handleComplaintSubmit} className="space-y-5 text-xs sm:text-sm">
                        <h3 className="text-base sm:text-lg font-bold text-gold font-tamil border-b border-stone pb-2 flex items-center gap-2">
                            <Icon name="alert" className="w-5 h-5 text-kumkum" />
                            புகார் கோரிக்கை (Complaints / Suggestions)
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1.5">தங்கள் பெயர் (Name)</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold font-tamil"
                                    placeholder="பெயர்"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1.5">போன் எண் (Mobile)</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold"
                                    placeholder="98XXXXXXXX"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-300 font-tamil text-xs mb-1.5">புகார் வகை (Category)</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold font-tamil"
                            >
                                <option value="Temple cleanliness">சுற்றுப்புற தூய்மை (Temple cleanliness)</option>
                                <option value="Water problem">குடிநீர் பிரச்சனை (Water problem)</option>
                                <option value="Parking">வாகன நிறுத்துமிடம் (Parking issue)</option>
                                <option value="Service issue">வழிபாட்டு சேவைகள் குறைபாடு (Service issue)</option>
                                <option value="Suggestions">ஆலோசனைகள் (Suggestions)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-300 font-tamil text-xs mb-1.5">விளக்கம் (Message) *</label>
                            <textarea
                                required
                                value={complaintMsg}
                                onChange={(e) => setComplaintMsg(e.target.value)}
                                rows={4}
                                className="w-full bg-stone border border-gold/30 rounded p-3 text-slate-200 focus:outline-none focus:border-gold font-tamil"
                                placeholder="பிரச்சனையை விரிவாக எழுதவும்..."
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 font-tamil text-xs mb-1.5">புகைப்படம் பதிவேற்றவும் (Photo Upload)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full bg-stone border border-gold/30 rounded p-2 text-slate-400 text-xs focus:outline-none focus:border-gold"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-kumkum hover:bg-kumkum-light border border-gold/40 text-gold font-tamil font-bold px-6 py-2.5 rounded transition"
                        >
                            புகாரை சமர்ப்பி (Submit Complaint)
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-5 text-xs sm:text-sm">
                        <h3 className="text-base sm:text-lg font-bold text-gold font-tamil border-b border-stone pb-2 flex items-center gap-2">
                            <Icon name="star" className="w-5 h-5 text-gold" />
                            திருக்கோவில் அனுபவங்களை பகிர்க
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1.5">தங்கள் பெயர் (Name) *</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold font-tamil"
                                    placeholder="பெயர்"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1.5">ஊர் (Place)</label>
                                <input
                                    type="text"
                                    value={place}
                                    onChange={(e) => setPlace(e.target.value)}
                                    className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold font-tamil"
                                    placeholder="கோவை, திருச்சி"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-300 font-tamil text-xs mb-2">மதிப்பீடு (Rating)</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none"
                                    >
                                        <Icon
                                            name="star"
                                            className={`w-7 h-7 ${star <= rating ? 'fill-gold text-gold' : 'text-slate-600 hover:text-gold'}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-300 font-tamil text-xs mb-1.5">தங்களின் அனுபவம் (Experience Description) *</label>
                            <textarea
                                required
                                value={exp}
                                onChange={(e) => setExp(e.target.value)}
                                rows={4}
                                className="w-full bg-stone border border-gold/30 rounded p-3 text-slate-200 focus:outline-none focus:border-gold font-tamil"
                                placeholder="உங்களின் அனுபவங்களை எழுதவும்..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-gold hover:bg-gold-dark text-stone-dark font-tamil font-bold px-6 py-2.5 rounded transition"
                        >
                            மதிப்புரையை சமர்ப்பி (Submit Review)
                        </button>
                    </form>
                )}

                {statusMsg && (
                    <div className="mt-4 p-3 bg-stone border border-gold/20 rounded text-center text-xs text-gold font-tamil">
                        {statusMsg}
                    </div>
                )}
            </div>
        </div>
    );
}

// ----------------------------------------------------
// Component: Gallery (Pinterest style)
// ----------------------------------------------------
function GalleryPage({ t, language, db, saveState }) {
    const [filter, setFilter] = useState('All');
    const [uploadOpen, setUploadOpen] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");

    const [imgTitle, setImgTitle] = useState("");
    const [imgCategory, setImgCategory] = useState("Temple");
    const [fileObj, setFileObj] = useState(null);
    const [base64Data, setBase64Data] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileObj(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setBase64Data(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleGalleryUpload = (e) => {
        e.preventDefault();
        if (!imgTitle || !base64Data) {
            alert("தலைப்பு மற்றும் புகைப்படத்தை தேர்ந்தெடுக்கவும்.");
            return;
        }

        const publishPhoto = (filePath) => {
            const newPhoto = {
                id: "g_" + Date.now(),
                category: imgCategory,
                title: imgTitle,
                url: filePath || base64Data,
                approved: false
            };

            const updatedDb = { ...db };
            updatedDb.gallery = [...(updatedDb.gallery || []), newPhoto];
            saveState(updatedDb);

            setImgTitle("");
            setFileObj(null);
            setBase64Data("");
            setUploadOpen(false);
            setStatusMsg("புகைப்படம் வெற்றிகரமாக பதிவேற்றப்பட்டது. நிர்வாகி அங்கீகரித்த பின் கேலரியில் தோன்றும்.");
            setTimeout(() => setStatusMsg(""), 5000);
        };

        fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: fileObj.name, data: base64Data })
        })
        .then(res => res.json())
        .then(data => {
            publishPhoto(data.filePath);
        })
        .catch(err => {
            console.error("Gallery photo upload failed, using base64 inline", err);
            publishPhoto("");
        });
    };

    const categories = ['All', 'Temple', 'Festival', 'Veeramalai', 'Deities', 'Old memories', 'Devotees'];
    const galleryItems = db.gallery ? db.gallery.filter(item => item.approved && (filter === 'All' || item.category === filter)) : [];

    return (
        <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col gap-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gold/20 pb-6">
                <div>
                    <span className="text-xs bg-kumkum/40 border border-gold/40 text-gold px-3.5 py-1 rounded-full font-tamil">புகைப்பட மாடம்</span>
                    <h2 className="text-2xl sm:text-4xl font-bold font-tamil text-gold-gradient mt-2">திருக்கோவில் புகைப்படத் தொகுப்பு</h2>
                </div>
                <button
                    onClick={() => setUploadOpen(true)}
                    className="bg-gold hover:bg-gold-dark text-stone-dark font-tamil font-bold text-xs sm:text-sm py-2.5 px-5 rounded-md flex items-center gap-1 transition"
                >
                    <Icon name="plus" className="w-4 h-4" />
                    புகைப்படம் பதிவேற்ற (Upload Photo)
                </button>
            </div>

            {statusMsg && (
                <div className="p-3 bg-stone border border-gold/20 rounded text-center text-xs text-gold font-tamil">
                    {statusMsg}
                </div>
            )}

            <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`text-xs font-semibold py-1.5 px-3.5 rounded-full transition-all ${
                            filter === cat ? 'bg-kumkum text-gold border border-gold' : 'bg-stone border border-stone-light text-slate-400 hover:text-white'
                        }`}
                    >
                        {cat === 'All' ? 'அனைத்தும்' : cat}
                    </button>
                ))}
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {galleryItems.map((item) => (
                    <div key={item.id} className="break-inside-avoid bg-stone-light border border-gold/20 p-2.5 rounded-lg hover:border-gold/60 transition group relative overflow-hidden">
                        <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-auto object-cover rounded"
                        />
                        <div className="absolute inset-x-2.5 bottom-2.5 p-3 rounded bg-stone-dark/85 border border-gold/25 opacity-0 group-hover:opacity-100 transition duration-300">
                            <h4 className="font-tamil font-bold text-xs sm:text-sm text-gold-gradient">{item.title}</h4>
                            <span className="text-[10px] text-slate-400 font-tamil">{item.category}</span>
                        </div>
                    </div>
                ))}
            </div>

            {uploadOpen && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-stone-dark border border-gold/40 rounded-lg max-w-md w-full p-6 relative shadow-gold-lg">
                        <button
                            onClick={() => setUploadOpen(false)}
                            className="absolute top-4 right-4 text-gold hover:text-white"
                        >
                            <Icon name="x" className="w-6 h-6" />
                        </button>

                        <h3 className="text-base sm:text-lg font-bold font-tamil text-gold-gradient mb-4 flex items-center gap-1.5">
                            <Icon name="photo" className="w-5 h-5 text-gold" />
                            புகைப்படம் பதிவேற்றம்
                        </h3>

                        <form onSubmit={handleGalleryUpload} className="space-y-4 text-xs sm:text-sm">
                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1.5">படத்தின் தலைப்பு (Title) *</label>
                                <input
                                    type="text"
                                    required
                                    value={imgTitle}
                                    onChange={(e) => setImgTitle(e.target.value)}
                                    className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold font-tamil"
                                    placeholder="தலைப்பு"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1.5">பிரிவு (Category)</label>
                                <select
                                    value={imgCategory}
                                    onChange={(e) => setImgCategory(e.target.value)}
                                    className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold font-tamil"
                                >
                                    <option value="Temple">Temple (கோவில்)</option>
                                    <option value="Festival">Festival (திருவிழா)</option>
                                    <option value="Veeramalai">Veeramalai (வீரமலை)</option>
                                    <option value="Deities">Deities (தெய்வங்கள்)</option>
                                    <option value="Old memories">Old memories (பழைய நினைவுகள்)</option>
                                    <option value="Devotees">Devotees (பக்தர்கள்)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1.5">புகைப்படம் தேர்ந்தெடுக்கவும் (Select Image) *</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    required
                                    onChange={handleFileChange}
                                    className="w-full bg-stone border border-gold/30 rounded p-2 text-slate-400 text-xs focus:outline-none focus:border-gold"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gold hover:bg-gold-dark text-stone-dark font-tamil font-bold py-2.5 rounded transition"
                            >
                                பதிவேற்று (Upload)
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// ----------------------------------------------------
// Component: Admin Panel (Moderation and custom databases updates)
// ----------------------------------------------------
function AdminPanel({ t, language, db, saveState, adminLoggedIn, setAdminLoggedIn }) {
    const [password, setPassword] = useState("");
    const [loginErr, setLoginErr] = useState("");
    const [adminTab, setAdminTab] = useState('bookings');

    // Custom management forms state
    const [newNotice, setNewNotice] = useState("");
    
    // Rooms Admin Panel inputs
    const [roomName, setRoomName] = useState("");
    const [roomLocation, setRoomLocation] = useState("");
    const [roomDistance, setRoomDistance] = useState("100m");
    const [roomAc, setRoomAc] = useState(false);
    const [roomFacList, setRoomFacList] = useState("");
    const [roomBase64, setRoomBase64] = useState("");
    const [roomFileObj, setRoomFileObj] = useState(null);

    // Hero Slides Admin Panel inputs
    const [slideTitle, setSlideTitle] = useState("");
    const [slideSubtitle, setSlideSubtitle] = useState("");
    const [slideDesc, setSlideDesc] = useState("");
    const [slideBase64, setSlideBase64] = useState("");
    const [slideFileObj, setSlideFileObj] = useState(null);

    // History Editor inputs
    const [selectedHistoryChap, setSelectedHistoryChap] = useState(1);
    const [historyTitle, setHistoryTitle] = useState("");
    const [historyContent, setHistoryContent] = useState("");
    const [historyBase64, setHistoryBase64] = useState("");
    const [historyFileObj, setHistoryFileObj] = useState(null);

    // Dynamic state synchronizer for history selection change
    useEffect(() => {
        if (db.history) {
            const chap = db.history.find(c => c.num === Number(selectedHistoryChap));
            if (chap) {
                setHistoryTitle(chap.title);
                setHistoryContent(chap.content);
                setHistoryBase64(chap.image);
            }
        }
    }, [selectedHistoryChap, db.history]);

    // Festival Management states
    const [festTitle, setFestTitle] = useState("");
    const [festDate, setFestDate] = useState("");
    const [festDaysCount, setFestDaysCount] = useState("");
    const [festDesc, setFestDesc] = useState("");
    const [festIsMain, setFestIsMain] = useState(false);
    const [festBase64, setFestBase64] = useState("");
    const [festFileObj, setFestFileObj] = useState(null);
    
    // Festival Schedule Builder states
    const [tempSchedule, setTempSchedule] = useState([]);
    const [stepEvent, setStepEvent] = useState("");
    const [stepDate, setStepDate] = useState("");
    const [stepTime, setStepTime] = useState("");
    const [stepDesc, setStepDesc] = useState("");
    
    // Live update state inside admin
    const [newLiveUpdate, setNewLiveUpdate] = useState("");
    const [liveUpdateMsg, setLiveUpdateMsg] = useState("");

    const handleAddLiveUpdateAdmin = (e) => {
        e.preventDefault();
        if (!newLiveUpdate.trim()) return;

        const updatedDb = { ...db };
        const newLog = {
            id: "lu_" + Date.now(),
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString('ta-IN', { hour: '2-digit', minute: '2-digit' }),
            message: newLiveUpdate,
            type: "info"
        };
        updatedDb.liveUpdates = [newLog, ...(updatedDb.liveUpdates || [])];
        saveState(updatedDb);
        setNewLiveUpdate("");
        setLiveUpdateMsg("நேரலை அறிவிப்பு வெளியிடப்பட்டது!");
        setTimeout(() => setLiveUpdateMsg(""), 3000);
    };

    const handleDeleteLiveUpdate = (luId) => {
        if (!confirm("இந்த நேரலை அறிவிப்பை நீக்க வேண்டுமா?")) return;
        const updatedDb = { ...db };
        updatedDb.liveUpdates = updatedDb.liveUpdates.filter(l => l.id !== luId);
        saveState(updatedDb);
    };

    const handleAddScheduleStep = () => {
        if (!stepEvent.trim()) {
            alert("நிகழ்வு பெயரை உள்ளிடவும்.");
            return;
        }
        const newStep = {
            event: stepEvent,
            date: stepDate || "தேதி",
            time: stepTime || "நேரம்",
            desc: stepDesc || ""
        };
        setTempSchedule([...tempSchedule, newStep]);
        setStepEvent("");
        setStepDate("");
        setStepTime("");
        setStepDesc("");
    };

    const handleRemoveScheduleStep = (idx) => {
        setTempSchedule(tempSchedule.filter((_, i) => i !== idx));
    };

    const handleAddFestival = (e) => {
        e.preventDefault();
        if (!festTitle || !festDate) {
            alert("திருவிழா தலைப்பு மற்றும் தேதியை உள்ளிடவும்.");
            return;
        }

        const publishFestival = (filePath) => {
            const newFest = {
                id: "fest_" + Date.now(),
                title: festTitle,
                date: festDate,
                daysCount: Number(festDaysCount) || 1,
                description: festDesc,
                image: filePath || festBase64 || "/assets/images/Capture.PNG",
                isMain: festIsMain,
                schedule: tempSchedule
            };

            const updatedDb = { ...db };
            updatedDb.festivals = [...(updatedDb.festivals || []), newFest];
            saveState(updatedDb);

            setFestTitle("");
            setFestDate("");
            setFestDaysCount("");
            setFestDesc("");
            setFestIsMain(false);
            setFestBase64("");
            setFestFileObj(null);
            setTempSchedule([]);
            alert("திருவிழா வெற்றிகரமாக சேர்க்கப்பட்டது!");
        };

        if (festFileObj) {
            fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: festFileObj.name, data: festBase64 })
            })
            .then(res => res.json())
            .then(data => publishFestival(data.filePath))
            .catch(err => {
                console.error("Festival image upload failed", err);
                publishFestival("");
            });
        } else {
            publishFestival("");
        }
    };

    const handleDeleteFestival = (festId) => {
        if (!confirm("இந்த திருவிழாவை நீக்க வேண்டுமா?")) return;
        const updatedDb = { ...db };
        updatedDb.festivals = updatedDb.festivals.filter(f => f.id !== festId);
        saveState(updatedDb);
        alert("திருவிழா நீக்கப்பட்டது.");
    };

    // Deities Management states
    const [deityName, setDeityName] = useState("");
    const [deityTitle, setDeityTitle] = useState("");
    const [deityHistory, setDeityHistory] = useState("");
    const [deityBase64, setDeityBase64] = useState("");
    const [deityFileObj, setDeityFileObj] = useState(null);

    const handleAddDeity = (e) => {
        e.preventDefault();
        if (!deityName || !deityTitle) {
            alert("தெய்வத்தின் பெயர் மற்றும் சிறப்பை உள்ளிடவும்.");
            return;
        }

        const publishDeity = (filePath) => {
            const newDeity = {
                id: "dei_" + Date.now(),
                name: deityName,
                title: deityTitle,
                photo: filePath || deityBase64 || "/assets/images/Capture.PNG",
                history: deityHistory,
                gallery: [filePath || deityBase64 || "/assets/images/Capture.PNG"]
            };

            const updatedDb = { ...db };
            updatedDb.deities = [...(updatedDb.deities || []), newDeity];
            saveState(updatedDb);

            setDeityName("");
            setDeityTitle("");
            setDeityHistory("");
            setDeityBase64("");
            setDeityFileObj(null);
            alert("புதிய தெய்வம் வெற்றிகரமாக சேர்க்கப்பட்டது!");
        };

        if (deityFileObj) {
            fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: deityFileObj.name, data: deityBase64 })
            })
            .then(res => res.json())
            .then(data => publishDeity(data.filePath))
            .catch(err => {
                console.error("Deity photo upload failed", err);
                publishDeity("");
            });
        } else {
            publishDeity("");
        }
    };

    const handleDeleteDeity = (deityId) => {
        if (!confirm("இந்த தெய்வத்தை பட்டியலிலிருந்து நீக்க வேண்டுமா?")) return;
        const updatedDb = { ...db };
        updatedDb.deities = updatedDb.deities.filter(d => d.id !== deityId);
        saveState(updatedDb);
        alert("தெய்வம் நீக்கப்பட்டது.");
    };

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPasswordState, setNewPasswordState] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changePasswordMsg, setChangePasswordMsg] = useState("");
    const [changePasswordErr, setChangePasswordErr] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        })
        .then(res => {
            if (res.status === 200) return res.json();
            return res.json().then(data => { throw new Error(data.error); });
        })
        .then(resData => {
            if (resData.success) {
                setAdminLoggedIn(true);
                setLoginErr("");
                setPassword("");
            }
        })
        .catch(err => {
            console.error("Login failed", err);
            setLoginErr(err.message || "தவறான கடவுச்சொல் அல்லது சேவையக தொடர்பு தோல்வி!");
        });
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (newPasswordState !== confirmPassword) {
            setChangePasswordErr("புதிய கடவுச்சொற்கள் பொருந்தவில்லை!");
            return;
        }

        fetch('/api/admin/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                currentPassword,
                newPassword: newPasswordState
            })
        })
        .then(res => {
            if (res.status === 200) return res.json();
            return res.json().then(data => { throw new Error(data.error); });
        })
        .then(resData => {
            if (resData.success) {
                setChangePasswordMsg("கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது!");
                setChangePasswordErr("");
                setCurrentPassword("");
                setNewPasswordState("");
                setConfirmPassword("");
                setTimeout(() => setChangePasswordMsg(""), 4000);
            }
        })
        .catch(err => {
            console.error("Password change failed", err);
            setChangePasswordErr(err.message || "தற்போதைய கடவுச்சொல் தவறானது!");
            setChangePasswordMsg("");
        });
    };

    // Hero Slides Management
    const handleAddSlide = (e) => {
        e.preventDefault();
        if (!slideTitle || !slideBase64) {
            alert("தலைப்பு மற்றும் புகைப்படத்தை உள்ளிடவும்.");
            return;
        }

        const publishSlide = (filePath) => {
            const newSlide = {
                id: "hs_" + Date.now(),
                url: filePath || slideBase64,
                title: slideTitle,
                subtitle: slideSubtitle,
                description: slideDesc
            };

            const updatedDb = { ...db };
            updatedDb.heroSlides = [...(updatedDb.heroSlides || []), newSlide];
            saveState(updatedDb);

            setSlideTitle("");
            setSlideSubtitle("");
            setSlideDesc("");
            setSlideBase64("");
            setSlideFileObj(null);
            alert("முகப்பு ஸ்லைடர் புகைப்படம் சேர்க்கப்பட்டது!");
        };

        if (slideFileObj) {
            fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: slideFileObj.name, data: slideBase64 })
            })
            .then(res => res.json())
            .then(data => publishSlide(data.filePath))
            .catch(err => {
                console.error("Slide upload failed", err);
                publishSlide("");
            });
        } else {
            publishSlide("");
        }
    };

    const handleDeleteSlide = (slideId) => {
        const updatedDb = { ...db };
        updatedDb.heroSlides = updatedDb.heroSlides.filter(s => s.id !== slideId);
        saveState(updatedDb);
        alert("ஸ்லைடர் புகைப்படம் நீக்கப்பட்டது.");
    };

    // Notices Line Management
    const handleAddNotice = (e) => {
        e.preventDefault();
        if (!newNotice.trim()) return;

        const updatedDb = { ...db };
        updatedDb.notices = [...(updatedDb.notices || []), newNotice];
        saveState(updatedDb);
        setNewNotice("");
        alert("அறிவிப்பு வரி சேர்க்கப்பட்டது!");
    };

    const handleDeleteNotice = (idx) => {
        const updatedDb = { ...db };
        updatedDb.notices = updatedDb.notices.filter((_, i) => i !== idx);
        saveState(updatedDb);
        alert("அறிவிப்பு வரி நீக்கப்பட்டது.");
    };

    // Rooms Database Management
    const handleAddRoom = (e) => {
        e.preventDefault();
        if (!roomName || !roomLocation) {
            alert("விடுதி பெயர் மற்றும் முகவரியை உள்ளிடவும்.");
            return;
        }

        const publishRoom = (filePath) => {
            const facs = roomFacList.split(',').map(s => s.trim()).filter(s => s.length > 0);
            const newRoomObj = {
                id: "room_" + Date.now(),
                name: roomName,
                photos: [filePath || roomBase64 || "/assets/images/Capture.PNG"],
                location: roomLocation,
                distance: roomDistance,
                ac: roomAc,
                facilities: facs.length > 0 ? facs : ["சுத்தமான குடிநீர்", "Parking வசதி"],
                available: true
            };

            const updatedDb = { ...db };
            updatedDb.rooms = [...(updatedDb.rooms || []), newRoomObj];
            saveState(updatedDb);

            setRoomName("");
            setRoomLocation("");
            setRoomDistance("100m");
            setRoomAc(false);
            setRoomFacList("");
            setRoomBase64("");
            setRoomFileObj(null);
            alert("புதிய விடுதி வெற்றிகரமாக சேர்க்கப்பட்டது!");
        };

        if (roomFileObj) {
            fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: roomFileObj.name, data: roomBase64 })
            })
            .then(res => res.json())
            .then(data => publishRoom(data.filePath))
            .catch(err => {
                console.error("Room photo upload failed", err);
                publishRoom("");
            });
        } else {
            publishRoom("");
        }
    };

    const handleDeleteRoom = (roomId) => {
        if (!confirm("இந்த விடுதியை நீக்க வேண்டுமா?")) return;
        const updatedDb = { ...db };
        updatedDb.rooms = updatedDb.rooms.filter(r => r.id !== roomId);
        saveState(updatedDb);
        alert("விடுதி நீக்கப்பட்டது.");
    };

    // History Chapters Management
    const handleUpdateHistory = (e) => {
        e.preventDefault();

        const publishHistoryUpdate = (filePath) => {
            const updatedDb = { ...db };
            updatedDb.history = updatedDb.history.map(chap => {
                if (chap.num === Number(selectedHistoryChap)) {
                    return {
                        ...chap,
                        title: historyTitle,
                        content: historyContent,
                        image: filePath || historyBase64 || chap.image
                    };
                }
                return chap;
            });
            saveState(updatedDb);
            setHistoryFileObj(null);
            alert("வரலாற்று அத்தியாயம் வெற்றிகரமாக மாற்றப்பட்டது!");
        };

        if (historyFileObj) {
            fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: historyFileObj.name, data: historyBase64 })
            })
            .then(res => res.json())
            .then(data => publishHistoryUpdate(data.filePath))
            .catch(err => {
                console.error("History image upload failed", err);
                publishHistoryUpdate("");
            });
        } else {
            publishHistoryUpdate("");
        }
    };

    // Generic files helper handler
    const handleFileChangeHelper = (e, setBase64, setFileObj) => {
        const file = e.target.files[0];
        if (!file) return;
        setFileObj(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setBase64(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // General Bookings Moderation
    const handleUpdateBookingStatus = (reqId, newStatus) => {
        const updatedDb = { ...db };
        updatedDb.bookings = updatedDb.bookings.map(b => b.id === reqId ? { ...b, status: newStatus } : b);
        saveState(updatedDb);
    };

    const handleModerateReview = (revId, approve) => {
        const updatedDb = { ...db };
        if (approve) {
            updatedDb.reviews = updatedDb.reviews.map(r => r.id === revId ? { ...r, approved: true } : r);
        } else {
            updatedDb.reviews = updatedDb.reviews.filter(r => r.id !== revId);
        }
        saveState(updatedDb);
    };

    const handleModerateGallery = (galId, approve) => {
        const updatedDb = { ...db };
        if (approve) {
            updatedDb.gallery = updatedDb.gallery.map(g => g.id === galId ? { ...g, approved: true } : g);
        } else {
            updatedDb.gallery = updatedDb.gallery.filter(g => g.id !== galId);
        }
        saveState(updatedDb);
    };

    const handleAddGalleryPhotoDirect = (e) => {
        e.preventDefault();
        // Allow admin to add photo directly to gallery as approved
        if (!slideTitle || !slideBase64) {
            alert("தலைப்பு மற்றும் படத்தை தேர்ந்தெடுக்கவும்.");
            return;
        }

        const publishPhoto = (filePath) => {
            const newPhoto = {
                id: "g_" + Date.now(),
                category: slideSubtitle || "Temple",
                title: slideTitle,
                url: filePath || slideBase64,
                approved: true
            };
            const updatedDb = { ...db };
            updatedDb.gallery = [...(updatedDb.gallery || []), newPhoto];
            saveState(updatedDb);
            setSlideTitle("");
            setSlideSubtitle("");
            setSlideBase64("");
            setSlideFileObj(null);
            alert("புகைப்படம் நேரடியாக கேலரியில் சேர்க்கப்பட்டது!");
        };

        if (slideFileObj) {
            fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: slideFileObj.name, data: slideBase64 })
            })
            .then(res => res.json())
            .then(data => publishPhoto(data.filePath))
            .catch(err => {
                console.error("Gallery direct upload failed", err);
                publishPhoto("");
            });
        } else {
            publishPhoto("");
        }
    };

    const handleUpdateComplaintStatus = (compId, newStatus) => {
        const updatedDb = { ...db };
        updatedDb.complaints = updatedDb.complaints.map(c => c.id === compId ? { ...c, status: newStatus } : c);
        saveState(updatedDb);
    };

    if (!adminLoggedIn) {
        return (
            <div className="max-w-md mx-auto px-4 py-24">
                <div className="bg-stone-light border border-gold/30 p-8 rounded-lg shadow-gold flex flex-col items-center">
                    <div className="p-4 rounded-full bg-kumkum/40 border border-gold text-gold mb-6 shadow-kumkum">
                        <Icon name="lock" className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold font-tamil text-gold-gradient mb-6">திருக்கோவில் நிர்வாக முகப்பு</h3>
                    
                    <form onSubmit={handleLogin} className="w-full space-y-4 text-xs sm:text-sm">
                        <div>
                            <label className="block text-slate-300 font-tamil text-xs mb-1.5">கடவுச்சொல் (Password) *</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 text-center focus:outline-none focus:border-gold font-mono"
                                placeholder="••••••••"
                            />
                        </div>
                        {loginErr && <p className="text-xs text-red-500 font-tamil text-center">{loginErr}</p>}
                        
                        <button
                            type="submit"
                            className="w-full bg-gold hover:bg-gold-dark text-stone-dark font-tamil font-bold py-2.5 rounded transition"
                        >
                            உள்நுழைக (Sign In)
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const pendingBookings = db.bookings ? db.bookings.filter(b => b.status === 'pending').length : 0;
    const openComplaints = db.complaints ? db.complaints.filter(c => c.status === 'open').length : 0;
    const pendingReviews = db.reviews ? db.reviews.filter(r => !r.approved).length : 0;
    const pendingGallery = db.gallery ? db.gallery.filter(g => !g.approved).length : 0;

    return (
        <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col gap-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gold/20 pb-6">
                <div>
                    <h2 className="text-3xl font-bold font-tamil text-gold-gradient font-tamil">நிர்வாக கண்ட்ரோல் பேனல்</h2>
                    <p className="text-slate-400 font-tamil text-xs mt-1">திருக்கோவில் தரவுகள் மேலாண்மை</p>
                </div>
                <button
                    onClick={() => setAdminLoggedIn(false)}
                    className="text-xs bg-kumkum/40 border border-gold/30 text-gold px-3.5 py-1.5 rounded hover:bg-kumkum transition font-tamil"
                >
                    வெளியேறு (Logout)
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div onClick={() => setAdminTab('bookings')} className="bg-stone-light border border-gold/20 p-4 rounded-lg cursor-pointer hover:border-gold transition">
                    <span className="text-2xl font-bold text-gold font-mono">{pendingBookings}</span>
                    <h5 className="text-[11px] sm:text-xs text-slate-400 font-tamil mt-1">முன்பதிவுகள் (Bookings)</h5>
                </div>
                <div onClick={() => setAdminTab('complaints')} className="bg-stone-light border border-gold/20 p-4 rounded-lg cursor-pointer hover:border-gold transition">
                    <span className="text-2xl font-bold text-red-500 font-mono">{openComplaints}</span>
                    <h5 className="text-[11px] sm:text-xs text-slate-400 font-tamil mt-1">புகார்கள் (Complaints)</h5>
                </div>
                <div onClick={() => setAdminTab('reviews')} className="bg-stone-light border border-gold/20 p-4 rounded-lg cursor-pointer hover:border-gold transition">
                    <span className="text-2xl font-bold text-gold font-mono">{pendingReviews}</span>
                    <h5 className="text-[11px] sm:text-xs text-slate-400 font-tamil mt-1">மதிப்புரைகள் (Reviews)</h5>
                </div>
                <div onClick={() => setAdminTab('gallery_mod')} className="bg-stone-light border border-gold/20 p-4 rounded-lg cursor-pointer hover:border-gold transition">
                    <span className="text-2xl font-bold text-gold font-mono">{pendingGallery}</span>
                    <h5 className="text-[11px] sm:text-xs text-slate-400 font-tamil mt-1">கேலரி ஒப்புதல் (Photos)</h5>
                </div>
            </div>

            {/* Sub-navigation tabs */}
            <div className="flex flex-wrap border-b border-stone-light text-xs sm:text-sm">
                {[
                    { id: "bookings", label: "முன்பதிவுகள்" },
                    { id: "complaints", label: "புகார்கள்" },
                    { id: "reviews", label: "விமர்சனங்கள்" },
                    { id: "fest_manage", label: "திருவிழாக்கள் மேலாண்மை" },
                    { id: "deities_manage", label: "தெய்வங்கள் மேலாண்மை" },
                    { id: "hero_slider", label: "முகப்பு ஸ்லைடர்" },
                    { id: "notices", label: "அறிவிப்பு வரிகள்" },
                    { id: "history_edit", label: "வரலாறு திருத்தம்" },
                    { id: "room_manage", label: "தங்குமிடம் மேலாண்மை" },
                    { id: "gallery_mod", label: "கேலரி நிர்வகி" },
                    { id: "settings", label: "அமைப்புகள்" }
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setAdminTab(t.id)}
                        className={`py-3 px-4 font-semibold font-tamil border-b-2 transition-all ${
                            adminTab === t.id ? 'border-gold text-gold bg-stone' : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="bg-stone-light border border-gold/20 rounded-lg p-5">
                
                {/* Settings Panel */}
                {adminTab === 'settings' && (
                    <div className="max-w-md mx-auto space-y-6 py-4">
                        <h4 className="font-bold text-gold font-tamil border-b border-stone pb-2 text-center sm:text-left">நிர்வாக கடவுச்சொல் மாற்று (Change Password)</h4>
                        
                        <form onSubmit={handleChangePassword} className="bg-stone border border-gold/30 p-6 rounded-lg space-y-4 text-xs sm:text-sm">
                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1.5">தற்போதைய கடவுச்சொல் (Current Password) *</label>
                                <input
                                    type="password"
                                    required
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full bg-stone-light border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1.5">புதிய கடவுச்சொல் (New Password) *</label>
                                <input
                                    type="password"
                                    required
                                    value={newPasswordState}
                                    onChange={(e) => setNewPasswordState(e.target.value)}
                                    className="w-full bg-stone-light border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1.5">புதிய கடவுச்சொல்லை உறுதிசெய் (Confirm Password) *</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-stone-light border border-gold/30 rounded p-2.5 text-slate-200 focus:outline-none focus:border-gold"
                                    placeholder="••••••••"
                                />
                            </div>

                            {changePasswordErr && <p className="text-xs text-red-500 font-tamil text-center">{changePasswordErr}</p>}
                            {changePasswordMsg && <p className="text-xs text-green-500 font-tamil text-center font-bold">{changePasswordMsg}</p>}

                            <button
                                type="submit"
                                className="w-full bg-gold hover:bg-gold-dark text-stone-dark font-tamil font-bold py-2.5 rounded transition"
                            >
                                கடவுச்சொல்லை மாற்று (Update Password)
                            </button>
                        </form>
                    </div>
                )}

                {/* Deities Management Panel */}
                {adminTab === 'deities_manage' && (
                    <div className="space-y-8">
                        <h4 className="font-bold text-gold font-tamil border-b border-stone pb-2">கோவில் வழிபாட்டு மூர்த்திகள் (தெய்வங்கள்) மேலாண்மை</h4>
                        
                        {/* Deities List table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm text-slate-300 font-tamil">
                                <thead className="bg-stone text-gold border-b border-gold/20">
                                    <tr>
                                        <th className="p-3">படம்</th>
                                        <th className="p-3">தெய்வத்தின் பெயர்</th>
                                        <th className="p-3">சிறப்பு / அவதாரம்</th>
                                        <th className="p-3">விளக்கம் / தல வரலாறு</th>
                                        <th className="p-3">செயல்கள்</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone">
                                    {db.deities && db.deities.map((deity) => (
                                        <tr key={deity.id} className="hover:bg-stone/30">
                                            <td className="p-3">
                                                <img src={deity.photo} alt={deity.name} className="w-12 h-12 object-cover rounded border border-gold/20" />
                                            </td>
                                            <td className="p-3 font-semibold text-gold">{deity.name}</td>
                                            <td className="p-3">{deity.title}</td>
                                            <td className="p-3 text-xs text-slate-400 max-w-xs truncate">{deity.history}</td>
                                            <td className="p-3">
                                                <button
                                                    onClick={() => handleDeleteDeity(deity.id)}
                                                    className="bg-red-950 hover:bg-red-900 text-gold px-3 py-1.5 rounded text-[10px] transition font-tamil"
                                                >
                                                    நீக்கு (Delete)
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Add Deity Form */}
                        <form onSubmit={handleAddDeity} className="bg-stone border border-gold/30 p-5 rounded space-y-4 text-xs sm:text-sm">
                            <h5 className="font-bold text-gold font-tamil border-b border-stone pb-2">புதிய வழிபாட்டு மூர்த்தி (தெய்வம்) சேர்க்க</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 font-tamil text-xs mb-1">தெய்வத்தின் பெயர் *</label>
                                    <input type="text" value={deityName} onChange={e => setDeityName(e.target.value)} required className="w-full bg-stone-light border border-gold/30 rounded p-2.5 text-slate-200 font-tamil" placeholder="உதாரணம்: ஸ்ரீ பெரியகாண்டி அம்மன்" />
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-tamil text-xs mb-1">தெய்வத்தின் சிறப்பு / பட்டம் (Title) *</label>
                                    <input type="text" value={deityTitle} onChange={e => setDeityTitle(e.target.value)} required className="w-full bg-stone-light border border-gold/30 rounded p-2.5 text-slate-200 font-tamil" placeholder="உதாரணம்: அவதார தாய் / எல்லை காவல் தெய்வம்" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1">தெய்வத்தின் தல வரலாறு / சிறப்புகள் *</label>
                                <textarea value={deityHistory} onChange={e => setDeityHistory(e.target.value)} required rows={4} className="w-full bg-stone-light border border-gold/30 rounded p-3 text-slate-200 font-tamil focus:outline-none focus:border-gold" placeholder="தெய்வம் பற்றிய முழு வரலாற்று கதை விவரம்..." />
                            </div>
                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1">தெய்வத்தின் புகைப்படம் (Select Photo) *</label>
                                <input type="file" accept="image/*" required onChange={e => handleFileChangeHelper(e, setDeityBase64, setDeityFileObj)} className="w-full bg-stone-light border border-gold/30 rounded p-2 text-slate-400 text-xs" />
                            </div>
                            <button type="submit" className="bg-gold hover:bg-gold-dark text-stone-dark font-tamil font-bold px-6 py-2 rounded text-xs transition">சேர் (Add Deity)</button>
                        </form>
                    </div>
                )}

                {/* Festival Management Panel */}
                {adminTab === 'fest_manage' && (
                    <div className="space-y-8">
                        <h4 className="font-bold text-gold font-tamil border-b border-stone pb-2">திருவிழாக்கள் மற்றும் நேரலை செய்திகள் மேலாண்மை</h4>
                        
                        {/* Section 1: Live Updates Posting Form */}
                        <div className="bg-stone border border-gold/30 p-5 rounded space-y-4">
                            <h5 className="font-bold text-gold font-tamil">நேரலை செய்தி பலகை (Post Live Announcement)</h5>
                            <p className="text-slate-400 text-xs font-tamil">இங்கே வெளியிடும் செய்திகள் முகப்பு பக்கத்தில் நேரலை செய்திகளாக ஓடும்.</p>
                            
                            <form onSubmit={handleAddLiveUpdateAdmin} className="space-y-4">
                                <textarea
                                    value={newLiveUpdate}
                                    onChange={(e) => setNewLiveUpdate(e.target.value)}
                                    placeholder="நேரலை அறிவிப்பை டைப் செய்யவும்..."
                                    rows={3}
                                    className="w-full bg-stone-light border border-gold/30 rounded p-3 text-slate-200 text-xs sm:text-sm font-tamil focus:outline-none focus:border-gold"
                                    required
                                />
                                <div className="flex items-center justify-between">
                                    <button
                                        type="submit"
                                        className="bg-gold hover:bg-gold-dark text-stone-dark font-tamil font-bold px-6 py-2 rounded text-xs transition"
                                    >
                                        வெளியிடவும் (Publish Notice)
                                    </button>
                                    {liveUpdateMsg && <span className="text-xs text-green-500 font-tamil">{liveUpdateMsg}</span>}
                                </div>
                            </form>

                            {/* Existing Live Updates List */}
                            {db.liveUpdates && db.liveUpdates.length > 0 && (
                                <div className="mt-4 border-t border-stone-light pt-4">
                                    <h6 className="text-xs text-gold font-tamil font-semibold mb-2">நடப்பு நேரலை செய்திகள்:</h6>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {db.liveUpdates.map((lu) => (
                                            <div key={lu.id} className="bg-stone-light p-2.5 rounded text-xs text-slate-300 flex justify-between items-center gap-3">
                                                <div className="font-tamil">
                                                    <span className="text-gold font-bold">[{lu.date} {lu.time}]</span> {lu.message}
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteLiveUpdate(lu.id)}
                                                    className="bg-red-950/60 hover:bg-red-900 text-gold px-2 py-1 rounded text-[10px] transition font-tamil"
                                                >
                                                    நீக்கு
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Section 2: Festival Listings & Deletion */}
                        <div className="bg-stone border border-gold/30 p-5 rounded space-y-4">
                            <h5 className="font-bold text-gold font-tamil border-b border-stone pb-2">கோவில் திருவிழாக்கள் பட்டியல்</h5>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm text-slate-300 font-tamil">
                                    <thead className="bg-stone-light text-gold border-b border-gold/20">
                                        <tr>
                                            <th className="p-3">படம்</th>
                                            <th className="p-3">திருவிழா பெயர்</th>
                                            <th className="p-3">தேதி</th>
                                            <th className="p-3">நாட்கள்</th>
                                            <th className="p-3">முதன்மை திருவிழா?</th>
                                            <th className="p-3">செயல்கள்</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone-light">
                                        {db.festivals && db.festivals.map((fest) => (
                                            <tr key={fest.id} className="hover:bg-stone-light/30">
                                                <td className="p-3">
                                                    <img src={fest.image} alt={fest.title} className="w-12 h-12 object-cover rounded" />
                                                </td>
                                                <td className="p-3 font-semibold text-gold">{fest.title}</td>
                                                <td className="p-3">{fest.date}</td>
                                                <td className="p-3">{fest.daysCount} நாட்கள்</td>
                                                <td className="p-3">
                                                    {fest.isMain ? (
                                                        <span className="bg-kumkum/40 border border-gold/30 text-gold text-[10px] px-2 py-0.5 rounded font-tamil">ஆம்</span>
                                                    ) : (
                                                        <span className="text-slate-500 text-[10px] font-tamil">இல்லை</span>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    <button
                                                        onClick={() => handleDeleteFestival(fest.id)}
                                                        className="bg-red-950 hover:bg-red-900 text-gold px-3 py-1.5 rounded text-[10px] transition font-tamil"
                                                    >
                                                        நீக்கு (Delete)
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Section 3: Add Festival Form */}
                        <form onSubmit={handleAddFestival} className="bg-stone border border-gold/30 p-5 rounded space-y-4 text-xs sm:text-sm">
                            <h5 className="font-bold text-gold font-tamil border-b border-stone pb-2">புதிய திருவிழா சேர்க்க</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 font-tamil text-xs mb-1">திருவிழா பெயர் *</label>
                                    <input type="text" value={festTitle} onChange={e => setFestTitle(e.target.value)} required className="w-full bg-stone-light border border-gold/30 rounded p-2.5 text-slate-200 font-tamil" placeholder="உதாரணம்: மாசி பெருந்திருவிழா" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-slate-300 font-tamil text-xs mb-1">தொடங்கும் தேதி *</label>
                                        <input type="date" value={festDate} onChange={e => setFestDate(e.target.value)} required className="w-full bg-stone-light border border-gold/30 rounded p-2 text-slate-200" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-300 font-tamil text-xs mb-1">நாட்கள் அளவு (Days)</label>
                                        <input type="number" min="1" value={festDaysCount} onChange={e => setFestDaysCount(e.target.value)} className="w-full bg-stone-light border border-gold/30 rounded p-2.5 text-slate-200" placeholder="10" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1">திருவிழா பற்றிய விளக்கம் / தகவல்கள் *</label>
                                <textarea value={festDesc} onChange={e => setFestDesc(e.target.value)} required rows={3} className="w-full bg-stone-light border border-gold/30 rounded p-3 text-slate-200 font-tamil focus:outline-none focus:border-gold" placeholder="திருவிழாவின் முழு சிறப்புகள்..." />
                            </div>

                            <div className="flex gap-4 items-center">
                                <label className="flex items-center gap-1.5 font-tamil text-xs text-slate-300 cursor-pointer">
                                    <input type="checkbox" checked={festIsMain} onChange={e => setFestIsMain(e.target.checked)} className="rounded bg-stone-light border-gold/30 text-kumkum focus:ring-0" />
                                    இது முதன்மை பெருவிழா (Main Festival - எப்போதும் காட்டும்)
                                </label>
                            </div>

                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1">திருவிழா புகைப்படம் (Select Photo) *</label>
                                <input type="file" accept="image/*" required={!festBase64} onChange={e => handleFileChangeHelper(e, setFestBase64, setFestFileObj)} className="w-full bg-stone-light border border-gold/30 rounded p-2 text-slate-400 text-xs" />
                            </div>

                            {/* Festival Timeline Step Builder */}
                            <div className="bg-stone-light border border-gold/20 p-4 rounded space-y-3">
                                <h6 className="font-bold text-gold font-tamil text-xs">திருவிழா கால அட்டவணை நிகழ்வுகள் பில்டர் (Timeline Event Builder)</h6>
                                <p className="text-slate-400 text-[10px] font-tamil">திருவிழாவின் முக்கிய நாட்களின் நிகழ்வுகளை இங்கே ஒவ்வொன்றாக ஆட் செய்யவும் (உதாரணம்: கொடியேற்றம், தேர் திருவிழா).</p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-slate-300 font-tamil text-[10px] mb-1">விழா நிகழ்வு பெயர் (e.g. தேரோட்டம்)</label>
                                        <input type="text" value={stepEvent} onChange={e => setStepEvent(e.target.value)} className="w-full bg-stone border border-gold/20 rounded p-2 text-xs text-slate-200 font-tamil" placeholder="கொடியேற்றம் / தேரோட்டம்" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-300 font-tamil text-[10px] mb-1">நாள் / தேதி (e.g. நாள் 1 அல்லது 2026-03-01)</label>
                                        <input type="text" value={stepDate} onChange={e => setStepDate(e.target.value)} className="w-full bg-stone border border-gold/20 rounded p-2 text-xs text-slate-200 font-tamil" placeholder="நாள் 1 அல்லது தேதி" />
                                    </div>
                                    <div>
                                        <label className="block text-slate-300 font-tamil text-[10px] mb-1">நேரம் (e.g. காலை 9:00)</label>
                                        <input type="text" value={stepTime} onChange={e => setStepTime(e.target.value)} className="w-full bg-stone border border-gold/20 rounded p-2 text-xs text-slate-200" placeholder="காலை 9:00 மணி" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-tamil text-[10px] mb-1">நிகழ்வு விவரம் (Event description)</label>
                                    <input type="text" value={stepDesc} onChange={e => setStepDesc(e.target.value)} className="w-full bg-stone border border-gold/20 rounded p-2 text-xs text-slate-200 font-tamil" placeholder="சுவாமி திருவீதி உலா மற்றும் மகா தீபாராதனை..." />
                                </div>
                                <button type="button" onClick={handleAddScheduleStep} className="bg-stone hover:bg-stone-dark text-gold border border-gold/30 font-tamil font-semibold px-4 py-1.5 rounded text-xs transition">
                                    + அட்டவணையில் சேர் (Add Step)
                                </button>

                                {/* Temp Schedule List display */}
                                {tempSchedule.length > 0 && (
                                    <div className="mt-3 space-y-2 border-t border-stone pt-3">
                                        <span className="text-[10px] text-gold font-tamil font-semibold">சேர்க்கப்பட்ட விழா நிகழ்வுகள்:</span>
                                        <div className="space-y-1.5">
                                            {tempSchedule.map((s, idx) => (
                                                <div key={idx} className="bg-stone p-2 rounded text-xs flex justify-between items-center text-slate-300 font-tamil">
                                                    <div>
                                                        <span className="font-bold text-gold">{s.event}</span> ({s.date} - {s.time}) - <span className="text-slate-400 text-[11px]">{s.desc}</span>
                                                    </div>
                                                    <button type="button" onClick={() => handleRemoveScheduleStep(idx)} className="text-red-500 font-tamil font-semibold hover:underline text-[10px]">நீக்கு</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="bg-gold hover:bg-gold-dark text-stone-dark font-tamil font-bold px-6 py-2.5 rounded text-xs transition">
                                திருவிழாவை சேமி (Publish Festival)
                            </button>
                        </form>
                    </div>
                )}

                {/* Bookings enquiry moderation table */}
                {adminTab === 'bookings' && (
                    <div className="space-y-4">
                        <h4 className="font-bold text-gold font-tamil mb-4">பக்தர் சேவை முன்பதிவுகள் கோரிக்கை பட்டியல்</h4>
                        {db.bookings && db.bookings.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm text-slate-300 font-tamil">
                                    <thead className="bg-stone text-gold border-b border-gold/20">
                                        <tr>
                                            <th className="p-3">வகை (Type)</th>
                                            <th className="p-3">பக்தர் பெயர்</th>
                                            <th className="p-3">போன் எண்</th>
                                            <th className="p-3">தேதி</th>
                                            <th className="p-3">விவரங்கள்</th>
                                            <th className="p-3">நிலை (Status)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-stone">
                                        {db.bookings.map((b) => (
                                            <tr key={b.id} className="hover:bg-stone/30">
                                                <td className="p-3 capitalize font-bold text-gold">{b.type}</td>
                                                <td className="p-3 font-semibold">{b.name}</td>
                                                <td className="p-3 text-gold">{b.phone}</td>
                                                <td className="p-3">{b.date}</td>
                                                <td className="p-3 text-slate-400 text-xs">
                                                    {b.details.roomOption && `விடுதி: ${b.details.roomOption}`}
                                                    {b.details.offeringServices && `சேவைகள்: ${b.details.offeringServices.join(', ')}`}
                                                    {b.details.vehicle && `வாகனம்: ${b.details.vehicle} (${b.details.pickupType})`}
                                                    {b.details.guideLanguage && `வழிகாட்டி மொழி: ${b.details.guideLanguage}`}
                                                    {b.details.nakshatram && `அர்ச்சனை: ${b.details.nakshatram} (${b.details.rasi}) - முகவரி: ${b.details.deliveryAddress}`}
                                                </td>
                                                <td className="p-3">
                                                    {b.status === 'pending' ? (
                                                        <div className="flex gap-1.5">
                                                            <button onClick={() => handleUpdateBookingStatus(b.id, 'approved')} className="bg-green-700 hover:bg-green-600 text-white px-2 py-1 rounded text-[10px]">அனுமதி</button>
                                                            <button onClick={() => handleUpdateBookingStatus(b.id, 'rejected')} className="bg-red-950 hover:bg-red-900 text-gold px-2 py-1 rounded text-[10px]">மறுப்பு</button>
                                                        </div>
                                                    ) : (
                                                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold capitalize ${
                                                            b.status === 'approved' ? 'bg-green-950/40 text-green-500 border border-green-500/30' : 'bg-red-950/40 text-red-500 border border-red-500/30'
                                                        }`}>
                                                            {b.status === 'approved' ? 'Approved' : 'Rejected'}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-slate-400 font-tamil text-center py-6">கோரிக்கைகள் எதுவும் இல்லை.</p>
                        )}
                    </div>
                )}

                {/* Hero Slides Management */}
                {adminTab === 'hero_slider' && (
                    <div className="space-y-6">
                        <h4 className="font-bold text-gold font-tamil border-b border-stone pb-2">முகப்பு ஸ்லைடர் புகைப்படங்கள் மேலாண்மை</h4>
                        
                        {/* Slides List */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {db.heroSlides && db.heroSlides.map((slide) => (
                                <div key={slide.id} className="bg-stone border border-gold/20 p-3 rounded flex flex-col justify-between gap-3">
                                    <div>
                                        <img src={slide.url} alt={slide.title} className="w-full h-32 object-cover rounded" />
                                        <h5 className="text-xs sm:text-sm font-bold font-tamil text-gold mt-2">{slide.subtitle}</h5>
                                        <p className="text-[10px] text-slate-400 font-tamil leading-tight mt-1">{slide.description}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteSlide(slide.id)}
                                        className="bg-red-950 hover:bg-red-900 text-gold text-xs py-1.5 rounded font-tamil transition w-full"
                                    >
                                        நீக்கு (Delete Slide)
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Slide Form */}
                        <form onSubmit={handleAddSlide} className="bg-stone border border-gold/30 p-5 rounded space-y-4 text-xs sm:text-sm">
                            <h5 className="font-bold text-gold font-tamil border-b border-stone pb-2">புதிய ஸ்லைடர் புகைப்படம் சேர்க்க</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 font-tamil text-xs mb-1">ஸ்லைடு வகை (Category Title) *</label>
                                    <input type="text" value={slideTitle} onChange={e => setSlideTitle(e.target.value)} required className="w-full bg-stone-light border border-gold/30 rounded p-2.5 text-slate-200" placeholder="உதாரணம்: வீரப்பூர்" />
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-tamil text-xs mb-1">ஸ்லைடு தலைப்பு (Subtitle/Name) *</label>
                                    <input type="text" value={slideSubtitle} onChange={e => setSlideSubtitle(e.target.value)} required className="w-full bg-stone-light border border-gold/30 rounded p-2.5 text-slate-200" placeholder="உதாரணம்: ஸ்ரீ பெரியகாண்டி அம்மன் கோவில்" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1">விளக்கம் (Short Description)</label>
                                <input type="text" value={slideDesc} onChange={e => setSlideDesc(e.target.value)} className="w-full bg-stone-light border border-gold/30 rounded p-2.5 text-slate-200" placeholder="அண்ணன்மார் சாமிகளின் புனித பூமி" />
                            </div>
                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1">புகைப்படம் (Select Photo) *</label>
                                <input type="file" accept="image/*" required onChange={e => handleFileChangeHelper(e, setSlideBase64, setSlideFileObj)} className="w-full bg-stone-light border border-gold/30 rounded p-2 text-slate-400 text-xs" />
                            </div>
                            <button type="submit" className="bg-gold hover:bg-gold-dark text-stone-dark font-tamil font-bold px-6 py-2 rounded text-xs transition">சேர் (Add Slide)</button>
                        </form>
                    </div>
                )}

                {/* Notices Marquee List & additions */}
                {adminTab === 'notices' && (
                    <div className="space-y-6">
                        <h4 className="font-bold text-gold font-tamil border-b border-stone pb-2">முகப்பு அறிவிப்பு வரிகள் மேலாண்மை</h4>
                        
                        <div className="space-y-2">
                            {db.notices && db.notices.map((not, idx) => (
                                <div key={idx} className="bg-stone border border-gold/15 p-3 rounded flex justify-between items-center gap-4 text-xs sm:text-sm font-tamil text-slate-300">
                                    <p className="leading-relaxed">{not}</p>
                                    <button
                                        onClick={() => handleDeleteNotice(idx)}
                                        className="bg-red-950 hover:bg-red-900 text-gold text-xs px-2.5 py-1.5 rounded transition whitespace-nowrap"
                                    >
                                        நீக்கு
                                    </button>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleAddNotice} className="bg-stone border border-gold/30 p-5 rounded space-y-4 text-xs sm:text-sm">
                            <h5 className="font-bold text-gold font-tamil">புதிய அறிவிப்பு வரி சேர்க்க</h5>
                            <textarea
                                value={newNotice}
                                onChange={e => setNewNotice(e.target.value)}
                                required
                                rows={2}
                                className="w-full bg-stone-light border border-gold/30 rounded p-3 text-slate-200 focus:outline-none focus:border-gold font-tamil"
                                placeholder="மக்களுக்கு அறிவிக்க வேண்டிய முக்கியமான வாக்கியத்தை எழுதவும்..."
                            />
                            <button type="submit" className="bg-gold hover:bg-gold-dark text-stone-dark font-tamil font-bold px-6 py-2 rounded text-xs transition">சேர் (Add Notice)</button>
                        </form>
                    </div>
                )}

                {/* History Chapters Editor */}
                {adminTab === 'history_edit' && (
                    <form onSubmit={handleUpdateHistory} className="space-y-5 text-xs sm:text-sm">
                        <h4 className="font-bold text-gold font-tamil border-b border-stone pb-2">வரலாற்றுப் பக்க அத்தியாயங்கள் எடிட்டர்</h4>
                        
                        <div className="w-48">
                            <label className="block text-slate-300 font-tamil text-xs mb-1">அத்தியாயம் தேர்ந்தெடுக்கவும்</label>
                            <select
                                value={selectedHistoryChap}
                                onChange={e => setSelectedHistoryChap(e.target.value)}
                                className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 font-tamil"
                            >
                                {[1,2,3,4,5,6].map(num => (
                                    <option key={num} value={num}>அத்தியாயம் {num}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-300 font-tamil text-xs mb-1">அத்தியாயத்தின் தலைப்பு *</label>
                            <input
                                type="text"
                                required
                                value={historyTitle}
                                onChange={e => setHistoryTitle(e.target.value)}
                                className="w-full bg-stone border border-gold/30 rounded p-2.5 text-slate-200 font-tamil"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 font-tamil text-xs mb-1">விளக்கம் / வரலாறு விபரம் *</label>
                            <textarea
                                required
                                value={historyContent}
                                onChange={e => setHistoryContent(e.target.value)}
                                rows={6}
                                className="w-full bg-stone border border-gold/30 rounded p-3 text-slate-200 focus:outline-none focus:border-gold font-tamil leading-relaxed"
                            />
                        </div>

                        <div className="flex items-center gap-4 flex-wrap">
                            {historyBase64 && (
                                <img src={historyBase64} alt="Current Chapter Layout" className="w-28 h-20 object-cover rounded border border-gold/20" />
                            )}
                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1">புதிய புகைப்படம் மாற்ற (Change Chapter Photo)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => handleFileChangeHelper(e, setHistoryBase64, setHistoryFileObj)}
                                    className="bg-stone border border-gold/30 rounded p-2 text-slate-400 text-xs"
                                />
                            </div>
                        </div>

                        <button type="submit" className="bg-gold hover:bg-gold-dark text-stone-dark font-tamil font-bold px-6 py-2.5 rounded transition">
                            சேமி (Update Chapter)
                        </button>
                    </form>
                )}

                {/* Rooms Management Panel */}
                {adminTab === 'room_manage' && (
                    <div className="space-y-6">
                        <h4 className="font-bold text-gold font-tamil border-b border-stone pb-2">விடுதிகள் தங்குமிடங்கள் மேலாண்மை</h4>
                        
                        {/* Rooms List Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm text-slate-300 font-tamil">
                                <thead className="bg-stone text-gold border-b border-gold/20">
                                    <tr>
                                        <th className="p-3">விடுதி பெயர்</th>
                                        <th className="p-3">இடம்</th>
                                        <th className="p-3">தூரம்</th>
                                        <th className="p-3">AC / Non-AC</th>
                                        <th className="p-3">சிறப்பம்சங்கள்</th>
                                        <th className="p-3">செயல்கள் (Action)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone">
                                    {db.rooms && db.rooms.map((room) => (
                                        <tr key={room.id} className="hover:bg-stone/30">
                                            <td className="p-3 font-semibold flex items-center gap-2">
                                                {room.photos && room.photos[0] && (
                                                    <img src={room.photos[0]} alt={room.name} className="w-10 h-10 object-cover rounded" />
                                                )}
                                                {room.name}
                                            </td>
                                            <td className="p-3">{room.location}</td>
                                            <td className="p-3">{room.distance}</td>
                                            <td className="p-3">{room.ac ? "AC" : "Non-AC"}</td>
                                            <td className="p-3 text-xs text-slate-400">{room.facilities.join(', ')}</td>
                                            <td className="p-3">
                                                <button
                                                    onClick={() => handleDeleteRoom(room.id)}
                                                    className="bg-red-950 hover:bg-red-900 text-gold px-3 py-1 rounded text-[10px] transition"
                                                >
                                                    நீக்கு (Delete)
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Add Room Form */}
                        <form onSubmit={handleAddRoom} className="bg-stone border border-gold/30 p-5 rounded space-y-4 text-xs sm:text-sm">
                            <h5 className="font-bold text-gold font-tamil border-b border-stone pb-2">புதிய தங்குமிடம் (Room Facility) சேர்க்க</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 font-tamil text-xs mb-1">விடுதி பெயர் (Room/Residency Name) *</label>
                                    <input type="text" value={roomName} onChange={e => setRoomName(e.target.value)} required className="w-full bg-stone-light border border-gold/30 rounded p-2.5 text-slate-200 font-tamil" placeholder="பெயர்" />
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-tamil text-xs mb-1">அமைந்துள்ள இடம் (Location) *</label>
                                    <input type="text" value={roomLocation} onChange={e => setRoomLocation(e.target.value)} required className="w-full bg-stone-light border border-gold/30 rounded p-2.5 text-slate-200 font-tamil" placeholder="உதாரணம்: கோவில் தெற்கு தெரு, வீரப்பூர்" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-slate-300 font-tamil text-xs mb-1">கோவிலில் இருந்து தூரம் (Distance)</label>
                                    <input type="text" value={roomDistance} onChange={e => setRoomDistance(e.target.value)} className="w-full bg-stone-light border border-gold/30 rounded p-2.5 text-slate-200 font-tamil" placeholder="100 மீட்டர்" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-slate-300 font-tamil text-xs mb-1">சிறப்பம்சங்கள் / வசதிகள் (Facilities - கமாவால் பிரிக்கவும்) *</label>
                                    <input type="text" value={roomFacList} onChange={e => setRoomFacList(e.target.value)} className="w-full bg-stone-light border border-gold/30 rounded p-2.5 text-slate-200 font-tamil" placeholder="சுத்தமான குடிநீர், பெரிய பார்க்கிங், சமையல் வசதி" />
                                </div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <label className="flex items-center gap-1.5 font-tamil text-xs text-slate-300 cursor-pointer">
                                    <input type="checkbox" checked={roomAc} onChange={e => setRoomAc(e.target.checked)} className="rounded bg-stone-light border-gold/30 text-kumkum focus:ring-0" />
                                    ஏசி அறை (AC Room)
                                </label>
                            </div>
                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1">விடுதி புகைப்படம் (Select Photo) *</label>
                                <input type="file" accept="image/*" onChange={e => handleFileChangeHelper(e, setRoomBase64, setRoomFileObj)} className="w-full bg-stone-light border border-gold/30 rounded p-2 text-slate-400 text-xs" />
                            </div>
                            <button type="submit" className="bg-gold hover:bg-gold-dark text-stone-dark font-tamil font-bold px-6 py-2 rounded text-xs transition">சேர் (Add Room)</button>
                        </form>
                    </div>
                )}

                {/* Complaints moderation list */}
                {adminTab === 'complaints' && (
                    <div className="space-y-4">
                        <h4 className="font-bold text-gold font-tamil mb-4">பக்தர் புகார்கள் / ஆலோசனைகள்</h4>
                        {db.complaints && db.complaints.length > 0 ? (
                            <div className="space-y-4">
                                {db.complaints.map((comp) => (
                                    <div key={comp.id} className="bg-stone border border-gold/15 p-4 rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-start">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-xs bg-kumkum/40 border border-gold/20 text-gold px-2 py-0.5 rounded font-tamil font-semibold">{comp.category}</span>
                                                <span className="text-xs text-slate-400 font-tamil">{comp.date}</span>
                                                <span className="text-xs text-gold font-semibold">பக்தர்: {comp.name} ({comp.phone})</span>
                                            </div>
                                            <p className="text-slate-300 font-tamil text-xs sm:text-sm leading-relaxed">{comp.message}</p>
                                            {comp.imageUrl && (
                                                <a href={comp.imageUrl} target="_blank" rel="noreferrer" className="inline-block">
                                                    <img src={comp.imageUrl} alt="Complaint attachment" className="w-24 h-24 object-cover rounded border border-stone-light hover:border-gold transition" />
                                                </a>
                                            )}
                                        </div>
                                        <div className="sm:self-center">
                                            {comp.status === 'open' ? (
                                                <button onClick={() => handleUpdateComplaintStatus(comp.id, 'resolved')} className="bg-green-700 hover:bg-green-600 text-white font-tamil text-xs py-1.5 px-3 rounded transition">
                                                    மார்க் அஸ் Resolved
                                                </button>
                                            ) : (
                                                <span className="text-xs bg-stone-light text-slate-500 px-3 py-1 rounded border border-slate-700 font-tamil">Resolved</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 font-tamil text-center py-6">புகார்கள் எதுவும் இல்லை.</p>
                        )}
                    </div>
                )}

                {/* Reviews Moderation View */}
                {adminTab === 'reviews' && (
                    <div className="space-y-4">
                        <h4 className="font-bold text-gold font-tamil mb-4">பக்தர் மதிப்புரைகள் ஒப்புதல் பலகை</h4>
                        {db.reviews && db.reviews.length > 0 ? (
                            <div className="space-y-4">
                                {db.reviews.map((rev) => (
                                    <div key={rev.id} className="bg-stone border border-gold/15 p-4 rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-start">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="font-bold text-slate-200 font-tamil text-xs sm:text-sm">{rev.name}</span>
                                                    <span className="text-xs text-gold font-tamil ml-2">({rev.place})</span>
                                                </div>
                                                <span className="text-xs text-gold">Rating: {rev.rating}/5</span>
                                            </div>
                                            <p className="text-slate-300 font-tamil text-xs sm:text-sm italic">"{rev.experience}"</p>
                                            <span className={`text-[10px] px-2.5 py-0.5 rounded inline-block ${rev.approved ? 'bg-green-950/40 text-green-500' : 'bg-amber-950/40 text-amber-500'}`}>
                                                {rev.approved ? 'Approved' : 'Pending Review'}
                                            </span>
                                        </div>

                                        <div className="flex gap-2 self-end sm:self-center">
                                            {!rev.approved && (
                                                <button onClick={() => handleModerateReview(rev.id, true)} className="bg-green-700 hover:bg-green-600 text-white font-tamil text-xs py-1 px-3 rounded">அனுமதி</button>
                                            )}
                                            <button onClick={() => handleModerateReview(rev.id, false)} className="bg-red-950 hover:bg-red-900 text-gold font-tamil text-xs py-1 px-3 rounded">நீக்கு</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 font-tamil text-center py-6">மதிப்புரைகள் எதுவும் இல்லை.</p>
                        )}
                    </div>
                )}

                {/* Gallery Management and direct additions */}
                {adminTab === 'gallery_mod' && (
                    <div className="space-y-6">
                        <h4 className="font-bold text-gold font-tamil border-b border-stone pb-2">புகைப்பட தொகுப்பு நிர்வகி & ஒப்புதல் பலகை</h4>
                        
                        {/* Direct add photo form */}
                        <form onSubmit={handleAddGalleryPhotoDirect} className="bg-stone border border-gold/30 p-5 rounded space-y-4 text-xs sm:text-sm">
                            <h5 className="font-bold text-gold font-tamil border-b border-stone pb-2">நிர்வாகியே நேரடியாக புகைப்படம் சேர்க்க</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-300 font-tamil text-xs mb-1">புகைப்படத் தலைப்பு *</label>
                                    <input type="text" value={slideTitle} onChange={e => setSlideTitle(e.target.value)} required className="w-full bg-stone-light border border-gold/30 rounded p-2.5 text-slate-200 font-tamil" placeholder="தலைப்பு" />
                                </div>
                                <div>
                                    <label className="block text-slate-300 font-tamil text-xs mb-1">வகை (Category)</label>
                                    <select value={slideSubtitle} onChange={e => setSlideSubtitle(e.target.value)} className="w-full bg-stone-light border border-gold/30 rounded p-2.5 text-slate-200 font-tamil">
                                        <option value="Temple">Temple (கோவில்)</option>
                                        <option value="Festival">Festival (திருவிழா)</option>
                                        <option value="Veeramalai">Veeramalai (வீரமலை)</option>
                                        <option value="Deities">Deities (தெய்வங்கள்)</option>
                                        <option value="Old memories">Old memories (பழைய நினைவுகள்)</option>
                                        <option value="Devotees">Devotees (பக்தர்கள்)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-slate-300 font-tamil text-xs mb-1">படம் (Select Image) *</label>
                                <input type="file" accept="image/*" required onChange={e => handleFileChangeHelper(e, setSlideBase64, setSlideFileObj)} className="w-full bg-stone-light border border-gold/30 rounded p-2 text-slate-400 text-xs" />
                            </div>
                            <button type="submit" className="bg-gold hover:bg-gold-dark text-stone-dark font-tamil font-bold px-6 py-2 rounded text-xs transition">கேலரியில் சேர் (Publish Photo)</button>
                        </form>

                        {/* Approvals moderation list */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                            {db.gallery && db.gallery.map((img) => (
                                <div key={img.id} className="bg-stone border border-gold/15 p-3 rounded-lg flex flex-col justify-between gap-3">
                                    <div className="space-y-2">
                                        <img src={img.url} alt={img.title} className="w-full h-36 object-cover rounded" />
                                        <div>
                                            <h5 className="font-bold font-tamil text-xs text-slate-100">{img.title}</h5>
                                            <span className="text-[10px] text-gold font-tamil">{img.category}</span>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded inline-block ${img.approved ? 'bg-green-950/40 text-green-500' : 'bg-amber-950/40 text-amber-500'}`}>
                                            {img.approved ? 'Approved' : 'Pending Review'}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        {!img.approved && (
                                            <button onClick={() => handleModerateGallery(img.id, true)} className="flex-1 bg-green-700 hover:bg-green-600 text-white font-tamil text-xs py-1 rounded">Approve</button>
                                        )}
                                        <button onClick={() => handleModerateGallery(img.id, false)} className="flex-1 bg-red-950 hover:bg-red-900 text-gold font-tamil text-xs py-1 rounded">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

// ----------------------------------------------------
// Mounting the React application
// ----------------------------------------------------
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
