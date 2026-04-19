import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Plus, Search, Filter, MoreHorizontal, FileText, Calendar, User, X, TrendingUp, Check, AlertCircle, Download, PenTool, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../AppContext';
import { generateContractPDF } from '../services/contractPdfService';

const StatusBadge = ({ type, status }: { 
  type: 'payment' | 'signature' | 'contract', 
  status: string 
}) => {
  const config = {
    payment: {
      paid: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle, label: 'PAGO' },
      pending: { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertCircle, label: 'PENDENTE' },
      overdue: { color: 'bg-rose-50 text-rose-700 border-rose-200', icon: AlertCircle, label: 'ATRASADO' },
    },
    signature: {
      signed: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle, label: 'ASSINADO' },
      sent: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: PenTool, label: 'ENVIADO' },
      draft: { color: 'bg-slate-50 text-slate-500 border-slate-200', icon: FileText, label: 'PENDENTE' },
    },
    contract: {
      active: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Check, label: 'ATIVO' },
      expired: { color: 'bg-slate-50 text-slate-600 border-slate-200', icon: X, label: 'EXPIRADO' },
      terminated: { color: 'bg-rose-50 text-rose-600 border-rose-200', icon: X, label: 'RESCINDIDO' },
    }
  };

  const current = (config[type] as any)[status] || (type === 'signature' ? config.signature.draft : config.contract.active);
  const Icon = current.icon;

  return (
    <span className={`inline-flex items-center gap-1 py-0.5 px-2 rounded-full border text-[9px] font-black tracking-wider shadow-sm ${current.color}`}>
      <Icon size={10} strokeWidth={3} />
      {current.label}
    </span>
  );
};

