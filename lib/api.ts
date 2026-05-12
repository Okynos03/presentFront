export interface ApiError {
  message: string;
  status: number;
}

// Cambia esto a la URL de tu backend real si no usas proxies
const BASE_URL = 'http://localhost:8080/api/v1'; 

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch {
      // Fallback
    }
    throw { message: errorMsg, status: response.status } as ApiError;
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * FUNCIONES DE SERVICIO (CONECTORES)
 * Estas funciones usan fetchApi y aseguran que el resultado sea siempre manejable
 */

// --- EQUIPOS ---
export const getEquipos = () => 
  fetchApi<any>('/equipos')
    .then(res => (Array.isArray(res) ? res : res?.content || []))
    .catch(() => []); // Si falla, devuelve lista vacía para no romper el .map()

export const createEquipo = (data: { nombre_equipo: string; id_grupo: number }) => 
  fetchApi('/equipos', { method: 'POST', body: JSON.stringify(data) });

export const deleteEquipo = (id: number) => 
  fetchApi(`/equipos/${id}`, { method: 'DELETE' });

// --- EXPOSICIONES ---
export const getExposiciones = () => 
  fetchApi<any>('/exposiciones')
    .then(res => (Array.isArray(res) ? res : res?.content || []))
    .catch(() => []);

export const createExposicion = (data: { 
  titulo: string; 
  id_equipo: number; 
  id_rubrica: number; 
  fecha_inicio: string; 
  fecha_fin: string 
}) => fetchApi('/exposiciones', { method: 'POST', body: JSON.stringify(data) });

// --- AUXILIARES (Para llenar los select de los formularios) ---
export const getGrupos = () => 
  fetchApi<any>('/grupos')
    .then(res => (Array.isArray(res) ? res : res?.content || []))
    .catch(() => []);

export const getRubricas = () => 
  fetchApi<any>('/rubricas')
    .then(res => (Array.isArray(res) ? res : res?.content || []))
    .catch(() => []);