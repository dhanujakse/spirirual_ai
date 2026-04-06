import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { Play, Settings, Search, CheckCircle, Heart, Send, Lock, User, X, Loader, Bell, Headphones, Home, Sparkles, MapPin, ArrowLeft, MessageCircle } from 'lucide-react';
import { jwtDecode } from "jwt-decode";

// Removed STATIC_QUOTES since we strictly rely on the backend 365 generator

const CHANTING_QUOTES = [
  "Chanting the holy name is the prime benediction for this age.",
  "There is no difference between the holy name of the Lord and the Lord Himself.",
  "Simply by chanting the holy name of Krishna one can obtain freedom from material existence.",
  "The holy name of Krishna is transcendentally blissful. It bestows all spiritual benedictions.",
  "By chanting Hare Krishna, one's heart is cleansed of all material dirt.",
  "In this age of Kali, there is no other means but the chanting of the holy name.",
  "Chanting is a process of purification. It is the medicine that cures the disease of material illusion.",
  "The chanting of the Hare Krishna mantra is recommended as the easiest method for self-realization in this age.",
  "We should chant Hare Krishna carefully and attentively, then the mind will not wander.",
  "The holy name of Krishna is so attractive that anyone who chants it becomes immediately freed from all reactions of sinful life.",
  "Chanting the holy name is the only fire that can burn down the entire forest of material entanglement.",
  
  // Added from ISKCON Desire Tree
  "Chanting is not just a process, it is a relationship. You and the holy name are together.",
  "One's memory of Krishna is revived by chanting the maha-mantra, Hare Krishna.",
  "We must chant with the proper service attitude – not demanding love of God, but chanting for Krishna's pleasure.",
  "The perfect spiritual practice for this age is to chant the holy name with full conviction.",
  "By chanting Krishna's names, one will be transferred to the supreme planet, Krishnaloka, without a doubt.",
  "The chanting itself purifies us and as the heart becomes purified, the Holy name is revealed to us.",
  "Human life is bestowed to achieve spiritual success and the easiest procedure is to chant the holy name.",
  "Chanting is the waxing moon that spreads the white lotus of good fortune for all living entities.",
  "Maya targets your chanting because it is our most potent weapon against her.",
  "Chanting Hare Krishna increases the ocean of transcendental bliss.",
  "In order to be recognized by Krishna, one should chant the holy name of the Lord continuously.",
  "This sound vibration surpasses all lower strata of consciousness – sensual, mental and intellectual.",
  "The process of chanting is so powerful that even householders can easily gain the ultimate result.",
  "Caitanya Mahaprabhu recommended everyone chant to cleanse the dust from the heart.",
  "Brahma muhurta is the best time to chant. As the day increases, it becomes difficult to concentrate.",
  "Ninety-nine percent of spiritual advancement depends on chanting only.",
  "In any condition of life, if one goes on chanting he will never be unhappy.",
  "If the heart is cleansed by chanting, then one can actually understand the importance of the holy name.",
  "The holy name is the incarnation of the Lord in the form of sound.",
  "By chanting without offenses, one can very quickly attain the shelter of the Lord’s lotus feet.",
  "Chanting should be done with a feeling of humility, thinking oneself lower than the straw in the street.",
  "The name of Krishna and Krishna Himself are identical; there is no difference between them.",
  "The chanting of Hare Krishna is the only way to get out of the clutches of Maya.",
  "When one chants the holy name, the Lord dances on their tongue.",
  "The more one chants, the more one’s heart becomes soft and filled with love for God.",
  "One who has a taste for chanting the holy name has no interest in material sense gratification.",
  "Chanting is the essence of all Vedic scriptures.",
  "Through the chanting of the maha-mantra, one can perceive the presence of Krishna everywhere.",
  "To the degree you allow Maya to distract you from chanting, you become malleable to her will.",
  "Even a fraction of a second of attentive chanting should not be wasted."
];
const getRandomQuote = () => CHANTING_QUOTES[Math.floor(Math.random() * CHANTING_QUOTES.length)];

const FALLBACK_VIDEOS = [
  // Motivation
  { id: "M5n5iT8pWkI", title: "Overcome Laziness | Vamsidhari Dasa", thumbnail: "https://img.youtube.com/vi/M5n5iT8pWkI/hqdefault.jpg", category: "Motivation", views: "65K Views", description: "How to overcome procrastination and laziness through practical spiritual wisdom immediately.", time: "1 day ago" },
  { id: "a2Z3xY8pB1", title: "Stop Wasting Time on Mobile Apps", thumbnail: "https://img.youtube.com/vi/a2Z3xY8pB1/hqdefault.jpg", category: "Motivation", views: "30K Views", description: "Learn how to reclaim your focus from algorithms and invest it into authentic real world spiritual and mental growth.", time: "1 day ago" },
  { id: "z8X9mVX1oA", title: "Find Your Life Purpose Today", thumbnail: "https://img.youtube.com/vi/z8X9mVX1oA/hqdefault.jpg", category: "Motivation", views: "15K Views", description: "Stop drifting. The Vedic perspective on assigning absolute priority to your most vital human goals.", time: "2 days ago" },
  { id: "h9P2kL1nMw", title: "Overcoming Fear of Failure", thumbnail: "https://img.youtube.com/vi/h9P2kL1nMw/hqdefault.jpg", category: "Motivation", views: "19K Views", description: "Are exams or job interviews terrifying you? A simple shift in perspective from the Gita.", time: "3 days ago" },

  // Chanting
  { id: "S4G0rI82tQ0", title: "Power of Chanting (Sri Namam)", thumbnail: "https://img.youtube.com/vi/S4G0rI82tQ0/hqdefault.jpg", category: "Chanting", views: "40K Views", description: "Chanting the holy name cleanses the mind of stress and anxiety. Let's delve into the profound power of systematic Japa meditation.", time: "1 day ago" },
  { id: "v1B4mZ9pQo", title: "Japa Meditation Workshop", thumbnail: "https://img.youtube.com/vi/v1B4mZ9pQo/hqdefault.jpg", category: "Chanting", views: "50K Views", description: "A practical guide to holding beads and maintaining supreme mental focus during early morning Japa sessions.", time: "2 days ago" },
  { id: "x3P8nA7mT1", title: "Kirtan Mela Live Recording", thumbnail: "https://img.youtube.com/vi/x3P8nA7mT1/hqdefault.jpg", category: "Chanting", views: "100K Views", description: "Immerse yourself in this live ecstatic Kirtan recording and chant along.", time: "4 days ago" },
  { id: "l2M9xZ5pR4", title: "Nama Aparadha Explained", thumbnail: "https://img.youtube.com/vi/l2M9xZ5pR4/hqdefault.jpg", category: "Chanting", views: "25K Views", description: "Understanding the offenses against the Holy Name and how to avoid them during daily chanting.", time: "1 week ago" },

  // Discipline
  { id: "JcOIQ_kG3qU", title: "Manage Your Mind | Bhagavad Gita", thumbnail: "https://img.youtube.com/vi/JcOIQ_kG3qU/hqdefault.jpg", category: "Discipline", views: "30K Views", description: "Struggling with focus? The Bhagavad Gita provides timeless secrets for managing a distracted mind and staying disciplined.", time: "1 day ago" },
  { id: "D9zR3QfI8u8", title: "Student Life & Brahmacharya", thumbnail: "https://img.youtube.com/vi/D9zR3QfI8u8/hqdefault.jpg", category: "Discipline", views: "15K Views", description: "Celibacy and discipline for modern youth. Understanding how preserving our inner energy acts as the bedrock for ultimate success.", time: "2 weeks ago" },
  { id: "c5N2mX7pY1", title: "Wake Up Early Routine", thumbnail: "https://img.youtube.com/vi/c5N2mX7pY1/hqdefault.jpg", category: "Discipline", views: "40K Views", description: "The profound benefits of Brahma Muhurta. Why the early hours contain maximum spiritual potency.", time: "3 weeks ago" },
  { id: "m8X4pL1nZ9", title: "Fasting & Mental Clarity", thumbnail: "https://img.youtube.com/vi/m8X4pL1nZ9/hqdefault.jpg", category: "Discipline", views: "20K Views", description: "How Ekadasi fasting isn't just a bodily sacrifice, but a crucial tool for profound psychological discipline.", time: "1 month ago" },

  // Story
  { id: "Y5g1h3wR2Kk", title: "Bhagavad Gita Secrets Revealed", thumbnail: "https://img.youtube.com/vi/Y5g1h3wR2Kk/hqdefault.jpg", category: "Story", views: "40K Views", description: "Discover the hidden narrative secrets of the great epic. Understanding Krishna's instructions requires a change in perspective.", time: "1 month ago" },
  { id: "p1M8nA4xZ2", title: "Krishna and Sudama Pastime", thumbnail: "https://img.youtube.com/vi/p1M8nA4xZ2/hqdefault.jpg", category: "Story", views: "80K Views", description: "The beautiful story of friendship between Lord Krishna and his poverty-stricken friend.", time: "1 month ago" },
  { id: "y7B2mX9pQ4", title: "The Story of Dhruva Maharaja", thumbnail: "https://img.youtube.com/vi/y7B2mX9pQ4/hqdefault.jpg", category: "Story", views: "35K Views", description: "A five-year-old boy's incredible determination to achieve the impossible through severe austerities.", time: "2 months ago" },
  { id: "k4L9nM1pZ8", title: "Ramayana: Hanuman's Devotion", thumbnail: "https://img.youtube.com/vi/k4L9nM1pZ8/hqdefault.jpg", category: "Story", views: "90K Views", description: "Exploring the zenith of service attitude in the glorious pastimes of Sri Hanuman.", time: "3 months ago" }
];

