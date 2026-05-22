import { Character } from "../types";

export interface CollectionSet {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  emoji: string;
  themeColor: string;       // Accent glow class or hex
  accentColor: string;      // RGB or hex color string
  cabinetBg: string;        // CSS gradient class for claw game background
  borderClass: string;      // Glow border styling for machine skinning
  glowClass: string;        // Shadow/Glow colors
  badgeBg: string;          // Color style for UI badges
  customNotifs: string[];   // Dynamic machine message ticks
  seasonalEvent: {
    name: string;
    description: string;
    multiplier: number;     // Spawn luck percentage multiplier
    icon: string;
  };
}

export const COLLECTION_SETS: CollectionSet[] = [
  {
    id: "indonesian_folklore",
    name: "Classic Mall Ghosts",
    subtitle: "Nostalgic Folk Legends",
    description: "Reimagined spooky-cute spirits of nostalgic urban legends. Resting on cold cozy shelves after years trapped inside older machines.",
    emoji: "👻",
    themeColor: "text-arcade-cyan",
    accentColor: "#00ecff",
    cabinetBg: "bg-gradient-to-b from-[#111125] to-[#04040f]",
    borderClass: "border-arcade-cyan shadow-[0_0_15px_rgba(34,211,238,0.5)]",
    glowClass: "shadow-[0_0_10px_rgba(34,211,238,0.4)]",
    badgeBg: "bg-sky-950/80 border-sky-500/60 text-sky-300",
    customNotifs: [
      "Lovi is whispering to his ropes.",
      "The smell of burnt incense and stale cola fills the chute.",
      "A sudden soft cold draft passes by your shoulder."
    ],
    seasonalEvent: {
      name: "Sore Indomaret Midnight",
      description: "Atmospheric twilight. Grab a carton of sweet tea. Folklore capture rates increased by 25%!",
      multiplier: 1.25,
      icon: "🏪"
    }
  },
  {
    id: "tiny_dinosaurs",
    name: "Tiny Dinosaurs",
    subtitle: "Overlooked Tiny Fossils",
    description: "Cute, vulnerable, and slightly confused preschool fossil friends who are too soft for the Ice Age.",
    emoji: "🦕",
    themeColor: "text-emerald-400",
    accentColor: "#34d399",
    cabinetBg: "bg-gradient-to-b from-[#0f2415] to-[#030c05]",
    borderClass: "border-emerald-500 shadow-[0_0_15px_rgba(52,211,153,0.5)]",
    glowClass: "shadow-[0_0_10px_rgba(52,211,153,0.4)]",
    badgeBg: "bg-emerald-950/80 border-emerald-500/60 text-emerald-300",
    customNotifs: [
      "A very tiny roar echoes inside the capsule pile.",
      "A small fossilized tail twitch is detected in Section C.",
      "Tiny dinosaur footprints appear on the glass steam."
    ],
    seasonalEvent: {
      name: "Jurassic Rust Convergence",
      description: "Rust and ancient moss are glowing inside the grid. Dinosaurs are 30% easier to catch!",
      multiplier: 1.3,
      icon: "🌿"
    }
  },
  {
    id: "sad_spaceships",
    name: "Sad Spaceships",
    subtitle: "Lost Satellites & Space Drifters",
    description: "Quiet, drifting deep-space probes that missed their landing coordinates and ended up in our arcade cabinet instead.",
    emoji: "🚀",
    themeColor: "text-amber-400",
    accentColor: "#fbbf24",
    cabinetBg: "bg-gradient-to-b from-[#1e1b4b] to-[#090514]",
    borderClass: "border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.5)]",
    glowClass: "shadow-[0_0_10px_rgba(251,191,36,0.4)]",
    badgeBg: "bg-amber-950/80 border-amber-500/60 text-amber-300",
    customNotifs: [
      "Sputnik Junior is broadcasting its little mechanical heartbeats.",
      "Static signals on frequency 109.9 MHz are crackling.",
      "A faint signal from Voyager-X says: 'Are you still there?'"
    ],
    seasonalEvent: {
      name: "Cosmic Retrograde Spark",
      description: "The planetary alignment creates high-voltage magnetics! Gravity drops by half temporarily.",
      multiplier: 1.4,
      icon: "🪐"
    }
  },
  {
    id: "convenience_snacks",
    name: "Haunted Mart Snacks",
    subtitle: "Midnight Warung Snacks",
    description: "Awkward 1990s convenience store wrappers that expired decades ago but still feel extraordinarily sweet and soft.",
    emoji: "🥤",
    themeColor: "text-pink-400",
    accentColor: "#f472b6",
    cabinetBg: "bg-gradient-to-b from-[#2e1022] to-[#090108]",
    borderClass: "border-pink-500 shadow-[0_0_15px_rgba(244,114,182,0.5)]",
    glowClass: "shadow-[0_0_10px_rgba(244,114,182,0.4)]",
    badgeBg: "bg-pink-950/80 border-pink-500/60 text-pink-300",
    customNotifs: [
      "The smell of artificial strawberry powder passes by.",
      "A plastic packet crinkles in fear as you approach.",
      "Teh Botol condensation droplets are spelling small happy words."
    ],
    seasonalEvent: {
      name: "Chiki Cheese Hour",
      description: "Midnight cravings active! Crunchy snacks are extra playful tonight.",
      multiplier: 1.25,
      icon: "🧀"
    }
  },
  {
    id: "moon_creatures",
    name: "Moon Creatures",
    subtitle: "Craterside Celestial Companions",
    description: "Soft, low-gravity companions born inside lunar dust storms. Caught in small vapor clouds inside the prize chamber.",
    emoji: "🌙",
    themeColor: "text-indigo-400",
    accentColor: "#818cf8",
    cabinetBg: "bg-gradient-to-b from-[#0c0d21] to-[#010108]",
    borderClass: "border-indigo-500 shadow-[0_0_15px_rgba(129,140,248,0.5)]",
    glowClass: "shadow-[0_0_10px_rgba(129,140,248,0.4)]",
    badgeBg: "bg-indigo-950/80 border-indigo-500/60 text-indigo-300",
    customNotifs: [
      "A lunar bundle is floating upside down in gravity.",
      "Chandra crescent is casting a sleepy blue light.",
      "Faint stardust dust sparkles are settling on the joystick."
    ],
    seasonalEvent: {
      name: "Blue Moon Eclipse",
      description: "A gorgeous blue moon rises. Legendary Moon Creatures have 50% more lucky capsules!",
      multiplier: 1.5,
      icon: "🔵"
    }
  },
  {
    id: "arcade_mascots",
    name: "Glitchy Mascots",
    subtitle: "Abandoned Cabinet High-Scores",
    description: "Broken high-score sprites, tangled ticker tapes, and bent coins salvaged from abandoned arcade cabinets down the hall.",
    emoji: "🕹️",
    themeColor: "text-violet-400",
    accentColor: "#a78bfa",
    cabinetBg: "bg-gradient-to-b from-[#1e102f] to-[#05010a]",
    borderClass: "border-violet-500 shadow-[0_0_15px_rgba(167,139,248,0.5)]",
    glowClass: "shadow-[0_0_10px_rgba(167,139,248,0.4)]",
    badgeBg: "bg-violet-950/80 border-violet-500/60 text-violet-300",
    customNotifs: [
      "D-pad clicks 'UP, UP, DOWN' over and over.",
      "MissingNo glitches of beautiful pixels are flickering in the corner.",
      "The ticket dispenser attempts a mechanical rattle in vain."
    ],
    seasonalEvent: {
      name: "CRT Scanline Reset",
      description: "A glitch in the master terminal. Machine controls feel 40% snappier and luck is boosted!",
      multiplier: 1.35,
      icon: "🩹5"
    }
  }
];

