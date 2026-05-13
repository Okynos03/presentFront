import { useState, useEffect, useCallback } from 'react';
import { gruposApi } from '../api';
import { Grupo, GrupoInput, PagedResponse } from '@/lib/types';
import { AxiosError } from 'axios';

export const useGrupos = (page = 0, size = 10) => {
    const [data, setData] = useState<PagedResponse<Grupo> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGrupos = useCallback(async () => {
        try {
        setLoading(true);
        setError(null);
        const response = await gruposApi.getAll(page, size);
        setData(response.data);
        } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setError(error.response?.data?.message || 'Error al obtener grupos');
        } finally {
        setLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        fetchGrupos();
    }, [fetchGrupos]);

    const createGrupo = async (data: GrupoInput) => {
        const response = await gruposApi.create(data);
        await fetchGrupos();
        return response.data;
    };

    const updateGrupo = async (id: number, data: GrupoInput) => {
        const response = await gruposApi.update(id, data);
        await fetchGrupos();
        return response.data;
    };

    const removeGrupo = async (id: number) => {
        await gruposApi.remove(id);
        await fetchGrupos();
    };

    const addAlumno = async (id_grupo: number, id_alumno: number) => {
        await gruposApi.addAlumno(id_grupo, id_alumno);
        await fetchGrupos();
    };

    const removeAlumno = async (id_grupo: number, id_alumno: number) => {
        await gruposApi.removeAlumno(id_grupo, id_alumno);
        await fetchGrupos();
    };

    return {
        data,
        loading,
        error,
        refetch: fetchGrupos,
        createGrupo,
        updateGrupo,
        removeGrupo,
        addAlumno,
        removeAlumno,
    };
};