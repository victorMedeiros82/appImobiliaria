export interface Contract {
  id: string;
  tenant: string;
  property: string;
  fullAddress: string;
  zipCode: string;
  city: string;
  state: string;
  value: number;
  status: 'active' | 'expired' | 'terminated';
  paymentStatus: 'paid' | 'pending' | 'overdue';
  start: string;
  end: string;
  dueDate: string;
  rooms: string;
  area: string;
  garage: string;
  readjustmentIndex: 'IGP-M' | 'IPCA';
  nextInspection?: string;
  signatureStatus?: 'draft' | 'sent' | 'signed';
  signatureKey?: string;
  observations?: string;
}

export interface Payment {
  id: string;
  contractId: string;
  value: number;
  dueDate: string;
  paymentDate?: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface DashboardStats {
  monthlyRevenue: number;
  delinquencyRate: number; // Inadimplência
  expiringContractsCount: number;
}
