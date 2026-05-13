"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { useEffect, useState } from 'react';
import { LayoutDashboard, BookOpen, Users, GraduationCap, UsersRound, Presentation, ClipboardList, LogOut, X } from 'lucide-react';

const allMenuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: [1, 2, 3] },
  { name: 'Materias', path: '/materias', icon: BookOpen, roles: [1, 3] },
  { name: 'Grupos', path: '/grupos', icon: UsersRound, roles: [1, 3] },
  { name: 'Alumnos', path: '/alumnos', icon: GraduationCap, roles: [1, 3] },
  { name: 'Equipos', path: '/equipos', icon: Users, roles: [1, 2, 3] },
  { name: 'Exposiciones', path: '/exposiciones', icon: Presentation, roles: [1, 2, 3] },
  { name: 'Evaluaciones', path: '/evaluaciones', icon: ClipboardList, roles: [2] },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuItems, setMenuItems] = useState(allMenuItems);

  useEffect(() => {
    const user = authService.getUser();
    if (user) {
      setMenuItems(allMenuItems.filter(item => item.roles.includes(user.id_rol)));
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="w-64 h-screen border-r border-border bg-background/95 glass flex flex-col">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          ExpoSystem
        </h1>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-secondary/50 rounded-lg transition-colors">
            <X size={18} className="text-muted-foreground" />
          </button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.path
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              }`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}