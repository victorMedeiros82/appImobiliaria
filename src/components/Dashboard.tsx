import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, Users, AlertTriangle, 
  DollarSign, Home, ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../AppContext';

export const Dashboard = () => {
  const { transactions, contracts } = useApp();
  
  // Real numbers for stats
  const totalReceitaMes = transactions
    .filter(t => t.status === 'paid' && new Date(t.date).getMonth() === 3) // April
    .reduce((acc, t) => acc + t.value, 0);

  const inadimplenciaCount = transactions.filter(t => t.status === 'overdue').length;
  const inadimplenciaPercent = transactions.length > 0 
    ? ((inadimplenciaCount / transactions.length) * 100).toFixed(1) 
    : "0.0";

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          label="Imóveis Gerenciados" 
          value={`${contracts.length} Unidades`} 
          trend="Ativos na Carteira" 
          trendType="up"
          icon={<Home size={16} className="text-primary" />}
        />
        <StatCard 
          label="Recebimentos (Abril)" 
          value={`R$ ${totalReceitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          trend="↑ 8.2% vs mês anterior" 
          trendType="up"
          icon={<DollarSign size={16} className="text-emerald-500" />}
        />
        <StatCard 
          label="Taxa de Inadimplência" 
          value={`${inadimplenciaPercent}%`} 
          trend="↓ 0.5% (Melhoria)" 
          trendType="down"
          icon={<AlertTriangle size={16} className="text-amber-500" />}
        />
        <StatCard 
          label="Renovações (30d)" 
          value="14" 
          trend="4 Críticos (IGP-M)" 
          trendType="warn"
          icon={<TrendingUp size={16} className="text-blue-500" />}
        />
      </section>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Container */}
        <div className="lg:col-span-2 bg-brand-card rounded-xl border border-border-main p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-text-main">Transações Recentes (PIX Webhook)</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-bottom border-border-main">
                  <th className="py-3 text-[12px] font-semibold text-text-muted uppercase tracking-wider">Inquilino</th>
                  <th className="py-3 text-[12px] font-semibold text-text-muted uppercase tracking-wider">Unidade</th>
                  <th className="py-3 text-[12px] font-semibold text-text-muted uppercase tracking-wider">Valor</th>
                  <th className="py-3 text-[12px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="py-3 text-[12px] font-semibold text-text-muted uppercase tracking-wider">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 text-sm font-medium text-text-main">{tx.tenant}</td>
                    <td className="py-3.5 text-sm text-text-muted">{tx.unit}</td>
                    <td className="py-3.5 text-sm font-semibold">R$ {tx.value.toLocaleString('pt-BR')}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        tx.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tx.status === 'paid' ? 'PAGAMENTO OK' : tx.status === 'overdue' ? 'ATRASADO' : 'PENDENTE'}
                      </span>
                    </td>
                    <td className="py-3.5 text-sm text-text-muted">{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="flex flex-col gap-6">
          <div className="bg-brand-card rounded-xl border border-border-main p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-text-main mb-4">Engine de Reajuste</h3>
            <div className="text-xs text-text-muted">Próximo processamento (IGP-M/IPCA):</div>
            <div className="text-base font-bold text-text-main mt-1">01 de Novembro</div>
            <div className="flex items-center gap-2 mt-4 text-[13px] text-text-main font-medium">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              Automação Serverless Ativa
            </div>
          </div>

          <div className="bg-brand-card rounded-xl border border-border-main p-6 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text-main">Meta de Receita</h3>
              <TrendingUp size={16} className="text-primary" />
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactions.slice(0, 4).map((t, idx) => ({ month: ['Jan', 'Fev', 'Mar', 'Abr'][idx], revenue: t.value }))}>
                  <XAxis dataKey="month" hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="revenue" fill="#2563eb" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, trend, trendType, icon }: any) => (
  <div className="bg-brand-card p-5 rounded-xl border border-border-main shadow-sm flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <div className="text-[12px] text-text-muted uppercase font-bold tracking-wider">{label}</div>
      {icon}
    </div>
    <div className="text-2xl font-bold text-text-main leading-none">{value}</div>
    <div className={`text-[12px] font-medium ${
      trendType === 'up' ? 'text-success' : 
      trendType === 'down' ? 'text-danger' : 'text-warning'
    }`}>
      {trend}
    </div>
  </div>
);
