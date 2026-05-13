import api from '@/lib/api';
import { Evaluacion, EvaluacionInput } from '@/lib/types';

export const evaluacionesApi = {
    create(data: EvaluacionInput): Promise<{ data: Evaluacion }> {
        return api.post('/evaluaciones', data);
    },

    getById(id: number): Promise<{ data: Evaluacion }> {
        return api.get(`/evaluaciones/${id}`);
    },
};