const CATEGORIES = ["Scripture", "Glorification", "Story", "Chanting", "Kirtan", "QnA"];

const categorizeVideo = (title) => {
  const t = title.toLowerCase();

  const kirtanMatches = "kirtan|keerthan|bhajan|arati|aarti|sankirtan|sankirtana|parikrama kirtan|yajna kirtan|பஜனை|கீர்த்தனை|ஆரத்தி|adharam|akrodha|amar jivan|amar nitai|ambudanjan|ami jamuna|ami to|anadi karama|antara mandire|ar ke|ar koto|ara keno|are bhai|asalo katha|atma nivedana|avatara sara|bhaja gauranga|bhaja re|bhajah hu|bhale gaura|bhoga aarti|bhoga arati|yamunastakam|bhuliya|bolo hari|boro kripa|boro sukher|brahma samhita|carana kamal|devi suresvari|dhana mora|dhule dhule|doyala nitai|duhkher|durlabha|dusta mana|ei baro|ek din|ekhona|emona durmati|gangeya|gaura aarti|gaura arati|gaura pahu|gauranga|gay gaurchand|gay gour|gopinath|gurau|gurudeva|hari bolo|hari haray|hari hari|hari he|hari jaya|hari kabe|he govinda|huhunkara|jaya jagganath|jaya narasimha|narasimha arati|jaya radha|jayati|je anilo|jiva jago|kabe gaura|kabe habe|kabe mui|kabe sri|kadacit|jagannathastakam|kali kukkura|keno hare|kesava|ki jani|ki rupe|krishna hoite|krpa koro|krsna deva|krsna jinaka|krsna krsna|krsna prema|krsna tabe|kunkumakta|kusumita|madana mohana|madhuram|maha prasade|maine ratana|mama mana|manasa deho|mirar|yoga siddhir|nadiya|namo namah tulasi|tulasi arati|nanda ke|narada muni|nava nirada|nija karma|nija pati|nitai|ohe vaishnava|ore mana|ore vrndavaner|param karuna|prabhu tava|pranam mantras|pranam tomai|prapance|prasadam prayers|radha krishna|radha kunda|radhe jaya|radhe radhe|raja rani|sad goswami|sakhe kalaya|sarvasva tomar|sri damodara|sri dasavtar|sri guru caran|gurv-ashtakam|guru arati|sri hari vasare|sri jagganath|sri krishna caitanya|sri rupa|sri sacisuta|sri sri yamunastakam|srita kamala|suddha bhakat|sujanarbuda|sundara|suniyachi|tatala|thakura vaishnava|ten offenses|tumi sarveswareswara|udilo arun|ugram viram|ujjavala|ujjvala|vamsi dhari|vande krsna|vibhavari|vidyara|vraje prasiddham|vrindavan|vrndavana vasi|yadi gaura|yadi te|yashomati";
  if (new RegExp(kirtanMatches).test(t)) return "Kirtan";

  if (t.match(/kelvi badhil|கேள்வி பதில்|கேள்வி-பதில்|question|answer|q&a|q and a|q & a|\?/)) return "QnA";

  if (t.match(/chant|chanting|mantra|japa|pranama|vacha|uvaca|uvacha|ashtakam|astakam|sloka|slokam|dhyana|nama|sahasranamam|மந்திரம்|ஜபம்|ஸ்லோகம்|நாமம்/)) return "Chanting";
  if (t.match(/bhagavad gita|gita|srimad bhagavatam|bhagavatam|ramayana|ramayanam|valmiki ramayana|shree valmiki ramayana|chaitanya charitamrita|purusha suktam|bhakti sastri|canto|bhishma panchakam|lecture|shastra|sastra|rama lecture|uddhava gita|upanishad|laghu bhagavatamrta|sri laghu bhagavatamrta|mahabharatam|krishna leela|பகவத் கீதை|கீதை|பாகவதம்|ராமாயணம்|ஸ்ரீமத்|புருஷ சூக்தம்|பக்தி சாஸ்திரி|காண்டம்|ஸ்கந்தம்|பீஷ்ம பஞ்சகம்|சொற்பொழிவு|உரை|சாஸ்திரம்|சைதன்ய சரிதாம்ருதம்|உத்தவ கீதை|உபநிஷத்|மகாபாரதம்|கிருஷ்ண லீலை/)) return "Scripture";
  if (t.match(/appearance day|disappearance day|glories|glorification|acharya|guru puja|vyasa puja|பிரபுபாத|ஜெயந்தி/)) return "Glorification";
  if (t.match(/rama|krishna|lila|story|festival|navami|janmashtami|pastime|கதை|லீலை|ராம|கிருஷ்ண|பரமாத்மா|prahlada|quote|prabhupada quote|muni|rishi|goswami|maharaj|maharaja|alwar|nayanar|bhakta|முனிவர்|ரிஷி|கோஸ்வாமி|மகாராஜ்|ஆழ்வார்|நாயனார்|பக்தர்/)) return "Story";

  if (t.split(" ").length >= 4 && !t.match(/[\u0B80-\u0BFF]/)) return "Story";

  return "Scripture";
};

const isRecent = (video) => {
  if (!video) return false;
  const t = (video.time || "").toLowerCase();

  // String matching for fallback videos
  if (t.includes("month") || t.includes("year")) return false;
  if (t.includes("weeks") || t.includes("week")) {
    if (t.includes("2 weeks") || t.includes("3 weeks") || t.includes("4 weeks")) return false;
  }
  if (t.includes("day") || t.includes("days")) {
    const daysMatch = t.match(/(\d+)\s+day/);
    if (daysMatch && parseInt(daysMatch[1]) > 10) return false;
  }

  // For ISO date strings from DB
  if (video.publishedAt) {
    const diffDays = (Date.now() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 10) return false;
  }
  return true;
};

