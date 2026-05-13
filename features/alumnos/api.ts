import api from '@/lib/api';
import { Alumno, AlumnoInput, PagedResponse } from '@/lib/types';

export const alumnosApi = {
    getAll(page = 0, size = 10): Promise<{ data: PagedResponse<Alumno> }> {
        return api.get('/alumnos', { params: { page, size } });
    },

    getById(id: number): Promise<{ data: Alumno }> {
        return api.get(`/alumnos/${id}`);
    },

    create(data: AlumnoInput): Promise<{ data: Alumno }> {
        return api.post('/alumnos', data);
    },

    update(id: number, data: Omit<AlumnoInput, 'password'>): Promise<{ data: Alumno }> {
        return api.put(`/alumnos/${id}`, data);
    },

    remove(id: number): Promise<void> {
        return api.delete(`/alumnos/${id}`);
    },
};