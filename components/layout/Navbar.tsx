"use client";

import { useEffect, useState } from 'react';
import { getAuthUser, User } from '@/lib/auth';

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  return (
    <header className="h-16 border-b border-border bg-background/50 glass flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle could go here */}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-sm text-right hidden md:block">
          <p className="font-medium text-foreground">{user?.nombre || 'Usuario'}</p>
          <p className="text-xs text-muted-foreground">{user?.id_rol === 1 ? 'Administrador' : 'Alumno'}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
          {user?.nombre?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}
