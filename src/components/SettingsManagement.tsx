import React, { useState } from 'react';
import { 
  Building2, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  Settings2, 
  Save, 
  Mail, 
  MessageSquare, 
  Globe, 
  Cpu, 
  Database, 
  LogOut,
  ChevronRight,
  Info,
  Check,
  User,
  Plus,
  Calendar,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SettingsCategory = 'company' | 'finance' | 'notifications' | 'security' | 'integrations' | 'account';

export const SettingsManagement = () => {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('company');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 overflow-hidden min-h-[calc(100vh-180px)] animate-in fade-in duration-500">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 shrink-0">
        <div className="bg-brand-card border border-border-main rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border-main bg-slate-50/50">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest pl-2">Preferências</h3>
          </div>
          <nav className="p-2 space-y-1">
            <SettingsNavItem 
              active={activeCategory === 'company'} 
              onClick={() => setActiveCategory('company')} 
              icon={<Building2 size={18} />} 
              label="Dados da Imobiliária" 
              description="Logo, CNPJ e contatos"
            />
            <SettingsNavItem 
              active={activeCategory === 'finance'} 
              onClick={() => setActiveCategory('finance')} 
              icon={<CreditCard size={18} />} 
              label="Regras Financeiras" 
              description="Taxas, bancos e multas"
            />
            <SettingsNavItem 
              active={activeCategory === 'notifications'} 
              onClick={() => setActiveCategory('notifications')} 
              icon={<Bell size={18} />} 
              label="Notificações" 
              description="Alertas e automações"
            />
            <SettingsNavItem 
              active={activeCategory === 'integrations'} 
              onClick={() => setActiveCategory('integrations')} 
              icon={<Cpu size={18} />} 
              label="Integrações" 
              description="APIs e Gateways"
            />
            <SettingsNavItem 
              active={activeCategory === 'security'} 
              onClick={() => setActiveCategory('security')} 
              icon={<ShieldCheck size={18} />} 
              label="Segurança & LGPD" 
              description="Privacidade e logs"
            />
             <SettingsNavItem 
              active={activeCategory === 'account'} 
              onClick={() => setActiveCategory('account')} 
              icon={<User size={18} />} 
              label="Minha Conta" 
              description="Perfil e senha"
            />
          </nav>
        </div>

        <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-dashed border-border-main">
            <div className="flex items-start gap-3">
                <Info size={16} className="text-primary mt-0.5" />
                <div>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                        Alterações nestas configurações afetam o comportamento global do sistema e a geração de boletos.
                    </p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Settings Content */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-brand-card border border-border-main rounded-2xl shadow-sm overflow-hidden flex flex-col h-full bg-white">
          <div className="p-6 border-b border-border-main flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-text-main capitalize">
                {activeCategory === 'company' && 'Dados da Imobiliária'}
                {activeCategory === 'finance' && 'Regras Financeiras'}
                {activeCategory === 'notifications' && 'Configurações de Notificação'}
                {activeCategory === 'integrations' && 'Integrações Externas'}
                {activeCategory === 'security' && 'Privacidade e Segurança'}
                {activeCategory === 'account' && 'Configurações de Perfil'}
              </h2>
              <p className="text-xs text-text-muted mt-1 italic tracking-tight">
                Certifique-se de salvar as alterações antes de navegar para outra seção.
              </p>
            </div>
            <button 
                onClick={handleSave}
                disabled={isSaving}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 ${
                    savedSuccess 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                    : 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20'
                }`}
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : savedSuccess ? (
                <Check size={18} />
              ) : (
                <Save size={18} />
              )}
              {isSaving ? 'Salvando...' : savedSuccess ? 'Salvo!' : 'Salvar Alterações'}
            </button>
          </div>

          <div className="p-8 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="max-w-3xl space-y-10"
              >
                {activeCategory === 'company' && (
                  <div className="space-y-8">
                    <section className="space-y-4">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                        <Building2 size={14} /> Identidade Visual
                      </h4>
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-slate-100 rounded-2xl border-2 border-dashed border-border-main flex flex-col items-center justify-center gap-2 text-text-muted cursor-pointer hover:bg-slate-200 transition-colors">
                            <Plus size={20} />
                            <span className="text-[10px] font-bold">Logo</span>
                        </div>
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-bold text-text-main italic">Sua Logo</p>
                            <p className="text-xs text-text-muted leading-relaxed">
                                Formatos sugeridos: PNG ou SVG (fundo transparente). <br/>
                                Tamanho ideal: 512x512px.
                            </p>
                        </div>
                      </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase">Nome Fantasia</label>
                            <input className="w-full px-4 py-3 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue="PropTech Solutions Ltda" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase">CNPJ</label>
                            <input className="w-full px-4 py-3 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue="42.123.456/0001-99" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase">Email de Contato</label>
                            <input className="w-full px-4 py-3 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue="contato@proptech.com.br" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase">Telefone/WhatsApp</label>
                            <input className="w-full px-4 py-3 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" defaultValue="(11) 98765-4321" />
                        </div>
                    </section>
                  </div>
                )}

                {activeCategory === 'finance' && (
                  <div className="space-y-10">
                    <section className="space-y-6">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Taxas & Comissionamento</h4>
                        <div className="h-px bg-border-main flex-1"></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-border-main flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Administração (%)</span>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-black text-text-main italic">8.0</span>
                                <span className="text-sm font-bold text-slate-400 mb-1">fixo p/ mês</span>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-border-main flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Multa por Atraso (%)</span>
                            <div className="flex items-end gap-2">
                                <span className="text-2xl font-black text-rose-500 italic">2.0</span>
                                <span className="text-sm font-bold text-slate-400 mb-1">+ juros 1%/mês</span>
                            </div>
                        </div>
                      </div>
                    </section>

                    <section className="space-y-6">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Conexão Bancária (Boletos)</h4>
                        <div className="h-px bg-border-main flex-1"></div>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-6 border border-border-main space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-border-main flex items-center justify-center font-black text-text-muted italic">BB</div>
                                <div>
                                    <p className="text-sm font-bold text-text-main">Banco do Brasil</p>
                                    <p className="text-xs text-text-muted">Convenio: 12345 • Carteira: 17/019</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">ATIVO</span>
                        </div>
                        <button className="text-xs font-bold text-primary hover:underline">Configurar Webhook de Conciliação Automaticamente</button>
                      </div>
                    </section>
                  </div>
                )}

                {activeCategory === 'notifications' && (
                  <div className="space-y-10">
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <h4 className="text-xs font-bold text-primary uppercase tracking-widest italic">Régua de Cobrança Automática</h4>
                            <div className="h-px bg-border-main flex-1"></div>
                        </div>
                        
                        <div className="space-y-4">
                            <ToggleSetting 
                                title="Lembrete de Vencimento" 
                                description="Enviar lembrete 3 dias antes do vencimento via Email e Push."
                                defaultEnabled={true}
                            />
                            <ToggleSetting 
                                title="Aviso de Inadimplência" 
                                description="Notificar inquilino e proprietário no 1º dia de atraso."
                                defaultEnabled={true}
                            />
                            <ToggleSetting 
                                title="Relatório Mensal p/ Proprietário" 
                                description="Enviar PDF consolidado de rendimentos todo dia 01."
                                defaultEnabled={false}
                            />
                             <ToggleSetting 
                                title="Notificações via WhatsApp" 
                                description="Requer integração externa com API oficial (WABA)."
                                defaultEnabled={false}
                            />
                        </div>
                    </section>
                  </div>
                )}

                {activeCategory === 'integrations' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <IntegrationCard 
                        name="Iugu / Asaas" 
                        description="Gateway para emissão de boletos e cartões com conciliação."
                        status="disconnected"
                        icon={<CreditCard size={24} />}
                    />
                    <IntegrationCard 
                        name="Google Calendar" 
                        description="Sincronize datas de vistoria e reajuste com sua agenda."
                        status="connected"
                        icon={<Calendar size={24} />}
                    />
                    <IntegrationCard 
                        name="Azure Blob / S3" 
                        description="Armazenamento de contratos e documentos assinados."
                        status="connected"
                        icon={<Database size={24} />}
                    />
                    <IntegrationCard 
                        name="Docusign" 
                        description="Assinatura eletrônica com validade jurídica integrada."
                        status="disconnected"
                        icon={<FileText size={24} />}
                    />
                  </div>
                )}

                {activeCategory === 'security' && (
                  <div className="space-y-8">
                     <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-4">
                         <ShieldCheck className="text-amber-600 mt-1" size={24} />
                         <div>
                             <p className="text-sm font-bold text-amber-900">Políticas de Privacidade (LGPD)</p>
                             <p className="text-xs text-amber-800/80 leading-relaxed mt-1 italic">
                                Seus dados estão sendo processados em conformidade com a regulamentação vigente. Logs de acesso são retidos por 5 anos conforme exigido por lei.
                             </p>
                         </div>
                     </div>

                     <section className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-border-main rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-100 rounded-xl text-text-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                    <Database size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-text-main">Exportação Completa de Dados</p>
                                    <p className="text-xs text-text-muted italic">Baixar backup em formato .SQL ou .JSON</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-300" />
                        </div>

                        <div className="flex items-center justify-between p-4 border border-border-main rounded-2xl hover:bg-rose-50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-100 rounded-xl text-text-muted group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
                                    <LogOut size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-text-main">Encerramento de Conta</p>
                                    <p className="text-xs text-text-muted italic">Excluir permanentemente todos os dados da imobiliária</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-slate-300" />
                        </div>
                     </section>
                  </div>
                )}

                {activeCategory === 'account' && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-border-main">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-black text-2xl italic tracking-tighter">
                            VM
                        </div>
                        <div>
                            <p className="text-lg font-bold text-text-main">Victor Medeiros</p>
                            <p className="text-xs text-text-muted">Administrador Master • Criado em Out/2023</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase italic">Nova Senha</label>
                            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase italic">Confirmar Senha</label>
                            <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-border-main rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsNavItem = ({ active, onClick, icon, label, description }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all ${
      active 
      ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
      : 'text-text-muted hover:bg-slate-50 hover:text-text-main'
    }`}
  >
    <div className={`mt-0.5 p-2 rounded-lg ${active ? 'bg-white/20' : 'bg-slate-100'}`}>
        {icon}
    </div>
    <div className="text-left">
      <div className={`text-sm font-bold ${active ? 'text-white' : 'text-text-main'}`}>{label}</div>
      <div className={`text-[10px] ${active ? 'text-blue-100' : 'text-slate-400 opacity-80'} italic`}>{description}</div>
    </div>
  </button>
);

