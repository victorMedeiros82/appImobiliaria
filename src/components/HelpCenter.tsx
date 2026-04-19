import React, { useState } from 'react';
import { 
  Search, Book, MessageSquare, Phone, 
  ChevronDown, ExternalLink, HelpCircle, 
  FileText, Shield, Sparkles, MessageCircle,
  PlayCircle, LayoutDashboard, Users, DollarSign,
  BarChart3, CheckCircle2, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'contracts' | 'finance' | 'tenants' | 'general';
}

const FAQS: FAQItem[] = [
  {
    id: '1',
    category: 'contracts',
    question: 'Como funciona o reajuste automático?',
    answer: 'O sistema monitora anualmente a data de aniversário do contrato. 30 dias antes, ele consulta os índices IGP-M ou IPCA (conforme configurado) e sugere o novo valor. Você pode validar e aplicar em massa na seção de Gestão de Contratos.'
  },
  {
    id: '2',
    category: 'finance',
    question: 'Como integrar os pagamentos via PIX?',
    answer: 'Nossa Engine de Webhooks permite que você conecte seu banco. Assim que o pagamento cai na conta, o sistema recebe um aviso e dá baixa automática no contrato correspondente, mudando o status para "PAGAMENTO OK".'
  },
  {
    id: '3',
    category: 'tenants',
    question: 'O sistema é compatível com a LGPD?',
    answer: 'Sim! Todos os dados de inquilinos são tratados com criptografia. Na seção de Dashboard, você encontra as diretrizes de conformidade que o sistema segue para garantir a privacidade dos dados sensíveis.'
  },
  {
    id: '4',
    category: 'general',
    question: 'Como funciona a assinatura eletrônica?',
    answer: 'Utilizamos integração via Clicksign/DocuSign. Você gera o contrato em PDF, clica em "Enviar para Assinatura" e o inquilino recebe um link seguro por e-mail. Quando ele assina, o sistema é notificado via Webhook.'
  }
];

const TUTORIAL_STEPS = [
  {
    id: 'dashboard',
    title: 'Dashboard Geral',
    icon: <LayoutDashboard size={20} />,
    description: 'A página inicial centraliza as métricas críticas da sua imobiliária.',
    features: [
      'Visualização instantânea de receita mensal.',
      'Taxa de inadimplência calculada em tempo real.',
      'Alertas de contratos próximos ao vencimento.',
      'Guia de conformidade LGPD para proteção de dados.'
    ]
  },
  {
    id: 'tenants',
    title: 'Gestão de Inquilinos',
    icon: <Users size={20} />,
    description: 'Cadastre e gerencie inquilinos pessoas físicas ou jurídicas.',
    features: [
      'Formulários dinâmicos que se adaptam a PF e PJ.',
      'Busca inteligente por CNPJ ou CPF.',
      'Histórico completo de contratos por inquilino.',
      'Exportação de relatórios em PDF.'
    ]
  },
  {
    id: 'contracts',
    title: 'Contratos Integrados',
    icon: <FileText size={20} />,
    description: 'Crie contratos com validade jurídica em poucos segundos.',
    features: [
      'Geração automática de PDF profissional com cláusulas padrão.',
      'Assinatura eletrônica integrada (DocuSign/Clicksign).',
      'Campos de observações internas para controle.',
      'Status visuais para acompanhamento da jornada do contrato.'
    ]
  },
  {
    id: 'finance',
    title: 'Financeiro & Reajustes',
    icon: <DollarSign size={20} />,
    description: 'Controle o fluxo de caixa e os reajustes anuais.',
    features: [
      'Simulação de reajustes automáticos (IGP-M/IPCA).',
      'Controle de pagamentos por Webhook/PIX.',
      'Geração de recibos em um clique.',
      'Histórico de transações consolidado.'
    ]
  },
  {
    id: 'reports',
    title: 'Relatórios Analíticos',
    icon: <BarChart3 size={20} />,
    description: 'Transforme dados em decisões estratégicas para seu negócio.',
    features: [
      'Gráficos de tendências de faturamento mensal.',
      'Análise de ocupação de imóveis.',
      'Métricas de crescimento da carteira.',
      'Filtros por período customizado.'
    ]
  }
];

