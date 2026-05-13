"use client";

import { useState } from "react";
import { useEvaluaciones } from "@/features/evaluaciones/hooks/useEvaluaciones";
import { EvaluacionInput } from "@/lib/types";
import { useToast } from "@/components/ui/Toast";
import { Plus, ClipboardList } from "lucide-react";
import { authService } from "@/lib/auth";

export default function EvaluacionesPage() {
  const { addToast } = useToast();
  const { loading, createEvaluacion } = useEvaluaciones();
  const user = authService.getUser();

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<EvaluacionInput>({
    id_exposicion: 0,
    id_alumno_evaluador: user?.id_usuario || 0,
    detalles: [],
  });
  const [formErrors, setFormErrors] = useState({
    id_exposicion: "",
    detalles: "",
  });
  const [nuevoDetalle, setNuevoDetalle] = useState({ id_criterio: 0, calificacion: 0 });

  const validate = () => {
    let valid = true;
    const errors = { id_exposicion: "", detalles: "" };

    if (!formData.id_exposicion) {
      errors.id_exposicion = "El ID de exposición es requerido";
      valid = false;
    }
    if (formData.detalles.length === 0) {
      errors.detalles = "Debe agregar al menos un criterio";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleAddDetalle = () => {
    if (!nuevoDetalle.id_criterio) return;
    if (nuevoDetalle.calificacion < 0 || nuevoDetalle.calificacion > 10) return;

    setFormData(prev => ({
      ...prev,
      detalles: [...prev.detalles, { ...nuevoDetalle }],
    }));
    setNuevoDetalle({ id_criterio: 0, calificacion: 0 });
  };

  const handleRemoveDetalle = (index: number) => {
    setFormData(prev => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await createEvaluacion(formData);
      addToast("Evaluación registrada correctamente", "success");
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      const message = err.message || "Error al registrar evaluación";
      addToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id_exposicion: 0,
      id_alumno_evaluador: user?.id_usuario || 0,
      detalles: [],
    });
    setFormErrors({ id_exposicion: "", detalles: "" });
    setNuevoDetalle({ id_criterio: 0, calificacion: 0 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evaluaciones</h1>
          <p className="text-muted-foreground">Registro de evaluaciones con rúbrica.</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Nueva Evaluación</span>
          <span className="sm:hidden">Nueva</span>
        </button>
      </div>

      {/* Estado vacío */}
      <div className="rounded-xl border border-border glass bg-background/50 p-12 text-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <ClipboardList size={40} className="opacity-30" />
          <p>Las evaluaciones se registran por exposición.</p>
          <p className="text-sm">Click en "Nueva Evaluación" para registrar una.</p>
        </div>
      </div>

      {/* Modal crear evaluación */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass bg-background/95 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">Nueva Evaluación</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">ID Exposición</label>
                <input
                  type="number"
                  value={formData.id_exposicion || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, id_exposicion: Number(e.target.value) }))}
                  placeholder="ej. 1"
                  className={`w-full px-4 py-2.5 rounded-lg bg-input border ${
                    formErrors.id_exposicion ? "border-red-500/50" : "border-border"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                />
                {formErrors.id_exposicion && <p className="text-red-400 text-xs mt-1">{formErrors.id_exposicion}</p>}
              </div>

              {/* Criterios */}
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">Criterios de evaluación</label>
                <div className="space-y-2 mb-3">
                  {formData.detalles.map((detalle, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-input border border-border">
                      <span className="text-sm">Criterio {detalle.id_criterio} — <span className="text-primary font-medium">{detalle.calificacion}/10</span></span>
                      <button
                        onClick={() => handleRemoveDetalle(index)}
                        className="text-red-400 hover:text-red-300 text-xs transition-colors"
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>

                {/* Agregar criterio */}
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={nuevoDetalle.id_criterio || ""}
                    onChange={(e) => setNuevoDetalle(prev => ({ ...prev, id_criterio: Number(e.target.value) }))}
                    placeholder="ID criterio"
                    className="flex-1 px-3 py-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                  />
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={nuevoDetalle.calificacion || ""}
                    onChange={(e) => setNuevoDetalle(prev => ({ ...prev, calificacion: Number(e.target.value) }))}
                    placeholder="Calif. (0-10)"
                    className="flex-1 px-3 py-2 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                  />
                  <button
                    onClick={handleAddDetalle}
                    className="px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm"
                  >
                    Agregar
                  </button>
                </div>
                {formErrors.detalles && <p className="text-red-400 text-xs mt-1">{formErrors.detalles}</p>}
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
                {submitting ? "Guardando..." : "Registrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}