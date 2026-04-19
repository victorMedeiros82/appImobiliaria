import React from 'react';

export const LGPDGuidelines = () => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-text-main mb-2">Documentos e Compliance LGPD</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LGPDBadge 
          title="AES-256 Encryption"
          desc="Armazenamento criptografado de vistorias e contratos em S3 Bucket privado com chaves gerenciadas via KMS."
          type="primary"
        />
        
        <LGPDBadge 
          title="Trilha de Auditoria"
          desc="Logs de acesso LGPD ativos para 14 usuários administradores. Rastreabilidade total de download e visualização."
          type="success"
        />
      </div>
    </div>
  );
};

const LGPDBadge = ({ title, desc, type }: { title: string; desc: string; type: 'primary' | 'success' }) => (
  <div className={`bg-slate-100 p-4 rounded-lg border-l-4 text-text-muted text-[13px] ${
    type === 'primary' ? 'border-primary' : 'border-success'
  }`}>
    <span className="block font-bold text-text-main mb-1">{title}</span>
    {desc}
  </div>
);
