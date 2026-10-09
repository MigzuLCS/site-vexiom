// Caminho de um arquivo de public/ com o prefixo do GitHub Pages (vazio no dev e na raiz).
// Use para <img src>, ícones e url() em estilo inline: o Next não prefixa esses sozinho.
export const caminho = (arquivo: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${arquivo}`
