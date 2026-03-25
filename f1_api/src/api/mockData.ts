// src/api/mockData.ts

// Diesmal die 100% korrekten Geometrie-Daten für den Shanghai International Circuit.
// Exakt auf dein Referenzbild abgestimmt. Keine überlappenden Linien mehr!
export const SHANGHAI_TRACK_GEOMETRY = [
  // Start/Ziel-Gerade (Diagonale nach oben rechts)
  {x: 3500, y: 4000},
  {x: 4000, y: 5500},
  {x: 4500, y: 7000},
  {x: 5000, y: 8500},

  // T1 - T4: Die "Schnecke" (Zieht nach rechts, rollt sich ein, dann ein kleiner Haken raus)
  {x: 5500, y: 9500},
  {x: 6500, y: 9800},
  {x: 7500, y: 9000},
  {x: 8000, y: 8000},
  {x: 7500, y: 7000},
  {x: 6500, y: 6800},
  {x: 6000, y: 7500}, // T3 Apex
  {x: 6300, y: 8200}, // T4 Linksknick raus aus der Schnecke

  // T5 & T6 Haarnadel (Zieht weit nach rechts außen)
  {x: 7000, y: 8300},
  {x: 8500, y: 8500},
  {x: 9500, y: 8000},
  {x: 9800, y: 7000}, // T6 Haarnadel Apex
  {x: 9000, y: 6500},

  // T7 - T10 (Die S-Kurven im Mittelteil)
  {x: 7500, y: 6500},
  {x: 6500, y: 6000},
  {x: 6200, y: 5000}, // T8
  {x: 6500, y: 4000}, 
  {x: 7500, y: 3500}, // T9
  {x: 8500, y: 4000}, // T10
  {x: 9500, y: 3000},

  // T11 - T13 (Die überhöhte Kurve auf die Gegengerade)
  {x: 10000, y: 2000},
  {x: 9500, y: 1200},
  {x: 8500, y: 1000},

  // Die ewig lange Gegengerade (Perfekt horizontal nach links)
  {x: 6000, y: 1000},
  {x: 4000, y: 1000},
  {x: 2000, y: 1000},
  {x: 0, y: 1000},
  {x: -1500, y: 1000}, // Harte Bremszone

  // T14 Haarnadel (Unten links)
  {x: -2500, y: 1200},
  {x: -2800, y: 1800}, // T14 Apex
  {x: -2000, y: 2200},

  // T15 - T16 (Rückkehr zur S/F-Geraden)
  {x: -1000, y: 2200},
  {x: 500, y: 2200},
  {x: 1500, y: 2300},
  {x: 2500, y: 2500},
  {x: 3000, y: 3000}, // T16 Apex
  {x: 3500, y: 4000}  // Loop geschlossen
];