"use client";

import { useState } from "react";
import { useGrupos } from "@/features/grupos/hooks/useGrupos";
import { useMaterias } from "@/features/materias/hooks/useMaterias";
import { GrupoInput } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import { Plus, Pencil, Trash2, UsersRound } from "lucide-react";

export default function GruposPage() {
  const { addToast } = useToast();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<GrupoInput>({ nombre_grupo: "", ids_materias: [] });
  const [formErrors, setFormErrors] = useState({ nombre_grupo: "" });

  const { data, loading, createGrupo, updateGrupo, removeGrupo } = useGrupos(page, size);
  const { data: materiasData } = useMaterias(0, 100);

  const validate = () => {
    let valid = true;
    const errors = { nombre_grupo: "" };
    if (!formData.nombre_grupo.trim()) {
      errors.nombre_grupo = "El nombre es requerido";
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
        await updateGrupo(selectedId, formData);
        addToast("Grupo actualizado correctamente", "success");
      } else {
        await createGrupo(formData);
        addToast("Grupo creado correctamente", "success");
      }
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al guardar grupo";
      addToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (grupo: any) => {
    setFormData({
      nombre_grupo: grupo.nombre_grupo,
      ids_materias: grupo.materias?.map((m: any) => m.id_materia) || [],
    });
    setSelectedId(grupo.id_grupo);
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
      await removeGrupo(selectedId);
      addToast("Grupo eliminado correctamente", "success");
    } catch (err: any) {
      addToast("Error al eliminar grupo", "error");
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  const resetForm = () => {
    setFormData({ nombre_grupo: "", ids_materias: [] });
    setFormErrors({ nombre_grupo: "" });
    setIsEditing(false);
    setSelectedId(null);
  };

  const toggleMateria = (id: number) => {
    setFormData(prev => ({
      ...prev,
      ids_materias: prev.ids_materias?.includes(id)
        ? prev.ids_materias.filter(m => m !== id)
        : [...(prev.ids_materias || []), id],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grupos</h1>
          <p className="text-muted-foreground">Gestión de grupos del sistema.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all"
        >
          <Plus size={18} />
          Nuevo Grupo
        </button>
      </div>

      {/* Tabla */}
      <div className="rounded-xl border border-border glass bg-background/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Nombre</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Materias</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-border animate-pulse">
                  <td className="p-4"><div className="h-4 w-32 bg-muted rounded" /></td>
                  <td className="p-4"><div className="h-4 w-48 bg-muted rounded" /></td>
                  <td className="p-4"><div className="h-4 w-16 bg-muted rounded ml-auto" /></td>
                </tr>
              ))
            ) : data?.content.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <UsersRound size={40} className="opacity-30" />
                    <p>No hay grupos registrados aún.</p>
                  </div>
                </td>
              </tr>
            ) : (
              data?.content.map((grupo) => (
                <tr key={grupo.id_grupo} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium">{grupo.nombre_grupo}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {grupo.materias?.length === 0 ? (
                        <span className="text-muted-foreground text-sm">Sin materias</span>
                      ) : (
                        grupo.materias?.map((materia) => (
                          <span
                            key={materia.id_materia}
                            className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                          >
                            {materia.clave_materia}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(grupo)}
                        className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(grupo.id_grupo)}
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
              Página {page + 1} de {data.totalPages} — {data.totalElements} grupos
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
              {isEditing ? "Editar Grupo" : "Nuevo Grupo"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre_grupo}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre_grupo: e.target.value }))}
                  placeholder="ej. Grupo A"
                  className={`w-full px-4 py-2.5 rounded-lg bg-input border ${
                    formErrors.nombre_grupo ? "border-red-500/50" : "border-border"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                />
                {formErrors.nombre_grupo && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.nombre_grupo}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">Materias</label>
                <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-input border border-border min-h-[60px]">
                  {materiasData?.content.length === 0 ? (
                    <span className="text-muted-foreground text-sm">No hay materias disponibles</span>
                  ) : (
                    materiasData?.content.map((materia) => (
                      <button
                        key={materia.id_materia}
                        type="button"
                        onClick={() => toggleMateria(materia.id_materia)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                          formData.ids_materias?.includes(materia.id_materia)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {materia.clave_materia}
                      </button>
                    ))
                  )}
                </div>
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
            <h2 className="text-xl font-bold mb-2">Eliminar Grupo</h2>
            <p className="text-muted-foreground mb-6">
              ¿Estás seguro de que deseas eliminar este grupo? Esta acción no se puede deshacer.
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