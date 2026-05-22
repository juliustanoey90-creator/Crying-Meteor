import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect, useRef } from "react";
import { CHARACTERS, COLLECTION_SETS } from "../data/characters";
import { Character, Rarity } from "../types";
import PixelSprite from "./PixelSprite";
import CollectibleCard from "./CollectibleCard";
import {
  playCoinSound,
  playMoveTick,
  playSuccessFanfare,
  playLightFlickerSound,
} from "../utils/audio";
import { 
  Heart, 
  Sparkles, 
  X, 
  Lock, 
  BookOpen, 
  Library, 
  FolderHeart,
  Grid,
  TrendingUp,
  Bookmark,
  HelpCircle,
  Eye,
  Minimize2,
  Wrench
} from "lucide-react";

interface CollectionRoomProps {
  ambientActive: boolean;
  onBack: () => void;
  onPowerDownChange?: (active: boolean) => void;
  onResetCollection?: () => void;
}

export default function CollectionRoom({ 
  ambientActive, 
  onBack,
  onPowerDownChange,
  onResetCollection
}: CollectionRoomProps) {
  // Collection & Favorite storage states
  const [collectedIds, setCollectedIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  
  // Interactive UI states
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [activeCardCharacter, setActiveCardCharacter] = useState<Character | null>(null);
  const [viewMode, setViewMode] = useState<"scrapbook" | "shelf">("shelf");
  const [rarityFilter, setRarityFilter] = useState<"ALL" | Rarity>("ALL");
  const [activeThemeFilter, setActiveThemeFilter] = useState<"ALL" | string>("indonesian_folklore");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const muted = !ambientActive;

  // Maintenance Hatch Local States
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);
  const [resetStage, setResetStage] = useState<"idle" | "confirming" | "flickering" | "complete">("idle");

  const handleReleaseSpirits = () => {
    if (!muted) playLightFlickerSound();
    setResetStage("flickering");
    if (onPowerDownChange) onPowerDownChange(true);

    // Simulate authentic electrical power flicker ticks and fluorescent tube crackling sound effects
    let tickCount = 0;
    const ticker = setInterval(() => {
      if (!muted) playLightFlickerSound();
      tickCount++;
      if (tickCount >= 6) {
        clearInterval(ticker);
      }
    }, 280);

    // Clear progress on device memory under emotional atmospheric transition and shut off illumination levels
    setTimeout(() => {
      localStorage.removeItem("crying_meteor_favorites");
      const defaultCollected: string[] = [];
      localStorage.setItem("crying_meteor_collected", JSON.stringify(defaultCollected));
      
      setCollectedIds(defaultCollected);
      setFavoriteIds([]);
      
      if (onPowerDownChange) onPowerDownChange(false);
      setResetStage("complete");

      if (onResetCollection) {
        onResetCollection();
      }

      setTimeout(() => {
        setResetStage("idle");
        setIsMaintenanceOpen(false);
      }, 3500);
    }, 3200);
  };

  // Load collected from LocalStorage and seed with defaults if empty
  useEffect(() => {
    try {
      const stored = localStorage.getItem("crying_meteor_collected");
      const favorites = localStorage.getItem("crying_meteor_favorites");
      
      let collectedList: string[] = [];
      if (stored) {
        collectedList = JSON.parse(stored);
      } else {
        collectedList = [];
        localStorage.setItem("crying_meteor_collected", JSON.stringify(collectedList));
      }
      setCollectedIds(collectedList);

      if (favorites) {
        setFavoriteIds(JSON.parse(favorites));
      }
    } catch (e) {
      console.error("Local storage error in collection loading", e);
      // Fallback
      setCollectedIds([]);
    }
    
    // Play enter ambient sound
    setTimeout(() => {
      playSuccessFanfare();
    }, 100);
  }, []);

  // Update favorites to localStorage helper
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (!muted) playMoveTick();
    
    setFavoriteIds((prev) => {
      const isAlreadyFav = prev.includes(id);
      const next = isAlreadyFav ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem("crying_meteor_favorites", JSON.stringify(next));
      return next;
    });
  };

  // Helper to check status
  const isCollected = (id: string) => collectedIds.includes(id);
  const isFavorite = (id: string) => favoriteIds.includes(id);

  // Calculate stats based on the active theme filter so it reflects only the discoverable spirits
  const activeSetCharacters = activeThemeFilter === "ALL" 
    ? CHARACTERS 
    : CHARACTERS.filter((c) => c.themeId === activeThemeFilter);

  const totalCharacters = activeSetCharacters.length;
  const collectedCount = activeSetCharacters.filter((c) => isCollected(c.id)).length;
  const progressPercent = totalCharacters > 0 ? Math.round((collectedCount / totalCharacters) * 100) : 0;

  // Filtered characters list including themed sets filtering
  const filteredCharacters = CHARACTERS.filter((char) => {
    const matchRarity = rarityFilter === "ALL" || char.rarity === rarityFilter;
    const matchFav = !showOnlyFavorites || isFavorite(char.id);
    const matchTheme = activeThemeFilter === "ALL" || char.themeId === activeThemeFilter;
    return matchRarity && matchFav && matchTheme;
  });

  // Highlight/inspect a ghost
  const inspectGhost = (char: Character) => {
    if (!isCollected(char.id)) {
      if (!muted) playLightFlickerSound();
      return; 
    }
    if (!muted) playCoinSound();
    setSelectedCharacter(char);
  };

  // Ambient particles state
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);
  useEffect(() => {
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * -10,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto bg-slate-950/90 border-4 border-gray-800 rounded-lg shadow-2xl p-4 md:p-6 overflow-hidden z-20">
      
      {/* Floating Ambient Sparks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: "100%" }}
            animate={{
              opacity: [0, 0.4, 0.7, 0.4, 0],
              y: ["110%", "-10%"],
              x: ["0%", `${(Math.random() - 0.5) * 40}%`]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: "rgba(255, 105, 180, 0.35)",
              boxShadow: "0 0 10px rgba(255, 105, 180, 0.8), 0 0 4px rgba(0, 255, 255, 0.6)",
              borderRadius: "50%",
            }}
          />
        ))}
      </div>

      {/* Header Panel */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4 border-b-2 border-gray-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-arcade-pink rounded-sm animate-pulse" />
            <h1 className="pixel-text text-lg sm:text-xl md:text-2xl text-arcade-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.4)]">
              FORGOTTEN ARCHIVE
            </h1>
          </div>
          <p className="font-mono text-[10px] sm:text-xs text-gray-500 max-w-lg leading-relaxed">
            A dusty scrapbook of misunderstood spirits. Gently recovered from broken claw machines, resting on cold cozy shelves.
          </p>
        </div>

        {/* Back and ESCAPE Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => {
              if (!muted) playCoinSound();
              onBack();
            }}
            className="px-4 py-2 bg-gray-900 border-b-4 border-r-4 border-gray-950 hover:bg-gray-800 hover:text-arcade-cyan active:border-b-2 active:border-r-2 active:translate-y-0.5 active:translate-x-0.5 text-white pixel-text text-xs tracking-wider transition-all"
          >
            [ ESCAPE ROOM ]
          </button>
        </div>
      </div>

      {/* Stat Bar Dashboard */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/60 border-2 border-dashed border-gray-800 p-3 sm:p-4 rounded-md mb-6 relative">
        <div className="flex flex-col">
          <span className="pixel-text text-[8px] text-gray-500 uppercase tracking-widest">DISCOVERED RATE</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="pixel-text text-base md:text-lg text-arcade-pink">{collectedCount}</span>
            <span className="font-mono text-xs text-gray-600">/</span>
            <span className="font-mono text-xs text-gray-400">{totalCharacters}</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="pixel-text text-[8px] text-gray-500 uppercase tracking-widest">DIGITAL INDEX</span>
          <div className="w-full bg-gray-900 h-2 rounded overflow-hidden mt-2 border border-gray-800">
            <motion.div 
              className="bg-arcade-pink h-full shadow-[0_0_10px_rgba(255,0,255,0.6)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
          <span className="font-mono text-[9px] text-gray-500 text-right mt-1">{progressPercent}% SYNCED</span>
        </div>

        <div className="flex flex-col">
          <span className="pixel-text text-[8px] text-gray-500 uppercase tracking-widest font-bold">FAVORITES</span>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Heart size={14} className="text-arcade-pink fill-arcade-pink animate-pulse" />
            <span className="pixel-text text-xs sm:text-sm text-gray-300">{favoriteIds.length} AWKWARD BFFs</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="pixel-text text-[8px] text-gray-500 uppercase tracking-widest">HARDWARE</span>
          <span className="font-mono text-[9px] text-emerald-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
            VIRTUAL ROM_OK
          </span>
        </div>
      </div>

      {/* Dynamic Collection Cartridges Tray (Expandable Category Tabs) - Hidden for now, kept for later build */}
      {false && (
      <div className="relative z-10 bg-slate-900/10 border-2 border-gray-800 p-3 rounded-lg mb-6 shadow-sm">
        <div className="flex items-center gap-1.5 mb-2 pb-1 border-b border-gray-900">
          <Library size={12} className="text-arcade-cyan animate-pulse" />
          <span className="pixel-text text-[7.5px] text-gray-400">ARCHIVE COLLECTIONS (FILTER BY SYSTEMSET)</span>
          {activeThemeFilter !== "ALL" && (
            <button 
              onClick={() => { if (!muted) playMoveTick(); setActiveThemeFilter("ALL"); }}
              className="ml-auto font-mono text-[7px] text-arcade-pink hover:underline uppercase cursor-pointer"
            >
              [ RESET TO ALL ]
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {/* ALL Button */}
          <button
            onClick={() => {
              if (!muted) playMoveTick();
              setActiveThemeFilter("ALL");
            }}
            className={`py-1.5 px-3 border rounded text-[9px] pixel-text transition-all cursor-pointer flex items-center gap-1 leading-none ${
              activeThemeFilter === "ALL"
                ? "bg-slate-900 text-arcade-cyan border-arcade-cyan shadow-[0_0_8px_rgba(34,211,238,0.2)]"
                : "bg-black/45 text-gray-550 border-gray-850 hover:text-gray-300 hover:border-gray-700"
            }`}
          >
            <span>🌌</span>
            <span>ALL BEINGS</span>
          </button>

          {COLLECTION_SETS.map((set) => {
            const isSelected = set.id === activeThemeFilter;
            const setTotal = CHARACTERS.filter(c => c.themeId === set.id).length;
            const setCollected = CHARACTERS.filter(c => c.themeId === set.id && isCollected(c.id)).length;
            
            return (
              <button
                key={set.id}
                onClick={() => {
                  if (!muted) playMoveTick();
                  setActiveThemeFilter(set.id);
                }}
                className={`py-1.5 px-2.5 border rounded text-[9px] pixel-text transition-all cursor-pointer flex items-center gap-1.5 leading-none relative ${
                  isSelected
                    ? "bg-slate-900/90 text-white"
                    : "bg-black/45 text-gray-400 border-gray-850 hover:text-gray-300 hover:border-gray-700"
                }`}
                style={{ 
                  borderColor: isSelected ? set.accentColor : undefined,
                  boxShadow: isSelected ? `0 0 10px ${set.accentColor}25` : "none"
                }}
              >
                <span>{set.seasonalEvent.icon}</span>
                <span>{set.name.toUpperCase()}</span>
                
                {/* Progress Mini Badge */}
                <span className="font-mono text-[7px] py-0.5 px-1 bg-black/40 rounded text-gray-405 border border-white/5 font-bold">
                  {setCollected}/{setTotal}
                </span>

                {setCollected === setTotal && setTotal > 0 && (
                  <span className="text-[7.5px] text-yellow-400 absolute -top-1 -right-1 animate-bounce">★</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      )}

      {/* Control Filters Toolbar */}
      <div className="relative z-10 flex flex-wrap gap-2 items-center justify-between mb-6 bg-slate-900/40 p-2.5 rounded border border-gray-800/60">
        
        {/* Toggle Layout Views */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              if (!muted) playMoveTick();
              setViewMode("shelf");
            }}
            className={`px-3 py-1.5 rounded text-[9px] sm:text-[10px] pixel-text flex items-center gap-1.5 transition-all ${
              viewMode === "shelf" 
              ? "bg-arcade-pink text-white shadow-[0_0_10px_rgba(255,0,255,0.3)]" 
              : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white"
            }`}
          >
            <Library size={12} />
            <span>SHELF VIEW</span>
          </button>
          
          <button
            onClick={() => {
              if (!muted) playMoveTick();
              setViewMode("scrapbook");
            }}
            className={`px-3 py-1.5 rounded text-[9px] sm:text-[10px] pixel-text flex items-center gap-1.5 transition-all ${
              viewMode === "scrapbook" 
              ? "bg-arcade-cyan text-black font-semibold shadow-[0_0_10px_rgba(0,255,255,0.3)]" 
              : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white"
            }`}
          >
            <BookOpen size={12} />
            <span>SCRAPBOOK</span>
          </button>
        </div>

        {/* Filter Selection Panel */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Favorites filter toggle */}
          <button
            onClick={() => {
              if (!muted) playMoveTick();
              setShowOnlyFavorites(!showOnlyFavorites);
            }}
            className={`p-1 px-2.5 rounded text-[9px] sm:text-[10px] pixel-text transition-all border flex items-center gap-1 ${
              showOnlyFavorites
                ? "border-pink-500 bg-pink-950/50 text-pink-300"
                : "border-gray-800 bg-gray-900 text-gray-400 hover:text-white"
            }`}
          >
            <Heart size={10} className={showOnlyFavorites ? "fill-current" : ""} />
            <span>FAVES ONLY</span>
          </button>

          {/* Rarity filter selector */}
          <div className="flex items-center gap-1">
            <span className="pixel-text text-[8px] text-gray-500 mr-1 hidden sm:inline">RARITY:</span>
            {(["ALL", "COMMON", "UNCOMMON", "RARE", "LEGENDARY"] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  if (!muted) playMoveTick();
                  setRarityFilter(r);
                }}
                className={`px-2 py-1 text-[8px] pixel-text rounded ${
                  rarityFilter === r
                    ? "bg-gray-100 text-black border border-white"
                    : "bg-black text-gray-400 hover:text-white hover:bg-gray-900 border border-gray-800"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Core Grid Container */}
      <div className="relative z-10">
        
        {/* SHELF VIEW */}
        {viewMode === "shelf" && (
          <div className="flex flex-col gap-8 pb-4">
            {/* Split characters by shelf rows for cozy feeling */}
            {filteredCharacters.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-800 rounded bg-black/40">
                <HelpCircle className="mx-auto text-gray-600 mb-2" size={24} />
                <p className="pixel-text text-[10px] text-gray-500 uppercase tracking-widest">No spirits found matching these dials.</p>
                <p className="font-mono text-[9px] text-gray-650 mt-1">Try toggling filters or win more friends inside the machine!</p>
              </div>
            ) : (
              // Grouped in virtual shelves (of 4 items each)
              Array.from({ length: Math.ceil(filteredCharacters.length / 4) }).map((_, shelfIdx) => {
                const shelfItems = filteredCharacters.slice(shelfIdx * 4, shelfIdx * 4 + 4);
                return (
                  <div key={shelfIdx} className="relative flex flex-col pt-4">
                    {/* Items on this shelf */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 px-4 z-10">
                      {shelfItems.map((char) => {
                        const caught = isCollected(char.id);
                        const fav = isFavorite(char.id);
                        
                        return (
                          <motion.div
                            key={char.id}
                            whileHover={caught ? { y: -8, scale: 1.03 } : {}}
                            onClick={() => inspectGhost(char)}
                            className={`group relative cursor-pointer flex flex-col items-center p-3 rounded-md transition-all border-2 select-none ${
                              caught 
                                ? "bg-slate-900/80 hover:bg-slate-900 active:scale-95" 
                                : "bg-black/60 border-gray-900 cursor-not-allowed opacity-70"
                            }`}
                            style={{ 
                              borderColor: caught ? `${char.color}30` : "transparent",
                              boxShadow: caught ? `0 0 15px ${char.color}10` : "none" 
                            }}
                          >
                            {/* Color Glow Backplate when hovering */}
                            {caught && (
                              <div 
                                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded"
                                style={{ backgroundColor: char.color }}
                              />
                            )}

                            {/* Top row with rarity label/lock */}
                            <div className="w-full flex items-center justify-between pb-1 h-4">
                              {caught ? (
                                <span 
                                  className="pixel-text text-[6px] tracking-wide px-1.5 py-0.5 rounded border border-current leading-none"
                                  style={{ color: char.color }}
                                >
                                  {char.rarity}
                                </span>
                              ) : (
                                <span className="pixel-text text-[6px] text-gray-700 uppercase">[ LOCK ]</span>
                              )}

                              {/* Favorite Heart trigger */}
                              {caught && (
                                <motion.button
                                  whileTap={{ scale: 0.8 }}
                                  onClick={(e) => toggleFavorite(char.id, e)}
                                  className="text-gray-500 hover:text-arcade-pink p-0.5 z-20"
                                >
                                  <Heart 
                                    size={11} 
                                    className={`${fav ? "text-arcade-pink fill-arcade-pink" : "text-gray-650"}`} 
                                  />
                                </motion.button>
                              )}
                            </div>

                            {/* Sprite image in glowing frame */}
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center my-2 border border-gray-800/40 bg-black/40 rounded-sm">
                              {caught ? (
                                <>
                                  <motion.div
                                    animate={{ y: [0, -3, 0] }}
                                    transition={{
                                      duration: 3 + Math.random() * 2,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                      delay: Math.random() * 2,
                                    }}
                                    className="relative z-10"
                                  >
                                    <PixelSprite 
                                      sprite={char.sprite} 
                                      characterId={char.id}
                                      color={char.color}
                                      className="w-18 h-18 sm:w-22 sm:h-22"
                                    />
                                  </motion.div>
                                  {/* Rarity ambient spark */}
                                  {char.rarity === "LEGENDARY" && (
                                    <Sparkles size={14} className="absolute text-yellow-400 right-1 top-1 animate-pulse" />
                                  )}
                                </>
                              ) : (
                                <div className="flex flex-col items-center gap-1 opacity-40">
                                  <Lock size={18} className="text-gray-600" />
                                  <span className="pixel-text text-[5px] text-gray-500">UNDISCOVERED</span>
                                </div>
                              )}
                            </div>

                            {/* Name caption */}
                            <div className="text-center w-full z-10">
                              <span 
                                className={`pixel-text text-[9px] uppercase tracking-wide truncate block ${
                                  caught ? "text-white" : "text-gray-600 font-mono"
                                }`}
                              >
                                {caught ? char.name : "????????"}
                              </span>
                              <span className="font-mono text-[7px] text-gray-500 block mt-0.5">
                                {caught ? `COLL. #${char.id.slice(-3)}` : "LOCKED SPIRIT"}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Cozy Wooden/Glass Shelf Plate with Shadow underneath */}
                    <div className="relative w-full h-4 mt-2 z-0">
                      {/* Top plate */}
                      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-b border-gray-700/60 shadow-[0_4px_12px_rgba(0,0,0,0.8)]" />
                      {/* Front face projection */}
                      <div className="absolute inset-x-0 top-[6px] h-1.5 bg-[var(--color-arcade-black)] border-b border-gray-900" />
                      {/* Neon alignment strip highlighting the shelf bottom */}
                      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-sky-500/20 shadow-[0_0_8px_rgba(56,189,248,0.3)]" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* SCRAPBOOK VIEW */}
        {viewMode === "scrapbook" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
            {filteredCharacters.length === 0 ? (
              <div className="col-span-full text-center py-12 border border-dashed border-gray-800 rounded bg-black/40">
                <HelpCircle className="mx-auto text-gray-600 mb-2" size={24} />
                <p className="pixel-text text-[10px] text-gray-500 uppercase tracking-widest">SCRAPBOOK CATALOG IS EMPTY.</p>
              </div>
            ) : (
              filteredCharacters.map((char) => {
                const caught = isCollected(char.id);
                const fav = isFavorite(char.id);

                return (
                  <motion.div
                    key={char.id}
                    layoutId={`scrap-card-${char.id}`}
                    whileHover={caught ? { scale: 1.02 } : {}}
                    onClick={() => inspectGhost(char)}
                    className={`relative p-4 rounded-lg border-2 flex gap-4 overflow-hidden select-none select-none transition-all ${
                      caught 
                        ? "bg-slate-900/60 hover:bg-slate-900/90 border-gray-800/80 cursor-pointer" 
                        : "bg-black/60 border-gray-950 cursor-not-allowed opacity-60"
                    }`}
                  >
                    {/* Notebook grid line background subtle */}
                    <div className="absolute inset-0 opacity-5 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:12px_12px]" />

                    {/* Polaroid-like Frame for Ghost */}
                    <div className={`relative w-28 h-28 sm:w-32 sm:h-32 p-1.5 flex flex-col bg-white border border-gray-350 shadow-md transform -rotate-1 self-center shrink-0 ${caught ? "" : "brightness-50"}`}>
                      <div className="relative w-full h-[85%] bg-zinc-950 flex items-center justify-center overflow-hidden">
                        {caught ? (
                          <PixelSprite 
                            sprite={char.sprite} 
                            characterId={char.id}
                            color={char.color}
                            className="w-18 h-18"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-gray-600">
                            <Lock size={12} />
                            <span className="pixel-text text-[4px]">LOCKED</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-black px-1">
                        <span className="font-mono text-[6px] tracking-tight font-semibold">
                          {caught ? `NO. ${char.id.slice(-3)}` : "NO. ???"}
                        </span>
                        {caught && fav && (
                          <Heart size={8} className="text-arcade-pink fill-arcade-pink" />
                        )}
                      </div>
                    </div>

                    {/* Metadata specs */}
                    <div className="flex flex-col justify-between py-1 flex-1 z-10">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span 
                            className="pixel-text text-[7px] uppercase px-1.5 py-0.5 rounded bg-black/40 border border-current inline-block font-bold leading-none"
                            style={{ color: caught ? char.color : "#555555" }}
                          >
                            {caught ? char.rarity : "?????"}
                          </span>
                          
                          {caught && (
                            <button
                              onClick={(e) => toggleFavorite(char.id, e)}
                              className="text-gray-500 hover:text-arcade-pink p-0.5"
                            >
                              <Heart size={12} className={fav ? "text-arcade-pink fill-arcade-pink" : ""} />
                            </button>
                          )}
                        </div>

                        <h3 className="pixel-text text-xs sm:text-sm text-white mb-1 tracking-wide">
                          {caught ? char.name : "UNRECOVERED SPIRIT"}
                        </h3>

                        <p className="font-mono text-[9px] sm:text-[10px] text-gray-400 leading-snug line-clamp-2 italic mb-2">
                          {caught ? `"${char.description}"` : "You haven't recovered this companion. Play the claw machine to capture their capsule."}
                        </p>
                      </div>

                      {/* Display Emotional quirk preview if captured */}
                      {caught ? (
                        <div className="bg-black/40 p-1.5 px-2 border border-gray-850 rounded font-mono text-[8px] sm:text-[9px] text-gray-300 leading-relaxed">
                          <span className="text-arcade-pink font-bold block pixel-text text-[6px] mb-0.5">QUIRK:</span>
                          <span className="line-clamp-2">{char.quirk}</span>
                        </div>
                      ) : (
                        <span className="pixel-text text-[6.5px] text-gray-650">* COAX OUT WITHArcade TOKEN *</span>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Maintenance Panel Hatch */}
      <div className="relative z-10 mt-8 max-w-md mx-auto">
        <div className="w-full bg-slate-950/80 border border-gray-900 rounded p-3 font-mono text-[8.5px] text-gray-500 space-y-3 relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 right-0 p-1 font-mono text-[6px] text-slate-700 select-none">
            PERSISTENCE_SYS_V2
          </div>

          {!isMaintenanceOpen ? (
            <>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>CABINET IDENTIFIER:</span>
                  <span className="text-gray-400 font-bold">METEOR_MALL_M10P</span>
                </div>
                <div className="flex justify-between">
                  <span>PERSISTENT OFF-LINE MEMORY:</span>
                  <span className="text-emerald-400 font-bold animate-pulse">● DEVICE_BASED_SECURE</span>
                </div>
                <div className="flex justify-between">
                  <span>RESTORE STATUS:</span>
                  <span className="text-gray-400">RESTORED ON REVISIT</span>
                </div>
                <div className="flex justify-between text-slate-500 italic mt-1.5 border-t border-dashed border-gray-900 pt-2 text-[8px] leading-snug">
                  <span>"The machine quietly keeps your collection safe. Your creatures are safely sleeping in this browser."</span>
                </div>
              </div>

              <div className="pt-1 flex justify-center">
                <button
                  onClick={() => {
                    if (!muted) {
                      playCoinSound();
                      playLightFlickerSound();
                    }
                    setIsMaintenanceOpen(true);
                  }}
                  className="px-2 py-1 text-[8px] pixel-text text-arcade-cyan hover:text-white border border-dashed border-gray-800 hover:border-arcade-cyan/60 rounded bg-slate-900/40 hover:bg-slate-900 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Wrench size={8} className="animate-spin-slow text-arcade-cyan" />
                  <span>OPEN MAINTENANCE PANEL</span>
                </button>
              </div>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2.5 pt-1"
            >
              <div className="flex items-center justify-between border-b border-gray-900 pb-1.5">
                <div className="flex items-center gap-1.5 text-arcade-pink">
                  <Wrench size={10} />
                  <span className="pixel-text text-[8px]">MAINTENANCE HATCH</span>
                </div>
                <button
                  onClick={() => {
                    if (!muted) playMoveTick();
                    setIsMaintenanceOpen(false);
                    setResetStage("idle");
                  }}
                  className="text-[7.5px] text-gray-500 hover:text-gray-300 border border-gray-900 px-1 py-0.5 rounded cursor-pointer"
                >
                  [ CLOSE ]
                </button>
              </div>

              {resetStage === "idle" && (
                <div className="space-y-2">
                  <div className="text-[8px] text-gray-400 space-y-1">
                    <p>
                      <span className="text-white font-semibold">DEVICE SAVECOUNT:</span> {collectedIds.length - 2} caught spirits.
                    </p>
                    <p className="leading-snug text-slate-500 italic">
                      Your characters are stored offline on this browser. Starting a new session resets this device's memory.
                    </p>
                  </div>

                  <div className="flex justify-center pt-1 border-t border-gray-900/50">
                    <button
                      onClick={() => {
                        if (!muted) playMoveTick();
                        setResetStage("confirming");
                      }}
                      className="w-full py-1 text-[7.5px] pixel-text text-pink-400 border border-pink-900/50 hover:bg-pink-950/25 hover:border-pink-500/55 transition-all rounded cursor-pointer"
                    >
                      Let the creatures wander again
                    </button>
                  </div>
                </div>
              )}

              {resetStage === "confirming" && (
                <div className="space-y-2 p-1.5 bg-pink-950/15 border border-pink-950/60 rounded">
                  <p className="text-[8px] text-pink-300 leading-relaxed font-mono">
                    "If you return them, they will slip quiet-like back into the abandoned mall ruins. The cabinet's offline reels will start a new night empty of spirits."
                  </p>
                  
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      onClick={() => {
                        if (!muted) playMoveTick();
                        setResetStage("idle");
                      }}
                      className="px-2 py-1 text-[7.5px] pixel-text text-gray-400 bg-black/40 border border-gray-900 hover:text-white rounded cursor-pointer"
                    >
                      Keep them close
                    </button>
                    <button
                      onClick={handleReleaseSpirits}
                      className="px-2.5 py-1 text-[7.5px] pixel-text text-pink-500 bg-pink-950/30 border border-pink-800/80 hover:bg-pink-950 hover:text-pink-400 hover:border-pink-500 rounded cursor-pointer"
                    >
                      Release spirits
                    </button>
                  </div>
                </div>
              )}

              {resetStage === "flickering" && (
                <div className="space-y-1.5 p-1 text-center animate-pulse">
                  <div className="text-yellow-500 select-none text-[8.5px] font-bold">● POWER SHUTOFF INTENSIFYING</div>
                  <p className="text-[7.5px] text-yellow-600 font-mono italic">
                    "Shutting down core grid tubes..."
                  </p>
                  <p className="text-[7.5px] text-emerald-400 font-mono">
                    Releasing lonely ghosts back to the arcade slot...
                  </p>
                </div>
              )}

              {resetStage === "complete" && (
                <div className="space-y-1.5 p-1 text-center animate-fadeIn text-emerald-400">
                  <div className="text-[8.5px] font-bold">● NEW NIGHT CALIBRATED</div>
                  <p className="text-[7.5px] font-mono italic text-emerald-400/90 leading-snug">
                    All spirits returned to the abandoned arcade shelter safely.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* FOOTER TIPS NOTE */}
      <div className="relative z-10 mt-8 border-t border-gray-900 pt-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4">
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-gray-500" />
          <span className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">
            TIP: Captured ghosts reveal their full bios, colors, and emotional quirks in depth.
          </span>
        </div>
        <div className="pixel-text text-[8px] text-gray-600">
          CRYING METEOR v1.0.9 — JAVA-SECURE
        </div>
      </div>

      {/* INSPECT DETAIL MODAL DIALOG (SCRAPBOOK DISCOVERY PORTRAIT) */}
      <AnimatePresence>
        {selectedCharacter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-start justify-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] bg-black/95 backdrop-blur-sm overflow-y-auto overscroll-contain"
          >
            {/* Modal Floating dust */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded bg-white w-1 h-1 opacity-20 animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.4}s`
                  }}
                />
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              style={{ 
                borderColor: selectedCharacter.color,
                boxShadow: `0 0 35px ${selectedCharacter.color}35`
              }}
              className="relative max-w-md w-full my-2 bg-slate-950 border-4 p-5 sm:p-6 rounded-lg text-center flex flex-col items-center overflow-hidden shrink-0"
            >
              {/* Scanline CRT overlay filter on inspection */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
              
              {/* Top Bar with dismiss button */}
              <div className="w-full flex items-center justify-between mb-4 z-10">
                <div className="pixel-text text-[7px] text-gray-500 tracking-widest uppercase">
                  COMPANION ENCYCLOPEDIA // COLLECTION NO. {selectedCharacter.id.slice(-3).toUpperCase()}
                </div>
                
                <button
                  onClick={() => {
                    if (!muted) playMoveTick();
                    setSelectedCharacter(null);
                  }}
                  className="p-1 text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 bg-gray-900 rounded cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Rarity & Star Column */}
              <div className="flex items-center gap-3 mb-2 z-10">
                <span 
                  className="pixel-text text-[7px] px-2 py-1 select-none border border-current rounded"
                  style={{ color: selectedCharacter.color }}
                >
                  {selectedCharacter.rarity}
                </span>

                <button
                  onClick={() => toggleFavorite(selectedCharacter.id)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded border border-gray-850 hover:border-gray-700 bg-gray-900 text-gray-400 hover:text-arcade-pink transition-all text-[8px] pixel-text cursor-pointer"
                >
                  <Heart size={10} className={`${isFavorite(selectedCharacter.id) ? "text-arcade-pink fill-arcade-pink animate-pulse" : "text-gray-500"}`} />
                  <span>{isFavorite(selectedCharacter.id) ? "AWKWARD BFF" : "MAKE BFF"}</span>
                </button>
              </div>

              {/* Grand Glowing Sprite Frame */}
              <div className="relative inline-block mb-3 p-4 shrink-0">
                <div 
                  className="absolute inset-0 blur-2xl opacity-40 rounded-full"
                  style={{ backgroundColor: selectedCharacter.color }}
                />
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <PixelSprite 
                    sprite={selectedCharacter.sprite} 
                    characterId={selectedCharacter.id}
                    color={selectedCharacter.color}
                    className="w-40 h-40 sm:w-48 sm:h-48"
                  />
                </motion.div>
              </div>

              {/* Character Details Box */}
              <div className="w-full text-center z-10">
                <h2 className="pixel-text text-base sm:text-lg text-white mb-2 uppercase drop-shadow-[0_2px_0_rgba(0,0,0,1)]">
                  {selectedCharacter.name}
                </h2>

                <p className="font-mono text-gray-300 text-[10.5px] italic leading-relaxed mb-4 max-w-sm mx-auto p-3 bg-black/40 border border-gray-900 rounded">
                  "{selectedCharacter.description}"
                </p>

                {/* Emotional Quirk block */}
                <div className="bg-slate-900/45 p-3 rounded-md border-2 border-gray-900 text-left font-mono mb-5 text-[10px] space-y-1">
                  <div className="pixel-text text-arcade-pink text-[7px] tracking-wider uppercase font-extrabold flex items-center gap-1">
                    <Sparkles size={8} />
                    <span>EMOTIONAL QUIRK:</span>
                  </div>
                  <p className="text-gray-200 leading-relaxed italic">
                    {selectedCharacter.quirk}
                  </p>
                </div>

                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={() => {
                      if (!muted) playCoinSound();
                      setActiveCardCharacter(selectedCharacter);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-arcade-pink to-pink-600 text-white font-semibold text-[9px] pixel-text hover:brightness-110 active:translate-y-0.5 transition-all shadow-[0_3px_0_rgba(150,0,70,1)] uppercase flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles size={10} className="animate-pulse text-yellow-300" />
                    <span>PRINT STICKER CARD</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!muted) playMoveTick();
                      setSelectedCharacter(null);
                    }}
                    className="w-full py-2 bg-zinc-900 border border-zinc-805 text-zinc-300 font-semibold text-[9px] pixel-text hover:bg-white hover:text-black transition-all shadow-[0_3px_0_rgba(50,50,50,1)] uppercase cursor-pointer"
                  >
                    CLOSE ARCHIVE
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collectible sticker card floating system */}
      <AnimatePresence>
        {activeCardCharacter && (
          <CollectibleCard 
            character={activeCardCharacter} 
            onClose={() => setActiveCardCharacter(null)}
            ambientActive={ambientActive}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
