export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general del sistema de exposiciones.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 rounded-xl border border-border glass bg-background/50 flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">Métrica {i + 1}</span>
            <span className="text-3xl font-bold">---</span>
          </div>
        ))}
      </div>
      
      <div className="h-96 rounded-xl border border-border glass bg-background/50 flex items-center justify-center text-muted-foreground">
        Gráfica o Contenido Principal
      </div>
    </div>
  );
}
