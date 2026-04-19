import { PDFBuilder } from '../lib/pdfBuilder';
import { Contract } from '../types';

export const generateContractPDF = (contract: Contract, tenantDetails: any) => {
  const builder = new PDFBuilder(`Contrato_${contract.tenant.replace(/\s+/g, '_')}.pdf`);

  // Header
  builder.addHeader('Instrumento Particular de', 'Contrato de Locação Residencial');

  // Parties
  builder.addSectionTitle('I. Das Partes');
  builder.addParagraph(
    `LOCADOR: ALUGUELFLOW PROPERTY MANAGEMENT LTDA, inscrita no CNPJ sob o nº 00.111.222/0001-99, com sede administrativa em São Paulo/SP, neste ato representada por seu departamento jurídico.`,
    9
  );
  builder.addParagraph(
    `LOCATÁRIO(A): ${contract.tenant}, inscrito(a) no CPF/CNPJ sob o nº ${tenantDetails?.document || 'NÃO INFORMADO'}, residente e domiciliado(a) atualmente através dos contatos: ${tenantDetails?.email || '-'} | ${tenantDetails?.phone || '-'}.`,
    9
  );

  // Object
  builder.addSectionTitle('II. Do Objeto');
  builder.addClause(
    'CLÁUSULA PRIMEIRA',
    `O objeto deste contrato é a locação do imóvel situado à ${contract.fullAddress}, na cidade de ${contract.city}/${contract.state}, composto por ${contract.rooms || '0'} quarto(s) e área total de ${contract.area || '0'}m², em perfeitas condições de uso e habitabilidade.`
  );

  // Prazos
  builder.addSectionTitle('III. Do Prazo e da Vigência');
  builder.addClause(
    'CLÁUSULA SEGUNDA',
    `O prazo de locação é determinado, com início em ${new Date(contract.start).toLocaleDateString('pt-BR')} e término em ${new Date(contract.end).toLocaleDateString('pt-BR')}. Ao final deste período, o LOCATÁRIO obriga-se a restituir o imóvel livre de pessoas e bens, e nas mesmas condições em que o recebeu.`
  );

  // Valores
  builder.addSectionTitle('IV. Do Aluguel e Reajuste');
  builder.addClause(
    'CLÁUSULA TERCEIRA',
    `O valor mensal do aluguel é de R$ ${contract.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, a ser pago impreterivelmente até o dia ${contract.dueDate} de cada mês. PARÁGRAFO ÚNICO: O valor do aluguel será reajustado anualmente com base na variação do índice ${contract.readjustmentIndex}, ou, na falta deste, pelo índice que legalmente o substitua.`
  );

  // General Clauses
  builder.addSectionTitle('V. Das Cláusulas Gerais e Obrigações');
  builder.addClause(
    'CLÁUSULA QUARTA - DOS ENCARGOS',
    'Além do aluguel, o LOCATÁRIO será responsável pelo pagamento de todas as taxas incidentes sobre o imóvel, incluindo IPTU, taxas de condomínio, consumo de energia elétrica, água e gás.'
  );
  builder.addClause(
    'CLÁUSULA QUINTA - DA DESTINAÇÃO',
    'O imóvel locado destina-se exclusivamente para fins residenciais do LOCATÁRIO e sua família, sendo vedada a sublocação, transferência ou empréstimo, no todo ou em parte, a terceiros.'
  );
  builder.addClause(
    'CLÁUSULA SEXTA - DA VISTORIA',
    `O LOCATÁRIO declara receber o imóvel em perfeitas condições. O LOCADOR reserva-se o direito de realizar vistorias periódicas, mediante aviso prévio, sendo a próxima inspeção prevista para ${contract.nextInspection ? new Date(contract.nextInspection).toLocaleDateString('pt-BR') : "data a definir"}.`
  );
  builder.addClause(
    'CLÁUSULA SÉTIMA - DAS BENFEITORIAS',
    'Qualquer modificação ou benfeitoria no imóvel dependerá de prévia e expressa autorização por escrito do LOCADOR. As benfeitorias realizadas aderem ao imóvel, não cabendo ao LOCATÁRIO qualquer direito de retenção ou indenização.'
  );
  builder.addClause(
    'CLÁUSULA OITAVA - DA MULTA RESCISÓRIA',
    'Em caso de rescisão antecipada motivada pelo LOCATÁRIO, este pagará ao LOCADOR multa equivalente a 3 (três) meses de aluguel vigente, pro rata tempore ao tempo restante de contrato.'
  );
  builder.addClause(
    'CLÁUSULA NONA - DO FORO',
    `As partes elegem o Foro da Comarca de ${contract.city}/${contract.state} para dirimir quaisquer controvérsias oriundas deste contrato, com renúncia expressa a qualquer outro.`
  );

  // Observations (New!)
  if (contract.observations) {
    builder.addSectionTitle('VI. Observações Adicionais');
    builder.addParagraph(contract.observations, 8);
  }

  // Signatures
  builder.addSignatureSession(
    { label: 'Locador', name: 'AluguelFlow Property Management' },
    { label: 'Locatário', name: contract.tenant }
  );

  // Finalize
  builder.addFooter('Documento autenticado via AluguelFlow Digital');
  builder.save(`Contrato_Oficial_${contract.tenant.replace(/\s+/g, '_')}.pdf`);
};
