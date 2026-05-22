export default function CRTOverlay() {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute inset-0 crt-scanlines opacity-20" />
      <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-transparent to-black/30" />
    </div>
  );
}
