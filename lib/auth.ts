import { UserPayload } from './types';

const TOKEN_KEY = 'expo_token';

export const authService = {
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    document.cookie = `expo_token=${token}; path=/; max-age=${8 * 60 * 60}`;
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = 'expo_token=; path=/; max-age=0';
  },

  getUser(): UserPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded as UserPayload;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    const user = this.getUser();
    if (!user) return false;
    const now = Math.floor(Date.now() / 1000);
    return user.exp > now;
  },

  isAdmin(): boolean {
    return this.getUser()?.id_rol === 1;
  },

  isMaestro(): boolean {
    return this.getUser()?.id_rol === 3;
  },

  isAlumno(): boolean {
    return this.getUser()?.id_rol === 2;
  },

  logout(): void {
    this.removeToken();
  },
};