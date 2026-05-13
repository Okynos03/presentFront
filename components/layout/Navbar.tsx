"use client";

import { useEffect, useState } from 'react';
import { authService } from '@/lib/auth';
import { UserPayload } from '@/lib/types';
import { Menu } from 'lucide-react';

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [user, setUser] = useState<UserPayload | null>(null);

  useEffect(() => {
    setUser(authService.getUser());
  }, []);

  const getRolNombre = (id_rol: number) => {
    if (id_rol === 1) return 'Administrador';
    if (id_rol === 2) return 'Alumno';
    if (id_rol === 3) return 'Maestro';
    return 'Usuario';
  };

  return (
    <header className="h-16 border-b border-border bg-background/50 glass flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-secondary/50 rounded-lg transition-colors"
        >
          <Menu size={20} className="text-muted-foreground" />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-right hidden md:block">
          <p className="font-medium text-foreground">{user?.username || 'Usuario'}</p>
          <p className="text-xs text-muted-foreground">{user ? getRolNombre(user.id_rol) : ''}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
          {user?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}