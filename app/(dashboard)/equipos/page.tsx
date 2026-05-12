"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, X, Loader2, Users } from "lucide-react";
import { getEquipos, createEquipo, deleteEquipo, getGrupos } from "@/lib/api";

export default function EquiposPage() {
  // 1. ESTADOS
  const [mounted, setMounted] = useState(false);
  const [equipos, setEquipos] = useState<any[]>([]);
  const [grupos, setGrupos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el Modal y Formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({ 
    nombre_equipo: "", 
    id_grupo: "" 
  });

  // 2. EFECTO DE MONTAJE (Parche para el error de hidratación)
  useEffect(() => {
    setMounted(true);
    cargarDatos();
  }, []);

  // 3. CARGA DE DATOS DESDE LA API
  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargamos equipos y grupos al mismo tiempo
      const [equiposData, gruposData] = await Promise.all([
        getEquipos(), 
        getGrupos()
      ]);
      setEquipos(equiposData);
      setGrupos(gruposData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // 4. LÓGICA DE GUARDADO
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id_grupo) return alert("Debes seleccionar un grupo");

    setGuardando(true);
    try {
      await createEquipo({
        nombre_equipo: formData.nombre_equipo,
        id_grupo: parseInt(formData.id_grupo),
      });
      
      // Limpiar y cerrar
      setIsModalOpen(false);
      setFormData({ nombre_equipo: "", id_grupo: "" });
      
      // Recargar la lista
      await cargarDatos();
      alert("Equipo creado correctamente");
    } catch (error: any) {
      alert("Error al crear equipo: " + error.message);
    } finally {
      setGuardando(false);
    }
  };

  // 5. LÓGICA DE ELIMINACIÓN
  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este equipo?")) return;

    try {
      await deleteEquipo(id);
      setEquipos(equipos.filter((e) => e.id_equipo !== id));
    } catch (error) {
      alert("No se pudo eliminar el equipo. Verifica si tiene dependencias.");
    }
  };

  // 6. EVITAR RENDERIZADO EN SERVIDOR (Hydration Fix)
  if (!mounted) return null;

  return (
    <div className="w-full text-white">
      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Equipos</h1>
          <p className="text-zinc-400">Gestión de equipos registrados en el sistema.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus size={20} /> Nuevo Equipo
        </button>
      </div>

      {/* TABLA DE DATOS */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-zinc-800/50 border-b border-zinc-800 text-zinc-300">
            <tr>
              <th className="p-4 font-semibold">ID</th>
              <th className="p-4 font-semibold">Nombre del Equipo</th>
              <th className="p-4 font-semibold">Grupo</th>
              <th className="p-4 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-zinc-500">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                    <span>Cargando equipos...</span>
                  </div>
                </td>
              </tr>
            ) : equipos.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-20 text-center text-zinc-500">
                  No hay equipos registrados todavía.
                </td>
              </tr>
            ) : (
              equipos.map((e) => (
                <tr key={e.id_equipo} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="p-4 text-zinc-500 text-sm">#{e.id_equipo}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500">
                        <Users size={16} />
                      </div>
                      <span className="font-medium">{e.nombre_equipo}</span>
                    </div>
                  </td>
                  <td className="p-4 text-zinc-400">
                    Grupo ID: {e.id_grupo}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-zinc-400 hover:text-white transition-colors">
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(e.id_equipo)}
                        className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL PARA NUEVO EQUIPO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Nuevo Equipo</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Nombre del Equipo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Los Ingenieros"
                  value={formData.nombre_equipo}
                  onChange={(e) => setFormData({...formData, nombre_equipo: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Asignar a Grupo</label>
                <select 
                  required
                  value={formData.id_grupo}
                  onChange={(e) => setFormData({...formData, id_grupo: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 outline-none focus:border-blue-500 transition-all text-white"
                >
                  <option value="">Selecciona un grupo...</option>
                  {grupos.map((g) => (
                    <option key={g.id_grupo} value={g.id_grupo}>
                      {g.nombre_grupo} (ID: {g.id_grupo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={guardando}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {guardando ? "Creando equipo..." : "Registrar Equipo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}