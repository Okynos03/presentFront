import { useState, useEffect, useCallback } from 'react';
import { rubricasApi } from '../api';
import { Rubrica, RubricaInput, Criterio, CriterioInput, PagedResponse } from '@/lib/types';
import { AxiosError } from 'axios';

export const useRubricas = (page = 0, size = 10) => {
    const [data, setData] = useState<PagedResponse<Rubrica> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRubricas = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await rubricasApi.getAll(page, size);
            setData(response.data);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            setError(error.response?.data?.message || 'Error al obtener rúbricas');
        } finally {
            setLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        fetchRubricas();
    }, [fetchRubricas]);

    const createRubrica = async (data: RubricaInput) => {
        const response = await rubricasApi.create(data);
        await fetchRubricas();
        return response.data;
    };

    const updateRubrica = async (id: number, data: RubricaInput) => {
        const response = await rubricasApi.update(id, data);
        await fetchRubricas();
        return response.data;
    };

    const deleteRubrica = async (id: number) => {
        await rubricasApi.delete(id);
        await fetchRubricas();
    };

    const publishRubrica = async (id: number) => {
        const response = await rubricasApi.publish(id);
        await fetchRubricas();
        return response.data;
    };

    const getCriterios = async (id_rubrica: number): Promise<Criterio[]> => {
        const response = await rubricasApi.getCriterios(id_rubrica);
        return response.data;
    };

    const addCriterio = async (id_rubrica: number, data: CriterioInput) => {
        const response = await rubricasApi.addCriterio(id_rubrica, data);
        return response.data;
    };

    const updateCriterio = async (id_rubrica: number, id_criterio: number, data: CriterioInput) => {
        const response = await rubricasApi.updateCriterio(id_rubrica, id_criterio, data);
        return response.data;
    };

    const deleteCriterio = async (id_rubrica: number, id_criterio: number) => {
        await rubricasApi.deleteCriterio(id_rubrica, id_criterio);
    };

    return {
        data,
        loading,
        error,
        refetch: fetchRubricas,
        createRubrica,
        updateRubrica,
        deleteRubrica,
        publishRubrica,
        getCriterios,
        addCriterio,
        updateCriterio,
        deleteCriterio,
    };
};
