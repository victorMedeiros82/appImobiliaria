import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Search, Filter, Mail, Phone, User, Users, Plus, X, FileText, Calendar, MapPin, MoreHorizontal, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../AppContext';

export const TenantManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { tenants, addTenant, setIsTenantModalOpen, addNotification } = useApp();
  const [selectedTenant, setSelectedTenant] = useState<any | null>(null);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const primaryColor = [37, 99, 235]; // #2563eb
    const secondaryColor = [100, 116, 139]; // #64748b

    // Cabeçalho
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('AluguelFlow', 20, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const today = new Date().toLocaleDateString('pt-BR');
    doc.text(`Relatório Gerencial de Inquilinos | Gerado em: ${today}`, 20, 30);

    // Título do Relatório
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('RELATÓRIO DE INQUILINOS', 20, 60);

    doc.setFontSize(10);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(`Total de registros: ${filteredTenants.length}`, 20, 68);

    // Tabela - Cabeçalho
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 75, 180, 10, 'F');
    doc.line(15, 75, 195, 75);
    doc.line(15, 85, 195, 85);

    doc.setFontSize(9);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('NOME', 20, 81.5);
    doc.text('DOCUMENTO', 70, 81.5);
    doc.text('CONTATO', 110, 81.5);
    doc.text('STATUS', 170, 81.5);

    // Tabela - Conteúdo
    let y = 92;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    filteredTenants.forEach((tenant, index) => {
      // Verificar se precisa de nova página
      if (y > 270) {
        doc.addPage();
        y = 30;
        
        // Repetir cabeçalho da tabela se necessário
        doc.setFillColor(248, 250, 252);
        doc.rect(15, y - 10, 180, 10, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text('NOME', 20, y - 3.5);
        doc.text('DOCUMENTO', 70, y - 3.5);
        doc.text('CONTATO', 110, y - 3.5);
        doc.text('STATUS', 170, y - 3.5);
        y += 7;
      }

      const displayName = tenant.type === 'Corporate' && (tenant as any).tradeName 
        ? `${tenant.name} (${(tenant as any).tradeName})` 
        : tenant.name;
        
      doc.setFont('helvetica', 'bold');
      doc.text(displayName, 20, y);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(tenant.document, 70, y);
      
      doc.text(tenant.email, 110, y);
      doc.text(tenant.phone, 110, y + 4);
      
      const statusText = tenant.status === 'active' ? 'ATIVO' : 'INATIVO';
      doc.setFont('helvetica', 'bold');
      doc.text(statusText, 170, y);

      doc.setDrawColor(241, 245, 249);
      doc.line(15, y + 7, 195, y + 7);
      
      y += 12;
      doc.setFontSize(9);
    });

    // Rodapé
    const pageCount = (doc as any).internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
    }

    doc.save(`Relatorio_Inquilinos_${today.replace(/\//g, '-')}.pdf`);
    addNotification('Relatório de inquilinos gerado com sucesso!', 'success');
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.document.includes(searchTerm)
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold text-text-main">Gestão de Inquilinos</h2>
        
        <div className="flex gap-3">
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 bg-white border border-border-main text-text-main px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <Download size={18} className="text-primary" />
            Exportar Lista
          </button>
          <button 
            onClick={() => setIsTenantModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm active:scale-95"
          >
            <Plus size={18} />
            Cadastrar Inquilino
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por nome, e-mail ou CPF/CNPJ..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border-main rounded-xl text-sm font-medium text-text-muted hover:bg-slate-50 transition-colors">
            <Filter size={16} />
            Filtros
          </button>
        </div>
      </div>

      {/* Tenants Grid/List */}
      <div className="bg-brand-card border border-border-main rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-border-main">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Inquilino</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Contato</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider hidden md:table-cell">Documento</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider hidden lg:table-cell">Contratos</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/50">
              {filteredTenants.map((tenant) => (
                <tr 
                  key={tenant.id} 
                  onClick={() => setSelectedTenant(tenant)}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="px-4 md:px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shrink-0 border border-border-main overflow-hidden">
                        <User size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-text-main truncate">{tenant.name}</div>
                        <div className="text-[9px] font-bold text-primary uppercase tracking-wider">{tenant.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[11px] text-text-muted truncate max-w-[120px] sm:max-w-none">
                        <Mail size={12} strokeWidth={3} className="shrink-0" />
                        <span className="truncate">{tenant.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-text-muted">
                        <Phone size={12} strokeWidth={3} className="shrink-0" />
                        {tenant.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 hidden md:table-cell">
                    <span className="text-sm text-text-main font-medium font-mono">{tenant.document}</span>
                  </td>
                  <td className="px-6 py-5 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-1 bg-blue-50 text-primary rounded-lg text-xs font-bold border border-blue-100 italic">
                        {tenant.contracts} {tenant.contracts === 1 ? 'Contrato' : 'Contratos'}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      tenant.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tenant.status === 'active' ? 'ATIVO' : 'INATIVO'}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-5 text-right">
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-text-muted"
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 p-4 border border-dashed border-border-main rounded-xl bg-slate-50/50 flex items-center gap-4 text-text-muted">
        <Users size={20} className="text-slate-400" />
        <p className="text-xs leading-relaxed">
          <span className="font-bold">Dica SaaS:</span> Manter o histórico de comportamento do inquilino (pontualidade, zelo com o imóvel) ajuda na análise de crédito para futuras renovações ou novos contratos.
        </p>
      </div>

      {/* Detail Side Panel */}
      <AnimatePresence>
        {selectedTenant && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTenant(null)}
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
                <h3 className="text-lg font-bold text-text-main">Ficha do Inquilino</h3>
                <button 
                  onClick={() => setSelectedTenant(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-text-muted"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Header Profile */}
                <div className="text-center space-y-3 pb-4">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 mx-auto border-4 border-white shadow-lg overflow-hidden relative group">
                    <User size={48} />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Plus className="text-white" size={24} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-text-main">{selectedTenant.name}</h4>
                    {selectedTenant.tradeName && (
                      <p className="text-xs font-bold text-primary italic uppercase tracking-wider">{selectedTenant.tradeName}</p>
                    )}
                    <p className="text-sm text-text-muted">{selectedTenant.email}</p>
                    <div className="flex justify-center gap-2 mt-2">
                       <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedTenant.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {selectedTenant.status === 'active' ? 'TENANT ATIVO' : 'TENANT INATIVO'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-primary">
                        CLIENTE DESDE {new Date(selectedTenant.joinDate).getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-text-main">
                    <Phone size={18} className="text-primary" />
                    <h5 className="text-sm font-bold uppercase tracking-wider">Contato e Documentação</h5>
                  </div>
                  <div className="grid grid-cols-1 gap-4 text-sm bg-slate-50 p-5 rounded-2xl border border-border-main">
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted font-bold text-[10px] uppercase">Telefone</span>
                      <span className="text-text-main font-medium">{selectedTenant.phone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted font-bold text-[10px] uppercase">CPF/CNPJ</span>
                      <span className="text-text-main font-mono">{selectedTenant.document}</span>
                    </div>
                    {selectedTenant.stateRegistration && (
                      <div className="flex justify-between items-center">
                        <span className="text-text-muted font-bold text-[10px] uppercase">Inscrição Estadual</span>
                        <span className="text-text-main font-mono">{selectedTenant.stateRegistration}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted font-bold text-[10px] uppercase">Tipo de Pessoa</span>
                      <span className="text-text-main font-medium">{selectedTenant.type === 'Individual' ? 'Física' : 'Jurídica'}</span>
                    </div>
                    {selectedTenant.legalRepresentative && (
                      <div className="flex justify-between items-center pt-2 border-t border-border-main/50">
                        <span className="text-text-muted font-bold text-[10px] uppercase">Responsável Legal</span>
                        <span className="text-text-main font-bold text-primary italic">{selectedTenant.legalRepresentative}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Statistics & Related */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-text-main">
                    <FileText size={18} className="text-primary" />
                    <h5 className="text-sm font-bold uppercase tracking-wider">Histórico na Carteira</h5>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-border-main text-center">
                      <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Total Contratos</span>
                      <span className="text-2xl font-bold text-primary italic">{selectedTenant.contracts}</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-border-main text-center">
                       <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Pontualidade</span>
                       <span className="text-2xl font-bold text-emerald-500 italic">98%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                   <h5 className="text-xs font-bold text-text-muted uppercase tracking-widest px-1">Ações Recomendadas</h5>
                   <button className="w-full flex items-center justify-between p-4 bg-white border border-border-main rounded-2xl hover:bg-slate-50 transition-colors group">
                     <span className="text-sm font-medium text-text-main">Ver Contratos Ativos</span>
                     <MoreHorizontal size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
                   </button>
                   <button className="w-full flex items-center justify-between p-4 bg-white border border-border-main rounded-2xl hover:bg-slate-50 transition-colors group text-danger">
                     <span className="text-sm font-medium">Inativar Cadastro</span>
                     <X size={18} className="opacity-40" />
                   </button>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border-main bg-white">
                <button className="w-full bg-primary text-white px-4 py-3 rounded-2xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                  Editar Perfil Completo
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
