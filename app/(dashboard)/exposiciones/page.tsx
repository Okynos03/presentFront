"use client";
import { useState, useEffect } from "react";
import { Calendar, Users, Plus, X, Loader2, BookOpen, Search, Info } from "lucide-react";
import { getExposiciones, createExposicion, getEquipos, getRubricas } from "@/lib/api";

export default function ExposicionesPage() {
  // 1. ESTADOS PARA HIDRATACIÓN Y DATOS
  const [mounted, setMounted] = useState(false);
  const [expos, setExpos] = useState<any[]>([]);
  const [equipos, setEquipos] = useState<any[]>([]);
  const [rubricas, setRubricas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para el Modal y Formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    id_equipo: "",
    id_rubrica: "",
    fecha_inicio: "",
    fecha_fin: ""
  });

  // 2. EFECTO INICIAL
  useEffect(() => {
    setMounted(true);
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargamos todo lo necesario para el formulario y la vista
      const [exposData, equiposData, rubricasData] = await Promise.all([
        getExposiciones(),
        getEquipos(),
        getRubricas()
      ]);
      setExpos(exposData);
      setEquipos(equiposData);
      setRubricas(rubricasData);
    } catch (error) {
      console.error("Error cargando exposiciones:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. LÓGICA DE GUARDADO (POST)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await createExposicion({
        titulo: formData.titulo,
        id_equipo: parseInt(formData.id_equipo),
        id_rubrica: parseInt(formData.id_rubrica),
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin
      });
      
      setIsModalOpen(false);
      setFormData({ titulo: "", id_equipo: "", id_rubrica: "", fecha_inicio: "", fecha_fin: "" });
      await cargarDatos(); // Refrescar la lista
      alert("Exposición programada con éxito");
    } catch (error: any) {
      alert("Error al guardar: " + error.message);
    } finally {
      setGuardando(false);
    }
  };

  // 4. PARCHE DE HIDRATACIÓN
  if (!mounted) return null;

  return (
    <div className="w-full text-white">
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Exposiciones</h1>
          <p className="text-zinc-400">Panel de control y programación de presentaciones.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all font-medium shadow-lg shadow-blue-900/20"
        >
          <Plus size={20} /> Programar Exposición
        </button>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 text-zinc-500">
          <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
          <p>Cargando exposiciones...</p>
        </div>
      ) : expos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl text-zinc-500">
          <Calendar size={48} className="mb-4 opacity-20" />
          <p>No hay exposiciones programadas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expos.map((expo) => (
            <div key={expo.id_exposicion} className="group bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${expo.estado === 'ABIERTA' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
                  {expo.estado}
                </span>
                <div className="text-xs text-zinc-500 flex items-center gap-1">
                  <Calendar size={12} /> {new Date(expo.fecha_inicio).toLocaleDateString()}
                </div>
              </div>

              <h3 className="text-xl font-bold mb-4 line-clamp-2">{expo.titulo}</h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <Users size={16} className="text-blue-500" />
                  <span>Equipo ID: <b className="text-zinc-200">{expo.id_equipo}</b></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <BookOpen size={16} className="text-zinc-500" />
                  <span>Rúbrica ID: {expo.id_rubrica}</span>
                </div>
              </div>

              <button className="w-full bg-zinc-800 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold transition-all">
                Ver Detalles
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL PARA CREAR EXPOSICIÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Programar Exposición</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Título de la Exposición</label>
                <input 
                  type="text" required
                  placeholder="Ej. Implementación de Microservicios"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Equipo</label>
                  <select 
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                    onChange={(e) => setFormData({...formData, id_equipo: e.target.value})}
                  >
                    <option value="">Seleccionar...</option>
                    {equipos.map(eq => <option key={eq.id_equipo} value={eq.id_equipo}>{eq.nombre_equipo}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Rúbrica</label>
                  <select 
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                    onChange={(e) => setFormData({...formData, id_rubrica: e.target.value})}
                  >
                    <option value="">Seleccionar...</option>
                    {rubricas.map(r => <option key={r.id_rubrica} value={r.id_rubrica}>{r.nombre}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Fecha Inicio</label>
                  <input 
                    type="date" required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                    onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Fecha Fin</label>
                  <input 
                    type="date" required
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                    onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" disabled={guardando}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl mt-4 transition-all disabled:opacity-50"
              >
                {guardando ? "Guardando..." : "Confirmar Programación"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}