// --- Full-Stack DB & YouTube API Fetcher ---
const fetchVamsidhariVideosSafely = async () => {
  try {
    // 1. Trigger background Sync (Auto-Update Latest Logic)
    fetch("http://localhost:5000/api/sync_latest", { method: "POST" }).catch(e => console.log('Sync err:', e));

    // 2. Fetch Latest 20 from our SQLite Database!
    const res = await fetch("http://localhost:5000/api/videos/latest?limit=20");
    if (!res.ok) throw new Error("DB Offline");
    const data = await res.json();

    if (data && data.length > 0) {
      return data.map(v => ({
        id: v.videoId,
        title: v.title,
        description: v.description || "No description provided.",
        thumbnail: v.thumbnail,
        category: categorizeVideo(v.title),
        publishedAt: v.publishedAt,
        llmEnglish: v.llmEnglish,
        llmTamil: v.llmTamil,
        time: new Date(v.publishedAt).toLocaleDateString()
      }));
    }
  } catch (e) {
    console.warn("Backend DB failed. Switch on the server using `node server.js` to enable YouTube synchronization.");
  }
  throw new Error("All network attempts failed, retaining robust initial fallback.");
};

// --- Premium 3D Interaction Component ---
const TiltCard = ({ children, className, onClick, style = {} }) => {
  const tiltRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!tiltRef.current) return;
    const rect = tiltRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calculate rotation (-10 to 10 degrees)
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    
    // Apply 3D perspective and glow tracking
    tiltRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    tiltRef.current.style.transition = 'transform 0.05s linear';
  };

  const handleMouseLeave = () => {
    if (!tiltRef.current) return;
    // Snap back to perfectly flat smoothly
    tiltRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    tiltRef.current.style.transition = 'transform 0.4s ease-out';
  };

  return (
    <div
      ref={tiltRef}
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, transformStyle: 'preserve-3d' }}
    >
      {/* 3D Depth wrapper mapping */}
      <div style={{ transform: 'translateZ(20px)', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

// --- Modals ---
const AuthModal = ({ onClose, onSuccess }) => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const googleButtonRef = useRef(null);
  
  const hasAccounts = (JSON.parse(localStorage.getItem('spiritual_users_db')) || []).length > 0;

  const handleCredentialResponse = (response) => {
     try {
         const decoded = jwtDecode(response.credential);
         localStorage.setItem('spiritual_user', JSON.stringify({ name: decoded.name, email: decoded.email, picture: decoded.picture }));
         onSuccess(true);
     } catch(e) {
         setError("Authentication Validation Failed.");
     }
  };

  useEffect(() => {
    const initializeGsi = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          // Make sure we pull the raw env if they haven't explicitly prefixed VITE_ yet
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "270196791260-b2au9kguf9aopf093no9pane7cgkmpc3.apps.googleusercontent.com",
          callback: handleCredentialResponse
        });
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          { theme: "outline", size: "large", width: 300, text: "continue_with" }
        );
      }
    };

    const scriptId = 'google-gsi-client';
    if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.id = scriptId;
        script.async = true;
        document.body.appendChild(script);
        script.onload = initializeGsi;
    } else {
        initializeGsi();
    }
  }, [mode]);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 10; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
    setShowPassword(true);
    setError('');
  };

  const handleAuth = (e) => {
    e.preventDefault();
    if (password.length < 6) {
       setError("Password must be at least 6 characters long.");
       return;
    }
    
    // Simulate checking a database
    let userDb = [];
    try { userDb = JSON.parse(localStorage.getItem('spiritual_users_db')) || []; } catch(err){}

    if (mode === 'signup') {
       // Register logic
       const exists = userDb.find(u => u.email === email);
       if(exists) return setError("An account with this email already exists! Please Login.");
       
       userDb.push({ name: name || 'Devotee', email, password });
       localStorage.setItem('spiritual_users_db', JSON.stringify(userDb));
       localStorage.setItem('spiritual_user', JSON.stringify({ name: name || 'Devotee', email }));
       onSuccess(true);
    } else {
       // Strict Login logic check
       const validUser = userDb.find(u => u.email === email && u.password === password);
       if (!validUser) {
           setError("Please create an account / Sign Up first to login!");
           return;
       }
       localStorage.setItem('spiritual_user', JSON.stringify({ name: validUser.name, email: validUser.email }));
       onSuccess(true);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-effect">
        <X size={24} color="#64748b" style={{ position: 'absolute', top: 24, right: 24, cursor: 'pointer' }} onClick={onClose} />
        <div style={{ display: 'flex', borderBottom: '2px solid rgba(0,0,0,0.1)', marginBottom: 24 }}>
          <button onClick={() => setMode('login')} style={{ flex: 1, padding: 12, background: 'transparent', border: 'none', borderBottom: mode === 'login' ? '3px solid #9333ea' : 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', color: mode === 'login' ? '#9333ea' : '#64748b' }}>Login</button>
          <button onClick={() => setMode('signup')} style={{ flex: 1, padding: 12, background: 'transparent', border: 'none', borderBottom: mode === 'signup' ? '3px solid #9333ea' : 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', color: mode === 'signup' ? '#9333ea' : '#64748b' }}>Sign Up</button>
        </div>
        <h2 style={{ fontSize: '1.6rem', color: '#4c1d95', marginBottom: 8, fontWeight: 800 }}>
           {mode === 'login' ? (hasAccounts ? 'Welcome Back. Hare Krishna!' : 'Login. Hare Krishna!') : 'Create Account'}
        </h2>
        
        {error && <p style={{color: 'red', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 'bold'}}>{error}</p>}
        
        <form onSubmit={handleAuth}>
          {mode === 'signup' && <input type="text" id="name" name="name" autoComplete="name" required placeholder="Full Name" className="auth-input" value={name} onChange={e=>setName(e.target.value)} />}
          <input type="email" id="email" name="email" autoComplete="email" required placeholder="Email Address" className="auth-input" value={email} onChange={e=>setEmail(e.target.value)} />
          
          <div style={{ position: 'relative' }}>
            <input type={showPassword ? "text" : "password"} id="password" name="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={6} placeholder="Password (Min. 6 characters)" className="auth-input" value={password} onChange={e=>{setPassword(e.target.value); setError('');}} style={{ paddingRight: '46px' }} />
            <span style={{ position: 'absolute', right: 12, top: 14, cursor: 'pointer', fontSize: '0.8rem', color: '#9333ea', fontWeight: 'bold' }} onClick={() => setShowPassword(!showPassword)}>
               {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>
          
          {mode === 'signup' && (
            <button type="button" onClick={generatePassword} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.8rem', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer', marginBottom: 8, padding: 0, textAlign: 'left', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#4c1d95'} onMouseOut={(e) => e.target.style.color = '#64748b'}>Generate secure password</button>
          )}
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8 }}>{mode === 'login' ? 'SIGN IN →' : 'SIGN UP →'}</button>
        </form>
        
        <div style={{ marginTop: 16, textAlign: 'center', fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold', marginBottom: 16 }}>OR</div>
        
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', minHeight: 40 }} ref={googleButtonRef}>
          {/* Native Google OAuth render target */}
        </div>
      </div>
    </div>
  );
};

const ProfileModal = ({ onClose, onLogout }) => {
  const defaultEmail = 'user@example.com';
  const savedUser = JSON.parse(localStorage.getItem('spiritual_user')) || {name: '', email: defaultEmail};
  
  // Format the visual name robustly
  let displayName = savedUser.name;
  if (!displayName || displayName === 'Devotee' || displayName === 'Google Devotee') {
     displayName = savedUser.email ? savedUser.email.split('@')[0] : 'Devotee';
  }

  const totalJapas = localStorage.getItem('spiritual_japa') || 0;
  const totalRounds = Math.floor(totalJapas / 108);
  const targetRounds = localStorage.getItem('spiritual_target_rounds') || 4;
  const isActive = totalRounds >= targetRounds;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-effect" style={{textAlign: 'center'}}>
        <X size={24} color="#64748b" style={{ position: 'absolute', top: 24, right: 24, cursor: 'pointer' }} onClick={onClose} />
        <div style={{ width: 80, height: 80, borderRadius:'50%', background:'linear-gradient(135deg, #a855f7, #ec4899)', margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}>
          <User size={40} />
        </div>
        <h2 style={{ fontSize: '1.8rem', color: '#4c1d95', marginBottom: 8, fontWeight: 800, textTransform: 'capitalize' }}>{displayName}</h2>
        <p style={{ color: '#64748b', marginBottom: 24, fontWeight: 'bold' }}>{savedUser.email}</p>
        <div style={{background: 'rgba(147, 51, 234, 0.1)', padding: 16, borderRadius: 16, marginBottom: 24}}>
          <h4 style={{color: '#db2777', marginBottom: 8}}>Spiritual Progress</h4>
          
          {isActive ? (
             <div style={{display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fdf4ff', padding: '6px 12px', borderRadius: 20, color: '#c026d3', fontWeight: 800, fontSize: '0.9rem', marginBottom: 16}}>
                ⭐ Active
             </div>
          ) : (
             <p style={{color: '#4c1d95', fontWeight: 'bold'}}>In-Progress</p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 12 }}>
             <div>
                <p style={{fontSize: '1.4rem', fontWeight: 800, color: '#ec4899'}}>{totalJapas}</p>
                <p style={{fontSize: '0.75rem', color: '#1e293b'}}>Total Chants</p>
             </div>
             <div>
                <p style={{fontSize: '1.4rem', fontWeight: 800, color: '#ec4899'}}>{totalRounds}</p>
                <p style={{fontSize: '0.75rem', color: '#1e293b'}}>Rounds Completed</p>
             </div>
          </div>
        </div>
        {savedUser.email === 'dhanujakse@gmail.com' && (
           <Link to="/admin" onClick={onClose} style={{ display: 'block', width: '100%', padding: '12px', background: 'rgba(219, 39, 119, 0.1)', color: '#db2777', fontWeight: 800, borderRadius: '99px', textDecoration: 'none', marginBottom: '12px' }}>🔒 Dashboard Admin Center</Link>
        )}
        <button className="btn-primary" style={{ width: '100%', background: '#1e293b', boxShadow: 'none' }} onClick={() => { localStorage.removeItem('spiritual_user'); onLogout(); }}>Log Out</button>
      </div>
    </div>
  );
};

// Removed SettingsModal since env vars handle the key securely.

// --- LLM Sub-component rendering on the actual Dashboard Cards! ---
const DynamicSummaryBadge = ({ video }) => {
  if (!video.llmEnglish || video.llmEnglish.includes("Processing")) return null;
  return (
    <div style={{ marginTop: 12, padding: 12, background: 'rgba(147, 51, 234, 0.05)', borderRadius: 12, borderLeft: '4px solid #9333ea' }}>
      <h4 style={{ fontSize: '1rem', color: '#4c1d95', fontWeight: 800, marginBottom: 12 }}>📖 AI Description</h4>
      <div style={{ fontSize: '0.9rem', color: '#1e293b', marginBottom: 24, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}><strong>EN:</strong><br/><br/>{video.llmEnglish}</div>
      <div style={{ fontSize: '0.9rem', color: '#1e293b', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}><strong>TA:</strong><br/><br/>{video.llmTamil}</div>
    </div>
  );
};

// --- Views ---
const MainDashboard = ({ videos, isLoggedIn, setIsLoggedIn, showLogin, setShowLogin, japaCount, setJapaCount, targetRounds, setTargetRounds, activeCategory, setActiveCategory, searchOpen, setSearchOpen, searchQuery, openRouterKey }) => {
  const navigate = useNavigate();
  const [todayQuote, setTodayQuote] = useState({ text: "Loading quote...", source: "Vedabase", explanation: "" });
  const [showProfile, setShowProfile] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/quote/daily").then(r => r.json()).then(q => setTodayQuote(q)).catch(e => console.log(e));
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const currentRounds = Math.floor(japaCount / 108);
    if (currentRounds < targetRounds) {
      const showReminder = () => {
         // Respect the >3 hour inactive lag constraint completely
         const lastUpdate = localStorage.getItem('last_japa_update') || 0;
         const hoursSinceUpdate = (Date.now() - lastUpdate) / (1000 * 60 * 60);
         
         if (hoursSinceUpdate < 3) return; // Do nothing if they updated within the last 3 hours

         const randomQuote = getRandomQuote();
         const msg = `You have completed ${currentRounds}/${targetRounds} rounds today. "${randomQuote}" - Srila Prabhupada`;
         
         if ("Notification" in window && Notification.permission === "granted" && document.visibilityState !== "visible") {
             new Notification("Chanting Reminder", { body: msg, icon: "/vite.svg" });
         } else {
             setToast({ title: "Chanting Reminder", message: msg });
             setTimeout(() => setToast(null), 10000); 
         }
      };

      // Set the interval logic checking frequently in background, firing only when the 3hr lock wears off.
      const timeout = setTimeout(showReminder, 3500);
      const interval = setInterval(showReminder, 5 * 60 * 1000); // Check every 5 minutes

      return () => { clearTimeout(timeout); clearInterval(interval); };
    }
  }, [japaCount, targetRounds, isLoggedIn]);

  const CATEGORIES = ["Scripture", "Glorification", "Story", "Chanting", "Kirtan", "QnA"];

  // Explicit separation for Kirtan
  let displayVideos = videos.filter(v => isRecent(v));
  let kirtanVideos = videos.filter(v => v.category === "Kirtan");

  if (activeCategory !== "All") displayVideos = videos.filter(v => v.category === activeCategory);
  if (searchQuery) displayVideos = displayVideos.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.category.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleKirtanNav = () => {
    setActiveCategory("Kirtan");
    document.getElementById('videos-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="dashboard-container">
      {/* Toast Notification */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: 'linear-gradient(135deg, #4c1d95, #db2777)', color: 'white', padding: '16px 20px', borderRadius: 16, boxShadow: '0 10px 25px rgba(219,39,119,0.3)', zIndex: 9999, maxWidth: 350, animation: 'fadeIn 0.4s ease' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, display: 'flex', gap: 6, alignItems: 'center' }}><Bell size={18} /> {toast.title}</h4>
              <button style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: 0 }} onClick={() => setToast(null)}><X size={16} /></button>
           </div>
           <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.4', opacity: 0.95 }}>{toast.message}</p>
        </div>
      )}

      {/* Absolute Header Icons */}
      <div className="header-icons-box">
        <button className="icon-btn" onClick={() => navigate('/')} data-tooltip="Home"><Home size={22} color="#fff" /></button>
        <button className="icon-btn" onClick={() => { setSearchOpen(!searchOpen); setActiveCategory("All"); }} data-tooltip="Search"><Search size={22} color="#fff" /></button>
        <button className="icon-btn" onClick={() => navigate('/events')} data-tooltip="Live Events"><MapPin size={22} color="#fff" /></button>
        <button className="icon-btn" onClick={handleKirtanNav} data-tooltip="Kirtans"><Headphones size={22} color="#fff" /></button>
        <button className="icon-btn" data-tooltip="Notifications" onClick={() => {
           if ("Notification" in window) {
              Notification.requestPermission().then(p => {
                 if(p === 'granted') alert("Native Chanting Reminders Enabled! We'll notify you even when the tab is closed.");
              });
           } else {
              alert("Your browser does not support native notifications.");
           }
        }} title="Enable Native Reminders"><Bell size={22} color="#fff" /></button>
        <button className="icon-btn" onClick={() => isLoggedIn ? setShowProfile(true) : setShowLogin(true)} title="Profile">
          <User size={22} color={isLoggedIn ? "#f472b6" : "#fff"} />
        </button>
        {isLoggedIn && (
          <span style={{ color: 'white', marginLeft: 8, fontSize: '0.85rem', fontWeight: 'bold', display: 'none' }} className="profile-label">Profile</span>
        )}
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <img src="/new_hero.jpg" className="hero-bg-image" alt="Krishna Balaram" />
        <TiltCard className="hero-content">
          <h1 className="hero-title">Find Peace.<br />Stay Focused.<br /><span className="text-gradient">Grow Daily.</span></h1>
          <p className="hero-subtitle">Personalized spiritual content for youth to enrich daily life.</p>
          
          {searchOpen ? (
            <input autoFocus type="text" placeholder="Type here to instantly search videos..." value={searchQuery} onChange={e => {
              const event = new CustomEvent('DO_SEARCH', { detail: e.target.value });
              window.dispatchEvent(event);
            }} className="search-bar-hero" />
          ) : (
            <Link to="/explore">
              <button className="btn-primary" style={{ marginRight: 16 }}>Explore All Videos</button>
            </Link>
          )}
        </TiltCard>
      </div>

      <div className="app-content-wrapper" id="videos-section">

        <div className="section-header">
          <h2 className="section-title">Recommended For You</h2>
          <div className="section-filters">
            {CATEGORIES.map(c => <span key={c} className={activeCategory === c ? 'active' : ''} onClick={() => setActiveCategory(c)}>{c}</span>)}
            <div className="see-all-btn" onClick={() => setActiveCategory("All")}>See All &rsaquo;</div>
          </div>
        </div>

        {/* Video Loader / Grid */}
        <div className="video-grid">
          {displayVideos.map(video => (
            <TiltCard key={video.id} className="video-card" onClick={() => navigate(`/play/${video.id}`)}>
              <div className="thumbnail-box" style={{ transform: 'translateZ(15px)' }}>
                <img src={video.thumbnail} alt={video.title} onError={(e) => { e.target.src = '/youth_chanting.png' }} />
                <div className="vid-meta-overlay">
                  <span className="vid-badge" style={{ background: 'rgba(147, 51, 234, 0.8)' }}>{video.time}</span>
                </div>
              </div>
              <div className="vid-details" style={{ transform: 'translateZ(30px)' }}>
                <h4 className="vid-title">{video.title}</h4>
                <p style={{fontSize: '0.75rem', color: '#94a3b8', marginTop: 8, fontStyle: 'italic'}}>(Click video for detailed AI Description)</p>
              </div>
            </TiltCard>
          ))}
          {displayVideos.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.6)', padding: '50px 20px', borderRadius: 16 }}>
               <h3 style={{color: '#db2777', fontSize: '1.5rem', marginBottom: 10}}>No fresh videos here!</h3>
               <p style={{color: '#4c1d95', fontSize: '1.1rem', fontWeight: 'bold'}}>We haven't posted any new <b>{activeCategory !== "All" ? activeCategory : ""}</b> videos in the last 10 days.</p>
               <p style={{color: '#64748b', fontSize: '0.95rem', marginTop: 6}}>Don't worry, the historical archive still has everything!</p>
               <button className="btn-primary" style={{marginTop: 20}} onClick={() => navigate(`/explore?cat=${activeCategory}`)}>
                  Unlock Full Archive in Explore &rsaquo;
               </button>
            </div>
          )}
        </div>

        {kirtanVideos.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2 className="section-title" style={{ color: '#db2777', marginBottom: 16 }}>Kirtan & Sankirtan Series</h2>
            <div className="video-grid" style={{ marginBottom: 40 }}>
              {kirtanVideos.slice(0, 4).map(video => (
                <TiltCard key={video.id} className="video-card" onClick={() => navigate(`/play/${video.id}`)}>
                  <div className="thumbnail-box" style={{ transform: 'translateZ(15px)' }}><img src={video.thumbnail} alt={video.title} /></div>
                  <div className="vid-details" style={{ transform: 'translateZ(25px)' }}>
                    <h4 className="vid-title">{video.title}</h4>
                    <p style={{fontSize: '0.75rem', color: '#94a3b8', marginTop: 8, fontStyle: 'italic'}}>(Click to view Details)</p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        )}

        {/* Floating Categories Bar */}
        <div className="big-category-bar glass-effect">
          <button className="transparent-btn" onClick={() => setActiveCategory("Scripture")}>Scripture</button> |
          <button className="transparent-btn" onClick={() => setActiveCategory("Glorification")}>Glorification</button> |
          <button className="transparent-btn" onClick={handleKirtanNav}>Kirtan</button> |
          <button className="transparent-btn" onClick={() => setActiveCategory("QnA")}>Q&A</button> |
          <button className="transparent-btn" onClick={() => setActiveCategory("Story")}>Story</button>
        </div>

        {/* Kirtan Section */}
        <div className="kirtan-section">
          <div className="section-header">
             <h2 className="section-title">Kirtan & Chanting</h2>
          </div>
          <div className="kirtan-banner-box">
            <div className="mantra-circle-container">
               <div className="mantra-circle-spin"></div>
               <div className="mantra-circle-spin-inner"></div>
               <div className="mantra-content">
                 <h3>
                   Hare Krishna Hare Krishna<br/>
                   Krishna Krishna Hare Hare<br/>
                   Hare Rama Hare Rama<br/>
                   Rama Rama Hare Hare
                 </h3>
                 <p>Chant & Be Happy</p>
               </div>
            </div>

            <div className="japa-floating-card glass-effect">
              <div className="japa-header">
                <div className="japa-icon" style={{background: 'linear-gradient(135deg, #a855f7, #ec4899)', boxShadow: '0 4px 10px rgba(236,72,153,0.3)', color: 'white', fontWeight: 'bold', fontSize: '1.4rem'}}>0</div>
                Naam Japa Counter
              </div>
              <p style={{ fontSize: '0.75rem', color: '#4c1d95', fontWeight: 'bold', textAlign: 'center', width: '100%', marginBottom: '8px', marginTop: '4px' }}>108 chants = 1 round</p>

              <div className="japa-main-display" style={{ padding: '12px 0px' }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #db2777, #9333ea)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', boxShadow: '0 8px 15px rgba(236,72,153,0.4)', flexShrink: 0 }}>R{Math.floor(japaCount / 108)}</div>
                <span className="japa-num" style={{ textShadow: '0 10px 20px rgba(236,72,153,0.4)', flex: 1, textAlign: 'center' }}>{isLoggedIn ? japaCount : '--'}</span>
                <button className="japa-plus" style={{flexShrink: 0}} onClick={() => {
                   if(isLoggedIn) {
                      setJapaCount(prev => prev + 1);
                      localStorage.setItem('last_japa_update', Date.now());
                   } else setShowLogin(true);
                }}>+</button>
              </div>

              {isLoggedIn && (
                <div style={{ marginTop: 12, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.4)', padding: '6px 12px', borderRadius: 12 }}>
                  <span style={{fontSize: '0.85rem', fontWeight: 'bold', color: '#4c1d95'}}>Daily Goal (Rounds):</span>
                  <select style={{ padding: '4px 8px', borderRadius: 8, border: '1px solid #d8b4fe', outline: 'none', background: 'white', color: '#1e293b', fontWeight: 'bold', cursor: 'pointer' }} value={targetRounds} onChange={(e) => setTargetRounds(Number(e.target.value))}>
                     {[...Array(16)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', width: '100%', flexDirection: 'column' }}>
                <button className="japa-btn" style={{background: '#db2777', marginBottom: 4}} onClick={() => {
                   if (isLoggedIn) {
                      const beads = window.prompt("How many physical bead rounds did you finish?");
                      if (beads && !isNaN(beads)) {
                         setJapaCount(prev => prev + (Number(beads) * 108));
                         localStorage.setItem('last_japa_update', Date.now());
                      }
                   } else setShowLogin(true);
                }}>Add Logged Physical Rounds</button>
                <button className="japa-btn" onClick={() => isLoggedIn ? setJapaCount(0) : setShowLogin(true)}>
                  {isLoggedIn ? 'Reset Today' : 'Login to Count'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Wisdom Section */}
        <div style={{ marginTop: '24px' }}>
          <div className="section-header" style={{ justifyContent: 'flex-start', gap: 16 }}>
            <h2 className="section-title">Daily Wisdom</h2>
            <span style={{ background: 'rgba(255,255,255,0.6)', padding: '4px 12px', borderRadius: 99, fontSize: '0.8rem', fontWeight: 'bold', color: '#ec4899' }}>Dynamic Daily Quote &rsaquo;</span>
          </div>

          <TiltCard className="glass-effect wisdom-card" style={{ position: 'relative', overflow: 'hidden' }}>
            {!isLoggedIn && (
              <div className="wisdom-lock-overlay" style={{ transform: 'translateZ(20px)' }}>
                <Lock size={32} color="#64748b" style={{ marginBottom: 8 }} />
                <button className="btn-primary" onClick={() => setShowLogin(true)}>Login to Uncover Wisdom</button>
              </div>
            )}
            <div style={{ filter: !isLoggedIn ? 'blur(6px)' : 'none', opacity: !isLoggedIn ? 0.6 : 1, transition: '0.3s', userSelect: !isLoggedIn ? 'none' : 'auto' }}>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px', fontWeight: 'bold', transform: 'translateZ(10px)' }}>Source: {todayQuote.source || "Bhagavad Gita"}</p>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, fontStyle: 'italic', color: '#4c1d95', marginBottom: '16px', transform: 'translateZ(30px)' }}>"{todayQuote.text}"</h3>
                <p style={{ fontSize: '1rem', color: '#334155', transform: 'translateZ(20px)' }}><strong>Meaning & Explanation:</strong> {todayQuote.explanation}</p>
            </div>
          </TiltCard>
        </div>
        {showProfile && <ProfileModal onClose={() => setShowProfile(false)} onLogout={() => { setIsLoggedIn(false); setShowProfile(false); }} />}
      </div>
    </div>
  );
};

// 2. Explore Page (Pagination with DB)
const ExplorePage = ({ openRouterKey }) => {
  const navigate = useNavigate();
  const [allVideos, setAllVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const initialCat = urlParams.get('cat') || "All";
  const [activeCategory, setActiveCategory] = useState(initialCat);

  const fetchPage = async (p) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/videos?page=${p}&limit=100`);
      const data = await res.json();
      const mapped = data.data.map(v => ({
        id: v.videoId,
        title: v.title,
        description: v.description,
        thumbnail: v.thumbnail,
        category: categorizeVideo(v.title),
        publishedAt: v.publishedAt,
        llmEnglish: v.llmEnglish,
        llmTamil: v.llmTamil,
        time: new Date(v.publishedAt).toLocaleDateString()
      }));
      setAllVideos(prev => p === 1 ? mapped : [...prev, ...mapped]);
      setTotalPages(data.totalPages);
      setPage(p);
    } catch (e) { console.error("Explore fetch error"); }
    setLoading(false);
  };

  useEffect(() => { fetchPage(1); }, []);

  let displayExploreVideos = activeCategory === "All"
    ? allVideos
    : allVideos.filter(v => v.category === activeCategory);

  return (
    <div className="dashboard-container">
      <div className="header-icons-box">
        <button className="icon-btn" onClick={() => navigate('/')} title="Home"><Home size={22} color="#fff" /></button>
      </div>
      <div className="hero-section" style={{ height: '35vh', minHeight: '300px' }}>
        <div className="hero-content" style={{ maxWidth: 700 }}>
          <h1 className="hero-title" style={{ fontSize: '3rem' }}>Explore Library</h1>
          <p className="hero-subtitle" style={{ fontStyle: 'italic', fontSize: '1.1rem', lineHeight: '1.6' }}>"In this world, there is nothing so sublime and pure as transcendental knowledge. Such knowledge is the mature fruit of all mysticism."<br/><span style={{fontWeight: 'bold', fontStyle: 'normal', color: '#db2777'}}>- Bhagavad Gita 4.38</span></p>
        </div>
      </div>

      <div className="section-filters" style={{ display: 'flex', justifyContent: 'center', margin: '30px 0', gap: 12, flexWrap: 'wrap' }}>
        {["All", ...CATEGORIES].map(c =>
          <span key={c} className={activeCategory === c ? 'active' : ''} onClick={() => setActiveCategory(c)} style={{ cursor: 'pointer', padding: '8px 16px', background: activeCategory === c ? '#db2777' : 'rgba(255,255,255,0.7)', color: activeCategory === c ? 'white' : '#4c1d95', borderRadius: '20px', fontWeight: 'bold' }}>{c}</span>
        )}
      </div>

      <div className="app-content-wrapper">
        <div className="video-grid">
          {displayExploreVideos.map(video => (
            <TiltCard key={video.id || video.videoId} className="video-card" onClick={() => navigate(`/play/${video.id || video.videoId}`)}>
              <div className="thumbnail-box" style={{ transform: 'translateZ(10px)' }}>
                <img src={video.thumbnail} alt={video.title} onError={(e) => { e.target.src = '/youth_chanting.png' }} />
                <div className="vid-meta-overlay" style={{ display: 'flex', gap: '6px' }}>
                  <span className="vid-badge" style={{ background: 'rgba(219, 39, 119, 0.9)' }}>{video.category}</span>
                  <span className="vid-badge" style={{ background: 'rgba(147, 51, 234, 0.8)' }}>{new Date(video.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="vid-details" style={{ transform: 'translateZ(20px)' }}>
                <h4 className="vid-title">{video.title}</h4>
                <p style={{fontSize: '0.75rem', color: '#94a3b8', marginTop: 8, fontStyle: 'italic'}}>(Click video for detailed AI Description)</p>
              </div>
            </TiltCard>
          ))}
        </div>

        {page < totalPages && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
            <button className="btn-primary" onClick={() => fetchPage(page + 1)}>
              {loading ? "Loading..." : "Load More Videos (" + (totalPages - page) + " pages left)"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Video Player Detail with Chatbot LLM
const VideoPlayer = ({ videos, openRouterKey }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const video = videos.find(v => v.id === id) || videos[0];

  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { text: `Hare Krishna! Ask me any deep questions specifically analyzing the title and description of this video!`, sender: 'bot' }
  ]);
  const [botTyping, setBotTyping] = useState(false);

  const handleSend = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setMessages(prev => [...prev, { text: msg, sender: 'user' }]);
    setChatInput("");
    setBotTyping(true);

    if (!openRouterKey) {
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "The LLM is inactive without your API Key. Please insert it in Settings! Manually contact: 9677914980", sender: 'bot' }]);
        setBotTyping(false);
      }, 800);
      return;
    }

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${openRouterKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are an ISKCON AI Spiritual Guide acting like an advanced student of Srila Prabhupada. The user is watching a Tamil video. You must rely purely on the Video's translated AI EN/TA descriptions provided below to understand the exact context! Use your vast scriptural knowledge of the Vedabase to answer their questions based ONLY on what the video description logically entails. If the question is outside that bound, politely state 'For more guidance, contact: XXXXXXXX'." },
            { role: "user", content: `[Context: The video Title is '${video.title}'. English summary: '${video.llmEnglish}', Tamil summary: '${video.llmTamil}']. User's question to you: ${msg}` }
          ]
        })
      });
      const d = await res.json();
      setMessages(prev => [...prev, { text: d.choices[0].message.content, sender: 'bot' }]);
    } catch (e) {
      setMessages(prev => [...prev, { text: "Network execution failed or model was overloaded. For manual guidance, contact: XXXXXXXX", sender: 'bot' }]);
    }
    setBotTyping(false);
  };

  return (
    <div className="player-layout">
      <button className="back-btn" onClick={() => navigate('/')}>&lsaquo; Back</button>
      <div className="player-grid">

        <div className="video-main-column">
          <div className="video-player-container">
            <iframe src={`https://www.youtube.com/embed/${video.id}?autoplay=1`} title={video.title} frameBorder="0" allowFullScreen></iframe>
          </div>
          <div className="video-info-card glass-effect">
            <h2 className="section-title" style={{ fontSize: '1.6rem', marginBottom: 12 }}>{video.title}</h2>
            <div className="tags-row">
              <span className="vid-badge primary">{video.category}</span>
            </div>
            {/* Re-using the Dynamic Summary Badge here natively! */}
            <p className="ai-summary">This video contains vital instructions derived directly from {video.category}. Expand your knowledge by leveraging the AI tool below.</p>
            <DynamicSummaryBadge video={video} openRouterKey={openRouterKey} />
          </div>
        </div>

        <div className="chatbot-column glass-effect">
          <div className="chat-header">
            <div className="chat-avatar"><Heart size={22} /></div>
            <div className="chat-title-info">
              <h3>AI Spiritual Guide</h3>
              <p>Discussing context: {video.title.substring(0, 25)}...</p>
            </div>
          </div>
          <div className="chat-window">
            {messages.map((m, i) => <div key={i} className={`chat-line chat-${m.sender}`}>{m.text}</div>)}
            {botTyping && <div className="chat-line chat-bot"><Loader className="spin" size={16} /> Thinking...</div>}
          </div>
          <div className="chat-input-bar">
            <input type="text" placeholder="Ask LLM about this video..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
            <button onClick={handleSend}><Send size={18} /></button>
          </div>
        </div>

      </div>
    </div>
  );
};

// 3. Root App & State Management
const AdminPage = () => {
   const navigate = useNavigate();
   
   // Hard gate to block standard users who try manually typing the URL
   const savedUser = JSON.parse(localStorage.getItem('spiritual_user')) || {};
   useEffect(() => {
       if (savedUser.email !== 'dhanujakse@gmail.com') navigate('/');
   }, []);

   const [password, setPassword] = useState('');
   const [isAuth, setIsAuth] = useState(false);
   const [todayQuote, setTodayQuote] = useState({ text: "", source: "Vedabase", explanation: "" });
   
   // Event Form State
   const [newEvent, setNewEvent] = useState({ title: "", picture: "", mapUrl: "", streetName: "", startTime: "", endTime: "" });

   const handleLogin = (e) => {
      e.preventDefault();
      // Admin credential check
      if (password === 'admin123') setIsAuth(true);
      else alert("Invalid credentials - Access Denied");
   };

   if (!isAuth) {
      return (
         <div className="dashboard-container" style={{display:'flex', alignItems:'center', justifyContent:'center', minHeight: '100vh'}}>
           <div className="glass-effect" style={{padding: 40, borderRadius: 20, textAlign: 'center', maxWidth: 400, width: '100%'}}>
             <h2 style={{color: '#4c1d95', marginBottom: 12}}>Admin Gateway</h2>
             <p style={{color: '#64748b', fontSize: '0.85rem', marginBottom: 20}}>Requires exclusive authorization.</p>
             <form onSubmit={handleLogin}>
                <input type="password" placeholder="Enter specific admin keyword" value={password} onChange={e=>setPassword(e.target.value)} className="auth-input" />
                <button type="submit" className="btn-primary" style={{marginTop: 10, width:'100%'}}>Authenticate</button>
             </form>
           </div>
         </div>
      );
   }

   return (
      <div className="dashboard-container" style={{padding: 40, minHeight: '100vh'}}>
         <button className="btn-primary" onClick={() => navigate('/')} style={{ background: 'transparent', border: '1px solid #db2777', color: '#db2777', padding: '8px 16px', boxShadow: 'none' }}>&larr; Return to Application</button>
         
         <h2 style={{marginTop: 40, color: '#4c1d95', fontSize: '2rem'}}>Dashboard Control Center</h2>
         
         <div style={{display: 'flex', flexWrap: 'wrap', gap: 32}}>
             <div className="glass-effect" style={{padding: 32, marginTop: 24, borderRadius: 24, flex: 1, minWidth: 400}}>
                 <h4 style={{ fontSize: '1.2rem', color: '#db2777', marginBottom: 16 }}>Broadcast New Daily Wisdom</h4>
                 <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: 8}}>Verse / Quote Text</p>
                 <input type="text" placeholder="New quote text" className="auth-input" style={{ marginBottom: 16 }} onChange={(e) => setTodayQuote({ ...todayQuote, text: e.target.value })} />
                 <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: 8}}>Literature Source</p>
                 <input type="text" placeholder="e.g. Bhagavad Gita 4.34" className="auth-input" style={{ marginBottom: 16 }} onChange={(e) => setTodayQuote({ ...todayQuote, source: e.target.value })} />
                 <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: 8}}>Meaning / Explanation</p>
                 <textarea placeholder="Provide an explanation for the youth..." className="auth-input" style={{ marginBottom: 16, minHeight: 100, resize: 'vertical' }} onChange={(e) => setTodayQuote({ ...todayQuote, explanation: e.target.value })} />
                 <button className="btn-primary" style={{ marginTop: 12, width: '100%' }} onClick={() => {
                   if(!todayQuote.text) return alert("Quote cannot be empty.");
                   fetch("http://localhost:5000/api/quote/daily", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(todayQuote) })
                     .then(() => alert("Daily wisdom successfully updated globally! All devices will reflect this change."));
                 }}>Push Update to All Users</button>
             </div>

             <div className="glass-effect" style={{padding: 32, marginTop: 24, borderRadius: 24, flex: 1, minWidth: 400}}>
                 <h4 style={{ fontSize: '1.2rem', color: '#9333ea', marginBottom: 16 }}>Schedule a Local Event</h4>
                 <input type="text" placeholder="Event Name (eg. Nagar Sankirtan)" className="auth-input" style={{ marginBottom: 12 }} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
                 <input type="text" placeholder="Image URL (Thumbnail)" className="auth-input" style={{ marginBottom: 12 }} onChange={(e) => setNewEvent({ ...newEvent, picture: e.target.value })} />
                 <input type="text" placeholder="Street/Location Name" className="auth-input" style={{ marginBottom: 12 }} onChange={(e) => setNewEvent({ ...newEvent, streetName: e.target.value })} />
                 <input type="text" placeholder="Google Maps Embed (<iframe src=...> Src URL only)" className="auth-input" style={{ marginBottom: 12 }} onChange={(e) => setNewEvent({ ...newEvent, mapUrl: e.target.value })} />
                 
                 <div style={{display: 'flex', gap: 12}}>
                    <div style={{flex: 1}}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: 8}}>Start Time</p>
                        <input type="datetime-local" className="auth-input" style={{ marginBottom: 12 }} onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })} />
                    </div>
                    <div style={{flex: 1}}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b', marginBottom: 8}}>End Time</p>
                        <input type="datetime-local" className="auth-input" style={{ marginBottom: 12 }} onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })} />
                    </div>
                 </div>

                 <button className="btn-primary" style={{ background: '#9333ea', marginTop: 12, width: '100%' }} onClick={() => {
                   if(!newEvent.title || !newEvent.startTime) return alert("Title and Start Time required.");
                   fetch("http://localhost:5000/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newEvent) })
                     .then(() => alert("Event scheduled securely to database."));
                 }}>Publish Event Instantly</button>
             </div>
         </div>
      </div>
   );
};

