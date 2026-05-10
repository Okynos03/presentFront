"use client";

import { useState } from "react";

export default function MateriasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Materias</h1>
          <p className="text-muted-foreground">Gestión de materias del sistema.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]"
        >
          + Nueva Materia
        </button>
      </div>
      
      {/* Filtros Skeleton */}
      <div className="p-4 rounded-xl border border-border glass bg-background/50 flex gap-4">
        <input 
          type="text" 
          placeholder="Buscar materia..." 
          className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
          Filtrar
        </button>
      </div>

      {/* Tabla Skeleton */}
      <div className="rounded-xl border border-border glass bg-background/50 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-secondary/50">
            <tr>
              <th className="px-6 py-4 font-medium">Clave</th>
              <th className="px-6 py-4 font-medium">Nombre</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Empty State */}
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">📚</span>
                  <p>No hay materias registradas</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Paginación Skeleton */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>Mostrando 0 de 0 resultados</span>
        <div className="flex gap-2">
          <button disabled className="px-3 py-1 border border-border rounded-md opacity-50 cursor-not-allowed">Anterior</button>
          <button disabled className="px-3 py-1 border border-border rounded-md opacity-50 cursor-not-allowed">Siguiente</button>
        </div>
      </div>
    </div>
  );
}
