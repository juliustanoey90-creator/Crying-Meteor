import React from "react";
import { 
  Crown,
  Heart,
  Star,
  Sparkles
} from "lucide-react";

interface PixelSpriteProps {
  sprite: string;
  className?: string;
  characterId: string;
  color?: string;
}

export default function PixelSprite({ sprite, className = "w-12 h-12", characterId, color = "#ff00ff" }: PixelSpriteProps) {
  // If it's a pre-rendered PNG asset, render it directly
  if (sprite.endsWith(".png") || sprite.startsWith("/assets/images/")) {
    return (
      <img 
        src={sprite} 
        alt="pixel companion" 
        className={`${className} object-contain pixelate`} 
        referrerPolicy="no-referrer"
      />
    );
  }

  // Otherwise, render a procedural interactive vector illustration representing the themed collectible set
  const idPrefix = characterId.split("-")[0]; // "dino", "ship", "snack", "moon", "mascot"

  // Base outline and inner glow colors calculated with transparency
  const glowHex = `${color}30`;

  return (
    <div 
      className={`relative flex items-center justify-center filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] ${className}`}
      style={{ color }}
    >
      {/* Behind-glow aura */}
      <div 
        className="absolute inset-0 rounded-full blur-md opacity-25 scale-110 pointer-events-none transition-all duration-500"
        style={{ backgroundColor: color }}
      />

      {/* Retro scanline grid inside vector container */}
      <svg 
        viewBox="0 0 64 64" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Procedural drawing based on character ID or prefix */}
        {idPrefix === "dino" && (
          <g>
            {/* Cute Pixelated dinosaur silhouette */}
            {/* Dinosaur tail support */}
            <path d="M12,48 Q4,38 16,36 Q22,35 28,42" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="square" />
            
            {/* Stegosaurus plates or spikes? */}
            {characterId === "dino-steg-sleep" ? (
              <g fill="currentColor">
                <rect x="22" y="16" width="6" height="6" rx="1" />
                <rect x="32" y="14" width="6" height="6" rx="1" />
                <rect x="42" y="18" width="6" height="6" rx="1" />
              </g>
            ) : (
              // Triceratops horns / crest
              characterId === "dino-tri-sad" && (
                <g fill="#ffffff">
                  <path d="M46,20 L52,14 M38,16 L42,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="50" cy="24" r="2.5" fill="currentColor" />
                </g>
              )
            )}
            
            {/* Core Body */}
            <rect x="18" y="26" width="28" height="20" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="3" />
            
            {/* Cute short arms/feet depending on species */}
            {characterId === "dino-rex-short" ? (
              <g fill="currentColor">
                {/* Tiny Rexy stubby arms */}
                <rect x="44" y="30" width="4" height="2" />
                <rect x="44" y="34" width="4" height="2" />
                {/* Feet */}
                <rect x="24" y="44" width="6" height="4" />
                <rect x="36" y="44" width="6" height="4" />
              </g>
            ) : characterId === "dino-long-neck" ? (
              <g>
                <path d="M42,32 Q54,16 52,8" stroke="currentColor" strokeWidth="5" fill="none" />
                <rect x="48" y="4" width="8" height="6" rx="2" fill="currentColor" />
                {/* Long feet */}
                <rect x="22" y="44" width="4" height="8" fill="currentColor" />
                <rect x="38" y="44" width="4" height="8" fill="currentColor" />
              </g>
            ) : characterId === "dino-rapt-hide" ? (
              <g>
                <rect x="14" y="22" width="36" height="26" rx="4" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="3 3" />
                <circle cx="20" cy="30" r="2" fill="#22d3ee" />
                <circle cx="44" cy="38" r="2" fill="#22d3ee" />
                {/* Feet */}
                <rect x="22" y="44" width="5" height="4" fill="currentColor" />
                <rect x="37" y="44" width="5" height="4" fill="currentColor" />
              </g>
            ) : (
              // Default feet
              <g fill="currentColor">
                <rect x="22" y="44" width="6" height="4" />
                <rect x="36" y="44" width="6" height="4" />
              </g>
            )}

            {/* Face/Eyes details (Always emotionally awkward) */}
            <g fill="#000000">
              <rect x="38" y="30" width="3" height="4" />
              <rect x="44" y="30" width="3" height="4" />
              {/* Awkward squiggly sad frown */}
              <path d="M39,38 Q41,36 43,38" stroke="#000000" strokeWidth="2" fill="none" />
            </g>

            {/* Blushing checks */}
            <circle cx="36" cy="34" r="1.5" fill="#f43f5e" />
            <circle cx="47" cy="34" r="1.5" fill="#f43f5e" />
          </g>
        )}

        {idPrefix === "ship" && (
          <g>
            {/* Lost Satellite Space Probes */}
            {/* Blinking communication path */}
            <path d="M32,2 Q22,8 22,14 M32,2 Q42,8 42,14" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="2 3" opacity="0.6" />

            {/* Sputnik wings / antennae */}
            {characterId === "ship-sputnik" ? (
              <g stroke="currentColor" strokeWidth="2.5">
                <line x1="16" y1="46" x2="4" y2="58" />
                <line x1="48" y1="46" x2="60" y2="58" />
                <line x1="32" y1="18" x2="32" y2="2" />
              </g>
            ) : (
              // Voyager Record Disc
              characterId === "ship-voyager" ? (
                <g>
                  <circle cx="32" cy="32" r="14" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <circle cx="32" cy="32" r="8" fill="currentColor" opacity="0.2" />
                  <line x1="32" y1="32" x2="44" y2="44" stroke="currentColor" strokeWidth="2" />
                </g>
              ) : (
                // Kepler Solar Panel Arms
                <g fill="currentColor">
                  <rect x="4" y="28" width="12" height="8" rx="1" />
                  <rect x="48" y="28" width="12" height="8" rx="1" />
                  <line x1="16" y1="32" x2="48" y2="32" stroke="currentColor" strokeWidth="2" />
                </g>
              )
            )}

            {/* Core metallic capsule shell */}
            <circle cx="32" cy="32" r="12" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="3" />
            <circle cx="32" cy="32" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 1" />

            {/* Cozy Eyes */}
            <g fill="#000000">
              {characterId === "ship-kepler" ? (
                // Kepler lens / closed eye camera
                <g>
                  <circle cx="32" cy="32" r="3.5" fill="#22d3ee" />
                  <circle cx="31" cy="31" r="1" fill="#ffffff" />
                </g>
              ) : (
                <>
                  <rect x="29" y="30" width="2" height="3" />
                  <rect x="33" y="30" width="2" height="3" />
                  <line x1="29" y1="36" x2="35" y2="36" stroke="#000000" strokeWidth="1.5" />
                </>
              )}
            </g>

            {/* Little antenna flashing red dot */}
            <circle cx="32" cy="2" r="2.5" fill="#f43f5e" className="animate-pulse" />
          </g>
        )}

        {idPrefix === "snack" && (
          <g>
            {/* Haunted Warung Snacks */}
            {/* Sweet tea container */}
            {characterId === "snack-teh-crying" ? (
              <g>
                {/* Straw */}
                <path d="M40,15 L44,6 L48,8" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                {/* Snack Carton box */}
                <rect x="20" y="16" width="24" height="36" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="3.5" />
                {/* Condensed Droplet rings */}
                <ellipse cx="32" cy="56" rx="14" ry="4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="3 3" opacity="0.5" />
              </g>
            ) : characterId === "snack-indomie-ghost" ? (
              <g>
                {/* Crinkled noodle borders */}
                <rect x="14" y="20" width="36" height="26" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="3.5" />
                <path d="M14,20 L18,17 M50,20 L46,17 M14,46 L18,49 M50,46 L46,49" stroke="currentColor" strokeWidth="2" />
                {/* Floating noodle strands */}
                <path d="M26,16 Q20,12 18,14 M38,16 Q44,12 46,15" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </g>
            ) : characterId === "snack-es-monas" ? (
              <g>
                {/* Waffle cone */}
                <path d="M32,56 L20,32 L44,32 Z" stroke="currentColor" strokeWidth="3" fill="currentColor" fillOpacity="0.15" />
                {/* Glowing fluffy scoops */}
                <path d="M20,32 Q32,16 44,32 Q46,26 32,24 Q18,26 20,32" stroke="currentColor" strokeWidth="3.5" fill="none" />
                {/* Strawberry glow */}
                <circle cx="32" cy="23" r="5" fill="#f472b6" opacity="0.8" />
              </g>
            ) : (
              // Default crisp bag/box
              <g>
                <rect x="18" y="18" width="28" height="32" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="3" />
              </g>
            )}

            {/* Cute haunted eyes in snacks */}
            <g fill="#000000">
              <rect x="26" y="28" width="2" height="4" />
              <rect x="34" y="28" width="2" height="4" />
              {/* Tear droplet */}
              {characterId === "snack-teh-crying" && (
                <path d="M25,34 Q26,38 27,35" stroke="#38bdf8" strokeWidth="2" fill="#38bdf8" />
              )}
              {/* Little smile / line */}
              <line x1="28" y1="35" x2="34" y2="35" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </g>
        )}

        {idPrefix === "moon" && (
          <g>
            {/* Crater moon structures and stars */}
            <g opacity="0.35">
              <circle cx="12" cy="14" r="1.5" fill="#ffffff" />
              <circle cx="52" cy="10" r="1" fill="#ffffff" />
              <circle cx="54" cy="48" r="2" fill="#ffffff" />
            </g>

            {/* Chandra Crescent neon */}
            {characterId === "moon-phase-spirit" ? (
              <g>
                <path d="M42,16 A16,16 0 1,0 42,48 A12,12 0 1,1 42,16" stroke="currentColor" strokeWidth="4.5" fill="currentColor" fillOpacity="0.15" />
                <circle cx="24" cy="32" r="2" fill="#38bdf8" />
              </g>
            ) : (
              // Comet Spark tail
              characterId === "moon-comet-tail" ? (
                <g>
                  {/* Trail sweeps */}
                  <g stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4">
                    <line x1="20" y1="42" x2="6" y2="54" />
                    <line x1="24" y1="46" x2="10" y2="58" />
                    <line x1="26" y1="36" x2="12" y2="44" />
                  </g>
                  {/* Glowing comet sphere */}
                  <circle cx="36" cy="28" r="12" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="3" />
                </g>
              ) : (
                // Moon bunny or crater pug
                <g>
                  <circle cx="32" cy="34" r="13" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="3" />
                  {/* Cute Bunny Ears */}
                  {characterId === "moon-bunny-dust" && (
                    <g fill="currentColor">
                      <rect x="22" y="10" width="5" height="13" rx="2" transform="rotate(-15 22 10)" />
                      <rect x="37" y="10" width="5" height="13" rx="2" transform="rotate(15 37 10)" />
                    </g>
                  )}
                  {/* Pug/Rover legs */}
                  {characterId === "moon-crater-pug" && (
                    <g stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="45" x2="16" y2="54" />
                      <line x1="32" y1="46" x2="32" y2="56" />
                      <line x1="42" y1="45" x2="48" y2="54" />
                    </g>
                  )}
                </g>
              )
            )}

            {/* Face Eyes layout */}
            <g fill="#000000">
              <rect x="28" y="31" width="3" height="3" rx="0.5" />
              <rect x="35" y="31" width="3" height="3" rx="0.5" />
              {/* Surprised tiny mouth */}
              <circle cx="32.5" cy="38" r="2.5" fill="#000000" />
            </g>
          </g>
        )}

        {idPrefix === "mascot" && (
          <g>
            {/* Abandoned Arcade Mascots */}
            {/* Old joystick controller */}
            {characterId === "mascot-joy-rusty" ? (
              <g>
                <rect x="14" y="32" width="36" height="20" rx="3" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="3.5" />
                {/* Joystick metallic shaft & ball */}
                <line x1="32" y1="32" x2="32" y2="10" stroke="currentColor" strokeWidth="4.5" />
                <circle cx="32" cy="7" r="6" fill="#ef4444" stroke="currentColor" strokeWidth="1.5" />
                {/* Dpad cross */}
                <rect x="18" y="38" width="8" height="3" fill="currentColor" />
                <rect x="20.5" y="35.5" width="3" height="8" fill="currentColor" />
              </g>
            ) : characterId === "mascot-screen-burn" ? (
              <g>
                <rect x="12" y="14" width="40" height="34" rx="4" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="3.5" />
                {/* Inner screen border */}
                <rect x="16" y="18" width="32" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                {/* Glass corner glares */}
                <line x1="18" y1="20" x2="24" y2="20" stroke="currentColor" strokeWidth="1" />
              </g>
            ) : characterId === "mascot-ticket-clog" ? (
              <g>
                <path d="M18,18 H46 V44 H18 Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="3" />
                {/* Ticket spool lines */}
                <line x1="18" y1="24" x2="46" y2="24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                <line x1="18" y1="36" x2="46" y2="36" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
                {/* Dispenser bracket */}
                <rect x="22" y="44" width="20" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" />
              </g>
            ) : characterId === "mascot-glitch-hacker" ? (
              <g fill="currentColor">
                <rect x="10" y="10" width="16" height="16" opacity="0.6" />
                <rect x="34" y="14" width="18" height="18" opacity="0.8" />
                <rect x="14" y="36" width="24" height="14" opacity="0.4" />
                <rect x="38" y="38" width="16" height="16" opacity="0.9" />
                <circle cx="28" cy="28" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
              </g>
            ) : (
              // Default coin shape
              <circle cx="32" cy="32" r="16" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="3.5" />
            )}

            {/* Awkward face for arcade components */}
            {characterId !== "mascot-glitch-hacker" && (
              <g fill="#000000">
                <rect x="26" y="27" width="3" height="3" />
                <rect x="35" y="27" width="3" height="3" />
                {/* Glitchy straight line flat mouth */}
                <line x1="27" y1="35" x2="37" y2="35" stroke="#000000" strokeWidth="2" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
}