const EventsPage = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [comments, setComments] = useState({});
    const [commentInputs, setCommentInputs] = useState({});
    
    // Quick user derive
    const getUserDisplay = () => {
       const u = JSON.parse(localStorage.getItem('spiritual_user'));
       if(!u) return null;
       if(u.name && u.name !== 'Devotee') return u.name;
       if(u.email) return u.email.split('@')[0];
       return 'Devotee';
    };

    useEffect(() => {
       fetch("http://localhost:5000/api/events").then(r=>r.json()).then(data => {
          setEvents(data);
          data.forEach(e => {
             fetch(`http://localhost:5000/api/events/${e.id}/comments`).then(r=>r.json()).then(c => {
                setComments(prev => ({...prev, [e.id]: c}));
             });
          });
       }).catch(e => console.error("Event fetch fail:", e));
    }, []);
 
    const postComment = (eventId) => {
        const uName = getUserDisplay();
        if(!uName) return alert("Please establish a user profile first (Log In or sign up!).");
        const text = commentInputs[eventId];
        if(!text) return;

        fetch(`http://localhost:5000/api/events/${eventId}/comments`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: uName, text })
        }).then(()=> {
            setCommentInputs(prev => ({...prev, [eventId]: ""}));
            fetch(`http://localhost:5000/api/events/${eventId}/comments`).then(r=>r.json()).then(c => {
                setComments(prev => ({...prev, [eventId]: c}));
             });
        });
    };
 
    return (
        <div className="dashboard-container">
            <div className="header-icons-box">
               <button className="icon-btn" onClick={() => navigate('/')}><Home size={22} color="#fff" /></button>
            </div>
            <div className="hero-section" style={{ height: '35vh', minHeight: '300px' }}>
              <div className="hero-content">
                <h1 className="hero-title" style={{fontSize: '3.5rem'}}>Spiritual Events</h1>
                <p className="hero-subtitle">Join together locally for Kirtans, House Programs, and uplifting Nagar Sankirtans.</p>
              </div>
            </div>
            <div className="app-content-wrapper" style={{maxWidth: 1000}}>
                <div style={{display: 'flex', flexDirection: 'column', gap: 40}}>
                   {events.length === 0 && <div className="glass-effect" style={{padding:40, textAlign:'center', borderRadius:20}}><h3 style={{color: '#64748b'}}>No upcoming events scheduled yet...</h3></div>}
                   {events.map(ev => {
                       const isCompleted = new Date(ev.endTime) < new Date();
                       return (
                          <div key={ev.id} className="glass-effect" style={{padding: 32, borderRadius: 32, display: 'flex', flexWrap: 'wrap', gap: 32}}>
                              {ev.picture && <img src={ev.picture} style={{width: '100%', maxWidth: 400, height: 280, objectFit: 'cover', borderRadius: 20, boxShadow: '0 10px 20px rgba(0,0,0,0.1)'}} alt="Event" />}
                              <div style={{flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column'}}>
                                 <h3 style={{fontSize: '2rem', color: '#4c1d95', marginBottom: 12, fontWeight: 800, letterSpacing: '-1px'}}>{ev.title}</h3>
                                 <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fdf4ff', padding: '8px 16px', borderRadius: 99, color: '#db2777', fontWeight: 800, fontSize: '0.95rem', marginBottom: 16, width: 'fit-content'}}>
                                    <MapPin size={18} /> {ev.streetName || "Location TBA"}
                                 </div>
                                 <p style={{color: '#64748b', marginBottom: 20, fontWeight: 'bold'}}>{new Date(ev.startTime).toLocaleString()} — {new Date(ev.endTime).toLocaleTimeString()}</p>
                                 
                                 {ev.mapUrl && <iframe src={ev.mapUrl} width="100%" height="220" style={{border:0, borderRadius: 16, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))'}} allowFullScreen="" loading="lazy"></iframe>}
                                 
                                 {isCompleted && (
                                    <div style={{marginTop: 32, borderTop: '2px dashed rgba(147, 51, 234, 0.2)', paddingTop: 24}}>
                                       <h4 style={{color: '#4c1d95', marginBottom: 16, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 8}}><MessageCircle size={20} color="#db2777" /> Community Experiences ({comments[ev.id]?.length || 0})</h4>
                                       <div style={{marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300, overflowY: 'auto'}}>
                                          {(comments[ev.id] || []).map(c => (
                                              <div key={c.id} style={{background: 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.6))', padding: '16px', borderRadius: 16, borderLeft: '4px solid #db2777', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
                                                 <strong style={{color: '#9333ea', fontSize: '0.9rem', display: 'block', marginBottom: 4}}>{c.user}</strong>
                                                 <p style={{fontSize: '1rem', color: '#334155'}}>{c.text}</p>
                                              </div>
                                          ))}
                                          {(comments[ev.id]?.length === 0) && <p style={{color: '#94a3b8', fontStyle: 'italic'}}>Be the first to share your post-event realizations!</p>}
                                       </div>
                                       <div style={{display:'flex', gap: 12}}>
                                         <input type="text" placeholder="Share your experience..." className="auth-input" style={{marginBottom: 0, flex: 1}} value={commentInputs[ev.id] || ""} onChange={e=>setCommentInputs({...commentInputs, [ev.id]: e.target.value})} onKeyDown={e=> e.key === 'Enter' && postComment(ev.id)} />
                                         <button className="btn-primary" onClick={()=>postComment(ev.id)}><Send size={18} /></button>
                                       </div>
                                    </div>
                                 )}
                              </div>
                          </div>
                       )
                   })}
                </div>
            </div>
        </div>
    )
 }

// 4. Root App & State Management
export default function App() {
  const [videos, setVideos] = useState(FALLBACK_VIDEOS);

  // Initialize login state natively from local storage!
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('spiritual_user') !== null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const openRouterKey = import.meta.env.VITE_OPENROUTER_KEY || "";
  
  const [japaCount, setJapaCount] = useState(() => {
    const savedDate = localStorage.getItem('spiritual_japa_date');
    const todayDate = new Date().toDateString();
    
    // Automatically reset Japa Count for a new day if date has changed
    if (savedDate !== todayDate) {
       localStorage.setItem('spiritual_japa_date', todayDate);
       return 0;
    }
    
    const saved = localStorage.getItem('spiritual_japa');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [targetRounds, setTargetRounds] = useState(() => {
    const saved = localStorage.getItem('spiritual_target_rounds');
    return saved !== null ? parseInt(saved, 10) : 4;
  });

  // Effect to persist japaCount
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('spiritual_japa', japaCount);
      localStorage.setItem('spiritual_target_rounds', targetRounds);
    }
  }, [japaCount, targetRounds, isLoggedIn]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Run silent fetch in background to upgrade state if network allows!
    fetchVamsidhariVideosSafely()
      .then(data => {
        setVideos(data); // Replaces offline state with Live data if it clears network checks!
      })
      .catch(err => {
        console.warn("Proxy chains failed - relied on solid 16-video offline fallback array.");
      });
  }, []);

  useEffect(() => {
    const handleGlobalSearchHook = (e) => setSearchQuery(e.detail);
    window.addEventListener('DO_SEARCH', handleGlobalSearchHook);
    return () => window.removeEventListener('DO_SEARCH', handleGlobalSearchHook);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <MainDashboard
            videos={videos}
            isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}
            showLogin={showAuthModal} setShowLogin={setShowAuthModal}
            japaCount={japaCount} setJapaCount={setJapaCount}
            targetRounds={targetRounds} setTargetRounds={setTargetRounds}
            activeCategory={activeCategory} setActiveCategory={setActiveCategory}
            searchOpen={searchOpen} setSearchOpen={setSearchOpen}
            searchQuery={searchQuery}
            openRouterKey={openRouterKey}
          />
        } />
        <Route path="/explore" element={<ExplorePage openRouterKey={openRouterKey} />} />
        <Route path="/play/:id" element={<VideoPlayer videos={videos} openRouterKey={openRouterKey} />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/events" element={<EventsPage />} />
      </Routes>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={(status) => { setIsLoggedIn(status); setShowAuthModal(false); }} />}
    </Router>
  );
}