export const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'contracts' | 'finance' | 'tenants' | 'general'>('all');
  const [activeTutorialStep, setActiveTutorialStep] = useState(0);

  const filteredFaqs = FAQS.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-20">
      {/* Hero Section */}
      <section className="bg-primary rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl shadow-primary/20">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Como podemos ajudar?</h2>
            <p className="text-blue-100 text-lg max-w-md">
              Explore nossa base de conhecimento ou fale com um especialista AluguelFlow.
            </p>
            <div className="relative pt-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <input 
                type="text" 
                placeholder="Pesquise por cláusulas, boletos, vistorias..."
                className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl text-text-main shadow-lg focus:outline-none focus:ring-4 focus:ring-white/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 animate-pulse">
              <HelpCircle size={80} className="text-white" />
            </div>
          </div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
      </section>

      {/* Tutorial Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-primary rounded-xl">
            <PlayCircle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-main">Tutorial Interativo</h3>
            <p className="text-sm text-text-muted">Domine todas as ferramentas do AluguelFlow passo a passo.</p>
          </div>
        </div>

        <div className="bg-white border border-border-main rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[400px]">
          {/* Tutorial Tabs */}
          <div className="w-full md:w-72 bg-slate-50 border-r border-border-main p-4 space-y-2">
            {TUTORIAL_STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveTutorialStep(index)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left group ${
                  activeTutorialStep === index 
                    ? 'bg-white shadow-sm border border-border-main text-primary' 
                    : 'text-text-muted hover:bg-slate-100'
                }`}
              >
                <div className={`${activeTutorialStep === index ? 'text-primary' : 'text-slate-400 group-hover:text-text-main'} transition-colors`}>
                  {step.icon}
                </div>
                <span className="text-sm font-bold truncate">{step.title}</span>
                {activeTutorialStep === index && (
                  <ArrowRight size={14} className="ml-auto" />
                )}
              </button>
            ))}
          </div>

          {/* Tutorial Content */}
          <div className="flex-1 p-8 md:p-12 relative overflow-hidden bg-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={TUTORIAL_STEPS[activeTutorialStep].id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 relative z-10"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-primary rounded-full text-[10px] font-black tracking-widest uppercase">
                  Módulo {activeTutorialStep + 1}
                </div>
                <h4 className="text-2xl font-black text-text-main leading-tight">
                  {TUTORIAL_STEPS[activeTutorialStep].title}
                </h4>
                <p className="text-text-muted text-base leading-relaxed">
                  {TUTORIAL_STEPS[activeTutorialStep].description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {TUTORIAL_STEPS[activeTutorialStep].features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      <div className="mt-0.5 p-1 bg-emerald-50 text-emerald-500 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                        <CheckCircle2 size={12} />
                      </div>
                      <span className="text-sm text-text-main font-medium leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-8 flex items-center gap-4">
                  <button 
                    onClick={() => setActiveTutorialStep(prev => Math.min(prev + 1, TUTORIAL_STEPS.length - 1))}
                    disabled={activeTutorialStep === TUTORIAL_STEPS.length - 1}
                    className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2"
                  >
                    Próximo Passo
                    <ArrowRight size={16} />
                  </button>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    {activeTutorialStep + 1} de {TUTORIAL_STEPS.length}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Background Graphic */}
            <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-5 pointer-events-none scale-150 rotate-12">
              {React.cloneElement(TUTORIAL_STEPS[activeTutorialStep].icon, { size: 120 })}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main FAQ Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-text-main">Base de Conhecimento</h3>
            <div className="flex gap-2">
              {(['all', 'contracts', 'finance', 'tenants'] as const).map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeCategory === cat ? 'bg-primary text-white shadow-md' : 'bg-slate-100 text-text-muted hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'TUDO' : cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map(faq => (
                <div 
                  key={faq.id}
                  className="bg-white border border-border-main rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <button 
                    onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary border border-border-main">
                        <FileText size={18} />
                      </div>
                      <span className="font-bold text-text-main">{faq.question}</span>
                    </div>
                    <ChevronDown 
                      className={`text-text-muted transition-transform duration-300 ${expandedId === faq.id ? 'rotate-180' : ''}`} 
                      size={20} 
                    />
                  </button>
                  <AnimatePresence>
                    {expandedId === faq.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border-main bg-slate-50/50"
                      >
                        <div className="p-5 text-sm text-text-muted leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            ) : (
              <div className="p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-border-main">
                <Search size={40} className="mx-auto text-slate-300 mb-4" />
                <p className="text-text-muted font-medium">Nenhum resultado encontrado para sua pesquisa.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Quick Start Card */}
          <div className="bg-brand-card border border-border-main rounded-3xl p-6 shadow-sm relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <Sparkles className="text-amber-500 animate-pulse" size={24} />
                <h3 className="font-bold text-text-main">AluguelFlow AI</h3>
              </div>
              <p className="text-sm text-text-muted">
                Dúvidas complexas? Nossa IA entende seus contratos e ajuda com interpretações jurídicas.
              </p>
              <button 
                onClick={() => setIsChatOpen(true)}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} />
                Falar com IA
              </button>
            </div>
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all"></div>
          </div>

          {/* Support Channels */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest px-2">Suporte Direto</h3>
            <div className="grid grid-cols-1 gap-3">
              <SupportLink 
                icon={<MessageCircle size={20} className="text-emerald-500" />} 
                title="WhatsApp" 
                sub="Dúvidas Operacionais" 
                href="https://wa.me/5511000000000"
              />
              <SupportLink 
                icon={<Phone size={20} className="text-blue-500" />} 
                title="Telefone" 
                sub="Assuntos Críticos" 
                href="#"
              />
              <SupportLink 
                icon={<Shield size={20} className="text-purple-500" />} 
                title="Compliance" 
                sub="LGPD & Termos" 
                href="#"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Chatbox (Mock) */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-border-main z-[500] overflow-hidden"
          >
            <div className="bg-primary p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">AluguelFlow Assistant</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-success rounded-full animate-ping"></span>
                    <span className="text-[10px] font-medium text-blue-100">AI Ativa</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="h-80 p-4 bg-slate-50 flex flex-col justify-end gap-3 italic text-xs text-text-muted">
              <p>Olá! Sou o assistente inteligente especializado na plataforma. Como posso ajudar com seus contratos hoje?</p>
            </div>
            <div className="p-4 border-t border-border-main">
              <input 
                type="text" 
                placeholder="Digite sua dúvida..."
                className="w-full bg-slate-100 border border-border-main rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SupportLink = ({ icon, title, sub, href }: any) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-between p-4 bg-white border border-border-main rounded-2xl hover:border-primary/40 hover:bg-slate-50 transition-all group"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-border-main group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-text-main">{title}</p>
        <p className="text-[10px] text-text-muted">{sub}</p>
      </div>
    </div>
    <ExternalLink size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
  </a>
);

const X = ({ size, className }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);
