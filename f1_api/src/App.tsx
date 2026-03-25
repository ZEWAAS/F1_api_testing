import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Topbar from './components/Topbar';
import Home from './pages/Home';

const PageShell = ({ title }: { title: string }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-8 text-slate-100 shadow-[0_0_40px_rgba(15,23,42,0.8)]">
    <h1 className="text-lg font-semibold uppercase tracking-[0.25em] text-slate-200">
      {title}
    </h1>
    <p className="mt-4 text-sm text-slate-400">
      Hier kannst du später Tabellen, Karten und Statistiken für diesen Bereich
      einfügen.
    </p>
  </div>
);

const Drivers = () => <PageShell title="Fahrer" />;
const Standings = () => <PageShell title="WM-Stand" />;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.08),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.05),_transparent_55%)] opacity-80" />
        <div className="relative z-10">
          <Topbar />
          <main className="mx-auto max-w-6xl px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/standings" element={<Standings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;