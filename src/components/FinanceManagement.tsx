import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, AlertCircle, CheckCircle, 
  Filter, Search, ArrowUpRight, ArrowDownRight, 
  Calendar, MoreHorizontal, Download, Plus, FileText, Check, Loader2,
  BarChart2, LineChart as LineChartIcon, Palette
} from 'lucide-react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../AppContext';

export const FinanceManagement = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [exporting, setExporting] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [chartColor, setChartColor] = useState('#3b82f6'); // primary
  const [reportRange, setReportRange] = useState('6m');
  const { contracts, transactions, addNotification } = useApp();

  // Dynamic Chart Generation
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  const currentYear = 2024;
  
  const dynamicFinanceData = months.map((month, index) => {
    // Expected: Sum of monthly values of active contracts
    const expected = contracts.reduce((acc, c) => {
        const start = new Date(c.start);
        const end = new Date(c.end);
        const plotDate = new Date(currentYear, index, 15); // middle of month for safety
        if (plotDate >= start && plotDate <= end) {
            return acc + c.value;
        }
        return acc;
    }, 0);

    // Real: Sum of paid transactions
    const real = transactions.reduce((acc, t) => {
        const tDate = new Date(t.date);
        if (tDate.getMonth() === index && tDate.getFullYear() === currentYear && t.status === 'paid') {
            return acc + t.value;
        }
        return acc;
    }, 0);

    return { month, revenue: real, expected };
  });

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.tenant.toLowerCase().includes(searchTerm.toLowerCase()) || tx.id.includes(searchTerm);
    const matchesFilter = filter === 'all' || tx.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Summary logic for April 2024 (Current Month)
  const currentMonthIndex = 3; // April
  const totalReceived = transactions
    .filter(t => new Date(t.date).getMonth() === currentMonthIndex && t.status === 'paid')
    .reduce((acc, t) => acc + t.value, 0);
    
  const awaitingPayment = transactions
    .filter(t => new Date(t.date).getMonth() === currentMonthIndex && t.status === 'pending')
    .reduce((acc, t) => acc + t.value, 0);

  const totalOverdue = transactions
    .filter(t => t.status === 'overdue')
    .reduce((acc, t) => acc + t.value, 0);

  const handleExport = (type: string, format: 'PDF' | 'CSV') => {
    setExporting(`${type}-${format}`);
    // Simulate export delay
    setTimeout(() => {
      setExporting(null);
      addNotification(`Relatório de ${type} pronto para download (${format})`, 'success');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinanceStatCard 
          label="Total Recebido (Abril)" 
          value={`R$ ${totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          subtext={`Baseado em ${transactions.filter(t => new Date(t.date).getMonth() === currentMonthIndex && t.status === 'paid').length} transações conciliadas`}
          type="success"
          icon={<DollarSign size={20} />}
        />
        <FinanceStatCard 
          label="Aguardando Pagamento" 
          value={`R$ ${awaitingPayment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          subtext="Boletos pendentes neste mês"
          type="warning"
          icon={<Calendar size={20} />}
        />
        <FinanceStatCard 
          label="Inadimplência Bruta" 
          value={`R$ ${totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          subtext="Contratos com pagamento expirado"
          type="danger"
          icon={<AlertCircle size={20} />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-brand-card border border-border-main rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-text-main">Performance de Recebimento</h3>
                <p className="text-xs text-text-muted italic">Receita Real vs Previsão de Contrato</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Chart Type Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setChartType('bar')}
                    className={`p-1.5 rounded-md transition-all ${chartType === 'bar' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-main'}`}
                    title="Gráfico de Barras"
                  >
                    <BarChart2 size={16} />
                  </button>
                  <button 
                    onClick={() => setChartType('line')}
                    className={`p-1.5 rounded-md transition-all ${chartType === 'line' ? 'bg-white shadow-sm text-primary' : 'text-text-muted hover:text-text-main'}`}
                    title="Gráfico de Linha"
                  >
                    <LineChartIcon size={16} />
                  </button>
                </div>

                {/* Color Picker */}
                <div className="flex gap-1.5 border-l border-border-main pl-3">
                  <button 
                    onClick={() => setChartColor('#3b82f6')}
                    className={`w-5 h-5 rounded-full bg-blue-500 border-2 ${chartColor === '#3b82f6' ? 'border-slate-800 scale-110' : 'border-transparent opacity-60'}`}
                  />
                  <button 
                    onClick={() => setChartColor('#10b981')}
                    className={`w-5 h-5 rounded-full bg-emerald-500 border-2 ${chartColor === '#10b981' ? 'border-slate-800 scale-110' : 'border-transparent opacity-60'}`}
                  />
                  <button 
                    onClick={() => setChartColor('#f43f5e')}
                    className={`w-5 h-5 rounded-full bg-rose-500 border-2 ${chartColor === '#f43f5e' ? 'border-slate-800 scale-110' : 'border-transparent opacity-60'}`}
                  />
                </div>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={dynamicFinanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="expected" fill="#94a3b8" opacity={0.2} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="revenue" fill={chartColor} radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={dynamicFinanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="expected" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="revenue" stroke={chartColor} strokeWidth={3} dot={{ fill: chartColor, strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-brand-card border border-border-main rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border-main flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
              <h3 className="text-lg font-bold text-text-main">Extrato de Movimentações</h3>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={14} />
                   <input 
                    type="text" 
                    placeholder="Ref. ou Inquilino..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-border-main rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
                <button className="p-2 border border-border-main rounded-lg hover:bg-slate-50 text-text-muted">
                   <Download size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-border-main">
                    <th className="px-6 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider text-left">Referência</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider text-left">Inquilino</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider text-left">Valor</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main/50">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-text-muted">{tx.id}</span>
                        <div className="text-[10px] text-slate-400 mt-0.5">{tx.method}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-text-main">{tx.tenant}</div>
                        <div className="text-[10px] text-text-muted italic">{tx.unit}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-text-main">R$ {tx.value.toLocaleString('pt-BR')}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                          tx.status === 'overdue' ? 'bg-rose-100 text-rose-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {tx.status === 'paid' ? 'PAGO' : tx.status === 'overdue' ? 'ATRASADO' : 'PENDENTE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg text-text-muted">
                           <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reports Section */}
          <div className="bg-brand-card border border-border-main rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <FileText size={20} />
                  </div>
                  <div>
                      <h3 className="text-lg font-bold text-text-main">Relatórios de Carteira</h3>
                      <p className="text-xs text-text-muted italic">Exportação de dados consolidados em tempo real</p>
                  </div>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-border-main rounded-xl px-3 py-1.5">
                <Filter size={14} className="text-text-muted" />
                <select 
                  className="bg-transparent text-xs font-bold text-text-main focus:outline-none"
                  value={reportRange}
                  onChange={(e) => setReportRange(e.target.value)}
                >
                  <option value="3m">Últimos 3 Meses</option>
                  <option value="6m">Últimos 6 Meses</option>
                  <option value="1y">Último Ano</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReportCard 
                    title="Fluxo de Caixa" 
                    description="Detalhamento de entradas, saídas e saldo projetado do período."
                    onExport={(format: 'PDF' | 'CSV') => handleExport('Fluxo de Caixa', format)}
                    isExportingCSV={exporting === 'Fluxo de Caixa-CSV'}
                    isExportingPDF={exporting === 'Fluxo de Caixa-PDF'}
                />
                <ReportCard 
                    title="Inadimplência" 
                    description="Lista de débitos pendentes com cálculo de juros e multas."
                    onExport={(format: 'PDF' | 'CSV') => handleExport('Inadimplência', format)}
                    isExportingCSV={exporting === 'Inadimplência-CSV'}
                    isExportingPDF={exporting === 'Inadimplência-PDF'}
                />
                <ReportCard 
                    title="Receita por Contrato" 
                    description="Análise de rentabilidade individual por unidade e inquilino."
                    onExport={(format: 'PDF' | 'CSV') => handleExport('Receita por Contrato', format)}
                    isExportingCSV={exporting === 'Receita por Contrato-CSV'}
                    isExportingPDF={exporting === 'Receita por Contrato-PDF'}
                />
                 <ReportCard 
                    title="Reajustes Anuais" 
                    description="Histórico de alterações contratuais baseadas em IGP-M/IPCA."
                    onExport={(format: 'PDF' | 'CSV') => handleExport('Reajustes', format)}
                    isExportingCSV={exporting === 'Reajustes-CSV'}
                    isExportingPDF={exporting === 'Reajustes-PDF'}
                />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-primary rounded-2xl p-6 shadow-lg shadow-primary/20 text-white space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                   <ArrowUpRight size={20} />
                </div>
                <h4 className="font-bold">Ações Financeiras</h4>
             </div>
             <p className="text-sm text-blue-100">Registre pagamentos manuais ou emita boletos avulsos para inquilinos.</p>
             <button className="w-full py-3 bg-white text-primary font-bold rounded-xl text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-2 active:scale-95">
                <Plus size={18} />
                Lançar Valor Manual
             </button>
          </div>

          {/* Delinquency Alert Widget */}
          <div className="bg-brand-card border border-border-main rounded-2xl p-6 shadow-sm flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-text-main uppercase tracking-wider">Alertas de Atraso</h4>
                <div className="px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded text-[10px] font-bold">CRÍTICO</div>
             </div>
             <div className="space-y-4">
                <DelinquencyItem 
                  name="Ana Paula Santos" 
                  days={14} 
                  value="R$ 4.200,00"
                />
                <DelinquencyItem 
                  name="Beatriz Fontes" 
                  days={8} 
                  value="R$ 2.900,00"
                />
             </div>
             <button className="w-full py-2.5 text-xs font-bold text-primary hover:bg-blue-50 transition-colors border-t border-border-main mt-2">
                ACESSAR RÉGUA DE COBRANÇA
             </button>
          </div>

          {/* Audit Log / History */}
          <div className="bg-brand-card border border-border-main rounded-2xl p-6 shadow-sm flex flex-col gap-4">
             <h4 className="text-sm font-bold text-text-main uppercase tracking-wider">Últimas Conciliações</h4>
             <div className="space-y-3">
                <LogItem text="PIX recebido de João Silva" time="Há 12 min" />
                <LogItem text="Arquivo CNAB 240 gerado" time="Há 2 horas" />
                <LogItem text="Remessa Banco do Brasil enviada" time="Hoje, 09:30" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FinanceStatCard = ({ label, value, subtext, type, icon }: any) => {
  const colorClass = type === 'success' ? 'text-emerald-600 bg-emerald-50' : 
                   type === 'warning' ? 'text-amber-600 bg-amber-50' : 
                   'text-rose-600 bg-rose-50';
  
  return (
    <div className="bg-brand-card border border-border-main rounded-2xl p-6 shadow-sm hover:border-primary/30 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${colorClass} transition-all group-hover:scale-110`}>
          {icon}
        </div>
        <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{label}</div>
      </div>
      <div>
        <div className="text-2xl font-black text-text-main mb-1 italic tracking-tight">{value}</div>
        <p className="text-[11px] font-medium text-text-muted">{subtext}</p>
      </div>
    </div>
  );
};

const DelinquencyItem = ({ name, days, value }: any) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-border-main/30 border-l-4 border-l-rose-500">
    <div>
      <div className="text-xs font-bold text-text-main">{name}</div>
      <div className="text-[10px] text-rose-600 font-bold uppercase">{days} DIAS EM ATRAZO</div>
    </div>
    <div className="text-xs font-black text-text-main">{value}</div>
  </div>
);

const LogItem = ({ text, time }: any) => (
  <div className="flex items-start gap-3">
    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-2 shrink-0"></div>
    <div>
      <div className="text-xs text-text-main font-medium">{text}</div>
      <div className="text-[10px] text-slate-400">{time}</div>
    </div>
  </div>
);

const ReportCard = ({ title, description, onExport, isExportingCSV, isExportingPDF }: any) => (
  <div className="p-4 bg-slate-50 rounded-xl border border-border-main/50 flex flex-col justify-between gap-4">
    <div>
      <h4 className="text-sm font-bold text-text-main mb-1">{title}</h4>
      <p className="text-[11px] text-text-muted leading-relaxed">{description}</p>
    </div>
    <div className="flex gap-2">
      <button 
        disabled={isExportingCSV || isExportingPDF}
        onClick={() => onExport('CSV')}
        className="flex-1 py-2 bg-white border border-border-main rounded-lg text-[10px] font-bold text-text-muted hover:bg-slate-100 hover:text-text-main transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
      >
        {isExportingCSV ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
        CSV
      </button>
      <button 
        disabled={isExportingCSV || isExportingPDF}
        onClick={() => onExport('PDF')}
        className="flex-1 py-2 bg-white border border-border-main rounded-lg text-[10px] font-bold text-text-muted hover:bg-slate-100 hover:text-text-main transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
      >
        {isExportingPDF ? <Loader2 size={12} className="animate-spin" /> : <FileText size={12} />}
        PDF
      </button>
    </div>
  </div>
);
