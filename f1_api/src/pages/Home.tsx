import { useEffect, useState } from 'react';
import { getLatestSession } from '../api/openf1';
import TrackMap from '../components/TrackMap';
import { SHANGHAI_TRACK_GEOMETRY } from '../api/mockData';

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await getLatestSession();
        setSession(data);
      } catch (error) {
        console.error('Fehler beim Laden der Session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  if (loading) {
    return (
      <div className="mt-24 text-center text-sm uppercase tracking-[0.25em] text-slate-400">
        Lädt aktuelle Session...
      </div>
    );
  }

  // Perfekt platzierte Autos auf unserer Shanghai-Geometrie
  const mockCars = [
    { driver_number: 1, color: '#3671C6', x: -1000, y: 1000 }, // Red Bull: Voll auf der Bremse vor Turn 14
    { driver_number: 16, color: '#E80020', x: 4000, y: 5500 }, // Ferrari: Mitten auf der Start/Ziel-Geraden
    { driver_number: 4, color: '#FF8000', x: 6500, y: 4000 },  // McLaren: In den S-Kurven (Turn 8)
    { driver_number: 44, color: '#27F4D2', x: 9500, y: 7500 }  // Mercedes: In der Haarnadel Turn 6
  ];

  return (
    <div className="space-y-6">
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
        <section className="col-span-1 rounded-xl border border-slate-800 bg-slate-950/90 p-5 lg:col-span-2">
          {/* HIER ÜBERGEBEN WIR DIE PERFEKTEN DATEN */}
          <TrackMap
            trackData={SHANGHAI_TRACK_GEOMETRY}
            carPositions={mockCars}
          />
        </section>

        <aside className="flex flex-col rounded-xl border border-slate-800 bg-slate-950/90 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
              Live Positionen
            </h2>
            <span className="h-px w-14 bg-gradient-to-r from-slate-500 via-slate-300 to-slate-500" />
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Hier wird später das Leaderboard aus dem <code className="text-[10px] text-red-300">/position</code>{' '}
            Endpoint geladen.
          </p>

          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/80 p-3 text-[11px] text-slate-400">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
              Geplante Daten
            </p>
            <ul className="space-y-1">
              <li>· Aktuelle Position & Gap</li>
              <li>· Letzte Runde / Beste Runde</li>
              <li>· Reifencompound & Stints</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}