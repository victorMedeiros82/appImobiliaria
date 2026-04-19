export const INITIAL_TENANTS = [
  { 
    id: '1', 
    name: 'João Silva', 
    email: 'joao.silva@email.com', 
    phone: '(11) 98765-4321', 
    document: '123.456.789-00', 
    type: 'Individual',
    status: 'active',
    contracts: 1,
    joinDate: '2024-01-10'
  },
  { 
    id: '2', 
    name: 'Oliveira & Associados LTDA', 
    tradeName: 'Portal Consultoria',
    email: 'comercial@portal.com.br', 
    phone: '(21) 3322-1100', 
    document: '98.765.432/0001-99', 
    stateRegistration: '123.456.789.000',
    legalRepresentative: 'Maria Oliveira',
    type: 'Corporate',
    status: 'active',
    contracts: 1,
    joinDate: '2023-11-20'
  },
  { 
    id: '3', 
    name: 'Roberto Siqueira', 
    email: 'roberto.siq@email.com', 
    phone: '(11) 97766-5544', 
    document: '321.654.987-11', 
    type: 'Individual',
    status: 'active',
    contracts: 1,
    joinDate: '2025-02-15'
  },
  { 
    id: '4', 
    name: 'Ana Paula Santos', 
    email: 'anapaula.s@email.com', 
    phone: '(41) 96655-4433', 
    document: '456.123.789-22', 
    type: 'Individual',
    status: 'inactive',
    contracts: 0,
    joinDate: '2022-03-01'
  },
  {
    id: '5',
    name: 'Carlos M.',
    email: 'carlos.m@email.com',
    phone: '(11) 95544-3322',
    document: '789.456.123-88',
    type: 'Individual',
    status: 'active',
    contracts: 1,
    joinDate: '2024-02-01'
  }
];

export const INITIAL_CONTRACTS = [
  { id: '1', tenant: 'João Silva', property: 'Apt 201 - Blo B', fullAddress: 'Rua das Flores, 123', zipCode: '04571-010', city: 'São Paulo', state: 'SP', value: 2500, status: 'active', paymentStatus: 'paid', start: '2024-01-10', end: '2025-01-10', dueDate: '10', rooms: '2', area: '65', garage: '1', readjustmentIndex: 'IGP-M', nextInspection: '2024-10-15', signatureStatus: 'signed', observations: 'Inquilino pontual. Vistoria de entrada sem ressalvas.' },
  { id: '2', tenant: 'Maria Oliveira', property: 'Casa 05 - Cond. Portal', fullAddress: 'Av. das Palmeiras, 500', zipCode: '22790-710', city: 'Rio de Janeiro', state: 'RJ', value: 3800, status: 'active', paymentStatus: 'pending', start: '2023-11-20', end: '2024-11-20', dueDate: '20', rooms: '3', area: '120', garage: '2', readjustmentIndex: 'IPCA', signatureStatus: 'sent', observations: 'Aguardando confirmação do fiador.' },
  { id: '3', tenant: 'Roberto Siqueira', property: 'Business Tower - S2', fullAddress: 'Rua Olimpíada, 205', zipCode: '04551-000', city: 'São Paulo', state: 'SP', value: 12400, status: 'active', paymentStatus: 'paid', start: '2025-02-15', end: '2026-02-15', dueDate: '15', rooms: '1', area: '45', garage: '1', readjustmentIndex: 'IGP-M', signatureStatus: 'draft', observations: 'Contrato comercial com carência de 2 meses.' },
  { id: '4', tenant: 'Ana Paula Santos', property: 'Ed. Horizon - 802', fullAddress: 'Rua do Sol, 88', zipCode: '80120-010', city: 'Curitiba', state: 'PR', value: 4200, status: 'expired', paymentStatus: 'overdue', start: '2022-03-01', end: '2023-03-01', dueDate: '05', rooms: '2', area: '78', garage: '1', readjustmentIndex: 'IPCA', signatureStatus: 'signed', observations: 'Processo de renovação em andamento.' },
  { id: '5', tenant: 'Carlos M.', property: 'Ed. Aurora - 402', fullAddress: 'Av. Paulista, 1000', zipCode: '01310-100', city: 'São Paulo', state: 'SP', value: 3200, status: 'active', paymentStatus: 'paid', start: '2025-05-04', end: '2026-05-04', dueDate: '01', rooms: '2', area: '85', garage: '1', readjustmentIndex: 'IGP-M', signatureStatus: 'draft', observations: 'Mudança prevista para o fim do mês.' },
];

export const INITIAL_TRANSACTIONS = [
  { id: 'TX-001', tenant: 'João Silva', unit: 'Apt 201 - Blo B', value: 2500, status: 'paid', date: '2024-04-10', method: 'PIX' },
  { id: 'TX-002', tenant: 'Maria Oliveira', unit: 'Casa 05 - Cond. Portal', value: 3800, status: 'pending', date: '2024-04-20', method: 'Boleto' },
  { id: 'TX-003', tenant: 'Roberto Siqueira', unit: 'Business Tower - S2', value: 12400, status: 'paid', date: '2024-04-15', method: 'Transferência' },
  { id: 'TX-004', tenant: 'Ana Paula Santos', unit: 'Ed. Horizon - 802', value: 4200, status: 'overdue', date: '2024-04-05', method: 'Cartão' },
  { id: 'TX-005', tenant: 'Carlos M.', unit: 'Ed. Aurora - 402', value: 3200, status: 'paid', date: '2024-04-08', method: 'PIX' },
  { id: 'TX-006', tenant: 'João Silva', unit: 'Apt 201 - Blo B', value: 2500, status: 'paid', date: '2024-03-10', method: 'PIX' },
  { id: 'TX-007', tenant: 'Maria Oliveira', unit: 'Casa 05 - Cond. Portal', value: 3800, status: 'paid', date: '2024-03-20', method: 'Boleto' },
  { id: 'TX-008', tenant: 'Carlos M.', unit: 'Ed. Aurora - 402', value: 3200, status: 'paid', date: '2024-03-08', method: 'PIX' },
  { id: 'TX-009', tenant: 'João Silva', unit: 'Apt 201 - Blo B', value: 2500, status: 'paid', date: '2024-02-10', method: 'PIX' },
  { id: 'TX-010', tenant: 'Roberto Siqueira', unit: 'Business Tower - S2', value: 12400, status: 'paid', date: '2024-02-15', method: 'Transferência' },
];
