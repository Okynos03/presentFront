"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '' },
  { name: 'Materias', path: '/materias', icon: '' },
  { name: 'Grupos', path: '/grupos', icon: '' },
  { name: 'Alumnos', path: '/alumnos', icon: '' },
  { name: 'Equipos', path: '/equipos', icon: '' },
  { name: 'Exposiciones', path: '/exposiciones', icon: '' },
  { name: 'Evaluaciones', path: '/evaluaciones', icon: '' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen border-r border-border bg-background/50 glass flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          ExpoSystem
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === item.path
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              }`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <Link
          href="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <span>🚪</span>
          <span>Cerrar Sesión</span>
        </Link>
      </div>
    </aside>
  );
}
