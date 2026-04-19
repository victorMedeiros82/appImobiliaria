/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { LGPDGuidelines } from './components/LGPDGuidelines';
import { ContractManagement } from './components/ContractManagement';
import { TenantManagement } from './components/TenantManagement';
import { FinanceManagement } from './components/FinanceManagement';
import { SettingsManagement } from './components/SettingsManagement';
import { HelpCenter } from './components/HelpCenter';
import { ReportsDashboard } from './components/ReportsDashboard';
import { TenantModal } from './components/TenantModal';
import { LayoutDashboard, FileText, Users, DollarSign, Settings, Bell, X, CheckCircle, AlertCircle, Info, Search as SearchIcon, Command, User, Building2, Menu, HelpCircle, BarChart3 } from 'lucide-react';
import { AppProvider, useApp } from './AppContext';
import { AnimatePresence, motion } from 'motion/react';

type Tab = 'dashboard' | 'contracts' | 'tenants' | 'finance' | 'settings' | 'help' | 'reports';

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { notifications, removeNotification, tenants, contracts } = useApp();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-brand-bg relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Aside */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-sidebar-dark text-white p-6 flex flex-col gap-8 z-[160] transition-transform duration-300 transform
        lg:relative lg:translate-x-0 lg:w-60 lg:z-auto
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight text-white cursor-pointer" onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}>
            AluguelFlow
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 lg:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1">
          <ul className="flex flex-col gap-3">
            <NavItem 
              icon={<LayoutDashboard size={18} />} 
              label="Dashboard" 
              active={activeTab === 'dashboard'} 
              onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} 
            />
            <NavItem 
              icon={<FileText size={18} />} 
              label="Gerenciar Contratos" 
              active={activeTab === 'contracts'} 
              onClick={() => { setActiveTab('contracts'); setIsSidebarOpen(false); }} 
            />
            <NavItem 
              icon={<Users size={18} />} 
              label="Inquilinos" 
              active={activeTab === 'tenants'} 
              onClick={() => { setActiveTab('tenants'); setIsSidebarOpen(false); }} 
            />
            <NavItem 
              icon={<BarChart3 size={18} />} 
              label="Relatórios" 
              active={activeTab === 'reports'} 
              onClick={() => { setActiveTab('reports'); setIsSidebarOpen(false); }} 
            />
            <NavItem 
              icon={<DollarSign size={18} />} 
              label="Financeiro" 
              active={activeTab === 'finance'} 
              onClick={() => { setActiveTab('finance'); setIsSidebarOpen(false); }} 
            />
            <NavItem 
              icon={<Settings size={18} />} 
              label="Configurações" 
              active={activeTab === 'settings'} 
              onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} 
            />
            <NavItem 
              icon={<HelpCircle size={18} />} 
              label="Ajuda & FAQ" 
              active={activeTab === 'help'} 
              onClick={() => { setActiveTab('help'); setIsSidebarOpen(false); }} 
            />
          </ul>
        </nav>
        
        <div className="text-[11px] text-slate-400 mt-auto">
          v1.0.4 MVP • FullStack SaaS
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6 w-full prose-slate">
        <header className="flex justify-between items-center bg-white lg:bg-transparent p-4 lg:p-0 -mx-4 lg:mx-0 -mt-4 lg:mt-0 border-b lg:border-none border-border-main sticky top-0 lg:relative z-40 backdrop-blur-md lg:backdrop-blur-none bg-white/80">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-text-muted hover:bg-slate-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg md:text-2xl font-semibold text-text-main truncate">
              {activeTab === 'dashboard' ? 'Visão Geral' : 
               activeTab === 'contracts' ? 'Contratos' : 
               activeTab === 'tenants' ? 'Inquilinos' : 
               activeTab === 'reports' ? 'Relatórios Analíticos' :
               activeTab === 'finance' ? 'Financeiro' : 
               activeTab === 'settings' ? 'Configurações' : 'Central de Ajuda'}
            </h1>
          </div>
          <div className="text-xs text-text-muted hidden sm:block">Consultoria: PropTech Solutions</div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <Dashboard />
            <div className="mt-4">
              <LGPDGuidelines />
            </div>
          </div>
        )}

        {activeTab === 'contracts' && (
          <ContractManagement />
        )}

        {activeTab === 'tenants' && (
          <TenantManagement />
        )}

        {activeTab === 'finance' && (
          <FinanceManagement />
        )}

        {activeTab === 'reports' && (
          <ReportsDashboard />
        )}

        {activeTab === 'settings' && (
          <SettingsManagement />
        )}

        {activeTab === 'help' && (
          <HelpCenter />
        )}

        <TenantModal />

        {/* Command Palette */}
        <AnimatePresence>
          {isCommandPaletteOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCommandPaletteOpen(false)}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[250]"
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: -20, x: '-50%' }}
                animate={{ scale: 1, opacity: 1, y: 0, x: '-50%' }}
                exit={{ scale: 0.95, opacity: 0, y: -20, x: '-50%' }}
                className="fixed top-[20%] left-1/2 w-full max-w-xl bg-white rounded-3xl shadow-2xl z-[300] overflow-hidden border border-border-main"
              >
                <div className="p-4 border-b border-border-main flex items-center gap-4 bg-slate-50">
                  <SearchIcon size={20} className="text-slate-400" />
                  <input 
                    autoFocus
                    placeholder="Busca rápida (Inquilinos, Imóveis, Páginas...)" 
                    className="flex-1 bg-transparent border-none focus:outline-none text-base font-medium text-text-main"
                  />
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-border-main rounded-lg shadow-sm">
                    <span className="text-[10px] font-bold text-text-muted">ESC</span>
                  </div>
                </div>
                <div className="p-4 max-h-[400px] overflow-y-auto space-y-6">
                  <section className="space-y-2">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-2">Navegação</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <CommandOption icon={<LayoutDashboard size={14}/>} label="Dashboard" onClick={() => { setActiveTab('dashboard'); setIsCommandPaletteOpen(false); }} />
                      <CommandOption icon={<FileText size={14}/>} label="Contratos" onClick={() => { setActiveTab('contracts'); setIsCommandPaletteOpen(false); }} />
                      <CommandOption icon={<BarChart3 size={14}/>} label="Relatórios" onClick={() => { setActiveTab('reports'); setIsCommandPaletteOpen(false); }} />
                      <CommandOption icon={<Users size={14}/>} label="Inquilinos" onClick={() => { setActiveTab('tenants'); setIsCommandPaletteOpen(false); }} />
                      <CommandOption icon={<DollarSign size={14}/>} label="Financeiro" onClick={() => { setActiveTab('finance'); setIsCommandPaletteOpen(false); }} />
                      <CommandOption icon={<HelpCircle size={14}/>} label="Ajuda" onClick={() => { setActiveTab('help'); setIsCommandPaletteOpen(false); }} />
                    </div>
                  </section>
                  
                  <section className="space-y-2">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-2">Cadastros Recentes</h4>
                    <div className="space-y-1">
                      {tenants.slice(0, 3).map(t => (
                        <CommandListItem key={t.id} icon={<User size={14}/>} label={t.name} subText={`Inquilino • ${t.email}`} />
                      ))}
                      {contracts.slice(0, 2).map(c => (
                        <CommandListItem key={c.id} icon={<Building2 size={14}/>} label={c.property} subText={`Contrato de ${c.tenant}`} />
                      ))}
                    </div>
                  </section>
                </div>
                <div className="p-3 bg-slate-50 border-t border-border-main flex justify-between items-center px-6">
                  <p className="text-[10px] text-text-muted italic">Dica: Use as setas para navegar e Enter para selecionar.</p>
                  <Command size={14} className="text-slate-300" />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Global Toast Notifications */}
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3">
          <AnimatePresence>
            {notifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border min-w-[320px] ${
                  notif.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                  notif.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
                  notif.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                  'bg-slate-900 border-slate-700 text-white'
                }`}
              >
                <div className="shrink-0">
                  {notif.type === 'success' && <CheckCircle size={20} />}
                  {notif.type === 'error' && <AlertCircle size={20} />}
                  {notif.type === 'warning' && <AlertCircle size={20} />}
                  {notif.type === 'info' && <Info size={20} />}
                </div>
                <p className="text-sm font-bold flex-1">{notif.message}</p>
                <button 
                  onClick={() => removeNotification(notif.id)}
                  className="p-1 hover:bg-black/5 rounded-md transition-colors"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, active = false, onClick }: NavItemProps) {
  return (
    <li 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm cursor-pointer transition-all ${
        active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span>{label}</span>
    </li>
  );
}

function CommandOption({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-3 p-3 bg-white border border-border-main rounded-xl hover:border-primary/40 hover:bg-slate-50 transition-all text-left"
    >
      <div className="p-2 bg-slate-100 rounded-lg text-text-muted">
        {icon}
      </div>
      <span className="text-sm font-bold text-text-main">{label}</span>
    </button>
  );
}

interface CommandListItemProps {
  key?: React.Key;
  icon: React.ReactNode;
  label: string;
  subText: string;
}

function CommandListItem({ icon, label, subText }: CommandListItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group text-left">
      <div className="p-2 bg-blue-50 text-primary rounded-lg group-hover:bg-primary group-hover:text-white transition-all">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-text-main leading-tight">{label}</p>
        <p className="text-[10px] text-text-muted italic">{subText}</p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-bold text-slate-400">ENTER</kbd>
      </div>
    </div>
  );
}
