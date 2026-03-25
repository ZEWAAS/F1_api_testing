import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Aktuelles Rennen' },
  { to: '/drivers', label: 'Fahrer' },
  { to: '/standings', label: 'WM-Stand' },
];

export default function Topbar() {
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-3 text-sm font-semibold tracking-[0.35em]"
        >
          <div className="flex h-7 items-center rounded-full bg-slate-900/80 px-3 ring-1 ring-red-500/60">
            <span className="mr-1 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(248,113,113,0.9)]" />
            <span className="text-red-400">F1</span>
          </div>
          <span className="text-slate-300">DASHBOARD</span>
        </Link>

        <ul className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em]">
          {navItems.map((item) => {
            const isActive =
              item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={[
                    'relative inline-flex items-center gap-1 rounded-full px-3 py-1 transition-colors',
                    isActive
                      ? 'bg-red-500/15 text-red-300 ring-1 ring-red-500/60'
                      : 'text-slate-400 hover:text-red-300 hover:bg-slate-800/70',
                  ].join(' ')}
                >
                  {isActive && (
                    <span className="h-1 w-1 rounded-full bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.8)]" />
                  )}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}