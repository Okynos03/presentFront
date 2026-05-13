"use client";

import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { Users, GraduationCap, UsersRound } from "lucide-react";

export default function DashboardPage() {
  const { user, grupos, alumnos, equipos, loading, isAdmin, isMaestro, isAlumno } = useDashboard();

  const showFullDashboard = isAdmin || isMaestro;

  const metrics = showFullDashboard ? [
    {
      label: "Grupos",
      value: grupos?.totalElements ?? 0,
      icon: UsersRound,
    },
    {
      label: "Alumnos",
      value: alumnos?.totalElements ?? 0,
      icon: GraduationCap,
    },
    {
      label: "Equipos",
      value: equipos?.totalElements ?? 0,
      icon: Users,
    },
  ] : isAlumno ? [
    {
      label: "Equipos disponibles",
      value: equipos?.totalElements ?? 0,
      icon: Users,
    },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bienvenido, {user?.username}
        </h1>
        <p className="text-muted-foreground">
          Resumen general del sistema de exposiciones.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 rounded-xl border border-border glass bg-background/50 flex flex-col gap-2 animate-pulse">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-8 w-16 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <div key={i} className="p-6 rounded-xl border border-border glass bg-background/50 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
                  <Icon size={18} className="text-primary" />
                </div>
                <span className="text-3xl font-bold">{metric.value}</span>
              </div>
            );
          })}
        </div>
      )}

      {showFullDashboard && !loading && (
        <div className="rounded-xl border border-border glass bg-background/50 overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold">Grupos recientes</h2>
          </div>
          {grupos?.content.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No hay grupos registrados aún.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {grupos?.content.slice(0, 5).map((grupo) => (
                <div key={grupo.id_grupo} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <UsersRound size={16} className="text-primary" />
                    </div>
                    <span className="font-medium">{grupo.nombre_grupo}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {grupo.materias?.length ?? 0} materias
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isAlumno && !loading && (
        <div className="rounded-xl border border-border glass bg-background/50 overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold">Equipos disponibles</h2>
          </div>
          {equipos?.content.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              No hay equipos disponibles aún.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {equipos?.content.slice(0, 5).map((equipo) => (
                <div key={equipo.id_equipo} className="p-4 flex items-center justify-between hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users size={16} className="text-primary" />
                    </div>
                    <span className="font-medium">{equipo.nombre_equipo}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}