import api from '@/lib/api';
import { Exposicion, ExposicionInput, EstadoExpo, PagedResponse } from '@/lib/types';

export const exposicionesApi = {
    getAll(page = 0, size = 10): Promise<{ data: PagedResponse<Exposicion> }> {
        return api.get('/exposiciones', { params: { page, size } });
    },

    getById(id: number): Promise<{ data: Exposicion }> {
        return api.get(`/exposiciones/${id}`);
    },

    create(data: ExposicionInput): Promise<{ data: Exposicion }> {
        return api.post('/exposiciones', data);
    },

    update(id: number, data: ExposicionInput): Promise<{ data: Exposicion }> {
        return api.put(`/exposiciones/${id}`, data);
    },

    remove(id: number): Promise<void> {
        return api.delete(`/exposiciones/${id}`);
    },

    changeEstado(id: number, estado: EstadoExpo): Promise<void> {
        return api.patch(`/exposiciones/${id}/estado`, { estado });
    },
};