import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import SidebarPoblador from '../../components/SidebarPoblador';

export default function ImpactoComunidad() {
  const ingresosMensuales = [
    { mes: 'Ago', monto: 2800 },
    { mes: 'Sep', monto: 3450 },
    { mes: 'Oct', monto: 3900 },
    { mes: 'Nov', monto: 4250 },
  ];

  const distribucion = [
    { name: 'Comunidad y Pobladores', value: 75, color: '#1b4332' },
    { name: 'Operación Plataforma', value: 25, color: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      <SidebarPoblador />

      <main className="flex-1 p-6 lg:p-8">
        <div className="pb-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-900">Impacto en mi Comunidad</h1>
          <p className="text-xs text-slate-500">
            Beneficio económico directo y distribución justa frente a agencias tradicionales
          </p>
        </div>

        <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-950 text-white flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl shrink-0">
            🤝
          </div>
          <div>
            <h2 className="font-bold text-sm">El 75% de los ingresos se queda en la comunidad</h2>
            <p className="text-xs text-emerald-200 mt-0.5">
              Apoyando directamente a familias campesinas y artesanas de Yanque, Chivay y Coporaque
              sin fuga de capital a intermediarios.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-slate-800">Mis ingresos mensuales (S/)</h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                2026
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ingresosMensuales}>
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`S/ ${value}`, 'Ingresos']} />
                  <Bar dataKey="monto" fill="#1b4332" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-800 mb-1">Distribución de ingresos</h3>
              <p className="text-xs text-slate-500 mb-2">
                Modelo TurisConecta vs Agencias tradicionales
              </p>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribucion}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                    >
                      {distribucion.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Participación']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
              {distribucion.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}