/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import StarField from "./components/StarField";
import MeteorField from "./components/MeteorField";
import ClawMachine from "./components/ClawMachine";
import CRTOverlay from "./components/CRTOverlay";

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#050510] overflow-hidden selection:bg-pink-500 selection:text-white">
      {/* Background Layer */}
      <StarField />
      
      {/* Middle Layer (Meteors) */}
      <MeteorField />

      {/* Main Interaction Layer */}
      <ClawMachine />

      {/* Visual Effect Layer */}
      <CRTOverlay />

      {/* Corner UI Accents */}
      <div className="fixed top-6 left-6 z-40 hidden sm:block">
        <div className="pixel-text text-[10px] text-gray-500 flex flex-col gap-1 border-l-2 border-gray-800 pl-3">
          <span>REGION: ASIA-SEA</span>
          <span>EST: 199s</span>
          <span className="text-pink-500/50 italic">LOST SIGNAL...</span>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
        <div className="pixel-text text-[10px] text-gray-500 text-right border-r-2 border-gray-800 pr-3">
          <span>MEMORY-CARD: SLOW_HEART</span>
          <span>SLOT: 01</span>
        </div>
      </div>
    </div>
  );
}