const ToggleSetting = ({ title, description, defaultEnabled }: any) => {
    const [enabled, setEnabled] = useState(defaultEnabled);
    return (
        <div className="flex items-center justify-between p-4 bg-white border border-border-main rounded-2xl hover:border-primary/30 transition-all">
            <div className="pr-10">
                <p className="text-sm font-bold text-text-main">{title}</p>
                <p className="text-[11px] text-text-muted italic">{description}</p>
            </div>
            <button 
                onClick={() => setEnabled(!enabled)}
                className={`w-12 h-6 rounded-full transition-all relative ${enabled ? 'bg-primary' : 'bg-slate-200'}`}
            >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${enabled ? 'left-7' : 'left-1'}`} />
            </button>
        </div>
    );
};

const IntegrationCard = ({ name, description, status, icon }: any) => (
    <div className="p-5 border border-border-main rounded-2xl bg-white flex flex-col gap-4 group hover:border-primary/40 transition-all">
        <div className="flex justify-between items-start">
            <div className="p-3 bg-slate-50 rounded-xl text-text-muted group-hover:bg-primary group-hover:text-white transition-all">
                {icon}
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                status === 'connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
            }`}>
                {status === 'connected' ? 'CONECTADO' : 'PENDENTE'}
            </span>
        </div>
        <div>
            <p className="text-sm font-bold text-text-main mb-1">{name}</p>
            <p className="text-[11px] text-text-muted leading-relaxed italic">{description}</p>
        </div>
        <button className="w-full py-2 bg-slate-50 text-[10px] font-bold text-text-muted hover:bg-slate-100 hover:text-text-main rounded-lg transition-colors border border-border-main/50 uppercase tracking-widest">
            {status === 'connected' ? 'Gerenciar' : 'Conectar Agora'}
        </button>
    </div>
);
