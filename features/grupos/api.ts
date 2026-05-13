import api from '@/lib/api';
import { Grupo, GrupoInput, PagedResponse } from '@/lib/types';

export const gruposApi = {
    getAll(page = 0, size = 10): Promise<{ data: PagedResponse<Grupo> }> {
        return api.get('/grupos', { params: { page, size } });
    },

    getById(id: number): Promise<{ data: Grupo }> {
        return api.get(`/grupos/${id}`);
    },

    create(data: GrupoInput): Promise<{ data: Grupo }> {
        return api.post('/grupos', data);
    },

    update(id: number, data: GrupoInput): Promise<{ data: Grupo }> {
        return api.put(`/grupos/${id}`, data);
    },

    remove(id: number): Promise<void> {
        return api.delete(`/grupos/${id}`);
    },

    addAlumno(id_grupo: number, id_alumno: number): Promise<void> {
        return api.post(`/grupos/${id_grupo}/alumnos`, { id_alumno });
    },

    removeAlumno(id_grupo: number, id_alumno: number): Promise<void> {
        return api.delete(`/grupos/${id_grupo}/alumnos/${id_alumno}`);
    },
};