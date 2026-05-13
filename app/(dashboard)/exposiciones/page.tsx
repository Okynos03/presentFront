"use client";

import { useState } from "react";
import { useExposiciones } from "@/features/exposiciones/hooks/useExposiciones";
import { ExposicionInput, EstadoExpo } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import { Plus, Pencil, Trash2, Presentation } from "lucide-react";

export default function ExposicionesPage() {
  const { addToast } = useToast();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<ExposicionInput>({
    titulo: "",
    id_equipo: 0,
    id_rubrica: 0,
    fecha_inicio: "",
    fecha_fin: "",
  });
  const [formErrors, setFormErrors] = useState({
    titulo: "",
    id_equipo: "",
    id_rubrica: "",
    fecha_inicio: "",
    fecha_fin: "",
  });

  const { data, loading, createExposicion, updateExposicion, removeExposicion, changeEstado } = useExposiciones(page, size);

  const validate = () => {
    let valid = true;
    const errors = { titulo: "", id_equipo: "", id_rubrica: "", fecha_inicio: "", fecha_fin: "" };

    if (!formData.titulo.trim()) {
      errors.titulo = "El título es requerido";
      valid = false;
    }
    if (!formData.id_equipo) {
      errors.id_equipo = "El equipo es requerido";
      valid = false;
    }
    if (!formData.id_rubrica) {
      errors.id_rubrica = "La rúbrica es requerida";
      valid = false;
    }
    if (!formData.fecha_inicio) {
      errors.fecha_inicio = "La fecha de inicio es requerida";
      valid = false;
    }
    if (!formData.fecha_fin) {
      errors.fecha_fin = "La fecha de fin es requerida";
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
        await updateExposicion(selectedId, formData);
        addToast("Exposición actualizada correctamente", "success");
      } else {
        await createExposicion(formData);
        addToast("Exposición creada correctamente", "success");
      }
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al guardar exposición";
      addToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (exposicion: any) => {
    setFormData({
      titulo: exposicion.titulo,
      id_equipo: exposicion.id_equipo,
      id_rubrica: exposicion.id_rubrica,
      fecha_inicio: exposicion.fecha_inicio,
      fecha_fin: exposicion.fecha_fin,
    });
    setSelectedId(exposicion.id_exposicion);
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
      await removeExposicion(selectedId);
      addToast("Exposición eliminada correctamente", "success");
    } catch (err: any) {
      addToast("Error al eliminar exposición", "error");
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  const handleChangeEstado = async (id: number, estadoActual: EstadoExpo) => {
    const nuevoEstado: EstadoExpo = estadoActual === "ABIERTA" ? "CERRADA" : "ABIERTA";
    try {
      await changeEstado(id, nuevoEstado);
      addToast(`Exposición ${nuevoEstado === "ABIERTA" ? "abierta" : "cerrada"} correctamente`, "success");
    } catch (err: any) {
      addToast("Error al cambiar estado", "error");
    }
  };

  const resetForm = () => {
    setFormData({ titulo: "", id_equipo: 0, id_rubrica: 0, fecha_inicio: "", fecha_fin: "" });
    setFormErrors({ titulo: "", id_equipo: "", id_rubrica: "", fecha_inicio: "", fecha_fin: "" });
    setIsEditing(false);
    setSelectedId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exposiciones</h1>
          <p className="text-muted-foreground">Gestión de exposiciones del sistema.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Nueva Exposición</span>
          <span className="sm:hidden">Nueva</span>
        </button>
      </div>

      {/* Tabla desktop */}
      <div className="hidden md:block rounded-xl border border-border glass bg-background/50 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Título</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fecha inicio</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fecha fin</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-border animate-pulse">
                  <td className="p-4"><div className="h-4 w-40 bg-muted rounded" /></td>
                  <td className="p-4"><div className="h-4 w-20 bg-muted rounded" /></td>
                  <td className="p-4"><div className="h-4 w-24 bg-muted rounded" /></td>
                  <td className="p-4"><div className="h-4 w-24 bg-muted rounded" /></td>
                  <td className="p-4"><div className="h-4 w-16 bg-muted rounded ml-auto" /></td>
                </tr>
              ))
            ) : data?.content.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Presentation size={40} className="opacity-30" />
                    <p>No hay exposiciones registradas aún.</p>
                  </div>
                </td>
              </tr>
            ) : (
              data?.content.map((exposicion) => (
                <tr key={exposicion.id_exposicion} className="border-b border-border hover:bg-secondary/20 transition-colors">
                  <td className="p-4 font-medium">{exposicion.titulo}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleChangeEstado(exposicion.id_exposicion, exposicion.estado)}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
                        exposicion.estado === "ABIERTA"
                          ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                          : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      }`}
                    >
                      {exposicion.estado}
                    </button>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">{exposicion.fecha_inicio}</td>
                  <td className="p-4 text-muted-foreground text-sm">{exposicion.fecha_fin}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(exposicion)} className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDeleteConfirm(exposicion.id_exposicion)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors">
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
              <div className="h-4 w-40 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
          ))
        ) : data?.content.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-border glass bg-background/50">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Presentation size={40} className="opacity-30" />
              <p>No hay exposiciones registradas aún.</p>
            </div>
          </div>
        ) : (
          data?.content.map((exposicion) => (
            <div key={exposicion.id_exposicion} className="p-4 rounded-xl border border-border glass bg-background/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{exposicion.titulo}</p>
                  <button
                    onClick={() => handleChangeEstado(exposicion.id_exposicion, exposicion.estado)}
                    className={`mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      exposicion.estado === "ABIERTA"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {exposicion.estado}
                  </button>
                  <p className="text-xs text-muted-foreground mt-1">{exposicion.fecha_inicio} → {exposicion.fecha_fin}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(exposicion)} className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDeleteConfirm(exposicion.id_exposicion)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors">
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
          <div className="glass bg-background/95 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">
              {isEditing ? "Editar Exposición" : "Nueva Exposición"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">Título</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="ej. Exposición Parcial 1"
                  className={`w-full px-4 py-2.5 rounded-lg bg-input border ${
                    formErrors.titulo ? "border-red-500/50" : "border-border"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                />
                {formErrors.titulo && <p className="text-red-400 text-xs mt-1">{formErrors.titulo}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">ID Equipo</label>
                <input
                  type="number"
                  value={formData.id_equipo || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, id_equipo: Number(e.target.value) }))}
                  placeholder="ej. 1"
                  className={`w-full px-4 py-2.5 rounded-lg bg-input border ${
                    formErrors.id_equipo ? "border-red-500/50" : "border-border"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                />
                {formErrors.id_equipo && <p className="text-red-400 text-xs mt-1">{formErrors.id_equipo}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">ID Rúbrica</label>
                <input
                  type="number"
                  value={formData.id_rubrica || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, id_rubrica: Number(e.target.value) }))}
                  placeholder="ej. 1"
                  className={`w-full px-4 py-2.5 rounded-lg bg-input border ${
                    formErrors.id_rubrica ? "border-red-500/50" : "border-border"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                />
                {formErrors.id_rubrica && <p className="text-red-400 text-xs mt-1">{formErrors.id_rubrica}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">Fecha inicio</label>
                <input
                  type="date"
                  value={formData.fecha_inicio}
                  onChange={(e) => setFormData(prev => ({ ...prev, fecha_inicio: e.target.value }))}
                  className={`w-full px-4 py-2.5 rounded-lg bg-input border ${
                    formErrors.fecha_inicio ? "border-red-500/50" : "border-border"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                />
                {formErrors.fecha_inicio && <p className="text-red-400 text-xs mt-1">{formErrors.fecha_inicio}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">Fecha fin</label>
                <input
                  type="date"
                  value={formData.fecha_fin}
                  onChange={(e) => setFormData(prev => ({ ...prev, fecha_fin: e.target.value }))}
                  className={`w-full px-4 py-2.5 rounded-lg bg-input border ${
                    formErrors.fecha_fin ? "border-red-500/50" : "border-border"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                />
                {formErrors.fecha_fin && <p className="text-red-400 text-xs mt-1">{formErrors.fecha_fin}</p>}
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
            <h2 className="text-xl font-bold mb-2">Eliminar Exposición</h2>
            <p className="text-muted-foreground mb-6">
              ¿Estás seguro de que deseas eliminar esta exposición? Esta acción no se puede deshacer.
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