export const CHARACTERS: (Character & { themeId: string })[] = [
  // 1. Classic Folklore Set (Original 12)
  {
    id: "pocong-lovi",
    name: "Lovi the Bound",
    rarity: "COMMON",
    description: "A tiny Pocong wrapped in the softest cotton clouds.",
    quirk: "Always hops twice when excited, but usually trips on the second hop.",
    sprite: "/assets/images/pixel_lovi_pocong_1779284759470.png",
    color: "#ffffff",
    themeId: "indonesian_folklore"
  },
  {
    id: "tuyul-tommy",
    name: "Tommy Token",
    rarity: "COMMON",
    description: "A small Tuyul child who thinks arcade tokens are the currency of heaven.",
    quirk: "Will 'borrow' your shoe laces if he runs out of thread for his collection.",
    sprite: "/assets/images/pixel_tuyul_tommy_1779284778053.png",
    color: "#aaffaa",
    themeId: "indonesian_folklore"
  },
  {
    id: "kuyang-hana",
    name: "Hana High",
    rarity: "UNCOMMON",
    description: "A Kuyang whose head literally floats away when she daydreams too hard.",
    quirk: "Often gets tangled in washing lines. Prefers the view from there anyway.",
    sprite: "/assets/images/pixel_kuyung_hana_1779284796911.png",
    color: "#ff88ff",
    themeId: "indonesian_folklore"
  },
  {
    id: "kunti-lily",
    name: "Long-Haired Lily",
    rarity: "COMMON",
    description: "A Kuntilanak who hides in the arcade's photo booth to practice smiling.",
    quirk: "Her hair gets caught in the claw machine's gears. It's embarrassing.",
    sprite: "/assets/images/pixel_kunti_lily_1779285136953.png",
    color: "#ffffff",
    themeId: "indonesian_folklore"
  },
  {
    id: "genderuwo-big-g",
    name: "Big G",
    rarity: "UNCOMMON",
    description: "A gentle Genderuwo shadow who just wants to hold hands.",
    quirk: "Sometimes his hugs are so tight they turn things into pixel dust.",
    sprite: "/assets/images/pixel_big_g_1779285154810.png",
    color: "#c084fc",
    themeId: "indonesian_folklore"
  },
  {
    id: "wewe-gombel-mama",
    name: "Mama Weaver",
    rarity: "RARE",
    description: "A maternal Wewe Gombel who guards lost items and abandoned save files.",
    quirk: "If you leave your controller alone, she'll clean the thumbsticks for you.",
    sprite: "/assets/images/pixel_mama_weaver_1779285175277.png",
    color: "#ffaa88",
    themeId: "indonesian_folklore"
  },
  {
    id: "sundel-dolly",
    name: "Donut Dolly",
    rarity: "UNCOMMON",
    description: "A friendly Sundel Bolong with a hole in her back that she fills with donut tokens.",
    quirk: "Giggles whenever someone tries to 'insert coin' into her back.",
    sprite: "/assets/images/pixel_donut_dolly_1779285191709.png",
    color: "#ffeeee",
    themeId: "indonesian_folklore"
  },
  {
    id: "jenglot-tim",
    name: "Tiny Tim",
    rarity: "RARE",
    description: "A tiny Jenglot, very small, very old, and very confused by Wi-Fi.",
    quirk: "Tries to fight the claw arm. The claw arm usually wins.",
    sprite: "/assets/images/pixel_jenglot_solo_final_1779288507976.png",
    color: "#fca5a5",
    themeId: "indonesian_folklore"
  },
  {
    id: "banaspati-sparky",
    name: "Sparky",
    rarity: "UNCOMMON",
    description: "A floating Banaspati fireball that smells like singed popcorn.",
    quirk: "Heats up the glass of the machine so the 'near miss' capsules sweat.",
    sprite: "/assets/images/pixel_sparky_fireball_1779285224001.png",
    color: "#ff4400",
    themeId: "indonesian_folklore"
  },
  {
    id: "leak-tonguey",
    name: "Tonguey",
    rarity: "RARE",
    description: "A colorful Leak whose tongue changes flavor based on his mood.",
    quirk: "Accidentally licks the screen. It leaves a sticky pixel residue.",
    sprite: "/assets/images/pixel_tonguey_leak_1779285242382.png",
    color: "#ff3333",
    themeId: "indonesian_folklore"
  },
  {
    id: "buto-ijo-greenie",
    name: "Greenie",
    rarity: "COMMON",
    description: "A hungry Buto Ijo spirit who thinks the capsules are giant eggs.",
    quirk: "Tries to sit on the capsules to 'hatch' them. It doesn't work.",
    sprite: "/assets/images/pixel_greenie_giant_1779285262755.png",
    color: "#86efac",
    themeId: "indonesian_folklore"
  },
  {
    id: "wave-queen",
    name: "Wave",
    rarity: "LEGENDARY",
    description: "An emerald Nyi Roro Kidul queen ruling over the digital oceans.",
    quirk: "Leaves the scent of salt and static wherever she floats.",
    sprite: "/assets/images/pixel_wave_queen_1779285280694.png",
    color: "#22d3ee",
    themeId: "indonesian_folklore"
  },

  // 2. Tiny Dinosaurs Set
  {
    id: "dino-tri-sad",
    name: "Lonely Tricera",
    rarity: "COMMON",
    description: "A tiny dinosaur who worries her head crest is too heavy for her neck.",
    quirk: "Walks backwards when nervous so she doesn't poke any arcade bubbles.",
    sprite: "vector:dino-tri-sad",
    color: "#fbcfe8",
    themeId: "tiny_dinosaurs"
  },
  {
    id: "dino-rex-short",
    name: "Rexy Short-Arms",
    rarity: "UNCOMMON",
    description: "A small t-rex who cannot reach the machine cabinet joysticks.",
    quirk: "Sighs softly whenever she watches taller ghosts make high scores.",
    sprite: "vector:dino-rex-short",
    color: "#86efac",
    themeId: "tiny_dinosaurs"
  },
  {
    id: "dino-long-neck",
    name: "Bronto Blanket",
    rarity: "RARE",
    description: "A baby long-neck dinosaur who wears a warm scrap-paper label like a scarf.",
    quirk: "Blinks in slow motion. Usually takes 3 seconds to process a compliment.",
    sprite: "vector:dino-long-neck",
    color: "#a5f3fc",
    themeId: "tiny_dinosaurs"
  },
  {
    id: "dino-steg-sleep",
    name: "Steggy Sleepy",
    rarity: "COMMON",
    description: "A sleepy stegosaurus who believes pixel dust is the cozy soil of ancient jungles.",
    quirk: "Her back plates twitch in rhythm with the arcade's 8-bit bass lines.",
    sprite: "vector:dino-steg-sleep",
    color: "#fef08a",
    themeId: "tiny_dinosaurs"
  },
  {
    id: "dino-rapt-hide",
    name: "Shy Raptor",
    rarity: "LEGENDARY",
    description: "An ultra-shy raptor who wrapped himself in a discarded bubble wrap envelope.",
    quirk: "Pops exactly one bubble when made nervous. Only has 72 bubbles left.",
    sprite: "vector:dino-rapt-hide",
    color: "#c084fc",
    themeId: "tiny_dinosaurs"
  },

  // 3. Sad Spaceships Set
  {
    id: "ship-sputnik",
    name: "Sputnik Junior",
    rarity: "COMMON",
    description: "A rusty metal orb who keeps broadcasting his metadata to empty frequencies.",
    quirk: "His antennae buzz with 50Hz static whenever a coin drops down the chute.",
    sprite: "vector:ship-sputnik",
    color: "#cbd5e1",
    themeId: "sad_spaceships"
  },
  {
    id: "ship-voyager",
    name: "Voyager-X",
    rarity: "UNCOMMON",
    description: "A golden record player travelling through the quiet void of a long-lost memory card.",
    quirk: "Plays corrupted 80s greeting cards on loop. Sounds like faint laughter.",
    sprite: "vector:ship-voyager",
    color: "#fde047",
    themeId: "sad_spaceships"
  },
  {
    id: "ship-kepler",
    name: "Kepler Kid",
    rarity: "RARE",
    description: "An abandoned space telescope looking for a planet that hasn't finished rendering yet.",
    quirk: "Closes his lens shutter when mall lights get too bright. He fears neon.",
    sprite: "vector:ship-kepler",
    color: "#67e8f9",
    themeId: "sad_spaceships"
  },
  {
    id: "ship-rover-dust",
    name: "Dusty Rover",
    rarity: "COMMON",
    description: "A tiny rover rolling around on a small sand pile at the bottom of the tank.",
    quirk: "Collects old arcade screws and lines them up in neat concentric patterns.",
    sprite: "vector:ship-rover-dust",
    color: "#fed7aa",
    themeId: "sad_spaceships"
  },
  {
    id: "ship-nova-star",
    name: "Nova Glow",
    rarity: "LEGENDARY",
    description: "An old broken engine that still leaks soft lavender gravitational fields.",
    quirk: "Causes neighboring capsules to float exactly half-an-inch off the floor.",
    sprite: "vector:ship-nova-star",
    color: "#e879f9",
    themeId: "sad_spaceships"
  },

  // 4. Haunted Mart Snacks Set
  {
    id: "snack-teh-crying",
    name: "Sorrowful Teh",
    rarity: "COMMON",
    description: "A cardboard juice box dating back to 1996. It somehow remains cold.",
    quirk: "Spills cold tiny rings of sweat that spell 'SORRY' on the plastic chute.",
    sprite: "vector:snack-teh-crying",
    color: "#f97316",
    themeId: "convenience_snacks"
  },
  {
    id: "snack-indomie-ghost",
    name: "Ghostly Mi",
    rarity: "COMMON",
    description: "A spectral packet of instant noodles that smells like a rainy Jakarta evening.",
    quirk: "His dried noodles rattle like small maracas when the claw grabs him.",
    sprite: "vector:snack-indomie-ghost",
    color: "#fbbf24",
    themeId: "convenience_snacks"
  },
  {
    id: "snack-krupuk-soft",
    name: "Soft Krupuk",
    rarity: "UNCOMMON",
    description: "A giant white chip that went soggy and limp because the machine AC dripped.",
    quirk: "Makes a soft 'quish' cushion noise when capsules roll over her head.",
    sprite: "vector:snack-krupuk-soft",
    color: "#94a3b8",
    themeId: "convenience_snacks"
  },
  {
    id: "snack-chiki-puff",
    name: "Chiki Cheeky",
    rarity: "RARE",
    description: "An old puffy snack bag containing a single shiny green glass marble.",
    quirk: "Crinkles in absolute panic whenever fingers touch the cabinet monitor.",
    sprite: "vector:snack-chiki-puff",
    color: "#fca5a5",
    themeId: "convenience_snacks"
  },
  {
    id: "snack-es-monas",
    name: "Melted Monas",
    rarity: "LEGENDARY",
    description: "A mystical strawberry cone that never actually melts; it just glows.",
    quirk: "Emits a sweet strawberry-scented frequency that claims wild glitches.",
    sprite: "vector:snack-es-monas",
    color: "#f472b6",
    themeId: "convenience_snacks"
  },

  // 5. Moon Creatures Set
  {
    id: "moon-bunny-dust",
    name: "Lunar Dust Bunny",
    rarity: "COMMON",
    description: "A fluffy clump of silver crater-dust gathered in the machine air vents.",
    quirk: "Drifts upside down when the arcade background music plays low bass tones.",
    sprite: "vector:moon-bunny-dust",
    color: "#cbd5e1",
    themeId: "moon_creatures"
  },
  {
    id: "moon-crater-pug",
    name: "Crater Rover",
    rarity: "UNCOMMON",
    description: "A round grey creature with three stubby legs who loves digging in ash.",
    quirk: "Curls up so tight he resembles a crater pebble. Hard to grab!",
    sprite: "vector:moon-crater-pug",
    color: "#fda4af",
    themeId: "moon_creatures"
  },
  {
    id: "moon-phase-spirit",
    name: "Chandra Phase",
    rarity: "RARE",
    description: "A crescent shadow whose opacity responds to the physical lunar phase cycle.",
    quirk: "Casts a warm blue glow that resembles a cozy storefront neon sign.",
    sprite: "vector:moon-phase-spirit",
    color: "#38bdf8",
    themeId: "moon_creatures"
  },
  {
    id: "moon-cheese-mouse",
    name: "Cheese Nibbler",
    rarity: "COMMON",
    description: "A small mouse who was told the moon is made of cheddar, and is slightly disappointed.",
    quirk: "Constantly nibbles on the capsule labels, but leaves no permanent tooth scars.",
    sprite: "vector:moon-cheese-mouse",
    color: "#fef08a",
    themeId: "moon_creatures"
  },
  {
    id: "moon-comet-tail",
    name: "Comet Sweeper",
    rarity: "LEGENDARY",
    description: "A celestial guardian who sweeps away old broken pixel fragments with her tail.",
    quirk: "Leaves a trail of sparkling lavender dust that dissolves after 3 seconds.",
    sprite: "vector:moon-comet-tail",
    color: "#c084fc",
    themeId: "moon_creatures"
  },

  // 6. Abandoned Arcade Mascots Set
  {
    id: "mascot-joy-rusty",
    name: "Rusty D-Pad",
    rarity: "COMMON",
    description: "A rubber button-pad who forgot which combination triggers jumping.",
    quirk: "Clicks 'UP, UP' frantically whenever the claw approaches, then gets dizzy.",
    sprite: "vector:mascot-joy-rusty",
    color: "#ef4444",
    themeId: "arcade_mascots"
  },
  {
    id: "mascot-screen-burn",
    name: "CRT Burny",
    rarity: "UNCOMMON",
    description: "A sad face permanently burned into the phosphors of an old 1991 arcade screen.",
    quirk: "Flickers subtly whenever a high score is displayed on the neighboring machine.",
    sprite: "vector:mascot-screen-burn",
    color: "#22c55e",
    themeId: "arcade_mascots"
  },
  {
    id: "mascot-ticket-clog",
    name: "Ticket Cloggy",
    rarity: "RARE",
    description: "A strip of 18 red tickets that got jammed inside the dispenser slot in 1997.",
    quirk: "Rattles like tiny dry autumn leaves whenever you tap on the cabin glass.",
    sprite: "vector:mascot-ticket-clog",
    color: "#f97316",
    themeId: "arcade_mascots"
  },
  {
    id: "mascot-coin-jam",
    name: "Jammy Coin",
    rarity: "COMMON",
    description: "A shiny brass coin that bent and got jammed forever inside the machine's validator.",
    quirk: "Speaks in tiny high-pitched metallic clinks. Believes the capsule chute is a slides.",
    sprite: "vector:mascot-coin-jam",
    color: "#eab308",
    themeId: "arcade_mascots"
  },
  {
    id: "mascot-glitch-hacker",
    name: "MissingNo.09",
    rarity: "LEGENDARY",
    description: "A fragmented sprite block of glitched pixels that has developed a friendly soul.",
    quirk: "Divides into three separate flickering blocks when grabbed, then snaps back.",
    sprite: "vector:mascot-glitch-hacker",
    color: "#e879f9",
    themeId: "arcade_mascots"
  }
];
