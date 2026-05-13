import api from '@/lib/api';
import { Grupo, Equipo, Alumno, PagedResponse } from '@/lib/types';

export const dashboardApi = {
    // Para MAESTRO - sus grupos
    getGrupos(page = 0, size = 10): Promise<{ data: PagedResponse<Grupo> }> {
        return api.get('/grupos', { params: { page, size } });
    },

    // Para MAESTRO - alumnos de sus grupos
    getAlumnos(page = 0, size = 10): Promise<{ data: PagedResponse<Alumno> }> {
        return api.get('/alumnos', { params: { page, size } });
    },

    // Para MAESTRO y ALUMNO - equipos
    getEquipos(page = 0, size = 10): Promise<{ data: PagedResponse<Equipo> }> {
    return Promise.race([
        api.get('/equipos', { params: { page, size } }),
        new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 3000)
        ),
    ]) as Promise<{ data: PagedResponse<Equipo> }>;
    },
};