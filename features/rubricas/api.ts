import api from '@/lib/api';
import { Rubrica, RubricaInput, Criterio, CriterioInput, PagedResponse } from '@/lib/types';

export const rubricasApi = {
    getAll(page = 0, size = 10): Promise<{ data: PagedResponse<Rubrica> }> {
        return api.get('/rubricas', { params: { page, size } });
    },

    getById(id: number): Promise<{ data: Rubrica }> {
        return api.get(`/rubricas/${id}`);
    },

    create(data: RubricaInput): Promise<{ data: Rubrica }> {
        return api.post('/rubricas', data);
    },

    update(id: number, data: RubricaInput): Promise<{ data: Rubrica }> {
        return api.put(`/rubricas/${id}`, data);
    },

    delete(id: number): Promise<void> {
        return api.delete(`/rubricas/${id}`);
    },

    publish(id: number): Promise<{ data: Rubrica }> {
        return api.put(`/rubricas/${id}/publicar`, {});
    },

    // Criterios
    getCriterios(id_rubrica: number): Promise<{ data: Criterio[] }> {
        return api.get(`/rubricas/${id_rubrica}/criterios`);
    },

    addCriterio(id_rubrica: number, data: CriterioInput): Promise<{ data: Criterio }> {
        return api.post(`/rubricas/${id_rubrica}/criterios`, data);
    },

    updateCriterio(id_rubrica: number, id_criterio: number, data: CriterioInput): Promise<{ data: Criterio }> {
        return api.put(`/rubricas/${id_rubrica}/criterios/${id_criterio}`, data);
    },

    deleteCriterio(id_rubrica: number, id_criterio: number): Promise<void> {
        return api.delete(`/rubricas/${id_rubrica}/criterios/${id_criterio}`);
    },
};
