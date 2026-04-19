import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../AppContext';

export const TenantModal = () => {
  const { tenants, addTenant, isTenantModalOpen, setIsTenantModalOpen } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    tradeName: '', // Nome Fantasia
    email: '',
    phone: '',
    document: '',
    stateRegistration: '', // IE
    legalRepresentative: '', // Responsável
    type: 'Individual'
  });

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    const newTenant = {
      ...formData,
      id: Math.random().toString(36).substring(7),
      status: 'active' as const,
      contracts: 0,
      totalPaid: 0,
      lastPayment: '-',
      joinDate: new Date().toISOString().split('T')[0]
    };
    addTenant(newTenant);
    setIsTenantModalOpen(false);
    setFormData({ 
      name: '', 
      tradeName: '', 
      email: '', 
      phone: '', 
      document: '', 
      stateRegistration: '', 
      legalRepresentative: '', 
      type: 'Individual' 
    });
  };

  if (!isTenantModalOpen) return null;

  const isPJ = formData.type === 'Corporate';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsTenantModalOpen(false)}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
        >
           <div className="p-6 border-b border-border-main flex justify-between items-center bg-white shrink-0">
            <div>
              <h3 className="text-lg font-bold text-text-main">
                {isPJ ? 'Novo Inquilino (Pessoa Jurídica)' : 'Novo Inquilino (Pessoa Física)'}
              </h3>
              <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
                Cadastro de {isPJ ? 'Empresa' : 'Indivíduo'}
              </p>
            </div>
            <button 
              onClick={() => setIsTenantModalOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-text-muted"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleCreateTenant} className="p-6 space-y-4 overflow-y-auto">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase">Tipo de Cadastro</label>
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'Individual'})}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    formData.type === 'Individual' 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  PESSOA FÍSICA
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'Corporate'})}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    formData.type === 'Corporate' 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  PESSOA JURÍDICA
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase">
                  {isPJ ? 'Razão Social' : 'Nome Completo'}
                </label>
                <input 
                  required
                  type="text" 
                  placeholder={isPJ ? "Ex: Minha Empresa LTDA" : "Ex: João Silva"}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              {isPJ && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase">Nome Fantasia</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Minha Empresa"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.tradeName}
                    onChange={e => setFormData({...formData, tradeName: e.target.value})}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase">
                    {isPJ ? 'CNPJ' : 'CPF'}
                  </label>
                  <input 
                    required
                    type="text" 
                    placeholder={isPJ ? "00.000.000/0001-00" : "000.000.000-00"}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                    value={formData.document}
                    onChange={e => setFormData({...formData, document: e.target.value})}
                  />
                </div>
                {isPJ && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted uppercase">Inscrição Estadual</label>
                    <input 
                      type="text" 
                      placeholder="000.000.000.000"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                      value={formData.stateRegistration}
                      onChange={e => setFormData({...formData, stateRegistration: e.target.value})}
                    />
                  </div>
                )}
              </div>

              {isPJ && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase">Responsável Legal</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Nome do representante legal"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.legalRepresentative}
                    onChange={e => setFormData({...formData, legalRepresentative: e.target.value})}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase">E-mail</label>
                  <input 
                    required
                    type="email" 
                    placeholder={isPJ ? "financeiro@empresa.com" : "joao@email.com"}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase">Telefone</label>
                  <input 
                    required
                    type="text" 
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 flex gap-3">
               <button 
                type="button"
                onClick={() => setIsTenantModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-primary/20 transition-all"
              >
                Salvar Inquilino
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
