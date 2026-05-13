import { useState, useEffect, useCallback } from 'react';
import { dashboardApi } from '../api';
import { Grupo, Equipo, Alumno, PagedResponse, UserPayload } from '@/lib/types';
import { authService } from '@/lib/auth';
import { AxiosError } from 'axios';

export const useDashboard = () => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [grupos, setGrupos] = useState<PagedResponse<Grupo> | null>(null);
  const [alumnos, setAlumnos] = useState<PagedResponse<Alumno> | null>(null);
  const [equipos, setEquipos] = useState<PagedResponse<Equipo> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMaestro, setIsMaestro] = useState(false);
  const [isAlumno, setIsAlumno] = useState(false);

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
    setIsAdmin(authService.isAdmin());
    setIsMaestro(authService.isMaestro());
    setIsAlumno(authService.isAlumno());
  }, []);

  const fetchDashboard = useCallback(async () => {
    const currentUser = authService.getUser();
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);

      if (currentUser.id_rol === 1 || currentUser.id_rol === 3) {
        const [gruposRes, alumnosRes] = await Promise.all([
          dashboardApi.getGrupos(),
          dashboardApi.getAlumnos(),
        ]);
        setGrupos(gruposRes.data);
        setAlumnos(alumnosRes.data);

        try {
          const equiposRes = await dashboardApi.getEquipos();
          setEquipos(equiposRes.data);
        } catch (e) {
          setEquipos({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0 });
        }
      }

      if (currentUser.id_rol === 2) {
        try {
          const equiposRes = await dashboardApi.getEquipos();
          setEquipos(equiposRes.data);
        } catch (e) {
          setEquipos({ content: [], page: 0, size: 10, totalElements: 0, totalPages: 0 });
        }
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message || 'Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user !== null) {
      fetchDashboard();
    }
  }, [user, fetchDashboard]);

  return {
    user,
    grupos,
    alumnos,
    equipos,
    loading,
    error,
    isAdmin,
    isMaestro,
    isAlumno,
    refetch: fetchDashboard,
  };
};