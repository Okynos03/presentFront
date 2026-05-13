"use client";

import { useState } from "react";
import { useMaterias } from "@/features/materias/hooks/useMaterias";
import { MateriaInput } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import { Plus, Pencil, Trash2, Search, BookOpen } from "lucide-react";

export default function MateriasPage() {
  const { addToast } = useToast();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [nombre, setNombre] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formData, setFormData] = useState<MateriaInput>({ clave_materia: "", nombre_materia: "" });
  const [formErrors, setFormErrors] = useState<MateriaInput>({ clave_materia: "", nombre_materia: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data, loading, createMateria, updateMateria, removeMateria } = useMaterias(page, size, nombre);

  const validate = () => {
    let valid = true;
    const errors = { clave_materia: "", nombre_materia: "" };
    if (!formData.clave_materia.trim()) {
      errors.clave_materia = "La clave es requerida";
      valid = false;
    }
    if (!formData.nombre_materia.trim()) {
      errors.nombre_materia = "El nombre es requerido";
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
        await updateMateria(selectedId, formData);
        addToast("Materia actualizada correctamente", "success");
      } else {
        await createMateria(formData);
        addToast("Materia creada correctamente", "success");
      }
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al guardar materia";
      addToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (materia: any) => {
    setFormData({ clave_materia: materia.clave_materia, nombre_materia: materia.nombre_materia });
    setSelectedId(materia.id_materia);
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
      await removeMateria(selectedId);
      addToast("Materia eliminada correctamente", "success");
    } catch (err: any) {
      addToast("Error al eliminar materia", "error");
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  const resetForm = () => {
    setFormData({ clave_materia: "", nombre_materia: "" });
    setFormErrors({ clave_materia: "", nombre_materia: "" });
    setIsEditing(false);
    setSelectedId(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setNombre(search);
    setPage(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Materias</h1>
          <p className="text-muted-foreground">Gestión de materias del sistema.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all"
        >
          <Plus size={18} />
          Nueva Materia
        </button>
      </div>

      {/* Buscador */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-all"
        >
          Buscar
        </button>
      </form>

      {/* Tabla */}
      <div className="rounded-xl border border-border glass bg-background/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Clave</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Nombre</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-border animate-pulse">
                  <td className="p-4"><div className="h-4 w-24 bg-muted rounded" /></td>
                  <td className="p-4"><div className="h-4 w-48 bg-muted rounded" /></td>
                  <td className="p-4"><div className="h-4 w-16 bg-muted rounded ml-auto" /></td>
                </tr>
              ))
            ) : data?.content.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <BookOpen size={40} className="opacity-30" />
                    <p>No hay materias registradas aún.</p>
                  </div>
                </td>
              </tr>
            ) : (
              data?.content.map((materia) => (
                <tr key={materia.id_materia} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-mono text-sm">{materia.clave_materia}</td>
                  <td className="p-4">{materia.nombre_materia}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(materia)}
                        className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(materia.id_materia)}
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
              Página {page + 1} de {data.totalPages} — {data.totalElements} materias
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
              {isEditing ? "Editar Materia" : "Nueva Materia"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">Clave</label>
                <input
                  type="text"
                  value={formData.clave_materia}
                  onChange={(e) => setFormData(prev => ({ ...prev, clave_materia: e.target.value }))}
                  placeholder="ej. PROG-01"
                  className={`w-full px-4 py-2.5 rounded-lg bg-input border ${
                    formErrors.clave_materia ? "border-red-500/50" : "border-border"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                />
                {formErrors.clave_materia && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.clave_materia}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre_materia}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre_materia: e.target.value }))}
                  placeholder="ej. Programación Web"
                  className={`w-full px-4 py-2.5 rounded-lg bg-input border ${
                    formErrors.nombre_materia ? "border-red-500/50" : "border-border"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                />
                {formErrors.nombre_materia && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.nombre_materia}</p>
                )}
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
            <h2 className="text-xl font-bold mb-2">Eliminar Materia</h2>
            <p className="text-muted-foreground mb-6">
              ¿Estás seguro de que deseas eliminar esta materia? Esta acción no se puede deshacer.
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