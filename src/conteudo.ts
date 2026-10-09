// Dados do negócio num lugar só. Preços: Notion → Wiki → Planos e preços.

export const WHATSAPP = '' // [PREENCHER] só dígitos, com DDI e DDD: 55DDXXXXXXXXX
export const WHATSAPP_MENSAGEM = 'Quero um site para o meu negócio'
export const VAGAS_FUNDADOR = 10

export const linkWhatsapp = () =>
  WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WHATSAPP_MENSAGEM)}` : '#contato'
