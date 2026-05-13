"use client";

import { useState } from "react";
import { useAlumnos } from "@/features/alumnos/hooks/useAlumnos";
import { AlumnoInput } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react";

const ROLES = [
  { id: 1, nombre: "Administrador" },
  { id: 2, nombre: "Alumno" },
  { id: 3, nombre: "Maestro" },
];

export default function AlumnosPage() {
  const { addToast } = useToast();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<AlumnoInput>({
    username: "",
    email: "",
    nombre: "",
    password: "",
    id_rol: 2,
  });
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    nombre: "",
    password: "",
  });

  const { data, loading, createAlumno, updateAlumno, removeAlumno } = useAlumnos(page, size);

  const validate = () => {
    let valid = true;
    const errors = { username: "", email: "", nombre: "", password: "" };

    if (!formData.username.trim()) {
      errors.username = "El username es requerido";
      valid = false;
    }
    if (!formData.email.trim()) {
      errors.email = "El email es requerido";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "El email no es válido";
      valid = false;
    }
    if (!isEditing && !formData.password) {
      errors.password = "La contraseña es requerida";
      valid = false;
    } else if (!isEditing && formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (isEditing && selectedId) {
        const { password, ...updateData } = formData;
        await updateAlumno(selectedId, updateData);
        addToast("Usuario actualizado correctamente", "success");
      } else {
        await createAlumno(formData);
        addToast("Usuario creado correctamente", "success");
      }
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al guardar usuario";
      addToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (alumno: any) => {
    setFormData({
      username: alumno.username,
      email: alumno.email,
      nombre: alumno.nombre,
      password: "",
      id_rol: alumno.id_rol,
    });
    setSelectedId(alumno.id_usuario);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteConfirm = (id: number) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await removeAlumno(selectedId);
      addToast("Usuario eliminado correctamente", "success");
    } catch (err: any) {
      addToast("Error al eliminar usuario", "error");
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  const resetForm = () => {
    setFormData({ username: "", email: "", nombre: "", password: "", id_rol: 2 });
    setFormErrors({ username: "", email: "", nombre: "", password: "" });
    setIsEditing(false);
    setSelectedId(null);
  };

  const getRolNombre = (id_rol: number) => {
    return ROLES.find(r => r.id === id_rol)?.nombre || "Desconocido";
  };

  const getRolColor = (id_rol: number) => {
    if (id_rol === 1) return "bg-purple-500/10 text-purple-400";
    if (id_rol === 2) return "bg-blue-500/10 text-blue-400";
    if (id_rol === 3) return "bg-green-500/10 text-green-400";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">Gestión de usuarios del sistema.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all"
        >
          <Plus size={18} />
          Nuevo Usuario
        </button>
      </div>

      {/* Tabla */}
      <div className="rounded-xl border border-border glass bg-background/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Usuario</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Nombre</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rol</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-border animate-pulse">
                  <td className="p-4"><div className="h-4 w-24 bg-muted rounded" /></td>
                  <td className="p-4"><div className="h-4 w-40 bg-muted rounded" /></td>
                  <td className="p-4"><div className="h-4 w-32 bg-muted rounded" /></td>
                  <td className="p-4"><div className="h-4 w-20 bg-muted rounded" /></td>
                  <td className="p-4"><div className="h-4 w-16 bg-muted rounded ml-auto" /></td>
                </tr>
              ))
            ) : data?.content.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <GraduationCap size={40} className="opacity-30" />
                    <p>No hay usuarios registrados aún.</p>
                  </div>
                </td>
              </tr>
            ) : (
              data?.content.map((alumno) => (
                <tr key={alumno.id_usuario} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium">{alumno.username}</td>
                  <td className="p-4 text-muted-foreground text-sm">{alumno.email}</td>
                  <td className="p-4">{alumno.nombre}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRolColor(alumno.id_rol)}`}>
                      {getRolNombre(alumno.id_rol)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(alumno)}
                        className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(alumno.id_usuario)}
                        className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginación */}
        {data && data.totalPages > 1 && (
          <div className="p-4 flex items-center justify-between border-t border-border">
            <span className="text-sm text-muted-foreground">
              Página {page + 1} de {data.totalPages} — {data.totalElements} usuarios
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1 rounded-lg border border-border hover:bg-secondary/50 disabled:opacity-50 disabled:pointer-events-none transition-all text-sm"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(p => Math.min(data.totalPages - 1, p + 1))}
                disabled={page === data.totalPages - 1}
                className="px-3 py-1 rounded-lg border border-border hover:bg-secondary/50 disabled:opacity-50 disabled:pointer-events-none transition-all text-sm"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass bg-background/95 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border">
            <h2 className="text-xl font-bold mb-6">
              {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="ej. alumno123"
                  className={`w-full px-4 py-2.5 rounded-lg bg-input border ${
                    formErrors.username ? "border-red-500/50" : "border-border"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                />
                {formErrors.username && <p className="text-red-400 text-xs mt-1">{formErrors.username}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="ej. alumno@expo.com"
                  className={`w-full px-4 py-2.5 rounded-lg bg-input border ${
                    formErrors.email ? "border-red-500/50" : "border-border"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                />
                {formErrors.email && <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="ej. Juan Pérez"
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              {!isEditing && (
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground/80">Contraseña</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 rounded-lg bg-input border ${
                      formErrors.password ? "border-red-500/50" : "border-border"
                    } focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                  />
                  {formErrors.password && <p className="text-red-400 text-xs mt-1">{formErrors.password}</p>}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">Rol</label>
                <select
                  value={formData.id_rol}
                  onChange={(e) => setFormData(prev => ({ ...prev, id_rol: Number(e.target.value) as 1 | 2 | 3 }))}
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  {ROLES.map(rol => (
                    <option key={rol.id} value={rol.id}>{rol.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary/50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all disabled:opacity-70 disabled:pointer-events-none"
              >
                {submitting ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmación eliminar */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass bg-background/95 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-border">
            <h2 className="text-xl font-bold mb-2">Eliminar Usuario</h2>
            <p className="text-muted-foreground mb-6">
              ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowConfirm(false); setSelectedId(null); }}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary/50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}