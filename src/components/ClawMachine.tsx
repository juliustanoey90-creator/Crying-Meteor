import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect, useRef } from "react";
import { Character } from "../types";
import ClawGame from "./ClawGame";
import CollectionRoom from "./CollectionRoom";
import SupportHatch from "./SupportHatch";
import CollectibleCard from "./CollectibleCard";
import { CHARACTERS, COLLECTION_SETS } from "../data/characters";
import { 
  playCoinSound, 
  startAmbientBg, 
  stopAmbientBg, 
  isAmbientHumRunning, 
  playPixelClick,
  playLightFlickerSound
} from "../utils/audio";
import { 
  Sparkles, 
  Heart, 
  Globe, 
  Radio, 
  Tv, 
  User, 
  MessageSquare,
  Gift,
  Flame,
  HelpCircle,
  Wrench
} from "lucide-react";

// Emotional retrospective statuses representing quiet forgotten mall vibes
const SHY_MOODS: Record<string, string> = {
  "pocong-lovi": "Lovi spent the evening hopping on the bubble wrap behind the cabinet. She feels 12% softer.",
  "tuyul-tommy": "Tommy is busy polishing a shiny 100-rupiah coin from 1991. He says it holds a song.",
  "kuyang-hana": "Hana's mind has floated entirely out of the window. Her body is currently waiting patiently.",
  "kunti-lily": "Lily is practicing laughing at a lower octave in the photo booth. It sounds like a cozy purr.",
  "genderuwo-big-g": "Big G tried to hug the vending machine. The power flickered, but the candy was saved.",
  "wewe-gombel-mama": "Mama Weaver is organizing a basket of vintage memory cards she found under the floorboards.",
  "sundel-dolly": "Dolly fell asleep inside a stack of giant donut floaties. The static hum is keeping her warm.",
  "jenglot-tim": "Tiny Tim is holding a tiny screwdriver, trying to understand how the claw motor works.",
  "banaspati-sparky": "Sparky is drifting around the coin slot, occasionally warming up cold hands that pass by.",
  "leak-tonguey": "Tonguey claims he can taste the frequency of different CRT scanlines. Today feels grape-flavored.",
  "buto-ijo-greenie": "Greenie tried to hatch an old emerald glass marble. He says it will hatch a gentle giant.",
  "wave-queen": "The Queen is listening to the radio static. She says she can hear the ocean tides from Jakarta."
};

const FAKE_NOTIFICATIONS = [
  "A quiet stranger in Surabaya captured Lovi the Bound...",
  "Unknown collector retrieved Tommy Token's lost 1991 coin.",
  "A soft copper token clinked silently on another machine...",
  "Someone sent a blanket to Kunti Lily in the photo booth.",
  "Mama Weaver tucked in an abandoned save file elsewhere.",
  "Sparky was spotted glowing briefly in a dark corner of the mall.",
  "A digital shooting star fell over the cabinet. High scores cleared.",
  "Someone placed a fresh jasmine petal near the insert slot.",
  "Hana High got tangled in a laundry line in Yogyakarta.",
  "A lonely heart in Bandung became awkward BFFs with Big G.",
  "A wet leaf fell in from the skylight. Nobody moved it.",
  "The cabinet CRT monitor flickered twice. A ghost was daydreaming."
];

const GHOST_POSITIONS = [
  { top: "60%", left: "30%", scale: 0.8 },
  { top: "65%", left: "55%", scale: 0.9 },
  { top: "58%", left: "42%", scale: 1 },
];

