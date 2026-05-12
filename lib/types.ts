export interface Alumno {
  id: string;
  nombre: string;
}

export interface Equipo {
  id: string;
  nombre: string;
  integrantes: Alumno[];
}

export interface Exposicion {
  id: string;
  equipoId: string;
  equipoNombre: string;
  tema: string;
  fecha: string;
}

export interface Criterio {
  id: string;
  nombre: string; // Ej: "Dominio del tema"
  puntajeMax: number;
}

export interface Evaluacion {
  id: string;
  exposicionId: string;
  notas: { criterioId: string; calificacion: number }[];
  comentarios: string;
}