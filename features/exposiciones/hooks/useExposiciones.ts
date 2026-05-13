import { useState, useEffect, useCallback } from 'react';
import { exposicionesApi } from '../api';
import { Exposicion, ExposicionInput, EstadoExpo, PagedResponse } from '@/lib/types';
import { AxiosError } from 'axios';

export const useExposiciones = (page = 0, size = 10) => {
    const [data, setData] = useState<PagedResponse<Exposicion> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchExposiciones = useCallback(async () => {
        try {
        setLoading(true);
        setError(null);
        const response = await exposicionesApi.getAll(page, size);
        setData(response.data);
        } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setError(error.response?.data?.message || 'Error al obtener exposiciones');
        } finally {
        setLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        fetchExposiciones();
    }, [fetchExposiciones]);

    const createExposicion = async (data: ExposicionInput) => {
        const response = await exposicionesApi.create(data);
        await fetchExposiciones();
        return response.data;
    };

    const updateExposicion = async (id: number, data: ExposicionInput) => {
        const response = await exposicionesApi.update(id, data);
        await fetchExposiciones();
        return response.data;
    };

    const removeExposicion = async (id: number) => {
        await exposicionesApi.remove(id);
        await fetchExposiciones();
    };

    const changeEstado = async (id: number, estado: EstadoExpo) => {
        await exposicionesApi.changeEstado(id, estado);
        await fetchExposiciones();
    };

    return {
        data,
        loading,
        error,
        refetch: fetchExposiciones,
        createExposicion,
        updateExposicion,
        removeExposicion,
        changeEstado,
    };
};