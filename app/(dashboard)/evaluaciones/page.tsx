"use client";
import { useState } from "react";

export default function EvaluacionesPage() {
  // Rúbrica dinámica (estos criterios se pueden cambiar después con tu BD)
  const rubrica = [
    { id: "c1", nombre: "Dominio del Tema", max: 10 },
    { id: "c2", nombre: "Material Visual", max: 5 },
    { id: "c3", nombre: "Trabajo en Equipo", max: 5 },
  ];

  const [notas, setNotas] = useState<Record<string, number>>({});
  const [enviando, setEnviando] = useState(false);

  const handleCalificar = (id: string, valor: number) => {
    setNotas({ ...notas, [id]: valor });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    // Simular el tiempo de guardado
    setTimeout(() => {
      alert("Evaluación guardada exitosamente");
      setEnviando(false);
    }, 1500);
  };

  return (
    <div className="w-full text-white">
      {/* Cabecera que tenías originalmente */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Evaluaciones</h1>
        <p className="text-zinc-400">Rúbricas dinámicas y calificaciones.</p>
      </div>

      {/* Formulario adaptado a Modo Oscuro */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/40 border border-zinc-800 p-8 rounded-2xl">
        {rubrica.map((criterio) => (
          <div key={criterio.id} className="flex flex-col gap-2">
            <label className="font-semibold text-zinc-300 flex justify-between">
              {criterio.nombre}
              <span className="text-blue-500 font-bold">{notas[criterio.id] || 0} / {criterio.max}</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max={criterio.max} 
              step="1"
              value={notas[criterio.id] || 0}
              onChange={(e) => handleCalificar(criterio.id, parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        ))}

        <div className="pt-4">
          <label className="block font-semibold mb-2 text-zinc-300">Comentarios adicionales</label>
          <textarea 
            className="w-full bg-[#0a0a0a] border border-zinc-800 text-white p-3 rounded-lg outline-none focus:border-blue-500 transition-colors"
            rows={3}
            placeholder="Escribe aquí observaciones sobre el desempeño del equipo..."
          ></textarea>
        </div>

        <button 
          disabled={enviando}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-zinc-700 disabled:text-zinc-400"
        >
          {enviando ? "Guardando evaluación..." : "Finalizar Evaluación"}
        </button>
      </form>
    </div>
  );
}