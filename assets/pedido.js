/* ==========================================================
   Petidoci · estado do pedido
   Guarda a caixa montada, os itens da vitrine e os dados do
   formulário no navegador (localStorage), para que o cliente
   possa passar de uma página para outra sem perder nada.
   ========================================================== */
const TIPOS = ['Aniversário infantil', 'Aniversário adulto', 'Casamento', 'Chá de bebê ou revelação', 'Evento de empresa', 'Outra ocasião'];

const AMOSTRA = [
  ['chiclete','granulado'], ['ceu','granulado'], ['chiclete','listras'], ['lavanda','granulado'],
  ['ceu','liso'], ['cereja','granulado'], ['pistache','granulado'], ['chiclete','granulado'],
  ['limao','granulado'], ['ceu','listras'], ['tangerina','granulado'], ['lavanda','liso']
];

const Pedido = (() => {
  const KEY = 'petidoci-pedido-v1';
  const padrao = () => ({
    caixa: Array(CONFIG.lugares).fill(null),
    caixaTocada: false,           // vira true quando o cliente mexe na caixa
    incluirCaixa: false,
    lista: [],
    tipo: '', cores: ['chiclete'], convidados: '', qtd: '', tema: '', data: '', nome: '', obs: ''
  });

  let s = padrao();
  try { s = { ...s, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch (e) { /* sem armazenamento */ }
  if (!Array.isArray(s.caixa) || s.caixa.length !== CONFIG.lugares) s.caixa = Array(CONFIG.lugares).fill(null);

  const salvar = () => {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* ignora */ }
    document.dispatchEvent(new CustomEvent('pedido:mudou'));
  };

  const caixaGrupos = () => {
    const g = {};
    s.caixa.filter(Boolean).forEach(d => { const k = d.g + '|' + d.f; g[k] = (g[k] || 0) + 1; });
    return Object.entries(g).map(([k, n]) => { const [cor, f] = k.split('|'); return { cor, f, n }; });
  };
  const totalCaixa = () => s.caixa.filter(Boolean).length;
  const totalItens = () => s.lista.length + (s.caixaTocada ? 1 : 0);

  const mensagem = () => {
    const l = ['Olá! Vim pelo site e quero fazer uma encomenda de mini donuts.', ''];
    if (s.nome) l.push(`*Nome:* ${s.nome}`);
    l.push(`*Festa:* ${s.tipo || 'ainda não escolhi'}`);
    if (s.convidados) l.push(`*Convidados:* ${s.convidados}`);
    if (s.qtd) l.push(`*Quantidade de donuts:* ${s.qtd}`);
    if (s.cores.length) l.push(`*Cores:* ${s.cores.map(nomeCobertura).join(', ')}`);
    if (s.tema) l.push(`*Tema:* ${s.tema}`);
    if (s.data) l.push(`*Data:* ${s.data.split('-').reverse().join('/')}`);
    if (s.obs) l.push(`*Ideias:* ${s.obs}`);
    if (s.lista.length) {
      l.push('', '*Itens que escolhi na vitrine:*');
      s.lista.forEach(id => l.push(`- ${ITENS.find(i => i.id === id).nome}`));
    }
    if (s.incluirCaixa && totalCaixa()) {
      l.push('', `*Caixa que montei no site (${totalCaixa()} de ${CONFIG.lugares} lugares):*`);
      caixaGrupos().forEach(g => l.push(`- ${g.n} × ${nomeCobertura(g.cor)}, ${g.f}`));
    }
    return l.join('\n');
  };

  const link = texto => `https://wa.me/${CONFIG.whatsapp}` + (texto ? `?text=${encodeURIComponent(texto)}` : '');

  return { estado: s, salvar, caixaGrupos, totalCaixa, totalItens, mensagem, link };
})();
