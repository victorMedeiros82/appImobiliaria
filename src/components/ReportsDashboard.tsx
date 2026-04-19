import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, FileText, DollarSign, 
  Calendar, Download, Filter, ChevronRight, Activity, PieChart as PieChartIcon
} from 'lucide-react';
import { useApp } from '../AppContext';
import { motion } from 'motion/react';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ReportsDashboard = () => {
  const { contracts, tenants, transactions } = useApp();
  const [timeRange, setTimeRange] = useState('6m'); // 6m, 12m, all

  // --- Data Processing for Charts ---
  
  const reportData = useMemo(() => {
    const now = new Date();
    const rangeMonths = timeRange === '6m' ? 6 : timeRange === '12m' ? 12 : 24;
    
    // Generate months for the X-axis
    const months = Array.from({ length: rangeMonths }).map((_, i) => {
      const d = subMonths(now, rangeMonths - 1 - i);
      return {
        month: format(d, 'MMM/yy', { locale: ptBR }),
        rawDate: d,
        revenue: 0,
        expected: 0,
        delinquency: 0,
        occupancy: 0
      };
    });

    // 1. Revenue & Delinquency Trends
    months.forEach(m => {
      const monthStart = startOfMonth(m.rawDate);
      const monthEnd = endOfMonth(m.rawDate);

      const monthTransactions = transactions.filter(t => {
        const tDate = parseISO(t.date);
        return isWithinInterval(tDate, { start: monthStart, end: monthEnd });
      });

      m.revenue = monthTransactions
        .filter(t => t.status === 'paid')
        .reduce((acc, curr) => acc + curr.value, 0);
      
      m.expected = monthTransactions
        .reduce((acc, curr) => acc + curr.value, 0);

      m.delinquency = m.expected > 0 ? ((m.expected - m.revenue) / m.expected) * 100 : 0;
    });

    // 2. Occupancy Rate (Simulated trend based on contract start/end)
    // In a real app, this would check historical unit availability
    months.forEach(m => {
      const activeAtDate = contracts.filter(c => {
        const start = parseISO(c.start);
        const end = parseISO(c.end);
        return m.rawDate >= start && m.rawDate <= end;
      }).length;

      // Mocking 15 total units for occupancy calculation
      const totalUnits = 15;
      m.occupancy = (activeAtDate / totalUnits) * 100;
    });

    return months;
  }, [contracts, transactions, timeRange]);

  // --- Aggregate Stats ---
  const stats = useMemo(() => {
    const activeContracts = contracts.filter(c => c.status === 'active');
    const totalPortfolioValue = activeContracts.reduce((acc, curr) => acc + curr.value, 0);
    const activeTenants = tenants.filter(t => t.status === 'active').length;
    
    // Global Delinquency (Last 30 days)
    const thirtyDaysAgo = subMonths(new Date(), 1);
    const recentTx = transactions.filter(t => parseISO(t.date) >= thirtyDaysAgo);
    const recentPaid = recentTx.filter(t => t.status === 'paid').reduce((a, b) => a + b.value, 0);
    const recentExp = recentTx.reduce((a, b) => a + b.value, 0);
    const delinquencyRate = recentExp > 0 ? ((recentExp - recentPaid) / recentExp) * 100 : 0;

    return {
      totalPortfolioValue,
      activeTenants,
      contractCount: activeContracts.length,
      delinquencyRate
    };
  }, [contracts, tenants, transactions]);

  // --- Pie Chart Data: Tenant Distribution ---
  const tenantTypeData = useMemo(() => {
    const individual = tenants.filter(t => t.type === 'Individual').length;
    const corporate = tenants.filter(t => t.type === 'Corporate').length;
    return [
      { name: 'Pessoa Física', value: individual },
      { name: 'Pessoa Jurídica', value: corporate }
    ];
  }, [tenants]);

  const COLORS = ['#2563eb', '#8b5cf6', '#ec4899', '#f59e0b'];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-main">Relatórios de Performance</h2>
          <p className="text-sm text-text-muted">Análise consolidada de contratos e receita.</p>
        </div>
        
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl border border-border-main">
          {(['6m', '12m', 'all'] as const).map(range => (
            <button 
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                timeRange === range ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-text-main'
              }`}
            >
              {range === '6m' ? '6 Meses' : range === '12m' ? '12 Meses' : 'Histórico'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<DollarSign className="text-blue-500" />} 
          label="Carteira Ativa" 
          value={`R$ ${stats.totalPortfolioValue.toLocaleString('pt-BR')}`}
          trend="+4.2%"
          positive
        />
        <StatCard 
          icon={<Users className="text-purple-500" />} 
          label="Inquilinos Ativos" 
          value={stats.activeTenants.toString()}
          trend="+2"
          positive
        />
        <StatCard 
          icon={<Activity className="text-amber-500" />} 
          label="Inadimplência Global" 
          value={`${stats.delinquencyRate.toFixed(1)}%`}
          trend={stats.delinquencyRate > 10 ? "+1.5%" : "-0.8%"}
          positive={stats.delinquencyRate < 5}
        />
        <StatCard 
          icon={<PieChartIcon className="text-emerald-500" />} 
          label="Ocupação Média" 
          value={`${reportData[reportData.length - 1].occupancy.toFixed(0)}%`}
          trend="Estável"
          positive
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <ChartContainer title="Tendência de Receita Realizada">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={reportData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#64748b'}}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#64748b'}}
                tickFormatter={(val) => `R$${val/1000}k`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                formatter={(val: number) => [`R$ ${val.toLocaleString('pt-BR')}`, 'Receita']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Delinquency & Occupancy */}
        <ChartContainer title="Taxas de Inadimplência (%)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#64748b'}}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#64748b'}}
                domain={[0, 20]}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                formatter={(val: number) => [`${val.toFixed(1)}%`, 'Inadimplência']}
              />
              <Bar dataKey="delinquency" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Tenant Demographics */}
        <ChartContainer title="Distribuição por Tipo de Pessoa">
          <div className="flex flex-col md:flex-row items-center justify-around h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tenantTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {tenantTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* Occupancy History */}
        <ChartContainer title="Histórico de Ocupação da Carteira">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#64748b'}}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#64748b'}}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                formatter={(val: number) => [`${val.toFixed(0)}%`, 'Ocupação']}
              />
              <Line type="stepAfter" dataKey="occupancy" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Export Section */}
      <div className="bg-brand-card border border-border-main rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-primary">
            <Calendar size={24} />
          </div>
          <div>
            <h4 className="font-bold text-text-main">Exportação Consolidada</h4>
            <p className="text-xs text-text-muted">Gere relatórios retroativos em PDF ou Excel para auditoria.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-border-main rounded-xl text-sm font-bold text-text-main hover:bg-slate-50 transition-all">
            <Download size={18} />
            Excel (CSV)
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-black/10">
            <Download size={18} />
            Baixar Relatório PDF
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, positive }: any) => (
  <div className="bg-white border border-border-main p-6 rounded-3xl shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl border border-border-main">
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
        positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
      }`}>
        {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {trend}
      </div>
    </div>
    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{label}</span>
    <h3 className="text-2xl font-bold text-text-main mt-1">{value}</h3>
  </div>
);

const ChartContainer = ({ title, children }: any) => (
  <div className="bg-white border border-border-main p-6 rounded-3xl shadow-sm flex flex-col gap-6">
    <div className="flex justify-between items-center">
      <h3 className="font-bold text-text-main">{title}</h3>
      <button className="p-2 hover:bg-slate-50 rounded-lg text-text-muted">
        <Filter size={16} />
      </button>
    </div>
    {children}
  </div>
);
