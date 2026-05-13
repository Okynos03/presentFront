import { useState, useEffect, useCallback } from 'react';
import { alumnosApi } from '../api';
import { Alumno, AlumnoInput, PagedResponse } from '@/lib/types';
import { AxiosError } from 'axios';

export const useAlumnos = (page = 0, size = 10) => {
    const [data, setData] = useState<PagedResponse<Alumno> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAlumnos = useCallback(async () => {
        try {
        setLoading(true);
        setError(null);
        const response = await alumnosApi.getAll(page, size);
        setData(response.data);
        } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setError(error.response?.data?.message || 'Error al obtener alumnos');
        } finally {
        setLoading(false);
        }
    }, [page, size]);

    useEffect(() => {
        fetchAlumnos();
    }, [fetchAlumnos]);

    const createAlumno = async (data: AlumnoInput) => {
        const response = await alumnosApi.create(data);
        await fetchAlumnos();
        return response.data;
    };

    const updateAlumno = async (id: number, data: Omit<AlumnoInput, 'password'>) => {
        const response = await alumnosApi.update(id, data);
        await fetchAlumnos();
        return response.data;
    };

    const removeAlumno = async (id: number) => {
        await alumnosApi.remove(id);
        await fetchAlumnos();
    };

    return {
        data,
        loading,
        error,
        refetch: fetchAlumnos,
        createAlumno,
        updateAlumno,
        removeAlumno,
    };
};