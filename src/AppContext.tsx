import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { INITIAL_TENANTS, INITIAL_CONTRACTS, INITIAL_TRANSACTIONS } from './constants';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  tenants: typeof INITIAL_TENANTS;
  contracts: typeof INITIAL_CONTRACTS;
  transactions: typeof INITIAL_TRANSACTIONS;
  addTenant: (tenant: any) => void;
  addContract: (contract: any) => void;
  removeContract: (id: string) => void;
  updateContract: (id: string, updates: any) => void;
  isTenantModalOpen: boolean;
  setIsTenantModalOpen: (open: boolean) => void;
  notifications: Notification[];
  addNotification: (message: string, type?: Notification['type']) => void;
  removeNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [tenants, setTenants] = useState(INITIAL_TENANTS);
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [notifiedExpirations, setNotifiedExpirations] = useState<Set<string>>(new Set());

  const addNotification = (message: string, type: Notification['type'] = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Automated Expiration Check
  useEffect(() => {
    const checkExpirations = () => {
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      contracts.forEach(contract => {
        if (contract.status === 'active' && !notifiedExpirations.has(contract.id)) {
          const endDate = new Date(contract.end);
          
          // If contract expires within the next 30 days and hasn't expired yet
          if (endDate >= today && endDate <= thirtyDaysFromNow) {
            addNotification(
              `Atenção: O contrato de ${contract.tenant} (${contract.property}) vence em ${Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} dias!`,
              'warning'
            );
            setNotifiedExpirations(prev => new Set(prev).add(contract.id));
          }
        }
      });
    };

    // Initial check and set up a check every hour (in case the app stays open)
    checkExpirations();
    const interval = setInterval(checkExpirations, 3600000); 
    
    return () => clearInterval(interval);
  }, [contracts, notifiedExpirations]);

  const addTenant = (tenant: any) => {
    setTenants(prev => [tenant, ...prev]);
    addNotification('Inquilino cadastrado com sucesso!', 'success');
  };

  const addContract = (contract: any) => {
    setContracts(prev => [contract, ...prev]);
    // Also create a "pending" transaction for this contract in the current month
    const currentMonth = new Date().toISOString().split('-').slice(0, 2).join('-');
    const newTx = {
      id: `TX-${Math.floor(Math.random() * 900) + 100}`,
      tenant: contract.tenant,
      unit: contract.property,
      value: contract.value,
      status: 'pending' as const,
      date: `${currentMonth}-${contract.dueDate.padStart(2, '0')}`,
      method: 'Boleto'
    };
    setTransactions(prev => [newTx, ...prev]);
    addNotification('Novo contrato gerado e integrado ao financeiro!', 'success');
  };

  const removeContract = (id: string) => {
    setContracts(prev => prev.filter(c => c.id !== id));
    addNotification('Contrato removido da carteira.', 'info');
  };

  const updateContract = (id: string, updates: any) => {
    setContracts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    addNotification('Contrato atualizado com sucesso.', 'success');
  };

  return (
    <AppContext.Provider value={{ 
      tenants, 
      contracts, 
      transactions, 
      addTenant, 
      addContract, 
      removeContract,
      updateContract,
      isTenantModalOpen,
      setIsTenantModalOpen,
      notifications,
      addNotification,
      removeNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
