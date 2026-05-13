// Paginación
export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// Error
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

// Roles
export type Rol = 1 | 2 | 3; // 1=ADMIN, 2=ALUMNO, 3=MAESTRO

// Auth
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface UserPayload {
  id_usuario: number;
  username: string;
  id_rol: Rol;
  iat: number;
  exp: number;
}

// Alumnos
export interface Alumno {
  id_usuario: number;
  username: string;
  email: string;
  nombre: string;
  id_rol: Rol;
  activo: boolean;
  fecha_creacion: string;
}

export interface AlumnoInput {
  username: string;
  email: string;
  nombre: string;
  password: string;
  id_rol: Rol;
}

// Materias
export interface Materia {
  id_materia: number;
  clave_materia: string;
  nombre_materia: string;
  activo: boolean;
  fecha_creacion: string;
}

export interface MateriaInput {
  clave_materia: string;
  nombre_materia: string;
}

// Grupos
export interface Grupo {
  id_grupo: number;
  nombre_grupo: string;
  activo: boolean;
  materias: Materia[];
}

export interface GrupoInput {
  nombre_grupo: string;
  ids_materias?: number[];
}

// Equipos
export interface Equipo {
  id_equipo: number;
  nombre_equipo: string;
  id_grupo: number;
  id_jefe: number | null;
  activo: boolean;
}

export interface EquipoInput {
  nombre_equipo: string;
  id_grupo: number;
}

// Rubricas
export interface Criterio {
  id_criterio: number;
  id_rubrica: number;
  descripcion: string;
  ponderacion: number;
  escala_min: number;
  escala_max: number;
}

export interface Rubrica {
  id_rubrica: number;
  nombre: string;
  descripcion: string;
  criterios?: Criterio[];
}

// Exposiciones
export type EstadoExpo = 'ABIERTA' | 'CERRADA';

export interface Exposicion {
  id_exposicion: number;
  titulo: string;
  estado: EstadoExpo;
  id_equipo: number;
  id_rubrica: number;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface ExposicionInput {
  titulo: string;
  id_equipo: number;
  id_rubrica: number;
  fecha_inicio: string;
  fecha_fin: string;
}

// Evaluaciones
export interface DetalleEvaluacion {
  id_criterio: number;
  calificacion: number;
}

export interface Evaluacion {
  id_evaluacion: number;
  id_exposicion: number;
  id_alumno_evaluador: number;
  fecha_evaluacion: string;
  detalles: DetalleEvaluacion[];
}

export interface EvaluacionInput {
  id_exposicion: number;
  id_alumno_evaluador: number;
  detalles: DetalleEvaluacion[];
}