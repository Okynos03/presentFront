import api from '@/lib/api';
import { Materia, MateriaInput, PagedResponse } from '@/lib/types';

export const materiasApi = {
    getAll(page = 0, size = 10, nombre?: string): Promise<{ data: PagedResponse<Materia> }> {
        const params: Record<string, unknown> = { page, size };
        if (nombre) params.nombre = nombre;
        return api.get('/materias', { params });
    },

    getById(id: number): Promise<{ data: Materia }> {
        return api.get(`/materias/${id}`);
    },

    create(data: MateriaInput): Promise<{ data: Materia }> {
        return api.post('/materias', data);
    },

    update(id: number, data: MateriaInput): Promise<{ data: Materia }> {
        return api.put(`/materias/${id}`, data);
    },

    remove(id: number): Promise<void> {
        return api.delete(`/materias/${id}`);
    },
};