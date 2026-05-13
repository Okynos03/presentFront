import { useState, useEffect, useCallback } from 'react';
import { equiposApi } from '../api';
import { Equipo, EquipoInput, PagedResponse } from '@/lib/types';
import { AxiosError } from 'axios';

export const useEquipos = (page = 0, size = 10) => {
    const [data, setData] = useState<PagedResponse<Equipo> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEquipos = useCallback(async () => {
        try {
        setLoading(true);
        setError(null);
        const response = await equiposApi.getAll(page, size);
        setData(response.data);
        } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setError(error.response?.data?.message || 'Error al obtener equipos');
        } finally {
        setLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        fetchEquipos();
    }, [fetchEquipos]);

    const createEquipo = async (data: EquipoInput) => {
        const response = await equiposApi.create(data);
        await fetchEquipos();
        return response.data;
    };

    const updateEquipo = async (id: number, data: EquipoInput) => {
        const response = await equiposApi.update(id, data);
        await fetchEquipos();
        return response.data;
    };

    const removeEquipo = async (id: number) => {
        await equiposApi.remove(id);
        await fetchEquipos();
    };

    const addAlumno = async (id_equipo: number, id_alumno: number) => {
        await equiposApi.addAlumno(id_equipo, id_alumno);
        await fetchEquipos();
    };

    const removeAlumno = async (id_equipo: number, id_alumno: number) => {
        await equiposApi.removeAlumno(id_equipo, id_alumno);
        await fetchEquipos();
    };

    const assignJefe = async (id_equipo: number, id_jefe: number) => {
        await equiposApi.assignJefe(id_equipo, id_jefe);
        await fetchEquipos();
    };

    return {
        data,
        loading,
        error,
        refetch: fetchEquipos,
        createEquipo,
        updateEquipo,
        removeEquipo,
        addAlumno,
        removeAlumno,
        assignJefe,
    };
};