export default function ClawMachine() {
  const [view, setView] = useState<"landing" | "game" | "collection">("landing");
  const [ambientActive, setAmbientActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sharedCharacter, setSharedCharacter] = useState<Character | null>(null);

  // Check for shared URL sharing parameters
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const findId = params.get("find");
      if (findId) {
        const found = CHARACTERS.find((c) => c.id === findId);
        if (found) {
          setSharedCharacter(found);
        }
      }
    } catch (e) {
      console.error("Shared character lookup error", e);
    }
  }, []);

  // Smooth scroll-to-top on screen changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [view]);

  // Track collected spirits for Daily Mystery feature
  const [collectedIds, setCollectedIds] = useState<string[]>([]);
  
  // Persistence states & Maintenance Hatch
  const [isPowerDown, setIsPowerDown] = useState(false);
  const [returningBadgeVisible, setReturningBadgeVisible] = useState(false);

  // Trigger memory load visual check at start
  useEffect(() => {
    const stored = localStorage.getItem("crying_meteor_collected");
    if (stored) {
      try {
        const list = JSON.parse(stored);
        if (list.length > 0) { // Show if they've caught at least one
          setReturningBadgeVisible(true);
          const timer = setTimeout(() => {
            setReturningBadgeVisible(false);
          }, 7000);
          return () => clearTimeout(timer);
        }
      } catch (e) {
        // Ignore parsing errors here
      }
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("crying_meteor_collected");
    let list: string[] = [];
    if (stored) {
      try {
        list = JSON.parse(stored);
      } catch (e) {
        list = [];
      }
    } else {
      list = [];
      localStorage.setItem("crying_meteor_collected", JSON.stringify(list));
    }
    setCollectedIds(list);
  }, [view]);

  // Scalable themed machine sets
  const [activeThemeId, setActiveThemeId] = useState<string>("indonesian_folklore");
  const activeSet = COLLECTION_SETS.find(s => s.id === activeThemeId) || COLLECTION_SETS[0];

  // Interactive social states
  const [visitorCount, setVisitorCount] = useState(14);
  const [activeNotification, setActiveNotification] = useState("");
  const [reactions, setReactions] = useState<{ id: number; emoji: string; x: number; duration: number }[]>([]);
  const [selectedSpotlightTab, setSelectedSpotlightTab] = useState<"mystery" | "featured">("mystery");
  const [customSignalSent, setCustomSignalSent] = useState<string | null>(null);

  // Synchronize initial ambient background soundtrack logic
  useEffect(() => {
    setAmbientActive(isAmbientHumRunning());
  }, []);

  // Soft random fluctuations in guest count representing others wandering online
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next >= 8 && next <= 25 ? next : prev;
      });
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Set up quiet scrolling live notification ticker matching active theme
  useEffect(() => {
    const themeCharacters = CHARACTERS.filter(c => c.themeId === activeThemeId);
    const getThemeNotifications = () => {
      const generic = [
        "A wet leaf fell in from the skylight. Nobody moved it.",
        "The cabinet CRT monitor flickered twice. A ghost was daydreaming.",
        "Someone placed a fresh jasmine petal near the insert slot.",
        "A soft copper token clinked silently on another machine...",
        "A lonely collector adjusted their headphone cable under the blue neon lights."
      ];
      if (themeCharacters.length === 0) return generic;
      
      const names = themeCharacters.map(c => c.name);
      const themeMessages = [
        `A quiet stranger in Surabaya captured ${names[0 % names.length]}...`,
        `Unknown collector retrieved ${names[Math.min(1, names.length - 1)]}'s lost souvenir.`,
        `Someone sent a soft blanket to ${names[Math.min(2, names.length - 1)]} in the display booth.`,
        `${names[Math.min(3, names.length - 1)]} was spotted glowing briefly in a dark layout corner.`,
        `A lonely heart in Bandung became awkward BFFs with ${names[Math.min(4, names.length - 1)]}.`,
        `The sensor calibrated: ${names[Math.min(5, names.length - 1)]} is feeling cozy in Jakarta.`
      ];
      return [...themeMessages, ...generic];
    };

    const initialPool = getThemeNotifications();
    setActiveNotification(initialPool[Math.floor(Math.random() * initialPool.length)]);

    const interval = setInterval(() => {
      const pool = getThemeNotifications();
      setActiveNotification(pool[Math.floor(Math.random() * pool.length)]);
    }, 8000);
    return () => clearInterval(interval);
  }, [activeThemeId]);

  // Periodically spawn cozy random anonymous reactions drifting up the margins
  useEffect(() => {
    const interval = setInterval(() => {
      const emojiList = ["👻", "💖", "🎟️", "💫", "💧", "🌸", "🪐"];
      const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];
      if (Math.random() > 0.25) {
        spawnReaction(randomEmoji);
      }
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const spawnReaction = (emoji: string, isMine = false) => {
    const id = Date.now() + Math.random();
    // Keep reactions on the side margins of the page to avoid overlapping with the central claw machine cabinet
    // If it is mine, force to the right margin near the button panel for perfect instant visibility
    const isLeft = isMine ? false : Math.random() > 0.5;
    const x = isLeft 
      ? 3 + Math.random() * 15       // Left margins (3vw to 18vw)
      : 82 + Math.random() * 12;     // Right margins (82vw to 94vw)
    const duration = isMine ? 4.5 + Math.random() * 2 : 5 + Math.random() * 4; // drift duration in seconds
    
    setReactions((prev) => [...prev, { id, emoji, x, duration, isMine }]);
    
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, duration * 1000);
  };

  const handleManualReaction = (emoji: string) => {
    playPixelClick();
    spawnReaction(emoji, true);
    
    setCustomSignalSent(emoji);
    setTimeout(() => {
      setCustomSignalSent(null);
    }, 2800);
  };

  const toggleAmbient = () => {
    playPixelClick();
    if (ambientActive) {
      stopAmbientBg();
      setAmbientActive(false);
    } else {
      startAmbientBg();
      setAmbientActive(true);
    }
  };

  const handleStartGame = () => {
    playCoinSound();
    if (!ambientActive) {
      startAmbientBg();
      setAmbientActive(true);
    }
    setView("game");
  };

  const handleStartCollection = () => {
    playCoinSound();
    if (!ambientActive) {
      startAmbientBg();
      setAmbientActive(true);
    }
    setView("collection");
  };

  const handleResetCompleteInCollection = () => {
    const stored = localStorage.getItem("crying_meteor_collected");
    let list: string[] = [];
    if (stored) {
      try {
        list = JSON.parse(stored);
      } catch (e) {
        list = [];
      }
    } else {
      list = [];
    }
    setCollectedIds(list);
  };

  // Determine Daily Mystery and Hourly Featured spirits cleanly from the active collection set
  const themeCharacters = CHARACTERS.filter(c => c.themeId === activeThemeId);
  const todayDate = new Date().getDate();
  const currentHour = new Date().getHours();
  
  const dailyMysteryIndex = themeCharacters.length > 0 ? todayDate % themeCharacters.length : 0;
  const dailyMysteryChar = themeCharacters[dailyMysteryIndex] || CHARACTERS[0];
  const isDailyMysteryCaught = collectedIds.includes(dailyMysteryChar.id);

  const featuredIndex = themeCharacters.length > 0 ? (currentHour + todayDate) % themeCharacters.length : 0;
  const featuredChar = themeCharacters[featuredIndex] || CHARACTERS[0];

  return (
    <div 
      ref={containerRef}
      className={`relative flex flex-col items-center w-full h-[100dvh] z-10 px-4 pb-12 overflow-y-auto overflow-x-hidden transition-all screen-dimmable ${
        isPowerDown ? "machine-power-down" : ""
      } ${
        view === "game"
          ? "pt-8 sm:pt-12 md:pt-16 justify-center"
          : "pt-24 sm:pt-28 md:pt-32 lg:pt-24 justify-start"
      }`}
    >
      
      {/* Floating Retro Soundtrack Controller */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-2">
        <button
          onClick={toggleAmbient}
          className={`flex items-center gap-1.5 px-3 py-1.5 border-2 rounded font-mono text-[9px] pixel-text uppercase transition-all shadow-[0_2px_0_rgba(0,0,0,1)] ${
            ambientActive
              ? "bg-slate-900 border-arcade-cyan text-arcade-cyan hover:text-white"
              : "bg-gray-900 border-gray-800 text-gray-500 hover:text-white"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${ambientActive ? "bg-arcade-cyan animate-pulse shadow-[0_0_4px_currentColor]" : "bg-gray-700"}`} />
          <span>{ambientActive ? "SOUND: ON" : "SOUND: OFF"}</span>
        </button>
      </div>

      {/* Floating Strangers' Drift Emojis Background Overlays */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        <AnimatePresence>
          {reactions.map((r) => (
            <motion.div
              key={r.id}
              initial={{ y: "115vh", x: `${r.x}vw`, opacity: 0, scale: 0.6, rotate: 0 }}
              animate={{ 
                y: "-20vh", 
                opacity: [0, 0.95, 0.95, 0],
                scale: r.isMine ? [0.6, 1.8, 1.5, 0.9] : [0.6, 1.4, 1.2, 0.8],
                rotate: [0, r.isMine ? (Math.random() - 0.5) * 30 : (Math.random() - 0.5) * 60]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: r.duration, ease: "easeOut" }}
              className="absolute flex flex-col items-center select-none"
            >
              <div className="relative flex flex-col items-center">
                {r.isMine && (
                  <div className="absolute -top-4 bg-arcade-pink text-white text-[6.5px] font-mono font-bold leading-none px-1.5 py-0.5 rounded border border-white tracking-wider uppercase shadow-[0_1px_3px_rgba(0,0,0,0.5)] whitespace-nowrap animate-bounce">
                    YOU
                  </div>
                )}
                <div className={`text-2xl sm:text-3xl filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] ${
                  r.isMine 
                    ? "bg-pink-900/30 border border-arcade-pink/60 p-1 rounded-full shadow-[0_0_12px_rgba(236,72,153,0.5)]" 
                    : ""
                }`}>
                  {r.emoji}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {view === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-5xl pt-2 pb-12 flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
            {/* LEFT COLUMN: Main Game Machine & Header (Span 7) */}
            <div className="lg:col-span-7 flex flex-col items-center w-full">
              {/* Interactive Cabinet Container */}
              <div className="relative">
                {/* Glow backdrop matching active theme set */}
                <div 
                  className="absolute inset-[15%] rounded-lg filter blur-3xl opacity-20 pointer-events-none transition-all duration-700 font-sans" 
                  style={{ backgroundColor: activeSet.accentColor }} 
                />
                {/* Ghosts peeking around cabinet */}
                {GHOST_POSITIONS.map((pos, i) => (
                  <motion.img
                    key={i}
                    src="/assets/images/pixel_ghosts_batch_1779281788371.png"
                    className="absolute z-20 w-16 h-16 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    style={{ 
                        top: pos.top, 
                        left: pos.left, 
                        scale: pos.scale,
                    }}
                    animate={{ 
                      y: [0, -10, 0],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5
                    }}
                  />
                ))}

                {/* Main Claw Machine Body */}
                <motion.img
                  src="/assets/images/pixel_claw_machine_1779281769425.png"
                  className="w-[320px] md:w-[410px] relative z-30 drop-shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />

                {/* Imperfect blinking bulbs onto machine header */}
                <div className="absolute top-[8%] left-[25%] z-40 flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,1)] animate-ping" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-ping" style={{ animationDelay: "0.5s" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,1)] animate-ping" style={{ animationDelay: "0.2s" }} />
                </div>
                <div className="absolute top-[8%] right-[25%] z-40 flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-ping" style={{ animationDelay: "0.3s" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(234,179,8,1)] animate-ping" style={{ animationDelay: "0.7s" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,1)] animate-ping" style={{ animationDelay: "0.1s" }} />
                </div>
                
                {/* Embedded controls group on the glass screen area */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-full flex flex-col items-center gap-2.5">
                  
                  {/* Insert Coin Trigger */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartGame}
                    className="bg-[var(--color-arcade-pink)] border-b-8 border-r-8 border-pink-900 active:border-b-4 active:border-r-4 active:translate-y-1 active:translate-x-1 px-8 py-3.5 pixel-text text-md sm:text-lg text-white shadow-[0_0_25px_rgba(255,0,255,0.4)]"
                  >
                    <span className="blink">INSERT COIN</span>
                  </motion.button>

                  {/* Collection Room Trigger */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartCollection}
                    className="bg-slate-900 border-b-6 border-r-6 border-slate-950 active:border-b-2 active:border-r-2 active:translate-y-1 active:translate-x-1 px-6 py-2.5 pixel-text text-[10px] sm:text-xs text-arcade-cyan hover:text-white transition-colors uppercase tracking-widest shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                  >
                    <span>GHOST ARCHIVE</span>
                  </motion.button>
                  

                </div>
              </div>

              {/* General Title Block */}
              <div className="mt-8 text-center max-w-sm">
                <h1 
                  className="pixel-text text-xl md:text-3xl mb-2 tracking-tighter drop-shadow-[0_0_10px_rgba(0,255,255,0.4)] transition-all duration-500"
                  style={{ color: activeSet.accentColor, textShadow: `0 0 12px ${activeSet.accentColor}dd` }}
                >
                  CRYING METEOR
                </h1>
                <p className="font-mono text-gray-400 text-xs leading-relaxed border border-gray-900 p-3 bg-black/30">
                  Welcome to the virtual ruins of a cozy, forgotten neighborhood mall. 
                  Discover lonely spirits and share a quiet web silence. 
                </p>
              </div>

              {/* Cartridge Selection Tray (Hidden for now; kept for later build) */}
              {false && (
              <div className="w-full max-w-sm mt-5 bg-slate-950/85 border-2 border-gray-800 p-3 rounded shadow-xl relative animate-fadeIn">
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-gray-900">
                  <div className="flex items-center gap-1.5">
                    <Radio size={11} className="text-arcade-cyan animate-pulse" style={{ color: activeSet.accentColor }} />
                    <span className="pixel-text text-[7.5px] text-gray-400">CARTRIDGE DECK (SWAP GAME THEME)</span>
                  </div>
                  <span className="font-mono text-[7px] text-[#22d3ee] px-1.5 py-0.5 rounded bg-[#1e293b]/50 border border-[#22d3ee]/20 font-bold">
                    SYSTEM: OK
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-1.5">
                  {COLLECTION_SETS.map((set) => {
                    const isSelected = set.id === activeThemeId;
                    return (
                      <button
                        key={set.id}
                        onClick={() => {
                          playCoinSound();
                          setActiveThemeId(set.id);
                          localStorage.setItem("crying_meteor_active_theme", set.id);
                        }}
                        className={`relative py-2 px-1 border-2 rounded flex flex-col items-center justify-center gap-1 select-none transition-all cursor-pointer ${
                          isSelected
                            ? "bg-slate-900/95 text-white"
                            : "bg-black/60 text-gray-500 hover:text-gray-300 hover:bg-slate-900/40"
                        }`}
                        style={{ 
                          borderColor: isSelected ? set.accentColor : "#1f2937",
                          boxShadow: isSelected ? `0 0 12px ${set.accentColor}35` : "none"
                        }}
                      >
                        <span className="text-[14px]">{set.seasonalEvent.icon}</span>
                        <span className={`font-mono text-[6.5px] font-bold text-center leading-tight truncate w-full px-0.5 ${isSelected ? "text-white" : "text-gray-500"}`}>
                          {set.name.split(" ")[0]}
                        </span>
                        
                        {/* Glow indicator */}
                        <span 
                          className="absolute top-1 right-1 w-1 h-1 rounded-full bg-gray-800 transition-all duration-500" 
                          style={{ backgroundColor: isSelected ? set.accentColor : undefined, boxShadow: isSelected ? `0 0 4px ${set.accentColor}` : "none" }} 
                        />
                        {/* Golden contact pins representing physical cart bottom */}
                        <div className="absolute -bottom-1 inset-x-2 h-[2px] bg-yellow-600/40 rounded-t" />
                      </button>
                    );
                  })}
                </div>
              </div>
              )}
            </div>

            {/* RIGHT COLUMN: Atmospheric Bulletin Board (Span 5) */}
            <div className="lg:col-span-5 flex flex-col gap-4 w-full">
              
              {/* Outer Bulletin Card Frame */}
              <div className="relative w-full bg-slate-950/90 border-4 border-gray-800 p-4 rounded-lg shadow-2xl overflow-hidden">
                {/* Aesthetic background mesh lines */}
                <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />
                
                {/* Header Row */}
                <div className="flex items-center justify-between border-b-2 border-gray-800 pb-3 mb-4 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <Globe size={13} className="text-arcade-pink animate-spin-slow" />
                    <span className="pixel-text text-[9px] text-arcade-cyan">STRANGERS' BULLETIN</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/45 border border-dashed border-gray-800 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-mono text-[8px] text-gray-400 uppercase tracking-wider">
                      {visitorCount} SOULS ONLINE
                    </span>
                  </div>
                </div>

                {/* Subtle Discovery Live Log Stream */}
                <div className="bg-black/60 border border-gray-900 p-3 rounded mb-4 flex flex-col gap-1 relative z-10">
                  <span className="pixel-text text-[7px] text-gray-500 uppercase tracking-widest block mb-1">
                    [ QUIET EVENT STREAM ]
                  </span>
                  <div className="h-8 flex items-center justify-start">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={activeNotification}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.4 }}
                        className="font-mono text-[10px] text-gray-300 leading-snug italic"
                      >
                        {activeNotification || "Archiving silence..."}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>

                {/* TABS Selector for daily mystery vs featured collectible */}
                <div className="flex gap-2 mb-3 relative z-10">
                  <button
                    onClick={() => { playPixelClick(); setSelectedSpotlightTab("mystery"); }}
                    className={`flex-1 py-1 px-2 text-[8px] pixel-text rounded border transition-all ${
                      selectedSpotlightTab === "mystery"
                        ? "bg-slate-900 border-arcade-pink text-arcade-pink"
                        : "bg-black/40 border-gray-900 text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    DAILY MYSTERY
                  </button>
                  <button
                    onClick={() => { playPixelClick(); setSelectedSpotlightTab("featured"); }}
                    className={`flex-1 py-1 px-2 text-[8px] pixel-text rounded border transition-all ${
                      selectedSpotlightTab === "featured"
                        ? "bg-slate-900 border-arcade-cyan text-arcade-cyan"
                        : "bg-black/40 border-gray-900 text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    SPOTLIGHT HOUR
                  </button>
                </div>

                {/* TAB CONTENT */}
                <div className="min-h-[175px] flex flex-col justify-between relative z-10 bg-black/45 p-3 rounded border border-gray-900/60 mb-4 transition-all">
                  <AnimatePresence mode="wait">
                    {selectedSpotlightTab === "mystery" ? (
                      <motion.div
                        key="tab-mystery"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col h-full gap-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-yellow-400 rotate-45 inline-block" />
                          <span className="pixel-text text-[8px] text-yellow-400 uppercase tracking-wider">
                            COSMIC ALIGNMENT: COLLECTION NO. {dailyMysteryChar.id.slice(-3).toUpperCase()}
                          </span>
                        </div>

                        {/* Mysterious Black Silhouette of Daily character */}
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 bg-slate-950 rounded flex items-center justify-center overflow-hidden border border-gray-900 shrink-0">
                            {/* Colorful clue sprite with custom opacity and black layer overlay */}
                            <img
                              src={dailyMysteryChar.sprite}
                              className={`w-12 h-12 object-contain pixelate transition-all duration-300 ${
                                isDailyMysteryCaught 
                                  ? "opacity-100 scale-105" 
                                  : "opacity-45 brightness-75 contrast-90"
                              }`}
                              title={isDailyMysteryCaught ? dailyMysteryChar.name : "Play the claw machine to catch this daily mystery spirit!"}
                              referrerPolicy="no-referrer"
                            />
                            {!isDailyMysteryCaught && (
                              <>
                                {/* 50% opacity black color layer overlay as requested */}
                                <div className="absolute inset-0 bg-black/50 pointer-events-none" />
                                <HelpCircle size={12} className="absolute text-yellow-400/30" />
                              </>
                            )}
                          </div>

                          <div className="flex-1">
                            <h4 className={`pixel-text text-[9px] uppercase tracking-wider ${isDailyMysteryCaught ? "text-arcade-pink font-bold" : "text-zinc-500 font-medium"}`}>
                              {isDailyMysteryCaught ? `${dailyMysteryChar.name} (REVEALED)` : "??????? (PLAY & CATCH TO REVEAL)"}
                            </h4>
                            <p className="font-mono text-[9px] text-gray-400 leading-normal mt-1">
                              {isDailyMysteryCaught 
                                ? `${dailyMysteryChar.description} Quirk: ${dailyMysteryChar.quirk}`
                                : (SHY_MOODS[dailyMysteryChar.id] || "Resting silently on a soft virtual grid slot.")
                              }
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-900/50 p-2 rounded text-[8px] font-mono text-gray-400 leading-snug border border-gray-950 mt-1">
                          <span className="text-arcade-pink font-bold">MYSTERY ATTRACTION:</span> This spectral companion is currently radiating extra luck inside the capsule tank today. Try catching them!
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="tab-featured"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col h-full gap-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-cyan-400 rotate-45 inline-block animate-ping" />
                          <span className="pixel-text text-[8px] text-arcade-cyan uppercase tracking-wider">
                            HOURLY GUEST SPOTLIGHT
                          </span>
                        </div>

                        {/* Spotlight Spirit Details */}
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 bg-slate-950 rounded flex items-center justify-center overflow-hidden border border-gray-900 shrink-0">
                            <img
                              src={featuredChar.sprite}
                              className="w-12 h-12 object-contain pixelate animate-pulse"
                            />
                            <div className="absolute inset-0 bg-slate-400/5 mix-blend-color-dodge pointer-events-none" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-1">
                              <h4 className="pixel-text text-[10px] text-white uppercase tracking-wider">
                                {featuredChar.name}
                              </h4>
                              <span className="px-1 text-[5.5px] pixel-text font-bold border border-current leading-none" style={{ color: featuredChar.color }}>
                                {featuredChar.rarity}
                              </span>
                            </div>
                            <p className="font-mono text-[9px] text-gray-400 leading-normal mt-1 italic">
                              "{featuredChar.description}"
                            </p>
                          </div>
                        </div>

                        <div className="bg-slate-900/50 p-2 rounded text-[8px] font-mono text-gray-400 leading-snug border border-gray-950 mt-1">
                          <span className="text-arcade-cyan font-bold">SENTIMENT SHIELD:</span> {SHY_MOODS[featuredChar.id] || "Listening quietly to the steady transformator hum."}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Strangers' Shared Emoji Reactions Panel */}
                <div className="border-t-2 border-gray-900 pt-3 relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="pixel-text text-[7.5px] text-gray-500 uppercase tracking-widest">
                      [ SIGNAL TO STRANGERS ]
                    </span>
                    {customSignalSent && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="font-mono text-[7.5px] text-arcade-pink"
                      >
                        Signal {customSignalSent} sent!
                      </motion.span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {[
                      { emoji: "👻", label: "GHOST WAVE" },
                      { emoji: "💖", label: "FOR LOVE" },
                      { emoji: "🎟️", label: "TOSS COIN" },
                      { emoji: "💫", label: "STAR SPARK" },
                      { emoji: "🌸", label: "CHERRY BUD" },
                      { emoji: "🪐", label: "COSMOS" }
                    ].map((btn) => (
                      <button
                        key={btn.emoji}
                        onClick={() => handleManualReaction(btn.emoji)}
                        className="flex-1 py-1.5 bg-gray-900 border border-gray-850 hover:bg-slate-900 hover:border-slate-700 text-sm rounded cursor-pointer transition-all active:scale-90 flex justify-center items-center relative group"
                        title={btn.label}
                      >
                        <span>{btn.emoji}</span>
                        <span className="absolute bottom-[115%] left-1/2 -translate-x-1/2 bg-black border border-gray-800 text-[6.5px] text-white pixel-text px-1 rounded opacity-0 group-hover:opacity-100 hidden sm:block pointer-events-none whitespace-nowrap transition-opacity">
                          {btn.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <p className="font-mono text-[8px] text-gray-650 text-center mt-2.5">
                    Clicking an emoji spawns drifting signals onto other guests' screens in real time.
                  </p>
                </div>
              </div>

              {/* Subtle Arcade Support Segment / Maintenance Bay */}
              <SupportHatch onCoinDropped={() => spawnReaction("🪙", true)} />

            </div> {/* Close right col div */}
          </div> {/* Close grid div we added */}
        </motion.div>
      )}

        {view === "game" && (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="w-full flex flex-col items-center justify-center shrink-0"
          >
            <div className="mb-2 sm:mb-4 text-center">
                <h2 className="pixel-text text-arcade-cyan text-sm mb-1.5">NOW PLAYING</h2>
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-arcade-pink to-transparent" />
            </div>
            
            <ClawGame activeThemeId={activeThemeId} onBack={() => setView("landing")} />
            
            <div className="mt-2 sm:mt-4 pixel-text text-[9px] text-gray-600 animate-pulse">
                * MECHANICAL WHIRRING INTENSIFIES *
            </div>
          </motion.div>
        )}

        {view === "collection" && (
          <motion.div
            key="collection"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full flex justify-center"
          >
            <CollectionRoom 
              ambientActive={ambientActive} 
              onBack={() => setView("landing")} 
              onPowerDownChange={setIsPowerDown}
              onResetCollection={handleResetCompleteInCollection}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Memory Restoration Alert */}
      <AnimatePresence>
        {returningBadgeVisible && (
          <div className="fixed bottom-6 left-0 right-0 pointer-events-none flex justify-center z-55 px-4">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="pointer-events-auto w-full max-w-lg bg-slate-950/95 border-2 border-emerald-500/50 p-3 sm:px-4 rounded-md shadow-[0_4px_25px_rgba(16,185,129,0.3)] flex items-center justify-between gap-3 text-left border-dashed"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-bounce"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="pixel-text text-[8px] text-emerald-400 tracking-wider">RETRIEVING OFF-LINE MEMORY CARD: 100% SUCCESS</span>
                  <span className="font-mono text-[9px] text-gray-450 italic leading-relaxed">
                    "The machine remembers visitors on this device. Your creatures are safely sleeping here."
                  </span>
                </div>
              </div>
              <button 
                onClick={() => {
                  playPixelClick();
                  setReturningBadgeVisible(false);
                }}
                className="text-gray-500 hover:text-emerald-400 px-2 py-1 text-[10px] font-mono hover:bg-emerald-950/30 rounded border border-gray-900 hover:border-emerald-500/30 transition-all cursor-pointer shrink-0"
                title="Acknowledge and Close"
              >
                [ OK ]
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Shared Character Card Overlay System */}
      <AnimatePresence>
        {sharedCharacter && (
          <CollectibleCard
            character={sharedCharacter}
            onClose={() => {
              setSharedCharacter(null);
              try {
                const url = new URL(window.location.href);
                url.searchParams.delete("find");
                window.history.replaceState({}, document.title, url.toString());
              } catch (e) {
                // Ignore URL cleaner errors
              }
            }}
            ambientActive={ambientActive}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
