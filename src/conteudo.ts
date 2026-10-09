// Dados do negócio num lugar só. Preços: Notion → Wiki → Planos e preços.

export const WHATSAPP = '' // [PREENCHER] só dígitos, com DDI e DDD: 55DDXXXXXXXXX
export const WHATSAPP_MENSAGEM = 'Quero um site para o meu negócio'
export const VAGAS_FUNDADOR = 10

export const linkWhatsapp = (mensagem = WHATSAPP_MENSAGEM) =>
  WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}` : '#contato'

// Planos (Notion > Planos e preços). Fundador = −40%, só para os primeiros clientes.
export const PLANOS = [
  {
    nome: 'Essencial',
    tipo: 'Landing page',
    criacao: { tabela: 790, fundador: 474 },
    mensal: { tabela: 59, fundador: 39 },
    aPartirDe: false,
    prazo: 'Pronto em até 7 dias',
    itens: ['1 página', 'Botão de WhatsApp', 'Mapa e horários', 'Google Meu Negócio configurado'],
  },
  {
    nome: 'Profissional',
    tipo: 'Site institucional',
    criacao: { tabela: 1990, fundador: 1194 },
    mensal: { tabela: 99, fundador: 69 },
    aPartirDe: false,
    prazo: 'Pronto em até 21 dias',
    itens: ['De 3 a 6 páginas', 'Blog e novidades', 'Você edita o próprio conteúdo', 'SEO local'],
    destaque: true,
  },
  {
    nome: 'Sob medida',
    tipo: 'Com banco de dados',
    criacao: { tabela: 3500, fundador: 2100 },
    mensal: { tabela: 149, fundador: 99 },
    aPartirDe: true,
    prazo: 'Prazo combinado na conversa',
    itens: ['Agendamento', 'Cardápio com pedidos', 'Catálogo ou loja', 'Área do cliente'],
  },
] as const
