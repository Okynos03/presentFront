import api from '@/lib/api';
import { Equipo, EquipoInput, PagedResponse } from '@/lib/types';

export const equiposApi = {
    getAll(page = 0, size = 10): Promise<{ data: PagedResponse<Equipo> }> {
        return api.get('/equipos', { params: { page, size } });
    },

    getById(id: number): Promise<{ data: Equipo }> {
        return api.get(`/equipos/${id}`);
    },

    create(data: EquipoInput): Promise<{ data: Equipo }> {
        return api.post('/equipos', data);
    },

    update(id: number, data: EquipoInput): Promise<{ data: Equipo }> {
        return api.put(`/equipos/${id}`, data);
    },

    remove(id: number): Promise<void> {
        return api.delete(`/equipos/${id}`);
    },

    addAlumno(id_equipo: number, id_alumno: number): Promise<void> {
        return api.post(`/equipos/${id_equipo}/alumnos`, { id_alumno });
    },

    removeAlumno(id_equipo: number, id_alumno: number): Promise<void> {
        return api.delete(`/equipos/${id_equipo}/alumnos/${id_alumno}`);
    },

    assignJefe(id_equipo: number, id_jefe: number): Promise<void> {
        return api.patch(`/equipos/${id_equipo}/jefe`, { id_jefe });
    },
};