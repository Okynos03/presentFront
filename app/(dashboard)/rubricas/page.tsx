"use client";

import { useState } from "react";
import { useRubricas } from "@/features/rubricas/hooks/useRubricas";
import { RubricaInput, CriterioInput, Criterio } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import { Plus, Pencil, Trash2, Eye, EyeOff, ChevronDown } from "lucide-react";

export default function RubricasPage() {
  const { addToast } = useToast();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showCriterioModal, setShowCriterioModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedRubrica, setExpandedRubrica] = useState<number | null>(null);
  const [criterios, setCriterios] = useState<Criterio[]>([]);
  const [editingCriterioId, setEditingCriterioId] = useState<number | null>(null);

  const [formData, setFormData] = useState<RubricaInput>({
    nombre: "",
    descripcion: "",
  });

  const [criterioForm, setCriterioForm] = useState<CriterioInput>({
    descripcion: "",
    ponderacion: 0,
    escala_min: 0,
    escala_max: 10,
  });

  const [formErrors, setFormErrors] = useState({ nombre: "" });

  const {
    data,
    loading,
    createRubrica,
    updateRubrica,
    deleteRubrica,
    publishRubrica,
    getCriterios,
    addCriterio,
    updateCriterio,
    deleteCriterio,
  } = useRubricas(page, size);

  const validate = () => {
    let valid = true;
    const errors = { nombre: "" };
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es requerido";
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
        await updateRubrica(selectedId, formData);
        addToast("Rúbrica actualizada correctamente", "success");
      } else {
        await createRubrica(formData);
        addToast("Rúbrica creada correctamente", "success");
      }
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al guardar rúbrica";
      addToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (rubrica: any) => {
    setFormData({
      nombre: rubrica.nombre,
      descripcion: rubrica.descripcion || "",
    });
    setSelectedId(rubrica.id_rubrica);
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
      await deleteRubrica(selectedId);
      addToast("Rúbrica eliminada correctamente", "success");
    } catch (err: any) {
      addToast("Error al eliminar rúbrica", "error");
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await publishRubrica(id);
      addToast("Rúbrica publicada correctamente", "success");
    } catch (err: any) {
      addToast("Error al publicar rúbrica", "error");
    }
  };

  const handleExpandRubrica = async (id: number) => {
    if (expandedRubrica === id) {
      setExpandedRubrica(null);
    } else {
      try {
        const crit = await getCriterios(id);
        setCriterios(crit);
        setExpandedRubrica(id);
      } catch (err) {
        addToast("Error al obtener criterios", "error");
      }
    }
  };

  const handleAddCriterio = async () => {
    if (!expandedRubrica) return;
    if (!criterioForm.descripcion.trim() || criterioForm.ponderacion <= 0) {
      addToast("Completa todos los campos del criterio", "error");
      return;
    }

    setSubmitting(true);
    try {
      const newCriterio = await addCriterio(expandedRubrica, criterioForm);
      setCriterios([...criterios, newCriterio]);
      setCriterioForm({
        descripcion: "",
        ponderacion: 0,
        escala_min: 0,
        escala_max: 10,
      });
      addToast("Criterio agregado correctamente", "success");
    } catch (err: any) {
      addToast(err.response?.data?.message || "Error al agregar criterio", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCriterio = async (id_criterio: number) => {
    if (!expandedRubrica) return;
    try {
      await deleteCriterio(expandedRubrica, id_criterio);
      setCriterios(criterios.filter(c => c.id_criterio !== id_criterio));
      addToast("Criterio eliminado correctamente", "success");
    } catch (err) {
      addToast("Error al eliminar criterio", "error");
    }
  };

  const resetForm = () => {
    setFormData({ nombre: "", descripcion: "" });
    setFormErrors({ nombre: "" });
    setIsEditing(false);
    setSelectedId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rúbricas</h1>
          <p className="text-muted-foreground text-sm">Gestiona las rúbricas de evaluación</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Nueva rúbrica
        </button>
      </div>

      {/* Tabla de rúbricas */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            Cargando rúbricas...
          </div>
        ) : data?.content?.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No hay rúbricas registradas
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Criterios</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data?.content?.map((rubrica) => (
                  <tr key={rubrica.id_rubrica} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-medium">{rubrica.nombre}</p>
                        <p className="text-xs text-muted-foreground">{rubrica.descripcion}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        rubrica.publicada
                          ? "bg-green-500/20 text-green-700 dark:text-green-300"
                          : "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
                      }`}>
                        {rubrica.publicada ? "Publicada" : "Borrador"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {rubrica.criterios?.length || 0} criterios
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleExpandRubrica(rubrica.id_rubrica)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors text-sm"
                      >
                        <ChevronDown size={16} className={`transform transition-transform ${expandedRubrica === rubrica.id_rubrica ? 'rotate-180' : ''}`} />
                        Criterios
                      </button>
                      <button
                        onClick={() => handleEdit(rubrica)}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      {!rubrica.publicada && (
                        <button
                          onClick={() => handlePublish(rubrica.id_rubrica)}
                          className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteConfirm(rubrica.id_rubrica)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Criterios de rúbrica expandida */}
      {expandedRubrica && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-4">Criterios</h3>
            {criterios.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay criterios agregados</p>
            ) : (
              <div className="space-y-2 mb-6">
                {criterios.map((criterio) => (
                  <div key={criterio.id_criterio} className="flex items-start justify-between p-3 bg-muted/30 rounded-lg border border-border">
                    <div className="flex-1">
                      <p className="font-sm">{criterio.descripcion}</p>
                      <p className="text-xs text-muted-foreground">
                        Ponderación: {criterio.ponderacion}% | Escala: {criterio.escala_min} - {criterio.escala_max}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteCriterio(criterio.id_criterio)}
                      className="text-red-600 hover:text-red-700 transition-colors ml-4"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <h4 className="text-sm font-semibold">Agregar criterio</h4>
            <input
              type="text"
              placeholder="Descripción del criterio"
              value={criterioForm.descripcion}
              onChange={(e) => setCriterioForm({ ...criterioForm, descripcion: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
            />
            <div className="grid grid-cols-4 gap-2">
              <input
                type="number"
                placeholder="Ponderación %"
                value={criterioForm.ponderacion || ""}
                onChange={(e) => setCriterioForm({ ...criterioForm, ponderacion: parseFloat(e.target.value) || 0 })}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              />
              <input
                type="number"
                placeholder="Escala mín"
                value={criterioForm.escala_min || ""}
                onChange={(e) => setCriterioForm({ ...criterioForm, escala_min: parseFloat(e.target.value) || 0 })}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              />
              <input
                type="number"
                placeholder="Escala máx"
                value={criterioForm.escala_max || ""}
                onChange={(e) => setCriterioForm({ ...criterioForm, escala_max: parseFloat(e.target.value) || 10 })}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
              />
              <button
                onClick={handleAddCriterio}
                disabled={submitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg text-sm disabled:opacity-50 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal crear/editar rúbrica */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Editar rúbrica" : "Nueva rúbrica"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground transition-colors ${
                    formErrors.nombre ? "border-red-500" : "border-border"
                  }`}
                />
                {formErrors.nombre && <p className="text-red-500 text-xs mt-1">{formErrors.nombre}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Descripción</label>
                <textarea
                  value={formData.descripcion || ""}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg disabled:opacity-50 transition-colors"
              >
                {submitting ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmar eliminar */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirmar eliminación</h2>
            <p className="text-muted-foreground mb-6">
              ¿Estás seguro de que quieres eliminar esta rúbrica?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paginación */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 hover:bg-muted transition-colors"
          >
            Anterior
          </button>
          <span className="text-sm text-muted-foreground">
            Página {page + 1} de {data.totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(data.totalPages - 1, page + 1))}
            disabled={page === data.totalPages - 1}
            className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 hover:bg-muted transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
