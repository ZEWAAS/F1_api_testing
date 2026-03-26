import { useEffect, useState } from 'react';
import { getLatestSession, getDrivers } from '../api/openf1';
import TrackMap from '../components/TrackMap';

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [allDrivers, setAllDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Lade ausgewählte Fahrer aus dem LocalStorage oder setze Default (Verstappen, Leclerc, Norris, Hamilton)
  const [selectedDriverNums, setSelectedDriverNums] = useState<number[]>(() => {
    const saved = localStorage.getItem('f1_selected_drivers');
    return saved ? JSON.parse(saved) : [1, 16, 4, 44];
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Session holen
        const sessionData = await getLatestSession();
        setSession(sessionData);

        // 2. Alle Fahrer dieser Session holen
        if (sessionData?.session_key) {
          const driversData = await getDrivers(sessionData.session_key);
          setAllDrivers(driversData);
        }
      } catch (error) {
        console.error('Fehler beim Laden der API-Daten (Server evtl. down):', error);
        // --- FALLBACK 2026 GRID: Wenn die OpenF1 API down ist ---
        console.log("Nutze 2026 Fallback-Fahrerdaten, damit die UI weiter funktioniert.");
        setAllDrivers([
          // Red Bull Racing
          { driver_number: 1, name_acronym: 'VER', team_name: 'Red Bull Racing', team_colour: '3671C6' },
          { driver_number: 6, name_acronym: 'HAD', team_name: 'Red Bull Racing', team_colour: '3671C6' },
          // Ferrari
          { driver_number: 16, name_acronym: 'LEC', team_name: 'Ferrari', team_colour: 'E80020' },
          { driver_number: 44, name_acronym: 'HAM', team_name: 'Ferrari', team_colour: 'E80020' },
          // McLaren
          { driver_number: 4, name_acronym: 'NOR', team_name: 'McLaren', team_colour: 'FF8000' },
          { driver_number: 81, name_acronym: 'PIA', team_name: 'McLaren', team_colour: 'FF8000' },
          // Mercedes
          { driver_number: 63, name_acronym: 'RUS', team_name: 'Mercedes', team_colour: '27F4D2' },
          { driver_number: 12, name_acronym: 'ANT', team_name: 'Mercedes', team_colour: '27F4D2' },
          // Audi (Neues Werksteam)
          { driver_number: 27, name_acronym: 'HUL', team_name: 'Audi', team_colour: 'F60000' },
          { driver_number: 5, name_acronym: 'BOR', team_name: 'Audi', team_colour: 'F60000' },
          // Williams
          { driver_number: 55, name_acronym: 'SAI', team_name: 'Williams', team_colour: '64C4FF' },
          { driver_number: 23, name_acronym: 'ALB', team_name: 'Williams', team_colour: '64C4FF' },
          // Aston Martin
          { driver_number: 14, name_acronym: 'ALO', team_name: 'Aston Martin', team_colour: '229971' },
          { driver_number: 18, name_acronym: 'STR', team_name: 'Aston Martin', team_colour: '229971' },
          // Alpine
          { driver_number: 10, name_acronym: 'GAS', team_name: 'Alpine', team_colour: 'FF87BC' },
          { driver_number: 3, name_acronym: 'DOO', team_name: 'Alpine', team_colour: 'FF87BC' },
          // Haas
          { driver_number: 31, name_acronym: 'OCO', team_name: 'Haas', team_colour: 'B6BABD' },
          { driver_number: 87, name_acronym: 'BEA', team_name: 'Haas', team_colour: 'B6BABD' },
          // Racing Bulls (VCARB)
          { driver_number: 22, name_acronym: 'TSU', team_name: 'Racing Bulls', team_colour: '6692FF' },
          { driver_number: 30, name_acronym: 'LAW', team_name: 'Racing Bulls', team_colour: '6692FF' },
          // Cadillac (11. Team!)
          { driver_number: 11, name_acronym: 'PER', team_name: 'Cadillac', team_colour: 'A6A6A6' }
        ]);
        
        // Damit wir zumindest ein Rennen in der Kopfzeile sehen:
        if (!session) {
          setSession({
            session_name: "Mock Grand Prix",
            country_name: "Fallback",
            location: "Shanghai", // Damit die Map weiß, was sie laden soll!
            date_start: new Date().toISOString()
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fahrer umschalten (maximal 4)
  const toggleDriver = (driverNum: number) => {
    setSelectedDriverNums((prev) => {
      let newSelection = [...prev];
      if (newSelection.includes(driverNum)) {
        // Abwählen
        newSelection = newSelection.filter(n => n !== driverNum);
      } else {
        // Hinzufügen (wenn noch Platz ist)
        if (newSelection.length < 4) {
          newSelection.push(driverNum);
        } else {
          // Optional: Wenn schon 4 drin sind, den ältesten kicken
          newSelection.shift(); 
          newSelection.push(driverNum);
        }
      }
      // Im Browser speichern
      localStorage.setItem('f1_selected_drivers', JSON.stringify(newSelection));
      return newSelection;
    });
  };

  // Wir filtern die echten Fahrer-Objekte heraus, die aktuell ausgewählt sind
  const selectedDriversData = allDrivers.filter(d => selectedDriverNums.includes(d.driver_number));

  if (loading) {
    return (
      <div className="mt-24 text-center text-sm uppercase tracking-[0.25em] text-slate-400">
        Lädt Renndaten & Fahrer...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <header className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-5 shadow-[0_0_30px_rgba(15,23,42,0.7)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-red-400">
              Live Grand Prix
            </p>
            <h1 className="mt-1 text-xl font-semibold uppercase text-slate-50 tracking-[0.12em]">
              {session?.session_name || 'Unbekannt'} · {session?.country_name || 'Unbekannt'}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Live
            </span>
            <span className="h-px w-10 bg-gradient-to-r from-red-500 via-red-400 to-red-500" />
            <span>Strecke: {session?.location || 'Unbekannt'}</span>
            <span className="hidden text-slate-400 sm:inline">|</span>
            <span className="text-slate-400">
              {session ? new Date(session.date_start).toLocaleString('de-DE') : ''}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Die Karte (Links) */}
        <section className="col-span-1 rounded-xl border border-slate-800 bg-slate-950/90 p-5 lg:col-span-2">
          {/* Wir übergeben Location UND die echten Fahrerdaten */}
          <TrackMap 
            locationName={session?.location} 
            selectedDrivers={selectedDriversData} 
          />
        </section>

        {/* Die Fahrer-Auswahl (Rechts) */}
        {/* Die Fahrer-Auswahl (Rechts) */}
        {/* HIER NEU: p-5 entfernt, damit der Header ganz bis zum Rand geht */}
        <aside className="flex flex-col rounded-xl border border-slate-800 bg-slate-950/90 h-full max-h-[600px] overflow-hidden">
          
          {/* HIER NEU: Fester Hintergrund (bg-slate-950 statt /90), Z-Index hoch und eigener Rahmen unten */}
          <div className="flex items-center justify-between sticky top-0 bg-slate-950 z-20 px-5 pt-5 pb-4 border-b border-slate-800 shadow-md">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
                Fahrer Tracker
              </h2>
              <p className="text-[10px] text-slate-500 mt-1">Wähle max. 4 Fahrer ({selectedDriverNums.length}/4)</p>
            </div>
            <span className="h-px w-8 bg-gradient-to-r from-slate-500 via-slate-300 to-slate-500" />
          </div>

          {/* HIER NEU: Der scrollbare Bereich bekommt jetzt das Padding */}
          <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar px-5 py-4">
            {allDrivers.length === 0 && (
              <p className="text-xs text-slate-500">Keine Fahrer gefunden.</p>
            )}
            
            {allDrivers.map((driver) => {
              const isSelected = selectedDriverNums.includes(driver.driver_number);
              const color = driver.team_colour?.startsWith('#') ? driver.team_colour : `#${driver.team_colour || 'ffffff'}`;

              return (
                <button
                  key={driver.driver_number}
                  onClick={() => toggleDriver(driver.driver_number)}
                  className={`flex items-center justify-between rounded-lg p-3 text-left transition-all duration-200 border shrink-0
                    ${isSelected 
                      ? 'bg-slate-800 border-slate-600 shadow-md' 
                      : 'bg-slate-900/50 border-transparent hover:bg-slate-800/80 opacity-60 hover:opacity-100'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-1.5 h-6 rounded-full" 
                      style={{ backgroundColor: color, boxShadow: isSelected ? `0 0 10px ${color}80` : 'none' }} 
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-200 mr-2">{driver.driver_number}</span>
                      <span className="text-xs text-slate-300">{driver.name_acronym}</span>
                      <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{driver.team_name}</p>
                    </div>
                  </div>
                  
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center
                    ${isSelected ? 'border-red-500 bg-red-500/20' : 'border-slate-700 bg-slate-800'}
                  `}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-red-500" />}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}