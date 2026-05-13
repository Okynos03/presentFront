import { useState, useEffect, useCallback } from 'react';
import { materiasApi } from '../api';
import { Materia, MateriaInput, PagedResponse } from '@/lib/types';
import { AxiosError } from 'axios';

export const useMaterias = (page = 0, size = 10, nombre?: string) => {
    const [data, setData] = useState<PagedResponse<Materia> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMaterias = useCallback(async () => {
        try {
        setLoading(true);
        setError(null);
        const response = await materiasApi.getAll(page, size, nombre);
        setData(response.data);
        } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setError(error.response?.data?.message || 'Error al obtener materias');
        } finally {
        setLoading(false);
        }
    }, [page, size, nombre]);

    useEffect(() => {
        fetchMaterias();
    }, [fetchMaterias]);

    const createMateria = async (data: MateriaInput) => {
        const response = await materiasApi.create(data);
        await fetchMaterias();
        return response.data;
    };

    const updateMateria = async (id: number, data: MateriaInput) => {
        const response = await materiasApi.update(id, data);
        await fetchMaterias();
        return response.data;
    };

    const removeMateria = async (id: number) => {
        await materiasApi.remove(id);
        await fetchMaterias();
    };

    return {
        data,
        loading,
        error,
        refetch: fetchMaterias,
        createMateria,
        updateMateria,
        removeMateria,
    };
};