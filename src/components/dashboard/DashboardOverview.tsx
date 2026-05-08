import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  BarChart3,
  TrendingUp,
  PieChart as PieIcon
} from "lucide-react";

interface DashboardProps {
  statusData: { name: string; value: number }[];
  productivityData: { userName: string; completed: number }[];
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
  };
}

const COLORS = ["#f59e0b", "#3b82f6", "#10b981"]; 

export function DashboardOverview({ statusData, productivityData, stats }: DashboardProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden group border-none shadow-xl shadow-slate-200/50 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Total Tasks</p>
                <h3 className="text-3xl font-black">{stats.total}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <BarChart3 size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <TrendingUp size={12} />
              <span>OVERALL PROJECT LOAD</span>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100" />
        </Card>

        <Card className="relative overflow-hidden group border-none shadow-xl shadow-emerald-200/30 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-emerald-600/60 mb-1">Completed</p>
                <h3 className="text-3xl font-black text-emerald-600">{stats.completed}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                <CheckCircle2 size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-emerald-400">
              <span>{((stats.completed / (stats.total || 1)) * 100).toFixed(0)}% SUCCESS RATE</span>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </Card>

        <Card className="relative overflow-hidden group border-none shadow-xl shadow-blue-200/30 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-blue-600/60 mb-1">In Progress</p>
                <h3 className="text-3xl font-black text-blue-600">{stats.inProgress}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Clock size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-blue-400">
              <span>ACTIVE WORKFLOWS</span>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
        </Card>

        <Card className="relative overflow-hidden group border-none shadow-xl shadow-red-200/30 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-red-600/60 mb-1">Overdue</p>
                <h3 className="text-3xl font-black text-red-600">{stats.overdue}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                <AlertCircle size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-red-400">
              <span>IMMEDIATE ACTION REQUIRED</span>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500" />
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-2xl shadow-slate-200/50 bg-white rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black tracking-tight">Team Productivity</h3>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Completed tasks per user</p>
            </div>
            <TrendingUp className="text-primary/20" size={24} />
          </div>
          <CardContent className="p-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productivityData}>
                  <XAxis dataKey="userName" stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Bar dataKey="completed" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 border-none shadow-2xl shadow-slate-200/50 bg-white rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black tracking-tight">Status Distribution</h3>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Overall project health</p>
            </div>
            <PieIcon className="text-primary/20" size={24} />
          </div>
          <CardContent className="p-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
