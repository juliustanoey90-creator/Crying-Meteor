import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Character, Rarity } from "../types";
import { 
  X, 
  Sparkles, 
  HelpCircle, 
  Tv, 
  Award, 
  Heart, 
  Camera, 
  Download, 
  Zap, 
  Scissors,
  Check,
  Share2,
  Copy
} from "lucide-react";
import PixelSprite from "./PixelSprite";
import { playCoinSound, playMoveTick, playLightFlickerSound } from "../utils/audio";

interface CollectibleCardProps {
  character: Character;
  onClose: () => void;
  ambientActive?: boolean;
}

export default function CollectibleCard({ character, onClose, ambientActive = true }: CollectibleCardProps) {
  const [isFoil, setIsFoil] = useState(true);
  const [isCrtActive, setIsCrtActive] = useState(true);
  const [showGameFrame, setShowGameFrame] = useState(true);
  const [downloadState, setDownloadState] = useState<"idle" | "preparing" | "success" | "error">("idle");
  const [isFavorite, setIsFavorite] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "success">("idle");
  const [shareState, setShareState] = useState<"idle" | "success">("idle");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [discoveryTimestamp, setDiscoveryTimestamp] = useState("");
  const [awkwardStats, setAwkwardStats] = useState({ misunderstood: 85, softness: 90, clumsiness: 75 });

  useEffect(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const years = now.getFullYear();
    const months = pad(now.getMonth() + 1);
    const days = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    setDiscoveryTimestamp(`${years}-${months}-${days} ${hours}:${minutes} UTC`);

    // Procedural states from character metrics
    const m = (character.name.charCodeAt(0) * 7 + 13) % 25 + 75;
    const s = ((character.name.charCodeAt(1) || 65) * 9 + 4) % 20 + 80;
    const c = (character.description.length * 5 + 17) % 30 + 70;
    setAwkwardStats({ misunderstood: m, softness: s, clumsiness: c });
  }, [character]);

  const SHARE_REFLECTIONS = [
    "“Some creatures like being remembered.”",
    "“Another visitor carries this story now.”",
    "“Tiny ghosts travel surprisingly far.”",
    "“You slipped a tiny copper coin into someone else's memory.”",
    "“A quiet message drifting through the digital starfields.”",
    "“Your kindness is like a warm signal under a cold sky.”"
  ];

  const getShareUrl = () => {
    return `${window.location.origin}?find=${character.id}`;
  };

  const handleCopyLink = async () => {
    if (!muted) playMoveTick();
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopyState("success");
      const randomMsg = SHARE_REFLECTIONS[Math.floor(Math.random() * SHARE_REFLECTIONS.length)];
      setCustomMessage(randomMsg);
      setTimeout(() => {
        setCopyState("idle");
      }, 4000);
    } catch (err) {
      console.error("Clipboard write failed", err);
    }
  };

  const isShareSupported = typeof navigator !== "undefined" && !!navigator.share;

  const handleNativeShare = async () => {
    if (!muted) playCoinSound();
    
    const shareData = {
      title: `Crying Meteor — ${character.name}`,
      text: `Have you ever heard of ${character.name}? I discovered this emotionally awkward creature in a forgotten 8-bit claw machine!`,
      url: getShareUrl(),
    };

    if (isShareSupported) {
      try {
        await navigator.share(shareData);
        setShareState("success");
        const randomMsg = SHARE_REFLECTIONS[Math.floor(Math.random() * SHARE_REFLECTIONS.length)];
        setCustomMessage(randomMsg);
        setTimeout(() => setShareState("idle"), 4000);
      } catch (err) {
        console.log("Native share cancelled or failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(getShareUrl());
        setCopyState("success");
        setCustomMessage("“Native sharing unavailable. Slipped the companion's direct link into your clipboard instead!”");
        setTimeout(() => setCopyState("idle"), 4000);
      } catch (e) {
        console.error("Link fallback fail:", e);
      }
    }
  };
  
  // Card Mouse Tilt Coordinates for elegant interactive 3D perspective depth!
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const muted = !ambientActive;

  // Load existing favorites
  useEffect(() => {
    try {
      const favorites = localStorage.getItem("crying_meteor_favorites");
      if (favorites) {
        const parsed = JSON.parse(favorites);
        setIsFavorite(parsed.includes(character.id));
      }
    } catch {
      // Ignored
    }
  }, [character.id]);

  const toggleFavoriteLocal = () => {
    if (!muted) playMoveTick();
    try {
      const favoritesStr = localStorage.getItem("crying_meteor_favorites") || "[]";
      let favorites = JSON.parse(favoritesStr);
      if (isFavorite) {
        favorites = favorites.filter((id: string) => id !== character.id);
        setIsFavorite(false);
      } else {
        favorites.push(character.id);
        setIsFavorite(true);
      }
      localStorage.setItem("crying_meteor_favorites", JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  };

  // Card mouse movement interaction handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coords from -0.5 to 0.5
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;
    
    setTilt({
      x: mouseX * 25, // Max 25 degrees tilt
      y: mouseY * -25,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Safe color conversion utils to render shadows and sparkles with matching creature signatures
  const getRarityGlowHex = (rarity: Rarity) => {
    switch (rarity) {
      case "LEGENDARY": return "#c084fc"; // purple neon
      case "RARE": return "#fb7185"; // rose
      case "UNCOMMON": return "#38bdf8"; // sky blue
      default: return "#34d399"; // emerald
    }
  };

  const getRarityBadgeBg = (rarity: Rarity) => {
    switch (rarity) {
      case "LEGENDARY": return "bg-purple-950/80 border-purple-500/60 text-purple-300";
      case "RARE": return "bg-rose-950/80 border-rose-500/60 text-rose-300";
      case "UNCOMMON": return "bg-sky-950/80 border-sky-500/60 text-sky-300";
      default: return "bg-emerald-950/80 border-emerald-500/60 text-emerald-300";
    }
  };

  // Generate the download image directly on device client-side using Canvas!
  const downloadCardImage = async () => {
    if (!muted) playCoinSound();
    setDownloadState("preparing");

    try {
      // 1. Create canvas
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1200;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not initialize canvas context");

      // Set pixelated scale settings
      ctx.imageSmoothingEnabled = false;

      // 2. Background cosmic draw
      const gradient = ctx.createLinearGradient(0, 0, 0, 1200);
      gradient.addColorStop(0, "#080718");
      gradient.addColorStop(0.3, "#04040f");
      gradient.addColorStop(1, "#110b24");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 1200);

      // Draw vertical retro grid lines
      ctx.strokeStyle = "rgba(40, 30, 80, 0.4)";
      ctx.lineWidth = 1;
      for (let x = 0; x < 800; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1200);
        ctx.stroke();
      }
      for (let y = 0; y < 1200; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(800, y);
        ctx.stroke();
      }

      // Draw warm nebula circles
      const glowColor = getRarityGlowHex(character.rarity);
      const radGlow = ctx.createRadialGradient(400, 450, 50, 400, 450, 450);
      radGlow.addColorStop(0, `${glowColor}25`);
      radGlow.addColorStop(1, "transparent");
      ctx.fillStyle = radGlow;
      ctx.beginPath();
      ctx.arc(400, 400, 450, 0, Math.PI * 2);
      ctx.fill();

      // Draw starry pixel speckles
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      for (let i = 0; i < 40; i++) {
        const starX = Math.random() * 800;
        const starY = Math.random() * 1200;
        const size = Math.random() * 3 + 2;
        ctx.fillRect(starX, starY, size, size);
      }

      // 3. Draw outer double-layered 8-bit card frame
      ctx.strokeStyle = "rgba(100, 116, 139, 0.5)";
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, 740, 1140);

      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(37, 37, 726, 1126);

      // Cute corner brackets
      ctx.fillStyle = glowColor;
      // Top left
      ctx.fillRect(25, 25, 40, 12);
      ctx.fillRect(25, 25, 12, 40);
      // Top right
      ctx.fillRect(735, 25, 40, 12);
      ctx.fillRect(763, 25, 12, 40);
      // Bottom left
      ctx.fillRect(25, 1163, 40, 12);
      ctx.fillRect(25, 1135, 12, 40);
      // Bottom right
      ctx.fillRect(735, 1163, 40, 12);
      ctx.fillRect(763, 1135, 12, 40);

      // 4. Header metadata
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "bold 14px monospace";
      ctx.fillText("FORGOTTEN RECORD // VIRTUAL ARCADE SPECIMEN", 60, 80);
      
      const serialNum = `METEOR-${character.id.toUpperCase().replace("-", "_")}_09F`;
      ctx.textAlign = "right";
      ctx.fillText(serialNum, 740, 80);

      const timestampLabel = `STAMP: [${discoveryTimestamp || '2026-05-21 14:48 UTC'}]`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "left";
      ctx.fillText(timestampLabel, 60, 102);

      // 5. Draw big display box for character
      ctx.textAlign = "left";
      ctx.fillStyle = "#0c0a1a";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 4;
      ctx.fillRect(60, 120, 680, 520);
      ctx.strokeRect(60, 120, 680, 520);

      // Symmetrical physical corner screws (+)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 2;
      const drawScrew = (sx: number, sy: number) => {
        ctx.beginPath();
        ctx.moveTo(sx - 6, sy); ctx.lineTo(sx + 6, sy);
        ctx.moveTo(sx, sy - 6); ctx.lineTo(sx, sy + 6);
        ctx.stroke();
      };
      drawScrew(85, 145);
      drawScrew(715, 145);
      drawScrew(85, 615);
      drawScrew(715, 615);

      // Cyber scanlines inside the screen
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      for (let y = 120; y < 640; y += 4) {
        ctx.fillRect(60, y, 680, 2);
      }

      // Neon grid at viewport bottom
      const gridGradient = ctx.createLinearGradient(400, 480, 400, 640);
      gridGradient.addColorStop(0, "transparent");
      gridGradient.addColorStop(1, `${glowColor}20`);
      ctx.fillStyle = gridGradient;
      ctx.fillRect(60, 480, 680, 160);

      // Let's print beautiful "CRT MONITOR" in small tech lettering
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.font = "bold 12px monospace";
      ctx.fillText("CATHODE RAY TUBE EMUL_ACTIVE", 80, 150);
      ctx.textAlign = "right";
      ctx.fillText("60Hz ● REC_01", 720, 150);

      // 6. Draw character name bar & rarity
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255, 0, 127, 0.1)";
      ctx.fillRect(60, 650, 680, 75);
      ctx.strokeStyle = `${glowColor}40`;
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 650, 680, 75);

      // Name Text
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 38px sans-serif";
      ctx.fillText(character.name.toUpperCase(), 80, 701);

      // Rarity Badge Text
      ctx.textAlign = "right";
      ctx.fillStyle = glowColor;
      ctx.font = "bold 16px monospace";
      ctx.fillText(`[ ${character.rarity} ]`, 720, 696);

      // 7. Whimsical personality text
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "italic 22px Georgia, serif";

      // Manual simple line wrapping for Georgia text on canvas
      const words = `"${character.description}"`.split(" ");
      let currentLine = "";
      let yOffset = 760;
      const maxWidth = 640;

      for (let n = 0; n < words.length; n++) {
        const testLine = currentLine + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(currentLine, 80, yOffset);
          currentLine = words[n] + " ";
          yOffset += 32;
        } else {
          currentLine = testLine;
        }
      }
      ctx.fillText(currentLine, 80, yOffset);

      // 8. Quirk block in beautiful dark box
      yOffset += 35;
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.fillRect(60, yOffset, 680, 230);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.strokeRect(60, yOffset, 680, 230);

      ctx.fillStyle = glowColor;
      ctx.font = "bold 14px monospace";
      ctx.fillText("EMOTIONAL CHARACTER SIGNATURE // DIAL_04_QUIRK", 80, yOffset + 26);

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "italic 16px monospace";
      
      const quirkWords = character.quirk.split(" ");
      let quirkLine = "";
      let quirkY = yOffset + 52;
      for (let n = 0; n < quirkWords.length; n++) {
        const testLine = quirkLine + quirkWords[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 600 && n > 0) {
          ctx.fillText(quirkLine, 80, quirkY);
          quirkLine = quirkWords[n] + " ";
          quirkY += 22;
        } else {
          quirkLine = testLine;
        }
      }
      ctx.fillText(quirkLine, 80, quirkY);

      // Procedural Emotional Gauges: Staked Vertically Consistent with Live Layout
      const startGaugesY = yOffset + 104;
      const mLevel = (character.name.charCodeAt(0) * 7 + 13) % 25 + 75;
      const sLevel = ((character.name.charCodeAt(1) || 65) * 9 + 4) % 20 + 80;
      const cLevel = (character.description.length * 5 + 17) % 30 + 70;

      // Misunderstood Gauge Bar
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.font = "bold 13px monospace";
      ctx.fillText("MISUNDERSTOOD", 80, startGaugesY);
      ctx.textAlign = "right";
      ctx.fillStyle = glowColor;
      ctx.fillText(`${mLevel}%`, 720, startGaugesY);
      
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(80, startGaugesY + 6, 640, 6);
      ctx.fillStyle = glowColor;
      ctx.fillRect(80, startGaugesY + 6, mLevel * 6.4, 6);

      // Softness Gauge Bar
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.font = "bold 13px monospace";
      ctx.fillText("SOFTNESS", 80, startGaugesY + 36);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fb7185";
      ctx.fillText(`${sLevel}%`, 720, startGaugesY + 36);
      
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(80, startGaugesY + 42, 640, 6);
      ctx.fillStyle = "#fb7185";
      ctx.fillRect(80, startGaugesY + 42, sLevel * 6.4, 6);

      // Clumsiness Gauge Bar
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.font = "bold 13px monospace";
      ctx.fillText("CLUMSINESS", 80, startGaugesY + 72);
      ctx.textAlign = "right";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(`${cLevel}%`, 720, startGaugesY + 72);
      
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(80, startGaugesY + 78, 640, 6);
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(80, startGaugesY + 78, cLevel * 6.4, 6);

      // 9. Handheld hardware details sticker
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.font = "bold 12px monospace";
      ctx.fillText("● SYSTEM: PERSISTENCE_CARD", 80, 1110);
      ctx.textAlign = "right";
      ctx.fillText("STAMPED REGISTER: CRYING_METEOR_MALL_199X", 720, 1110);

      // 10. Draw the core Sprite in the center of the viewport
      // If it's a procedural vector, we need to extract the SVG elements in the browser DOM and draw
      // them to an Image object, then draw that image to our high-res Canvas.
      // Since PixelSprite compiles dynamically, we can query its SVG or render a standalone transient
      // SVG, serialize it, load it as image and draw! Let's implement this beautifully:
      const spriteEl = document.getElementById(`card-sprite-capture-${character.id}`);
      let spriteImg: HTMLImageElement | null = null;

      if (character.sprite.endsWith(".png") || character.sprite.startsWith("/assets/images/")) {
        // PNG Asset image load & await draw
        spriteImg = new Image();
        spriteImg.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          if (!spriteImg) return resolve();
          spriteImg.onload = () => resolve();
          spriteImg.onerror = () => reject(new Error("Failed to load sprite PNG"));
          spriteImg.src = character.sprite;
        });
        
        // Draw the PNG centered inside the card picture frame ensuring correct 1:1 scale or native ratio
        const naturalW = spriteImg.naturalWidth || 320;
        const naturalH = spriteImg.naturalHeight || 320;
        const ratio = naturalW / naturalH;
        let sizeX = 320;
        let sizeY = 320;
        
        if (ratio > 1) {
          sizeY = 320 / ratio;
        } else {
          sizeX = 320 * ratio;
        }
        
        ctx.drawImage(spriteImg, 400 - sizeX / 2, 380 - sizeY / 2, sizeX, sizeY);
      } else if (spriteEl) {
        // Locate its inner SVG
        const svgEl = spriteEl.querySelector("svg");
        if (svgEl) {
          // Clone the SVG element so we don't mess with active DOM styles
          const clone = svgEl.cloneNode(true) as SVGElement;
          
          // CRITICAL: Strip any styling classes like "w-full h-full" that can confuse headless SVG engines
          clone.removeAttribute("class");
          clone.removeAttribute("className");
          
          // Ensure SVG has correct dimensions, viewbox, and scale-matching properties
          clone.setAttribute("width", "360");
          clone.setAttribute("height", "360");
          clone.setAttribute("viewBox", "0 0 64 64");
          clone.setAttribute("preserveAspectRatio", "xMidYMid meet");
          
          // Apply current theme color hex explicitly so it renders correctly
          clone.style.color = glowColor;

          const svgString = new XMLSerializer().serializeToString(clone);
          const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
          const blobURL = window.URL.createObjectURL(svgBlob);

          spriteImg = new Image();
          await new Promise<void>((resolve) => {
            if (!spriteImg) return resolve();
            spriteImg.onload = () => {
              ctx.drawImage(spriteImg, 400 - 180, 380 - 180, 360, 360);
              window.URL.revokeObjectURL(blobURL);
              resolve();
            };
            spriteImg.onerror = () => {
              window.URL.revokeObjectURL(blobURL);
              resolve(); // Don't crash but let's fall back gracefully
            };
            spriteImg.src = blobURL;
          });
        }
      }

      // If foil holographic effect is active, add a final diagonal shimmer gradient across the canvas!
      if (isFoil) {
        const foilGradient = ctx.createLinearGradient(0, 0, 800, 1200);
        foilGradient.addColorStop(0, "rgba(255, 0, 255, 0.08)");
        foilGradient.addColorStop(0.3, "rgba(0, 255, 255, 0.06)");
        foilGradient.addColorStop(0.5, "rgba(255, 255, 0, 0.05)");
        foilGradient.addColorStop(0.7, "rgba(0, 255, 255, 0.06)");
        foilGradient.addColorStop(1, "rgba(255, 0, 255, 0.08)");
        ctx.fillStyle = foilGradient;
        ctx.fillRect(0, 0, 800, 1200);
      }

      // 11. Trigger download action of file
      const dataUri = canvas.toDataURL("image/png");
      const tempLink = document.createElement("a");
      tempLink.href = dataUri;
      tempLink.download = `crying_meteor_${character.id.replace("-", "_")}_sticker_card.png`;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);

      setDownloadState("success");
      setTimeout(() => setDownloadState("idle"), 3000);
    } catch (err) {
      console.error("Canvas collectible card generation failed:", err);
      // Fallback
      setDownloadState("error");
      setTimeout(() => setDownloadState("idle"), 3000);
    }
  };

  const primaryGlowColor = getRarityGlowHex(character.rarity);

  // Lock page scroll while the sticker booth is open (parent uses overflow-y-auto)
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const modal = (
    <div
      className="fixed inset-0 z-[200] overflow-y-auto overscroll-contain bg-black/90 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="collectible-card-title"
    >
      
      {/* Atmospheric digital cosmology and meteor shower trails */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Soft Retro Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/15 via-black/95 to-slate-950/40" />
        
        {/* Glowing atmospheric dust */}
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={`stardust-${i}`}
            className="absolute rounded-full w-1 h-1 animate-pulse"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + (i % 3)}s`,
              backgroundColor: primaryGlowColor,
              boxShadow: `0 0 10px ${primaryGlowColor}, 0 0 4px #ffffff`
            }}
          />
        ))}

        {/* Nostalgic diagonal meteor showers */}
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={`crying-meteor-${i}`}
            initial={{ x: "-40%", y: "-40%", opacity: 0 }}
            animate={{
              x: "130%",
              y: "130%",
              opacity: [0, 0, 0.5, 0.7, 0.3, 0]
            }}
            transition={{
              duration: 9 + i * 4,
              repeat: Infinity,
              delay: i * 3.5,
              ease: "easeInOut"
            }}
            className="absolute w-[200px] h-[1px] pointer-events-none rotate-45"
            style={{
              background: `linear-gradient(90deg, ${primaryGlowColor}, transparent)`,
              boxShadow: `0 0 12px ${primaryGlowColor}50`,
              top: `${5 + i * 22}%`,
              left: `${-10 + i * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Sticky header — always reachable on mobile */}
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] bg-black/85 backdrop-blur-md border-b border-slate-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <Award size={14} className="text-arcade-pink shrink-0" />
          <span
            id="collectible-card-title"
            className="pixel-text text-[7px] sm:text-[8px] text-zinc-400 uppercase tracking-wider truncate"
          >
            COLLECTIBLE PHOTO BOOTH
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!muted) playMoveTick();
            onClose();
          }}
          className="shrink-0 p-2 text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600 bg-gray-900/80 rounded cursor-pointer"
          aria-label="Close sticker card"
        >
          <X size={16} />
        </button>
      </div>

      {/* Main Container — top-aligned so overflow scrolls from the top */}
      <div className="relative max-w-4xl w-full mx-auto flex flex-col md:flex-row md:items-start items-center gap-6 md:gap-10 z-10 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2">
        
        {/* LEFT COLUMN: THE RETRO COLLECTIBLE CARD */}
        <div className="flex-1 flex flex-col items-center relative w-full max-w-sm">
          
          <span className="mb-2 text-[8px] pixel-text text-gray-500 tracking-widest uppercase text-center hidden sm:block">
            [ TILT MOUSE GENTLY TO SHIMMER ]
          </span>

          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{
              rotateY: tilt.x,
              rotateX: tilt.y,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{ 
              perspective: 1200,
              transformStyle: "preserve-3d",
              borderColor: primaryGlowColor,
              boxShadow: `0 15px 45px rgba(0,0,0,0.8), 0 0 30px ${primaryGlowColor}30`
            }}
            className="relative w-[310px] sm:w-[340px] aspect-[1/1.5] bg-slate-950 border-4 rounded-xl p-4 overflow-hidden selection:bg-transparent"
          >
            {/* Holographic foil shimmer diagonal ray */}
            {isFoil && (
              <motion.div
                animate={{
                  x: ["-100%", "200%"],
                  opacity: [0, 0.4, 0.6, 0.4, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-cyan-400/20 to-pink-500/20 blur-md pointer-events-none z-10 skew-x-30"
              />
            )}

            {/* Rainbow Holo Sheen Layer */}
            {isFoil && (
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.09] mix-blend-overlay z-15 transition-all duration-300"
                style={{
                  background: `linear-gradient(${15 + tilt.x * 2}deg, #ff00ff 0%, #00ffff 30%, #ffff00 65%, #ff00ff 100%)`
                }}
              />
            )}

            {/* Simulated CRT Screen scanline flicker */}
            {isCrtActive && (
              <div className="absolute inset-0 bg-scanlines pointer-events-none z-10 opacity-[0.15]" />
            )}

            {/* Double Border Glow Highlight */}
            <div 
              className="absolute inset-1.5 border border-dashed rounded-lg pointer-events-none"
              style={{ borderColor: `${primaryGlowColor}45` }}
            />

            {/* 1. Card Header */}
            <div className="flex justify-between items-center text-[7.5px] font-mono text-slate-500 mb-3 px-1 leading-none relative">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                No. {character.id.slice(-3).toUpperCase()}
              </span>
              <span className="pixel-text text-[6.5px] text-pink-500/80 animate-pulse">STAMP: [{discoveryTimestamp || 'UTC'}]</span>
              <span className="text-right">MALL CABINET #2</span>
            </div>

            {/* 2. Main Picture Booth Screen */}
            <div 
              className="relative w-full aspect-[4/3] bg-black/90 border border-gray-900 rounded-md overflow-hidden flex items-center justify-center p-2 mb-4 group"
            >
              {/* Symmetrical retro card screws in coordinates */}
              <span className="absolute top-1.5 left-1.5 text-slate-700 text-[8px] font-mono select-none pointer-events-none">+</span>
              <span className="absolute top-1.5 right-1.5 text-slate-700 text-[8px] font-mono select-none pointer-events-none">+</span>
              <span className="absolute bottom-1.5 left-1.5 text-slate-700 text-[8px] font-mono select-none pointer-events-none">+</span>
              <span className="absolute bottom-1.5 right-1.5 text-slate-700 text-[8px] font-mono select-none pointer-events-none">+</span>

              {/* Star fields and grid interior */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,35,0.7),rgba(0,0,0,1))] -z-10" />
              <div className="absolute inset-0 opacity-15 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />
              
              {/* Beautiful glowing neon floor reflection */}
              <div 
                className="absolute bottom-0 inset-x-0 h-10 blur-xl opacity-35"
                style={{ backgroundColor: primaryGlowColor }}
              />

              {/* CRT Glass Reflection light flash */}
              {isCrtActive && (
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-10" />
              )}

              {/* Star symbols */}
              <div className="absolute top-2 left-2 text-[6px] text-gray-700 font-mono">
                DISPLAY_CRT_VOLTS // 60Hz
              </div>
              <div className="absolute top-2 right-2 text-[6.5px] text-zinc-500 font-mono flex items-center gap-1">
                <span>REC</span>
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full inline-block animate-ping" />
              </div>

              {/* Character sprite wrapper explicitly labeled with ID to draw onto Canvas in Javascript */}
              <div 
                id={`card-sprite-capture-${character.id}`}
                className="relative z-10 scale-110"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <PixelSprite 
                    sprite={character.sprite} 
                    characterId={character.id}
                    color={primaryGlowColor}
                    className="w-24 h-24 sm:w-28 sm:h-28"
                  />
                </motion.div>
              </div>

              {/* Holographic sparkle dots */}
              {isFoil && (
                <Sparkles 
                  size={12} 
                  className="absolute text-cyan-300 left-4 bottom-4 opacity-50 animate-pulse" 
                />
              )}
              {isFoil && (
                <Sparkles 
                  size={12} 
                  className="absolute text-pink-300 right-5 top-5 opacity-50 animate-pulse" 
                />
              )}
            </div>

            {/* 3. Character Ribbon Block */}
            <div className="relative mb-3 flex items-center justify-between border-b pb-2 border-slate-900 px-1">
              <div className="flex flex-col">
                <h3 className="font-sans font-bold tracking-tight text-[11px] uppercase text-zinc-400 font-mono leading-none">
                  COSMIC REVELATION CARD
                </h3>
                <h2 className="pixel-text text-xs sm:text-[13px] text-white mt-1 leading-none shadow-sm drop-shadow-[0_2px_0_rgba(0,0,0,0.8)] filter">
                  {character.name}
                </h2>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className={`pixel-text text-[6px] px-1.5 py-0.5 rounded border inline-block leading-none ${getRarityBadgeBg(character.rarity)}`}>
                  {character.rarity}
                </span>
                <span className="font-mono text-[7px] text-slate-500 select-none">
                  # {(character.themeId || "folklore").toUpperCase().slice(0, 8)}
                </span>
              </div>
            </div>

            {/* 4. Personality & Whimsical Detail Description */}
            <div className="space-y-2 mb-3 select-none">
              <p className="font-mono text-slate-300 text-[10px] leading-relaxed italic border-l-2 pl-2 border-pink-500/50">
                "{character.description}"
              </p>

              {/* Quirk Signature */}
              <div className="bg-black/45 p-2 rounded border border-slate-900 font-mono text-[9px] text-zinc-300 leading-snug">
                <span className="text-[6.5px] font-bold text-arcade-pink pixel-text block uppercase mb-1 flex items-center gap-1 scale-95 origin-left">
                  <Zap size={6} className="text-arcade-pink fill-arcade-pink inline" />
                  EMOTIONAL QUIRK:
                </span>
                <span className="italic block mb-2">
                  {character.quirk}
                </span>

                {/* Real-time retro emotional bar gauges */}
                <div className="border-t border-slate-900/60 pt-2 mt-1.5 space-y-1 text-[8px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>MISUNDERSTOOD</span>
                    <span className="text-pink-400 font-bold">{awkwardStats.misunderstood}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden flex">
                    <div className="h-full bg-pink-500" style={{ width: `${awkwardStats.misunderstood}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>SOFTNESS</span>
                    <span className="text-rose-400 font-bold">{awkwardStats.softness}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden flex">
                    <div className="h-full bg-rose-500" style={{ width: `${awkwardStats.softness}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>CLUMSINESS</span>
                    <span className="text-sky-400 font-bold">{awkwardStats.clumsiness}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden flex">
                    <div className="h-full bg-sky-500" style={{ width: `${awkwardStats.clumsiness}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Beautiful physical stickers found details */}
            <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[7px] font-mono text-zinc-600 relative select-none">
              <div className="flex items-center gap-1">
                <span>FOUND INSIDE CRYING METEOR</span>
              </div>
              <div className="text-right flex items-center gap-1 italic text-slate-500 font-semibold text-pink-300/60 font-mono">
                <Scissors size={7} />
                <span>AUTHENTIC_199XC_STICKER</span>
              </div>
            </div>

          </motion.div>
        </div>


        {/* RIGHT COLUMN: REVELATION CONTROLS / DETAILS PANEL */}
        <div className="flex-1 max-w-sm w-full bg-slate-950 border-4 border-slate-900 rounded-lg p-5 sm:p-6 flex flex-col gap-5 shadow-2xl relative shrink-0">
          
          <div>
            <div className="mb-5 space-y-2">
              <h2 className="pixel-text text-sm sm:text-base text-zinc-100 flex items-center gap-2">
                <Camera size={14} className="text-arcade-cyan shrink-0" />
                STORY ARTIFACT
              </h2>
              <p className="font-sans text-xs text-zinc-400 leading-relaxed">
                Replay your journey by designing a nostalgic collectible arcade card. Fully formatted and prepared for download as a sticker to keep in your desktop folder or share with other lonely gamers.
              </p>
            </div>

            {/* Interactive Card Styles Swappers */}
            <div className="space-y-3.5 mb-6 bg-black/45 p-4 rounded-md border border-slate-900 font-mono text-xs">
              
              <div className="text-[9px] pixel-text text-gray-500 uppercase tracking-wider pb-1 flex items-center gap-1 border-b border-dashed border-slate-900">
                <HelpCircle size={10} />
                <span>HARDWARE DIALS</span>
              </div>

              {/* Holographic Sheen Foil */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Sparkles size={12} className={isFoil ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
                  Holographic Foil
                </span>
                <button
                  onClick={() => { if (!muted) playMoveTick(); setIsFoil(!isFoil); }}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                    isFoil ? "bg-arcade-pink" : "bg-zinc-800"
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                    isFoil ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* CRT Scanline Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Tv size={12} className={isCrtActive ? "text-arcade-cyan" : "text-gray-600"} />
                  CRT Scanline Mesh
                </span>
                <button
                  onClick={() => { if (!muted) playMoveTick(); setIsCrtActive(!isCrtActive); }}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                    isCrtActive ? "bg-arcade-cyan" : "bg-zinc-800"
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                    isCrtActive ? "translate-x-5" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Favorite Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-300 flex items-center gap-1.5">
                  <Heart size={12} className={isFavorite ? "text-red-500 fill-red-500 animate-pulse" : "text-gray-600"} />
                  Awkward BFF Status
                </span>
                <button
                  onClick={toggleFavoriteLocal}
                  className={`px-2.5 py-1 text-[9px] pixel-text rounded border transition-all cursor-pointer ${
                    isFavorite 
                      ? "bg-red-950/40 border-red-500/60 text-red-400" 
                      : "bg-slate-900 border-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  <span>{isFavorite ? "[ BFFS ]" : "[ MAKE BFF ]"}</span>
                </button>
              </div>

            </div>

            {/* Passing the Memory Share Widget */}
            <div className="space-y-3 mb-6 bg-black/45 p-4 rounded-md border border-slate-900 font-mono text-xs">
              
              <div className="text-[9px] pixel-text text-gray-500 uppercase tracking-widest pb-1 flex items-center gap-1.5 border-b border-dashed border-slate-900/65 animate-pulse">
                <Share2 size={10} className="text-arcade-pink" />
                <span>PASSING THE MEMORY</span>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 py-1.5 px-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-zinc-300 hover:text-white rounded flex items-center justify-center gap-1 transition-all text-[8px] pixel-text uppercase cursor-pointer"
                  >
                    {copyState === "success" ? (
                      <>
                        <Check size={9} className="text-emerald-400 shrink-0" />
                        <span className="text-emerald-400">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy size={9} className="shrink-0" />
                        <span>COPY LINK</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleNativeShare}
                    className="flex-1 py-1.5 px-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-zinc-300 hover:text-white rounded flex items-center justify-center gap-1 transition-all text-[8px] pixel-text uppercase cursor-pointer"
                  >
                    <Share2 size={9} className="shrink-0" />
                    <span>{isShareSupported ? "DIRECT" : "SHARE STORY"}</span>
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {customMessage && (
                    <motion.div
                      key={customMessage}
                      initial={{ opacity: 0, scale: 0.95, y: 3 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.25 }}
                      className="mt-2 text-center text-[10px] text-pink-300/85 italic font-sans leading-relaxed border-t border-slate-900/40 pt-2 border-dashed select-none"
                    >
                      {customMessage}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* DOWNLOAD & DISMISS CTA PANEL */}
          <div className="space-y-3 pt-4 border-t border-slate-900">
            {/* Generate & Download Card Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={downloadCardImage}
              disabled={downloadState === "preparing"}
              className={`w-full py-3 font-semibold text-[10px] pixel-text rounded transition-all cursor-pointer flex items-center justify-center gap-2 relative border-b-4 uppercase ${
                downloadState === "preparing"
                  ? "bg-gray-800 text-zinc-500 cursor-not-allowed border-gray-950"
                  : downloadState === "success"
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : downloadState === "error"
                  ? "bg-rose-950 border-rose-950 text-rose-400"
                  : "bg-white text-black hover:bg-arcade-cyan hover:text-black hover:border-arcade-cyan-950 border-gray-300 active:border-b-2 active:translate-y-0.5"
              }`}
            >
              {downloadState === "preparing" ? (
                <>
                  <span className="w-3 h-3 border-2 border-zinc-500 border-t-white rounded-full animate-spin inline-block" />
                  <span>ENGRAVING STICKER...</span>
                </>
              ) : downloadState === "success" ? (
                <>
                  <Check size={12} className="text-white shrink-0" />
                  <span>PRESERVED IN FOLDER!</span>
                </>
              ) : downloadState === "error" ? (
                <span>TELEMETRY FAULT_RETRY</span>
              ) : (
                <>
                  <Download size={12} className="shrink-0" />
                  <span>DOWNLOAD STICKER (PNG)</span>
                </>
              )}
            </motion.button>

            {/* Back to scrapbook dismiss button */}
            <button
              onClick={() => {
                if (!muted) playMoveTick();
                onClose();
              }}
              className="w-full py-2.5 text-[8px] pixel-text text-gray-500 hover:text-gray-300 border border-dashed border-gray-900 hover:border-zinc-700 rounded transition-all cursor-pointer select-none uppercase"
            >
              [ RETURN TO COZY ARCHIVE ]
            </button>
          </div>

        </div>

      </div>

    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modal, document.body)
    : modal;
}
