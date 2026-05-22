import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { CHARACTERS, COLLECTION_SETS } from "../data/characters";
import { Character } from "../types";
import PixelSprite from "./PixelSprite";
import {
  playCoinSound,
  playMoveTick,
  playClawDropSweep,
  playClawRaiseSweep,
  playLightFlickerSound,
  playCapsuleFallSound,
  playSuccessFanfare,
  playFailureSound,
  playPixelClick,
  playClawSuspenseTick,
} from "../utils/audio";

interface Capsule {
  id: number;
  x: number;
  y: number;
  isCaught: boolean;
  character?: Character;
}

export default function ClawGame({ activeThemeId, onBack }: { activeThemeId: string; onBack: () => void }) {
  const activeSet = COLLECTION_SETS.find(s => s.id === activeThemeId) || COLLECTION_SETS[0];
  const [gameState, setGameState] = useState<'idle' | 'moving' | 'dropping' | 'grabbing' | 'returning' | 'revealing' | 'result'>('idle');
  
  // Continuous suspense mechanical warning ticks while claw state is active
  useEffect(() => {
    if (gameState !== 'idle' && gameState !== 'result') {
      const p = setInterval(() => {
        playClawSuspenseTick();
      }, 300);
      return () => clearInterval(p);
    }
  }, [gameState]);
  const [revealStep, setRevealStep] = useState<'none' | 'claw_pause' | 'lights_flickering' | 'capsule_dropping' | 'suspense_pause' | 'screen_flash' | 'unveiling'>('none');
  const [lightsFlicker, setLightsFlicker] = useState(false);
  const [droppingCapsuleY, setDroppingCapsuleY] = useState<number | null>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [particles, setParticles] = useState<{ id: number; left: number; top: number; size: number; duration: number }[]>([]);
  
  // Core game states
  const [clawX, setClawX] = useState(50); // percentage
  const [clawY, setClawY] = useState(0); // percentage extension
  const [caughtItem, setCaughtItem] = useState<Capsule | null>(null);
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [message, setMessage] = useState("");
  const [moveDir, setMoveDir] = useState<'left' | 'right' | null>(null);
  const [showCharacter, setShowCharacter] = useState<Character | null>(null);

  // Stagger variants for the modal card text lines
  const modalContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.3
      }
    }
  };

  const modalItemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 90, damping: 14 }
    }
  };

  // Generate gorgeous pixel particles when a character modal is shown
  useEffect(() => {
    if (showCharacter) {
      const newParticles = Array.from({ length: 18 }).map((_, idx) => ({
        id: idx,
        left: Math.random() * 100,
        top: 80 + Math.random() * 20,
        size: Math.random() > 0.4 ? 4 : 6,
        duration: 2 + Math.random() * 3,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [showCharacter]);

  // Initialize capsules with characters belonging specifically to the active collection set
  useEffect(() => {
    const themeCharacters = CHARACTERS.filter(c => c.themeId === activeThemeId);
    if (themeCharacters.length === 0) return;

    const initialCapsules = Array.from({ length: 12 }).map((_, i) => {
      const rand = Math.random();
      let character;

      const legendaryChars = themeCharacters.filter(c => c.rarity === "LEGENDARY");
      const rareChars = themeCharacters.filter(c => c.rarity === "RARE");
      const uncommonChars = themeCharacters.filter(c => c.rarity === "UNCOMMON");
      const commonChars = themeCharacters.filter(c => c.rarity === "COMMON");

      // Seasonal multiplier makes rare/legendary items slightly easier to roll
      const multiplierFactor = activeSet.seasonalEvent?.multiplier || 1.0;
      const rareThreshold = Math.max(0.65, 0.85 / multiplierFactor);
      const legendaryThreshold = Math.max(0.80, 0.95 / multiplierFactor);

      if (rand > legendaryThreshold && legendaryChars.length > 0) {
        character = legendaryChars[Math.floor(Math.random() * legendaryChars.length)];
      } else if (rand > rareThreshold && rareChars.length > 0) {
        character = rareChars[Math.floor(Math.random() * rareChars.length)];
      } else if (rand > 0.58 && uncommonChars.length > 0) {
        character = uncommonChars[Math.floor(Math.random() * uncommonChars.length)];
      } else {
        character = commonChars.length > 0 
          ? commonChars[Math.floor(Math.random() * commonChars.length)]
          : themeCharacters[Math.floor(Math.random() * themeCharacters.length)];
      }

      return {
        id: i,
        x: 10 + Math.random() * 80,
        y: 75 + Math.random() * 8, 
        isCaught: false,
        character
      };
    });
    setCapsules(initialCapsules);
  }, [activeThemeId]);

  // Movement loop
  useEffect(() => {
    if (!moveDir || (gameState !== 'idle' && gameState !== 'moving')) return;
    
    if (gameState === 'idle') setGameState('moving');

    // Snappy immediate move with retro tick
    playMoveTick();
    setClawX((prev) => {
      const next = moveDir === 'left' ? prev - 1.5 : prev + 1.5;
      return Math.max(8, Math.min(92, next));
    });

    const interval = setInterval(() => {
      playMoveTick();
      setClawX((prev) => {
        const next = moveDir === 'left' ? prev - 1.5 : prev + 1.5;
        return Math.max(8, Math.min(92, next));
      });
    }, 120);

    return () => clearInterval(interval);
  }, [moveDir, gameState]);

  // Global release listener for robust 'tap/hold' support
  useEffect(() => {
    if (moveDir) {
      const handleGlobalUp = () => setMoveDir(null);
      window.addEventListener('pointerup', handleGlobalUp);
      window.addEventListener('pointercancel', handleGlobalUp);
      return () => {
        window.removeEventListener('pointerup', handleGlobalUp);
        window.removeEventListener('pointercancel', handleGlobalUp);
      };
    }
  }, [moveDir]);

  // Handle animation sequence via state
  useEffect(() => {
    if (gameState === 'dropping') {
      // Start descent - calibrated to reach floor capsules
      setClawY(72);
      playClawDropSweep();
      const timer = setTimeout(() => {
        setGameState('grabbing');
      }, 1200);
      return () => clearTimeout(timer);
    }

    if (gameState === 'grabbing') {
      // Detecting hit - tightened radius (8 units is roughly one capsule width)
      const hitIndex = capsules.findIndex(c => 
        Math.abs(c.x - clawX) < 8 && !c.isCaught
      );

      if (hitIndex !== -1 && !caughtItem) {
        setCaughtItem(capsules[hitIndex]);
        setCapsules(prev => prev.filter((_, i) => i !== hitIndex));
      }

      const timer = setTimeout(() => {
        setGameState('returning');
        setClawY(0);
      }, 800); 
      return () => clearTimeout(timer);
    }

    if (gameState === 'returning') {
      playClawRaiseSweep();
      const timer = setTimeout(() => {
        if (caughtItem) {
          // Instead of immediate result, initiate the grand, suspenseful cinematic reveal sequence!
          setGameState('revealing');
          setRevealStep('claw_pause');
        } else {
          setGameState('result');
        }
      }, 1500); // Time to reach top
      return () => clearTimeout(timer);
    }

    if (gameState === 'result') {
      if (caughtItem && !message) {
        const success = Math.random() > 0.3;
        if (!success) {
          setCaughtItem(null);
          setMessage("OOPS... SLIPPED.");
          playFailureSound();
        } else {
          setMessage("A NEW FRIEND!");
          setTimeout(() => {
            if (caughtItem.character) {
              setShowCharacter(caughtItem.character);
            }
          }, 500);
        }
      } else if (!caughtItem && !message && !showCharacter) {
        setMessage("TRY AGAIN?");
      }

      // Reset sequence
      const timer = setTimeout(() => {
        if (!showCharacter) {
          setGameState('idle');
          setMessage("");
          setCaughtItem(null);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  // Grand Suspenseful Reveal Sequence Handling
  useEffect(() => {
    if (gameState !== 'revealing') return;

    if (revealStep === 'claw_pause') {
      // Step 1: Slide claw carriage center over the prize chute (x = 14%)
      setClawX(14);
      const timer = setTimeout(() => {
        setRevealStep('lights_flickering');
      }, 1300);
      return () => clearTimeout(timer);
    }

    if (revealStep === 'lights_flickering') {
      // Step 2: Flickering cabinet lights
      setLightsFlicker(true);
      playLightFlickerSound();
      
      const timer = setTimeout(() => {
        setLightsFlicker(false);
        setRevealStep('capsule_dropping');
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (revealStep === 'capsule_dropping') {
      // Step 3: Open claw, let capsule descent slowly in the chute
      setDroppingCapsuleY(0);
      playCapsuleFallSound();

      // Trigger standard failure chance here (30% drop slip rate) to preserve original game logic beautifully
      const isSuccess = Math.random() > 0.3;
      if (!isSuccess) {
        const timer = setTimeout(() => {
          setDroppingCapsuleY(null);
          setCaughtItem(null);
          setGameState('result');
          setRevealStep('none');
          setMessage("OOPS... SLIPPED.");
          playFailureSound();
        }, 1200);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setRevealStep('suspense_pause');
        }, 1200);
        return () => clearTimeout(timer);
      }
    }

    if (revealStep === 'suspense_pause') {
      // Step 4: Silent tension before capsule pops out of view
      const timer = setTimeout(() => {
        setRevealStep('screen_flash');
      }, 1200);
      return () => clearTimeout(timer);
    }

    if (revealStep === 'screen_flash') {
      // Step 5: Screen soft-flashes with high brightness overlay and plays spectacular chiptune arpeggio success
      setFlashActive(true);
      playSuccessFanfare();

      const timer = setTimeout(() => {
        setFlashActive(false);
        setRevealStep('unveiling');
        if (caughtItem && caughtItem.character) {
          setShowCharacter(caughtItem.character);
          
          // Securely write to local archive database
          try {
            const stored = localStorage.getItem("crying_meteor_collected");
            let collected: string[] = stored ? JSON.parse(stored) : [];
            if (!collected.includes(caughtItem.character.id)) {
              collected.push(caughtItem.character.id);
              localStorage.setItem("crying_meteor_collected", JSON.stringify(collected));
            }
          } catch (e) {
            console.error("Failed to write won character to cache:", e);
          }
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [gameState, revealStep, caughtItem]);

  const dropClaw = () => {
    playPixelClick();
    if (gameState === 'idle' || gameState === 'moving') {
      setGameState('dropping');
      setMoveDir(null);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-4 w-full max-w-sm sm:max-w-md shrink-0">
      {/* Dynamic Seasonal Event Flash Banner */}
      <div className={`w-full flex justify-between items-center px-4 py-1.5 rounded border-2 font-mono text-[9px] uppercase tracking-wider ${activeSet.badgeBg} leading-none mb-1 shadow-sm`}>
        <div className="flex items-center gap-1.5">
          <span className="text-[12.5px]">{activeSet.seasonalEvent.icon}</span>
          <span className="font-bold text-white">{activeSet.seasonalEvent.name}</span>
        </div>
        <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
          <span className="animate-pulse text-yellow-300">★</span>
          <span className="text-[#38bdf8] font-bold">LUCK x{(activeSet.seasonalEvent.multiplier).toFixed(2)}</span>
        </div>
      </div>

      {/* Machine Window (The Tank) */}
      <div 
        className={`relative w-full aspect-[4/3] ${activeSet.cabinetBg} border-4 transition-all duration-500 rounded-t-lg overflow-hidden shadow-2xl`}
        style={{ borderColor: activeSet.accentColor, boxShadow: `0 -4px 30px ${activeSet.accentColor}25` }}
      >
        {/* Blinking cabinet machine side lights (hand-wired vintage feeling) */}
        <div className="absolute top-1 left-3 flex gap-1 z-50">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_6px_rgba(236,72,153,0.8)] animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.8)] animate-pulse" style={{ animationDelay: "0.4s" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)] animate-pulse" style={{ animationDelay: "0.8s" }} />
        </div>
        <div className="absolute top-1 right-3 flex gap-1 z-50">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)] animate-pulse" style={{ animationDelay: "0.2s" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.8)] animate-pulse" style={{ animationDelay: "0.6s" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_6px_rgba(236,72,153,0.8)] animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        {/* Background Decor */}
        <div className="absolute inset-x-0 bottom-0 h-1/6 bg-gray-900/40" />

        {/* Physical Prize Chute in Bottom-Left */}
        <div className="absolute bottom-0 left-[4%] w-[18%] h-1/5 bg-gray-950 border-t-2 border-r-2 border-gray-800 rounded-tr overflow-hidden z-20 flex flex-col items-center justify-center">
          <div className="absolute inset-0.5 bg-black border border-dashed border-gray-800 rounded-tr flex items-center justify-center text-center">
            <span className="pixel-text text-[4px] sm:text-[5px] text-gray-700 leading-tight animate-pulse">PRIZE<br/>CHUTE</span>
          </div>
        </div>
        
        {/* Capsules on the floor */}
        {capsules.map((c) => (
          <motion.img
            key={c.id}
            src="/assets/images/pixel_capsule_1779281986398.png"
            className="absolute w-8 h-8 sm:w-10 sm:h-10 object-contain"
            style={{ left: `${c.x}%`, top: `${c.y}%`, transform: 'translateX(-50%)' }}
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2 + Math.random(), repeat: Infinity }}
          />
        ))}

        {/* The Claw System */}
        <div className="absolute inset-x-0 top-0 h-full pointer-events-none">
          {/* Horizontal Rail */}
          <div className="absolute top-0 w-full h-4 bg-gray-800 shadow-inner z-50 animate-pulse" />
          
          {/* Claw Cart and Arm with Spring Slide */}
          <motion.div 
            className="absolute top-0 h-full flex flex-col items-center"
            animate={{ left: `${clawX}%` }}
            transition={{ type: "spring", stiffness: 45, damping: 14 }}
            style={{ transform: 'translateX(-50%)' }}
          >
            {/* Cart Visual */}
            <div className="w-10 h-7 bg-gray-700 rounded-b-md border-2 border-gray-600 z-50 flex items-center justify-center shadow-lg">
               <div className="w-4 h-1 bg-cyan-400 animate-pulse" />
            </div>
            
            {/* Movement Group (Cable + Head) */}
            <motion.div 
              className="absolute left-0 right-0 flex flex-col items-center origin-top w-full"
              initial={{ top: "0%" }}
              animate={{ top: `${clawY}%` }}
              transition={{ 
                duration: gameState === 'returning' ? 1.8 : 1.2, 
                ease: gameState === 'dropping' ? "easeIn" : "easeInOut" 
              }}
            >
              {/* Arm Cable */}
              <div 
                className="w-1 bg-blue-900 border-x border-blue-400/30"
                style={{ 
                  height: "100vh", 
                  position: "absolute",
                  bottom: "100%", 
                  marginBottom: "-10px"
                }}
              />
              
              {/* Claw Head */}
              <motion.div 
                  className="relative z-40"
                  animate={{ 
                      rotate: gameState === 'grabbing' ? [0, -10, 10, -10, 10, 0] : 0 
                  }}
              >
                  <motion.img
                  src="/assets/images/pixel_claw_arm_1779281964398.png"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                  animate={{
                      scale: gameState === 'grabbing' ? 1.2 : 1,
                      rotate: (gameState === 'returning' || gameState === 'revealing') && caughtItem ? [3, -3, 3] : 0
                  }}
                  transition={{ repeat: caughtItem ? Infinity : 0, duration: 0.2 }}
                  />
                  
                  {/* Caught Item */}
                  {caughtItem && revealStep !== 'capsule_dropping' && revealStep !== 'suspense_pause' && revealStep !== 'screen_flash' && revealStep !== 'unveiling' && (
                  <motion.img
                      src="/assets/images/pixel_capsule_1779281986398.png"
                      className="absolute top-8 sm:top-10 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 object-contain z-10"
                      animate={{
                        y: gameState === 'result' && !message.includes("FRIEND") ? [0, 400] : 0,
                        opacity: gameState === 'result' && !message.includes("FRIEND") ? [1, 0] : 1
                      }}
                      transition={{ duration: 0.5 }}
                  />
                  )}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Physical Dropping Capsule inside the prize chute */}
        {droppingCapsuleY !== null && (
          <motion.img
            src="/assets/images/pixel_capsule_1779281986398.png"
            className="absolute w-8 h-8 sm:w-10 sm:h-10 object-contain z-20"
            style={{ left: "12%" }}
            initial={{ top: "12%" }}
            animate={{ top: "85%" }}
            transition={{ duration: 1.2, ease: "easeIn" }}
          />
        )}

        {/* Lights Flickering Overlay */}
         {lightsFlicker && (
          <motion.div 
            className="absolute inset-0 pointer-events-none mix-blend-overlay bg-cyan-400/25 z-30"
            animate={{ opacity: [0.1, 0.8, 0.2, 0.9, 0.1, 0.9, 0.2] }}
            transition={{ duration: 1.5, ease: "linear" }}
          />
        )}

        {/* Suspense Pause Portal details */}
        {revealStep === 'suspense_pause' && (
          <div className="absolute inset-0 bg-black/85 z-30 flex flex-col items-center justify-center pointer-events-none">
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              className="pixel-text text-arcade-cyan text-[7px] sm:text-[9px] tracking-wider text-center flex flex-col gap-2"
            >
              <span>RETRIEVING COMPANION...</span>
              <span className="text-gray-600 text-[5px] tracking-widest uppercase">Initializing Digital Portal</span>
            </motion.div>
          </div>
        )}

        {/* Flash Effect on capture */}
        {flashActive && (
          <motion.div 
            className="absolute inset-0 bg-white z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}

        {/* Glass Reflection */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-white/10 opacity-30" />
      </div>

      {/* Machine Body (Control Panel) */}
      <div 
        className="w-full bg-gray-800 border-x-4 border-b-4 p-3 sm:p-4 rounded-b-lg shadow-xl flex flex-col items-center gap-2 sm:gap-4 transition-all border-gray-900"
        style={{ boxShadow: `0 8px 30px ${activeSet.accentColor}20` }}
      >
        
        <div className="h-4 flex items-center justify-center">
            <AnimatePresence mode="wait">
                {message && !showCharacter && (
                    <motion.div 
                        key={message}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="pixel-text text-arcade-cyan text-[10px] sm:text-xs text-center"
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <div className="flex items-center justify-between w-full px-2 sm:px-6">
            <div className="flex gap-2">
                <button 
                    onPointerDown={(e) => { e.preventDefault(); setMoveDir('left'); }}
                    className="w-12 h-12 bg-gray-700 border-b-4 border-black active:border-b-0 active:translate-y-1 rounded text-white flex items-center justify-center pixel-text text-lg select-none touch-none disabled:opacity-30"
                    aria-label="Move Left"
                    disabled={gameState !== 'idle' && gameState !== 'moving'}
                >
                    {"<"}
                </button>
                <button 
                    onPointerDown={(e) => { e.preventDefault(); setMoveDir('right'); }}
                    className="w-12 h-12 bg-gray-700 border-b-4 border-black active:border-b-0 active:translate-y-1 rounded text-white flex items-center justify-center pixel-text text-lg select-none touch-none disabled:opacity-30"
                    aria-label="Move Right"
                    disabled={gameState !== 'idle' && gameState !== 'moving'}
                >
                    {">"}
                </button>
            </div>

            <button 
                onClick={dropClaw}
                disabled={gameState !== 'idle' && gameState !== 'moving'}
                className="w-16 h-16 sm:w-20 sm:h-20 border-b-4 rounded-full pixel-text text-[10px] sm:text-xs text-white disabled:opacity-50 disabled:cursor-not-allowed select-none transition-all duration-300 shadow-md"
                style={{ 
                  backgroundColor: activeSet.accentColor, 
                  borderColor: `${activeSet.accentColor}cc`, 
                  boxShadow: gameState === 'idle' || gameState === 'moving' ? `0 4px 12px ${activeSet.accentColor}40` : "none"
                }}
            >
                PUSH
            </button>
        </div>

        <button 
            onClick={() => { playPixelClick(); onBack(); }}
            className="mt-2 text-gray-500 hover:text-white pixel-text text-[8px] uppercase tracking-widest"
        >
            [ Exit Machine ]
        </button>
      </div>

      {/* Character Result Modal with particles and staggered presentation */}
      <AnimatePresence>
        {showCharacter && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md overflow-hidden"
            >
                {/* Floating Celeb Star Particles */}
                {particles.map(p => (
                  <motion.div
                    key={p.id}
                    className="absolute bg-white pointer-events-none rounded"
                    style={{
                      left: `${p.left}%`,
                      top: `${p.top}%`,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                      boxShadow: `0 0 8px ${showCharacter.color}`,
                    }}
                    animate={{
                      y: -360,
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{
                      duration: p.duration,
                      repeat: Infinity,
                      ease: "linear",
                      delay: p.id * 0.12,
                    }}
                  />
                ))}

                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    style={{ borderColor: showCharacter.color, boxShadow: `0 0 40px ${showCharacter.color}40` }}
                    className="max-w-sm w-full bg-gray-950 border-4 p-6 relative overflow-hidden rounded-lg"
                >
                    {/* Retro Grid lines */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />

                    <motion.div 
                        variants={modalContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative text-center flex flex-col items-center"
                    >
                        <motion.div variants={modalItemVariants} className="pixel-text text-[7px] text-gray-500 mb-2 tracking-widest uppercase">
                            Collection No. {showCharacter.id.slice(-3)}
                        </motion.div>
                        
                        <motion.div 
                            variants={modalItemVariants}
                            className="relative inline-block mb-4"
                        >
                            <div className="absolute inset-0 blur-2xl opacity-60 rounded-full scale-110" style={{ backgroundColor: showCharacter.color }} />
                            <motion.div
                              animate={{ y: [0, -6, 0] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <PixelSprite 
                                sprite={showCharacter.sprite} 
                                characterId={showCharacter.id}
                                color={showCharacter.color}
                                className="w-52 h-52 sm:w-64 sm:h-64 relative z-10"
                              />
                            </motion.div>
                        </motion.div>

                        <motion.h3 
                            variants={modalItemVariants}
                            className="pixel-text text-white text-md sm:text-base mb-1 drop-shadow-[0_2px_0_rgba(0,0,0,1)] uppercase tracking-wide"
                        >
                            {showCharacter.name}
                        </motion.h3>
                        
                        <motion.div 
                            variants={modalItemVariants}
                            className="inline-block px-3 py-1 mb-4 border border-current pixel-text text-[7px] bg-black/40" 
                            style={{ color: showCharacter.color }}
                        >
                            {showCharacter.rarity}
                        </motion.div>

                        <motion.p 
                            variants={modalItemVariants}
                            className="font-mono text-gray-300 text-[10px] leading-relaxed mb-5 italic max-w-[280px]"
                        >
                           "{showCharacter.description}"
                        </motion.p>

                        <motion.div 
                            variants={modalItemVariants}
                            className="bg-black/60 p-3 rounded border border-gray-800 text-left w-full mb-6 font-mono"
                        >
                            <div className="pixel-text text-arcade-pink text-[7px] mb-1.5 tracking-wider font-bold">EMOTIONAL QUIRK:</div>
                            <div className="text-gray-300 text-[10px] leading-relaxed italic">
                                {showCharacter.quirk}
                            </div>
                        </motion.div>

                        <motion.button 
                            variants={modalItemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                playPixelClick();
                                setShowCharacter(null);
                                setGameState('idle');
                                setMessage("");
                                setCaughtItem(null);
                                setRevealStep('none');
                                setDroppingCapsuleY(null);
                            }}
                            className="w-full py-2.5 bg-white text-black font-semibold pixel-text text-[9px] hover:bg-arcade-cyan hover:text-black transition-colors shadow-[0_3px_0_rgba(180,180,180,1)] border border-gray-100 uppercase"
                        >
                            KEEP FRIEND
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
