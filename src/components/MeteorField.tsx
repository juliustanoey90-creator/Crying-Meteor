import { motion } from "motion/react";

export default function MeteorField() {
  const meteors = Array.from({ length: 4 }).map((_, i) => ({
    id: i,
    delay: i * 8,
    duration: 15 + Math.random() * 10,
    y: 10 + i * 20,
  }));

  return (
    <div className="fixed inset-0 z-5 pointer-events-none overflow-hidden">
      {meteors.map((m) => (
        <motion.img
          key={m.id}
          src="/assets/images/pixel_meteor_1779281807285.png"
          className="absolute w-16 opacity-40"
          initial={{ x: "-20%", y: `${m.y}%`, rotate: 45 }}
          animate={{ x: "120%", y: `${m.y + 10}%` }}
          transition={{
            duration: m.duration,
            repeat: Infinity,
            delay: m.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
