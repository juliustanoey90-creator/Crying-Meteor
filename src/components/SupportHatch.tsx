import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Coins, Flame, Sparkles, Heart, ExternalLink, HelpCircle, Tablet } from "lucide-react";
import { playCoinSound, playPixelClick, playLightFlickerSound } from "../utils/audio";
import QrSupportModal from "./QrSupportModal";

interface SupportHatchProps {
  onCoinDropped?: () => void;
}

export default function SupportHatch({ onCoinDropped }: SupportHatchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [coinsSlipped, setCoinsSlipped] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  // Load coins slipped from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem("crying_meteor_coins_slipped");
    if (stored) {
      const val = parseInt(stored, 10);
      if (!isNaN(val)) setCoinsSlipped(val);
    }
  }, []);

  const handleToggleHatch = () => {
    playLightFlickerSound();
    setIsOpen(!isOpen);
  };

  const handleSlipCoin = () => {
    playCoinSound();
    const nextCoins = coinsSlipped + 1;
    setCoinsSlipped(nextCoins);
    localStorage.setItem("crying_meteor_coins_slipped", String(nextCoins));

    // Spawn floating coin particles rising out of the slot
    const id = Date.now();
    const newParticle = {
      id,
      x: (Math.random() - 0.5) * 30, // slight random offset left/right
      y: -50 - Math.random() * 40 // upwards travel
    };
    setParticles((prev) => [...prev, newParticle]);

    // Cleanup particle after animation finishes
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 1200);

    // Call optional callback (to trigger parent reactions/drifting emojis)
    if (onCoinDropped) {
      onCoinDropped();
    }
  };

  const realSupportUrl = (import.meta as any).env?.VITE_SUPPORT_URL || "https://cryingmeteor.site/";

  // Calculate magical warmth parameters based on coins gifted
  const stardustLevel = Math.min(100, 35 + coinsSlipped * 5);
  const cozyTemp = 18 + Math.min(42, coinsSlipped * 1.8);

  let empathyMessage = "STARDUST BUFFER: EQUALIZED. The machine runs on starlight.";
  if (coinsSlipped > 15) {
    empathyMessage = "HEART STATE: OVERJOYED. The creature spirits are dancing around the offering cup!";
  } else if (coinsSlipped > 5) {
    empathyMessage = "HEART STATE: COZY & WARM. The stardust fills the screen with cozy glows.";
  } else if (coinsSlipped > 0) {
    empathyMessage = "HEART STATE: APPRECIATIVE. A small wave of nostalgia sweeps the cabinet.";
  }

  return (
    <div className="w-full mt-4 flex flex-col items-center">
      {/* Container double border border slot */}
      <div 
        className="w-full bg-slate-950/90 border-4 border-double border-arcade-pink/30 p-3 rounded shadow-xl relative"
        style={{
          boxShadow: isOpen 
            ? "inset 0 0 25px rgba(244,63,94,0.08), 0 4px 20px rgba(0,0,0,0.5)" 
            : "0 4px 20px rgba(0,0,0,0.4)"
        }}
      >
        {/* CLOSED STATE */}
        {!isOpen ? (
          <div className="flex items-center justify-between gap-3 selection:bg-transparent">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <Sparkles size={12} className="text-arcade-pink animate-pulse" />
                <span className="absolute -top-1.5 -right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="pixel-text text-[8px] text-pink-400 uppercase tracking-widest">
                  TINY ARCADE OFFERINGS
                </span>
                <span className="font-mono text-[7.5px] text-gray-500 truncate">
                  A subtle corner to send stardust • Optional tip jar
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleHatch}
              className="px-2.5 py-1 text-[8.5px] pixel-text text-gray-400 hover:text-arcade-pink hover:bg-slate-900/40 active:translate-y-0.5 border border-gray-800 hover:border-arcade-pink/40 bg-black/40 rounded transition-all cursor-pointer shrink-0"
              title="Peer inside the Wishing Well"
            >
              [ CHERISH ]
            </button>
          </div>
        ) : (
          /* OPEN STATE WITH ENRICHED EXPANDABLE HATCH INTERIOR */
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-col gap-3 relative z-10"
          >
            {/* Header row to close */}
            <div className="flex items-center justify-between border-b border-gray-900 pb-1.5">
              <div className="flex items-center gap-1.5">
                <Heart size={10} className="text-arcade-pink fill-arcade-pink/30" />
                <span className="pixel-text text-[7.5px] text-arcade-pink uppercase tracking-widest">
                  COSMIC WISHING WELL
                </span>
              </div>
              <button
                onClick={handleToggleHatch}
                className="font-mono text-[8px] text-gray-500 hover:text-white px-1.5 py-0.5 border border-gray-900 hover:border-gray-700 rounded transition-all cursor-pointer"
              >
                [ LEAVE ALONE ]
              </button>
            </div>

            {/* Recessed chamber for coin mechanics */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-black/75 p-3.5 border-2 border-slate-900 rounded shadow-inner relative overflow-hidden">
              
              {/* Scanline CRT style subtle glow inside hatch */}
              <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-transparent pointer-events-none" />

              {/* COIN COUPLER MECHANISM COLUMN */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center p-2 border border-dashed border-gray-900 rounded relative shrink-0 min-h-[110px] bg-black">
                
                {/* Glowing LED slots cutout in classic retro arcade format (100-coin backlit) */}
                <div className="relative mb-2 flex items-center justify-center">
                  
                  {/* Outer coin slot body */}
                  <div className="w-8 h-12 bg-zinc-950 border-2 border-pink-900/30 rounded flex flex-col items-center justify-between py-1 relative shadow-[0_0_12px_rgba(244,63,94,0.06)]">
                    
                    {/* Tiny embossed retro texts */}
                    <span className="font-mono text-[4px] text-pink-600 scale-75 leading-none">WISH CUP</span>
                    
                    {/* The glowing orange backlit slit */}
                    <motion.div 
                      key={coinsSlipped}
                      onClick={handleSlipCoin}
                      className="w-1.5 h-6 bg-pink-500 rounded cursor-pointer relative shadow-[0_0_8px_rgba(244,63,94,1)]"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Inside black insert slot cover cut */}
                      <span className="absolute inset-x-0.5 inset-y-1 bg-black rounded" />
                    </motion.div>

                    <span className="font-mono text-[4.5px] text-pink-500 scale-75 leading-none font-bold">COSY</span>
                  </div>

                  {/* Active floating indicator light */}
                  <span className="absolute -top-1 -right-4 flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-pink-500"></span>
                  </span>

                  {/* Particle effects spawning from the coin insert center locally */}
                  <AnimatePresence>
                    {particles.map((p) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 1, scale: 0.6, y: 0, x: p.x }}
                        animate={{ opacity: 0, scale: 1.4, y: p.y, rotate: 180 }}
                        transition={{ duration: 1.1, ease: "easeOut" }}
                        className="absolute text-pink-400 pointer-events-none select-none text-xs font-mono font-bold"
                      >
                        💖
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Drop Coin Trigger */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSlipCoin}
                  className="px-3 py-1.5 bg-pink-500/10 border border-pink-500/30 text-[8.5px] pixel-text text-pink-400 hover:text-white hover:bg-pink-500/20 active:bg-pink-500/30 transition-all rounded shadow-[0_0_10px_rgba(244,63,94,0.1)] cursor-pointer"
                >
                  TOSS WISH COIN
                </motion.button>
              </div>

              {/* COGNITIVE DATA AND WARMTH CONTROLS */}
              <div className="sm:col-span-7 flex flex-col gap-2 relative">
                
                {/* Vintage Diagnostic Terminal */}
                <div className="font-mono text-[8px] text-gray-400 space-y-1">
                  <div className="flex justify-between border-b border-gray-950 pb-0.5">
                    <span>WISHES OFFERED:</span>
                    <span className="text-pink-400 font-bold">{coinsSlipped} 🪙</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-950 pb-0.5">
                    <span>STARDUST AMPLITUDE:</span>
                    <span className="text-arcade-cyan">{stardustLevel}% RESONANT</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-950 pb-0.5">
                    <span>CABINET EMPATHY TEMP:</span>
                    <span className="text-pink-300">{cozyTemp.toFixed(1)}°C POETIC</span>
                  </div>
                </div>

                {/* Led Warmth Meter Progress */}
                <div className="w-full flex flex-col gap-1 mt-1">
                  <div className="w-full h-1.5 bg-gray-950 rounded border border-gray-900 p-[1px] overflow-hidden flex">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-pink-600 via-purple-500 to-indigo-400 rounded-sm"
                      style={{ width: `${Math.min(100, 15 + coinsSlipped * 7)}%` }}
                      layout
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <span className="font-mono text-[7.5px] text-gray-500 italic leading-snug">
                    {empathyMessage}
                  </span>
                </div>
              </div>

            </div>

            {/* Cozy Personal retrospective story about support */}
            <div className="border border-gray-900 bg-slate-950/40 p-2.5 rounded flex flex-col gap-2">
              <p className="font-mono text-[9px] text-gray-400 leading-relaxed">
                "This quiet cup sits in a dusty corner of the cabinet. Sometimes, kind travelers leave a small arcade coin behind to help keep the cozy screen warm and the nostalgic neon glowing through the dark. It is a gentle, optional gesture that means the world to the soft spirits who live here."
              </p>

              {/* Genuine, subtle support portal invitation */}
              <div className="border-t border-dashed border-gray-905 pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                <div className="flex items-center gap-1.5">
                  <Heart size={9} className="text-pink-500 fill-pink-500 animate-pulse" />
                  <span className="pixel-text text-[7px] text-gray-500 tracking-wider">
                    TINY OFFERINGS & APPRECIATION
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 items-center justify-center">
                  <button
                    onClick={() => {
                      playCoinSound();
                      setIsQrOpen(true);
                    }}
                    className="px-2.5 py-1 text-[8.5px] pixel-text text-pink-400 hover:text-white hover:bg-pink-950/30 border border-pink-500/30 hover:border-pink-500/70 bg-black/55 rounded transition-all cursor-pointer flex items-center gap-1 shrink-0 active:translate-y-0.5"
                  >
                    <span>[ KEEP THE ARCADE GLOWING ]</span>
                  </button>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </div>

      {/* QRIS / GoPay Hidden Drawer Compartment Modal */}
      <QrSupportModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
    </div>
  );
}