export const ContractManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const { contracts, tenants, addContract, removeContract, updateContract, addNotification, setIsTenantModalOpen } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReadjustmentModalOpen, setIsReadjustmentModalOpen] = useState(false);
  const [readjustmentPreview, setReadjustmentPreview] = useState<any[]>([]);
  const [selectedContract, setSelectedContract] = useState<any | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [formData, setFormData] = useState({
    tenant: '',
    property: '',
    fullAddress: '',
    zipCode: '',
    city: '',
    state: '',
    value: '',
    start: '',
    end: '',
    readjustmentIndex: 'IGP-M',
    rooms: '',
    area: '',
    garage: '',
    dueDate: '',
    nextInspection: '',
    observations: ''
  });
  const [zipError, setZipError] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateCEP = (value: string) => {
    const cepRegex = /^\d{5}-\d{3}$/;
    if (value && !cepRegex.test(value)) {
      setZipError('Formato inválido (00000-000)');
    } else {
      setZipError('');
    }
  };

  const handleExportPDF = (contract: any) => {
    const tenantDetails = tenants.find(t => t.name === contract.tenant);
    generateContractPDF(contract, tenantDetails);
    addNotification('Contrato completo gerado com sucesso!', 'success');
  };

  const handleSendToSign = async (contract: any) => {
    if (isSigning) return;
    
    setIsSigning(true);
    const tenantDetails = tenants.find(t => t.name === contract.tenant);
    
    try {
      const response = await fetch(`/api/contracts/${contract.id}/send-to-sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantEmail: tenantDetails?.email || 'cliente@exemplo.com',
        }),
      });

      const data = await response.json();

      if (data.success) {
        updateContract(contract.id, { 
          signatureStatus: 'sent',
          signatureKey: data.signatureKey 
        });
        
        // Update selected contract in local state if it's the one open
        if (selectedContract?.id === contract.id) {
          setSelectedContract({
            ...selectedContract,
            signatureStatus: 'sent',
            signatureKey: data.signatureKey
          });
        }
        
        addNotification(data.message, 'success');
      } else {
        addNotification('Falha ao enviar para assinatura eletrônica.', 'error');
      }
    } catch (error) {
      console.error('Signature Error:', error);
      addNotification('Erro de conexão com o servidor de assinatura.', 'error');
    } finally {
      setIsSigning(false);
    }
  };

  const handleSimulateWebhookCompletion = async (contract: any) => {
    try {
      // 1. Send simulated webhook to backend
      await fetch('/api/webhooks/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'signature_completed',
          document_key: contract.signatureKey || 'internal_id',
          status: 'signed'
        }),
      });

      // 2. Update local state to reflect the webhook-processed change
      updateContract(contract.id, { signatureStatus: 'signed' });
      
      if (selectedContract?.id === contract.id) {
        setSelectedContract({
          ...selectedContract,
          signatureStatus: 'signed'
        });
      }

      addNotification('Webhook recebido: Contrato assinado com sucesso!', 'success');
    } catch (error) {
      addNotification('Erro ao simular webhook.', 'error');
    }
  };

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Detailed Validation
    const errors: Record<string, string> = {};
    if (zipError) errors.zipCode = zipError;
    
    if (!formData.start) errors.start = 'Data de início é obrigatória';
    if (!formData.end) errors.end = 'Data de término é obrigatória';
    
    if (formData.start && formData.end) {
      const start = new Date(formData.start);
      const end = new Date(formData.end);
      if (end <= start) {
        errors.end = 'A data de término deve ser posterior à data de início';
      }
    }

    if (Number(formData.value) <= 0) {
      errors.value = 'O valor deve ser maior que zero';
    }

    if (Number(formData.dueDate) < 1 || Number(formData.dueDate) > 31) {
      errors.dueDate = 'Dia inválido (1-31)';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      addNotification('Verifique os erros no formulário', 'error');
      return;
    }
    
    const newContract = {
      id: (contracts.length + 1).toString(),
      tenant: formData.tenant,
      property: formData.property,
      fullAddress: formData.fullAddress,
      zipCode: formData.zipCode,
      city: formData.city,
      state: formData.state,
      value: Number(formData.value),
      status: 'active' as const,
      paymentStatus: 'pending' as const,
      start: formData.start,
      end: formData.end,
      readjustmentIndex: formData.readjustmentIndex,
      rooms: formData.rooms,
      area: formData.area,
      garage: formData.garage,
      dueDate: formData.dueDate,
      nextInspection: formData.nextInspection,
      observations: formData.observations
    };
    addContract(newContract);
    setIsModalOpen(false);
    setFormErrors({});
    setFormData({ 
      tenant: '', 
      property: '', 
      fullAddress: '', 
      zipCode: '', 
      city: '', 
      state: '', 
      value: '', 
      start: '', 
      end: '', 
      readjustmentIndex: 'IGP-M',
      rooms: '',
      area: '',
      garage: '',
      dueDate: '',
      nextInspection: '',
      observations: ''
    });
  };

  const handleSimulateReadjustment = () => {
    // Simulated indices for the last 12 months
    const indices: Record<string, number> = {
      'IGP-M': 0.0585, // 5.85%
      'IPCA': 0.0423   // 4.23%
    };

    const eligible = contracts.filter(c => {
      if (c.status !== 'active') return false;
      const startDate = new Date(c.start);
      const now = new Date();
      // To simulate "eligible for adjustment", we check if the contract is older than 6 months 
      // (in production this would be exactly on the 12th month/anniversary)
      const diffMonths = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());
      return diffMonths >= 6; 
    }).map(c => {
      const index = c.readjustmentIndex || 'IGP-M';
      const rate = indices[index];
      const newValue = Math.round(c.value * (1 + rate));
      return { ...c, oldValue: c.value, newValue, rate: (rate * 100).toFixed(2) };
    });

    setReadjustmentPreview(eligible);
    setIsReadjustmentModalOpen(true);
  };

  const applyReadjustments = () => {
    readjustmentPreview.forEach(item => {
      updateContract(item.id, { value: item.newValue });
    });
    setIsReadjustmentModalOpen(false);
    addNotification(`${readjustmentPreview.length} contratos reajustados com sucesso!`, 'success');
  };

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.tenant.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPayment = paymentFilter === 'all' || c.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesPayment;
  });

  const handleDeleteContract = (id: string) => {
    removeContract(id);
    setActiveMenuId(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold text-text-main">Gestão de Contratos</h2>
        
        <div className="flex gap-3">
          <button 
            onClick={handleSimulateReadjustment}
            className="flex items-center gap-2 bg-white border border-border-main text-text-main px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <TrendingUp size={18} className="text-primary" />
            Simular Reajustes
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm active:scale-95"
          >
            <Plus size={18} />
            Novo Contrato
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters & Search */}
        <div className="lg:col-span-3 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por inquilino, imóvel ou ID..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select 
              className="px-4 py-2.5 bg-white border border-border-main rounded-xl text-sm font-medium text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none min-w-[140px]"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="all">Todos Pagamentos</option>
              <option value="paid">Pagos</option>
              <option value="pending">Pendentes</option>
              <option value="overdue">Atrasados</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border-main rounded-xl text-sm font-medium text-text-muted hover:bg-slate-50 transition-colors">
              <Filter size={16} />
              Mais Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="bg-brand-card border border-border-main rounded-xl shadow-sm overflow-hidden text-center sm:text-left">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-border-main">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-left">Inquilino / Imóvel</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider hidden md:table-cell">Início</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-center hidden sm:table-cell">Venc.</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Aluguel</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-center">Pagamento</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-center">Assinatura</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider hidden lg:table-cell">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/50">
              {filteredContracts.map((contract) => (
                <tr 
                  key={contract.id} 
                  onClick={() => setSelectedContract(contract)}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="px-4 md:px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 rounded-lg flex items-center justify-center text-primary shrink-0">
                        <User size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-text-main truncate">{contract.tenant}</div>
                        <div className="text-[11px] text-text-muted truncate">{contract.property}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-text-muted hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(contract.start).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center hidden sm:table-cell">
                    <div className="text-sm font-medium text-text-main">
                      {contract.dueDate}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-5 text-right">
                    <div className="text-sm font-bold text-text-main">
                      R$ {contract.value.toLocaleString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-5 text-center">
                    <StatusBadge type="payment" status={contract.paymentStatus} />
                  </td>
                  <td className="px-4 md:px-6 py-5 text-center">
                    <StatusBadge type="signature" status={contract.signatureStatus || 'draft'} />
                  </td>
                  <td className="px-6 py-5 hidden lg:table-cell">
                    <StatusBadge type="contract" status={contract.status} />
                  </td>
                  <td className="px-4 md:px-6 py-5 text-right relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === contract.id ? null : contract.id);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        activeMenuId === contract.id ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-text-muted'
                      }`}
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    <AnimatePresence>
                      {activeMenuId === contract.id && (
                        <>
                          {/* Invisible backdrop to close menu */}
                          <div 
                            className="fixed inset-0 z-[65]" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(null);
                            }}
                          />
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-6 mt-2 w-48 bg-white border border-border-main rounded-xl shadow-xl z-[70] py-1 overflow-hidden"
                          >
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedContract(contract);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-main hover:bg-slate-50 transition-colors"
                            >
                              <FileText size={16} className="text-primary" />
                              Ver Detalhes
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                // Placeholder for Edit
                                alert(`Funcionalidade de Edição (ID: ${contract.id}) em desenvolvimento.`);
                                setActiveMenuId(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-main hover:bg-slate-50 transition-colors"
                            >
                              <Plus size={16} className="text-primary" />
                              Editar Contrato
                            </button>
                            <div className="h-px bg-border-main/50 my-1" />
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if(confirm(`Deseja realmente excluir o contrato de ${contract.tenant}?`)) {
                                  handleDeleteContract(contract.id);
                                }
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger hover:bg-rose-50 transition-colors"
                            >
                              <X size={16} />
                              Excluir Contrato
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Empty State Prototype Helper */}
      <div className="mt-4 p-4 border border-dashed border-border-main rounded-xl bg-slate-50/50 flex items-center gap-4 text-text-muted">
        <FileText size={20} className="text-slate-400" />
        <p className="text-xs leading-relaxed">
          <span className="font-bold">Dica de Arquiteto:</span> No MVP, estamos otimizando para visualização. A criação de contrato gerasse um draft que o departamento jurídico deve validar via assinatura digital (Integrado futuramente via DocuSign/Clicksign).
        </p>
      </div>

      {/* Modal Overlay for Creation Form */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[60] overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-border-main flex justify-between items-center bg-white shrink-0">
                <h3 className="text-lg font-bold text-text-main">Novo Contrato de Aluguel</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-text-muted"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateContract} className="p-6 space-y-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-text-muted uppercase">Selecionar Inquilino</label>
                      <button 
                        type="button"
                        onClick={() => setIsTenantModalOpen(true)}
                        className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <Plus size={10} />
                        CADASTRAR NOVO
                      </button>
                    </div>
                    <select 
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                      value={formData.tenant}
                      onChange={e => {
                        if (e.target.value === 'new') {
                          setIsTenantModalOpen(true);
                        } else {
                          setFormData({...formData, tenant: e.target.value});
                        }
                      }}
                    >
                      <option value="">Selecione um inquilino...</option>
                      {tenants.map(t => (
                        <option key={t.id} value={t.name}>{t.name}</option>
                      ))}
                      <option value="new" className="text-primary font-bold">+ Novo Inquilino...</option>
                    </select>
                  </div>

                  <div className="border-t border-border-main/50 pt-4">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Informações do Imóvel</h4>
                    
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-muted uppercase">Identificação da Unidade</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Ex: Ed. Aurora, Apt 402"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                          value={formData.property}
                          onChange={e => setFormData({...formData, property: e.target.value})}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-muted uppercase">Endereço Completo</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Rua, Número, Complemento, Bairro"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                          value={formData.fullAddress}
                          onChange={e => setFormData({...formData, fullAddress: e.target.value})}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-muted uppercase">CEP</label>
                          <input 
                            required
                            type="text" 
                            placeholder="00000-000"
                            className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                              zipError ? 'border-danger focus:ring-danger/20' : 'border-border-main focus:ring-primary/20'
                            }`}
                            value={formData.zipCode}
                            onChange={e => {
                              const val = e.target.value;
                              setFormData({...formData, zipCode: val});
                              validateCEP(val);
                            }}
                          />
                          {zipError && <p className="text-[10px] text-danger font-bold uppercase">{zipError}</p>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-muted uppercase">Cidade</label>
                          <input 
                            required
                            type="text" 
                            placeholder="Ex: São Paulo"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={formData.city}
                            onChange={e => setFormData({...formData, city: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-muted uppercase">Estado (UF)</label>
                        <select 
                          required
                          className="w-full px-4 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                          value={formData.state}
                          onChange={e => setFormData({...formData, state: e.target.value})}
                        >
                          <option value="">Selecione...</option>
                          <option value="AC">Acre</option>
                          <option value="AL">Alagoas</option>
                          <option value="AP">Amapá</option>
                          <option value="AM">Amazonas</option>
                          <option value="BA">Bahia</option>
                          <option value="CE">Ceará</option>
                          <option value="DF">Distrito Federal</option>
                          <option value="ES">Espirito Santo</option>
                          <option value="GO">Goiás</option>
                          <option value="MA">Maranhão</option>
                          <option value="MS">Mato Grosso do Sul</option>
                          <option value="MT">Mato Grosso</option>
                          <option value="MG">Minas Gerais</option>
                          <option value="PA">Pará</option>
                          <option value="PB">Paraíba</option>
                          <option value="PR">Paraná</option>
                          <option value="PE">Pernambuco</option>
                          <option value="PI">Piauí</option>
                          <option value="RJ">Rio de Janeiro</option>
                          <option value="RN">Rio Grande do Norte</option>
                          <option value="RS">Rio Grande do Sul</option>
                          <option value="RO">Rondônia</option>
                          <option value="RR">Roraima</option>
                          <option value="SC">Santa Catarina</option>
                          <option value="SP">São Paulo</option>
                          <option value="SE">Sergipe</option>
                          <option value="TO">Tocantins</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-muted uppercase">Quartos</label>
                          <input 
                            type="number" 
                            placeholder="0"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={formData.rooms}
                            onChange={e => setFormData({...formData, rooms: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-muted uppercase">Área (m²)</label>
                          <input 
                            type="number" 
                            placeholder="0"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={formData.area}
                            onChange={e => setFormData({...formData, area: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-text-muted uppercase">Vagas</label>
                          <input 
                            type="number" 
                            placeholder="0"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={formData.garage}
                            onChange={e => setFormData({...formData, garage: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border-main/50 pt-4">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Condições Financeiras e Prazos</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-muted uppercase">Valor do Aluguel (R$)</label>
                        <input 
                          required
                          type="number" 
                          placeholder="0.00"
                          className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                            formErrors.value ? 'border-danger focus:ring-danger/20' : 'border-border-main focus:ring-primary/20'
                          }`}
                          value={formData.value}
                          onChange={e => {
                            setFormData({...formData, value: e.target.value});
                            if (formErrors.value) setFormErrors({...formErrors, value: ''});
                          }}
                        />
                        {formErrors.value && <p className="text-[10px] text-danger font-bold uppercase">{formErrors.value}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-muted uppercase">Dia de Vencimento</label>
                        <input 
                          required
                          type="number" 
                          min="1"
                          max="31"
                          placeholder="Ex: 10"
                          className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                            formErrors.dueDate ? 'border-danger focus:ring-danger/20' : 'border-border-main focus:ring-primary/20'
                          }`}
                          value={formData.dueDate}
                          onChange={e => {
                            setFormData({...formData, dueDate: e.target.value});
                            if (formErrors.dueDate) setFormErrors({...formErrors, dueDate: ''});
                          }}
                        />
                        {formErrors.dueDate && <p className="text-[10px] text-danger font-bold uppercase">{formErrors.dueDate}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-muted uppercase">Índice</label>
                        <select 
                          required
                          className="w-full px-4 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                          value={formData.readjustmentIndex}
                          onChange={e => setFormData({...formData, readjustmentIndex: e.target.value})}
                        >
                          <option value="IGP-M">IGP-M</option>
                          <option value="IPCA">IPCA</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-muted uppercase">Data de Início</label>
                        <input 
                          required
                          type="date" 
                          className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                            formErrors.start ? 'border-danger focus:ring-danger/20' : 'border-border-main focus:ring-primary/20'
                          }`}
                          value={formData.start}
                          onChange={e => {
                            setFormData({...formData, start: e.target.value});
                            if (formErrors.start) setFormErrors({...formErrors, start: ''});
                          }}
                        />
                        {formErrors.start && <p className="text-[10px] text-danger font-bold uppercase">{formErrors.start}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-muted uppercase">Data de Término</label>
                        <input 
                          required
                          type="date" 
                          className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                            formErrors.end ? 'border-danger focus:ring-danger/20' : 'border-border-main focus:ring-primary/20'
                          }`}
                          value={formData.end}
                          onChange={e => {
                            setFormData({...formData, end: e.target.value});
                            if (formErrors.end) setFormErrors({...formErrors, end: ''});
                          }}
                        />
                        {formErrors.end && <p className="text-[10px] text-danger font-bold uppercase">{formErrors.end}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-muted uppercase">Próxima Vistoria (Opcional)</label>
                        <input 
                          type="date" 
                          className="w-full px-4 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          value={formData.nextInspection}
                          onChange={e => setFormData({...formData, nextInspection: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mt-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-text-muted uppercase">Observações Internas (Opcional)</label>
                        <textarea 
                          placeholder="Notas sobre o inquilino, imóvel ou condições especiais..."
                          className="w-full px-4 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[100px] resize-none"
                          value={formData.observations}
                          onChange={e => setFormData({...formData, observations: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-3 bg-white">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md shadow-primary/20 transition-all"
                  >
                    Gerar Contrato
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Contract Details Side Panel */}
      <AnimatePresence>
        {selectedContract && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedContract(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[80] flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-border-main flex justify-between items-center shrink-0">
                <h3 className="text-lg font-bold text-text-main">Detalhes do Contrato</h3>
                <button 
                  onClick={() => setSelectedContract(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-text-muted"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Header Summary */}
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-border-main">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-primary shrink-0">
                    <User size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-text-main leading-tight">{selectedContract.tenant}</h4>
                    <p className="text-sm text-text-muted">{selectedContract.property}</p>
                    <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedContract.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {selectedContract.status === 'active' ? 'CONTRATO ATIVO' : 'CONTRATO EXPIRADO'}
                    </span>
                  </div>
                </div>

                {/* Property Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <FileText size={18} />
                    <h5 className="text-sm font-bold uppercase tracking-wider">Informações do Imóvel</h5>
                  </div>
                  <div className="grid grid-cols-1 gap-4 text-sm bg-white p-4 rounded-xl border border-border-main/50">
                    <div>
                      <span className="text-text-muted block text-xs font-bold uppercase mb-1">Endereço Completo</span>
                      <p className="text-text-main font-medium">{selectedContract.fullAddress || '-'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-text-muted block text-xs font-bold uppercase mb-1">CEP</span>
                        <p className="text-text-main font-medium">{selectedContract.zipCode || '-'}</p>
                      </div>
                      <div>
                        <span className="text-text-muted block text-xs font-bold uppercase mb-1">Cidade / UF</span>
                        <p className="text-text-main font-medium">
                          {selectedContract.city && selectedContract.state 
                            ? `${selectedContract.city} - ${selectedContract.state}` 
                            : '-'}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 border-t border-border-main/30 pt-4">
                      <div>
                        <span className="text-text-muted block text-xs font-bold uppercase mb-1">Quartos</span>
                        <p className="text-text-main font-bold">{selectedContract.rooms || '-'}</p>
                      </div>
                      <div>
                        <span className="text-text-muted block text-xs font-bold uppercase mb-1">Área</span>
                        <p className="text-text-main font-bold">{selectedContract.area || '-'} m²</p>
                      </div>
                      <div>
                        <span className="text-text-muted block text-xs font-bold uppercase mb-1">Vagas</span>
                        <p className="text-text-main font-bold">{selectedContract.garage || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Section */}
                <div className="space-y-4 pb-6">
                  <div className="flex items-center gap-2 text-primary">
                    <Calendar size={18} />
                    <h5 className="text-sm font-bold uppercase tracking-wider">Condições Financeiras</h5>
                  </div>
                  <div className="grid grid-cols-1 gap-4 text-sm bg-white p-4 rounded-xl border border-border-main/50">
                    <div className="flex justify-between items-center py-2 border-b border-border-main/30">
                      <span className="text-text-muted font-bold uppercase text-xs">Aluguel Mensal</span>
                      <span className="text-lg font-bold text-primary">R$ {selectedContract.value.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-text-muted">Dia de Vencimento</span>
                      <span className="font-bold text-text-main">Todo dia {selectedContract.dueDate}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-text-muted">Índice de Reajuste</span>
                      <span className="font-bold text-text-main">{selectedContract.readjustmentIndex || '-'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2 pt-3 border-t border-border-main/30">
                      <div>
                        <span className="text-text-muted block text-xs font-bold uppercase mb-1">Início</span>
                        <p className="text-text-main font-medium">{new Date(selectedContract.start).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <span className="text-text-muted block text-xs font-bold uppercase mb-1">Término</span>
                        <p className="text-text-main font-medium">{new Date(selectedContract.end).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    {selectedContract.nextInspection && (
                      <div className="mt-4 pt-3 border-t border-border-main/30">
                        <span className="text-text-muted block text-xs font-bold uppercase mb-1">Próxima Vistoria</span>
                        <div className="flex items-center gap-2 text-text-main font-medium">
                          <Calendar size={14} className="text-primary" />
                          {new Date(selectedContract.nextInspection).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-border-main/30">
                      <span className="text-text-muted block text-xs font-bold uppercase mb-2 flex items-center gap-2">
                        <FileText size={12} className="text-primary" />
                        Observações
                      </span>
                      <div className="relative group">
                        <textarea 
                          className="w-full p-3 bg-slate-50 border border-border-main rounded-xl text-xs text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-none transition-all"
                          value={selectedContract.observations || ''}
                          placeholder="Adicione notas sobre este contrato..."
                          onChange={(e) => {
                            const newVal = e.target.value;
                            setSelectedContract({ ...selectedContract, observations: newVal });
                          }}
                          onBlur={() => {
                            updateContract(selectedContract.id, { observations: selectedContract.observations });
                          }}
                        />
                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white px-2 py-1 rounded text-[9px] font-bold text-text-muted border border-border-main shadow-sm pointer-events-none">
                          <Check size={10} className="text-emerald-500" />
                          SALVO AUTOMATICAMENTE
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-border-main/30">
                      <span className="text-text-muted block text-xs font-bold uppercase mb-2">Status do Contrato e Assinatura</span>
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge type="payment" status={selectedContract.paymentStatus} />
                        <StatusBadge type="signature" status={selectedContract.signatureStatus || 'draft'} />
                        <StatusBadge type="contract" status={selectedContract.status} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="p-6 border-t border-border-main bg-slate-50 flex flex-col gap-3 shrink-0">
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleExportPDF(selectedContract)}
                    className="flex-1 bg-white border border-border-main text-text-main px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={16} className="text-primary" />
                    Baixar PDF
                  </button>
                  <button className="flex-1 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md shadow-primary/20 transition-all">
                    Emitir Recibo
                  </button>
                </div>
                
                {selectedContract.signatureStatus !== 'signed' && (
                  <div className="flex flex-col gap-2">
                    <button 
                      disabled={isSigning}
                      onClick={() => handleSendToSign(selectedContract)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        selectedContract.signatureStatus === 'sent'
                          ? 'bg-white border border-border-main text-text-main hover:bg-slate-50'
                          : 'bg-slate-900 text-white hover:bg-slate-800'
                      } ${isSigning ? 'opacity-70 cursor-wait' : ''}`}
                    >
                      {isSigning ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <PenTool size={16} />
                      )}
                      {selectedContract.signatureStatus === 'sent' ? 'Reenviar para Assinatura' : 'Enviar para Assinatura Eletrônica'}
                    </button>

                    {selectedContract.signatureStatus === 'sent' && (
                      <button 
                        onClick={() => handleSimulateWebhookCompletion(selectedContract)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-sm font-bold hover:bg-emerald-100 transition-all hover:shadow-sm"
                      >
                        <CheckCircle size={16} />
                        Simular Conclusão da Assinatura (Webhook)
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Readjustment Simulation Modal */}
      <AnimatePresence>
        {isReadjustmentModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReadjustmentModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-[120] overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-border-main flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-main">Simulação de Reajuste Anual</h3>
                    <p className="text-xs text-text-muted">Índices projetados: <span className="font-bold">IGP-M (5.85%)</span> e <span className="font-bold">IPCA (4.23%)</span></p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsReadjustmentModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-text-muted"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {readjustmentPreview.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Check size={48} className="mx-auto text-emerald-300" />
                    <p className="text-text-muted text-sm">Nenhum contrato elegível para reajuste neste ciclo.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 px-4 py-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      <div className="col-span-4">Inquilino</div>
                      <div className="col-span-2 text-center">Índice</div>
                      <div className="col-span-3 text-right">Valor Atual</div>
                      <div className="col-span-3 text-right">Novo Valor</div>
                    </div>
                    {readjustmentPreview.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 items-center px-4 py-3 bg-slate-50 rounded-xl border border-border-main/50">
                        <div className="col-span-4">
                          <div className="text-sm font-bold text-text-main">{item.tenant}</div>
                          <div className="text-[10px] text-text-muted">{item.property}</div>
                        </div>
                        <div className="col-span-2 text-center">
                          <span className="px-2 py-0.5 bg-white border border-border-main rounded text-[10px] font-bold text-primary italic">
                            {item.readjustmentIndex}
                          </span>
                        </div>
                        <div className="col-span-3 text-right">
                          <div className="text-xs text-text-muted line-through font-medium">R$ {item.oldValue.toLocaleString('pt-BR')}</div>
                        </div>
                        <div className="col-span-3 text-right">
                          <div className="text-sm font-black text-emerald-600">R$ {item.newValue.toLocaleString('pt-BR')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-border-main bg-slate-50 flex gap-3">
                <button 
                  onClick={() => setIsReadjustmentModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-white border border-border-main text-text-main rounded-xl text-sm font-bold hover:bg-slate-100 transition-all"
                >
                  Cancelar
                </button>
                {readjustmentPreview.length > 0 && (
                  <button 
                    onClick={applyReadjustments}
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    Aplicar Reajustes
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
