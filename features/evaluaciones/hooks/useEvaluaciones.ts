import { useState, useCallback } from 'react';
import { evaluacionesApi } from '../api';
import { Evaluacion, EvaluacionInput } from '@/lib/types';
import { AxiosError } from 'axios';

export const useEvaluaciones = () => {
    const [evaluacion, setEvaluacion] = useState<Evaluacion | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createEvaluacion = useCallback(async (data: EvaluacionInput) => {
        try {
        setLoading(true);
        setError(null);
        const response = await evaluacionesApi.create(data);
        return response.data;
        } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        const message = error.response?.data?.message || 'Error al registrar evaluación';
        setError(message);
        throw new Error(message);
        } finally {
        setLoading(false);
        }
    }, []);

    const getEvaluacion = useCallback(async (id: number) => {
        try {
        setLoading(true);
        setError(null);
        const response = await evaluacionesApi.getById(id);
        setEvaluacion(response.data);
        return response.data;
        } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setError(error.response?.data?.message || 'Error al obtener evaluación');
        } finally {
        setLoading(false);
        }
    }, []);

    return {
        evaluacion,
        loading,
        error,
        createEvaluacion,
        getEvaluacion,
    };
};