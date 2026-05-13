"use client";

import { useState } from "react";
import { useEquipos } from "@/features/equipos/hooks/useEquipos";
import { useGrupos } from "@/features/grupos/hooks/useGrupos";
import { EquipoInput } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import { Plus, Pencil, Trash2, Users } from "lucide-react";

export default function EquiposPage() {
  const { addToast } = useToast();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<EquipoInput>({ nombre_equipo: "", id_grupo: 0 });
  const [formErrors, setFormErrors] = useState({ nombre_equipo: "", id_grupo: "" });

  const { data, loading, createEquipo, updateEquipo, removeEquipo } = useEquipos(page, size);
  const { data: gruposData } = useGrupos(0, 100);

  const validate = () => {
    let valid = true;
    const errors = { nombre_equipo: "", id_grupo: "" };
    if (!formData.nombre_equipo.trim()) {
      errors.nombre_equipo = "El nombre es requerido";
      valid = false;
    }
    if (!formData.id_grupo) {
      errors.id_grupo = "El grupo es requerido";
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
        await updateEquipo(selectedId, formData);
        addToast("Equipo actualizado correctamente", "success");
      } else {
        await createEquipo(formData);
        addToast("Equipo creado correctamente", "success");
      }
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al guardar equipo";
      addToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (equipo: any) => {
    setFormData({ nombre_equipo: equipo.nombre_equipo, id_grupo: equipo.id_grupo });
    setSelectedId(equipo.id_equipo);
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
      await removeEquipo(selectedId);
      addToast("Equipo eliminado correctamente", "success");
    } catch (err: any) {
      addToast("Error al eliminar equipo", "error");
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  const resetForm = () => {
    setFormData({ nombre_equipo: "", id_grupo: 0 });
    setFormErrors({ nombre_equipo: "", id_grupo: "" });
    setIsEditing(false);
    setSelectedId(null);
  };

  const getGrupoNombre = (id_grupo: number) => {
    return gruposData?.content.find(g => g.id_grupo === id_grupo)?.nombre_grupo || "Desconocido";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipos</h1>
          <p className="text-muted-foreground">Gestión de equipos del sistema.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Nuevo Equipo</span>
          <span className="sm:hidden">Nuevo</span>
        </button>
      </div>

      {/* Tabla desktop */}
      <div className="hidden md:block rounded-xl border border-border glass bg-background/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Nombre</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Grupo</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Jefe</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-border animate-pulse">
                  <td className="p-4"><div className="h-4 w-32 bg-muted rounded" /></td>
                  <td className="p-4"><div className="h-4 w-24 bg-muted rounded" /></td>
                  <td className="p-4"><div className="h-4 w-24 bg-muted rounded" /></td>
                  <td className="p-4"><div className="h-4 w-16 bg-muted rounded ml-auto" /></td>
                </tr>
              ))
            ) : data?.content.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Users size={40} className="opacity-30" />
                    <p>No hay equipos registrados aún.</p>
                  </div>
                </td>
              </tr>
            ) : (
              data?.content.map((equipo) => (
                <tr key={equipo.id_equipo} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium">{equipo.nombre_equipo}</td>
                  <td className="p-4 text-muted-foreground">{getGrupoNombre(equipo.id_grupo)}</td>
                  <td className="p-4 text-muted-foreground">
                    {equipo.id_jefe ? `ID: ${equipo.id_jefe}` : (
                      <span className="text-xs text-muted-foreground/50">Sin jefe</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(equipo)} className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDeleteConfirm(equipo.id_equipo)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tarjetas móvil */}
      <div className="md:hidden space-y-3">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-border glass bg-background/50 animate-pulse space-y-2">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
          ))
        ) : data?.content.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-border glass bg-background/50">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Users size={40} className="opacity-30" />
              <p>No hay equipos registrados aún.</p>
            </div>
          </div>
        ) : (
          data?.content.map((equipo) => (
            <div key={equipo.id_equipo} className="p-4 rounded-xl border border-border glass bg-background/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{equipo.nombre_equipo}</p>
                  <p className="text-sm text-muted-foreground">{getGrupoNombre(equipo.id_grupo)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {equipo.id_jefe ? `Jefe: ${equipo.id_jefe}` : "Sin jefe"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(equipo)} className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDeleteConfirm(equipo.id_equipo)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      {data && data.totalPages > 1 && (
        <div className="p-4 flex items-center justify-between border-t border-border">
          <span className="text-sm text-muted-foreground">
            Página {page + 1} de {data.totalPages}
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

      {/* Modal crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass bg-background/95 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border">
            <h2 className="text-xl font-bold mb-6">
              {isEditing ? "Editar Equipo" : "Nuevo Equipo"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre_equipo}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre_equipo: e.target.value }))}
                  placeholder="ej. Equipo Alpha"
                  className={`w-full px-4 py-2.5 rounded-lg bg-input border ${
                    formErrors.nombre_equipo ? "border-red-500/50" : "border-border"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                />
                {formErrors.nombre_equipo && <p className="text-red-400 text-xs mt-1">{formErrors.nombre_equipo}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">Grupo</label>
                <select
                  value={formData.id_grupo}
                  onChange={(e) => setFormData(prev => ({ ...prev, id_grupo: Number(e.target.value) }))}
                  className={`w-full px-4 py-2.5 rounded-lg bg-input border ${
                    formErrors.id_grupo ? "border-red-500/50" : "border-border"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                >
                  <option value={0}>Selecciona un grupo</option>
                  {gruposData?.content.map((grupo) => (
                    <option key={grupo.id_grupo} value={grupo.id_grupo}>{grupo.nombre_grupo}</option>
                  ))}
                </select>
                {formErrors.id_grupo && <p className="text-red-400 text-xs mt-1">{formErrors.id_grupo}</p>}
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
            <h2 className="text-xl font-bold mb-2">Eliminar Equipo</h2>
            <p className="text-muted-foreground mb-6">
              ¿Estás seguro de que deseas eliminar este equipo? Esta acción no se puede deshacer.
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