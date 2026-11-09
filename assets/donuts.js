/* ==========================================================
   Petidoci · desenho dos donuts (SVG gerado por código)
   donutTopo  -> vista de cima (caixa e painéis)
   donutLado  -> vista de lado (vitrine)
   ========================================================== */
const COBERTURAS = [
  { id: 'chiclete',  nome: 'Chiclete',  cor: '#E98FB0', conf: ['#ffffff', '#8F7CC4', '#7FC0DC'], linha: '#ffffff', texto: '#ffffff' },
  { id: 'ceu',       nome: 'Céu',       cor: '#6DB6D6', conf: ['#ffffff', '#F6C9DA', '#F2D860'], linha: '#ffffff', texto: '#ffffff' },
  { id: 'lavanda',   nome: 'Lavanda',   cor: '#9A86CF', conf: ['#ffffff', '#F6C9DA', '#B9DAE8'], linha: '#ffffff', texto: '#ffffff' },
  { id: 'cereja',    nome: 'Cereja',    cor: '#E5473F', conf: ['#ffffff', '#FFD2CF', '#F2D860'], linha: '#ffffff', texto: '#ffffff' },
  { id: 'pistache',  nome: 'Pistache',  cor: '#8CCB9F', conf: ['#ffffff', '#F6C9DA', '#F2D860'], linha: '#ffffff', texto: '#2c4a36' },
  { id: 'limao',     nome: 'Limão',     cor: '#F2D860', conf: ['#9A86CF', '#E98FB0', '#6DB6D6'], linha: '#E98FB0', texto: '#5b4a10' },
  { id: 'tangerina', nome: 'Tangerina', cor: '#F29B4B', conf: ['#ffffff', '#FFE7C2', '#8F7CC4'], linha: '#ffffff', texto: '#ffffff' },
  { id: 'baunilha',  nome: 'Baunilha',  cor: '#FBF4E8', conf: ['#E98FB0', '#6DB6D6', '#9A86CF', '#F2D860'], linha: '#E98FB0', texto: '#B5566A' }
];
const COR = Object.fromEntries(COBERTURAS.map(c => [c.id, c.cor]));
const nomeCobertura = id => (COBERTURAS.find(c => c.id === id) || COBERTURAS[0]).nome;

let _uid = 0;
const rng = s => () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;

function borda(cx, cy, R, rand, n = 96) {
  const a1 = rand() * 6.28, a2 = rand() * 6.28;
  let d = '';
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const r = R * (1 + 0.035 * Math.sin(5 * t + a1) + 0.02 * Math.sin(9 * t + a2));
    d += (i ? 'L' : 'M') + (cx + r * Math.cos(t)).toFixed(1) + ' ' + (cy + r * Math.sin(t)).toFixed(1);
  }
  return d + 'Z';
}

/* ---------- vista de cima ---------- */
function donutTopo({ g: glaze, f: finish = 'liso', s: seed = 1, t: text = '' }) {
  const c = COBERTURAS.find(x => x.id === glaze) || COBERTURAS[0];
  const rand = rng(seed * 7919 + 13);
  const id = 'd' + _uid++;
  const edge = borda(50, 50, 41, rand);
  let deco = '';

  if (finish === 'granulado') {
    for (let i = 0; i < 26; i++) {
      const a = rand() * Math.PI * 2, r = 21 + rand() * 17;
      const x = 50 + Math.cos(a) * r, y = 50 + Math.sin(a) * r;
      if (text && y < 52) continue;
      const col = c.conf[Math.floor(rand() * c.conf.length)];
      deco += `<rect x="${(x - 2.2).toFixed(1)}" y="${(y - 0.75).toFixed(1)}" width="4.4" height="1.5" rx=".75" fill="${col}" transform="rotate(${(rand() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }
  }
  if (finish === 'listras') {
    let linhas = '';
    for (let k = 0; k < 5; k++) linhas += `<path d="M-20 ${18 + k * 16} q15 -9 30 0 t30 0 t30 0 t30 0 t30 0"/>`;
    deco = `<g clip-path="url(#c${id})"><g transform="rotate(-24 50 50)" fill="none" stroke="${c.linha}" stroke-width="1.8" stroke-linecap="round" opacity=".92">${linhas}</g></g>`;
  }
  if (text) {
    deco += `<path id="p${id}" d="M21 50a29 29 0 1 1 58 0a29 29 0 1 1 -58 0" fill="none"/>
      <text font-size="11" font-weight="700" font-family="Hanken Grotesk,sans-serif" letter-spacing="1.5" fill="${c.texto}" text-anchor="middle"><textPath href="#p${id}" startOffset="25%">${text}</textPath></text>`;
  }

  return `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <defs>
      <mask id="m${id}"><rect width="100" height="100" fill="#fff"/><circle cx="50" cy="50" r="13.5" fill="#000"/></mask>
      <clipPath id="c${id}"><path d="${edge}"/></clipPath>
    </defs>
    <g mask="url(#m${id})">
      <circle cx="50" cy="50" r="46" fill="#D7A265"/>
      <circle cx="50" cy="50" r="45" fill="none" stroke="#C48E52" stroke-width="2"/>
      <path d="${edge}" fill="${c.cor}"/>
      ${deco}
      <circle cx="50" cy="50" r="17.5" fill="#D7A265"/>
      <path d="M21 39A30 30 0 0 1 44 20" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="3.2" stroke-linecap="round"/>
    </g>
  </svg>`;
}

/* ---------- vista de lado (grupo SVG, para compor cenas) ---------- */
function donutLado(cx, cy, esc, cor, deco, seed, rosto) {
  const c = COR[cor], rand = rng(seed * 97 + 5), id = 'g' + _uid++;
  const massa = '#C9915A', massaEsc = '#B27A45';
  let s = `<g transform="translate(${cx} ${cy}) scale(${esc})">`;
  if (rosto) s += `<circle cx="-36" cy="-18" r="9" fill="${c}"/><circle cx="36" cy="-18" r="9" fill="${c}"/>`;
  s += `<path d="M-54 2v12a54 28 0 0 0 108 0V2z" fill="${massaEsc}"/>`;
  s += `<ellipse cx="0" cy="2" rx="54" ry="28" fill="${massa}"/>`;
  s += `<ellipse cx="0" cy="-1" rx="52" ry="26" fill="${c}"/>`;
  for (let k = 0; k < 7; k++) {
    const x = -42 + k * 14 + rand() * 4, ex = x / 52;
    const y = -1 + 26 * Math.sqrt(Math.max(0, 1 - ex * ex)) - 4;
    s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="7" height="${(8 + rand() * 6).toFixed(1)}" rx="3.5" fill="${c}"/>`;
  }
  s += `<defs><clipPath id="${id}"><ellipse cx="0" cy="-1" rx="52" ry="26"/></clipPath></defs>`;
  if (deco === 'listras') {
    s += `<g clip-path="url(#${id})" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".9">` +
      [-14, -2, 10, 20].map(y => `<path d="M-60 ${y} q13 -8 26 0 t26 0 t26 0 t26 0 t26 0"/>`).join('') + '</g>';
  }
  if (deco === 'granulado' || deco === 'cereja' || deco === 'nome') {
    const cores = ['#fff', '#F6C9DA', '#F2D860', '#8F7CC4'];
    for (let k = 0; k < 20; k++) {
      const a = rand() * 6.283, f = 0.45 + rand() * 0.5;
      const x = Math.cos(a) * 50 * f, y = -1 + Math.sin(a) * 24 * f;
      if (Math.abs(x) < 20 && Math.abs(y + 2) < 9) continue;
      s += `<rect x="${(x - 2.5).toFixed(1)}" y="${(y - .8).toFixed(1)}" width="5" height="1.8" rx=".9" fill="${cores[k % 4]}" transform="rotate(${(rand() * 180).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }
  }
  s += `<ellipse cx="0" cy="-2" rx="18" ry="9" fill="${massa}"/><ellipse cx="0" cy="-1" rx="13.5" ry="6.2" fill="#4a2f22"/>`;
  s += `<path d="M-40 -8 q10 -18 34 -22" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="3.4" stroke-linecap="round"/>`;
  if (deco === 'cereja') {
    [[-9, -17], [11, -14]].forEach(([x, y]) => {
      s += `<path d="M${x} ${y} q4 -14 12 -18" fill="none" stroke="#3b6b3a" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="6" fill="#B3151F"/><circle cx="${x - 2}" cy="${y - 2}" r="1.6" fill="#fff" opacity=".7"/>`;
    });
  }
  if (deco === 'nome') {
    s += `<line x1="26" y1="-8" x2="26" y2="-46" stroke="#C9915A" stroke-width="2"/><path d="M26 -46h26l-6 7 6 7H26z" fill="#fff"/><text x="30" y="-37" font-size="8" font-weight="700" font-family="Hanken Grotesk,sans-serif" fill="${c}">Bia</text>`;
  }
  if (rosto) {
    s += `<circle cx="-12" cy="12" r="2.8" fill="#3B2622"/><circle cx="12" cy="12" r="2.8" fill="#3B2622"/><path d="M-6 17q6 5 12 0" fill="none" stroke="#3B2622" stroke-width="2" stroke-linecap="round"/>`;
  }
  return s + '</g>';
}

/* ---------- itens da vitrine ---------- */
const ITENS = [
  { id: 'cereja',    prat: 0, w: 230, r: -3, tipo: 'unico', cor: 'cereja',   deco: 'cereja',    nome: 'Cereja',                desc: 'Vermelho e rosa com cerejinhas.' },
  { id: 'nome',      prat: 0, w: 250, r: 2,  tipo: 'unico', cor: 'ceu',      deco: 'nome',      nome: 'Com o nome da festa',   desc: 'Cor, letras e o nome de quem faz aniversário.' },
  { id: 'torcida',   prat: 0, w: 220, r: -2, tipo: 'unico', cor: 'pistache', deco: 'listras',   nome: 'Torcida',               desc: 'Verde e amarelo para dias de jogo.' },
  { id: 'bichinhos', prat: 1, w: 220, r: 3,  tipo: 'rosto', cor: 'limao',    deco: 'granulado', nome: 'Bichinhos',             desc: 'Personagens e animais em cada donut.' },
  { id: 'torre',     prat: 1, w: 270, r: -2, tipo: 'torre',                                      nome: 'Torre de donuts',       desc: 'Um centro de mesa que também é sobremesa.' },
  { id: 'caixinha',  prat: 2, w: 230, r: 2,  tipo: 'caixa', cor: 'lavanda',  deco: 'granulado', nome: 'Caixinha de lembrança', desc: 'Para convidados, clientes e equipes.' },
  { id: 'mesa',      prat: 2, w: 280, r: -3, tipo: 'mesa',                                       nome: 'Mesa decorada',         desc: 'Vários donuts organizados para o evento.' }
];

function arteVitrine(it, i) {
  const svg = (w, h, corpo) => `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true" focusable="false">${corpo}</svg>`;
  if (it.tipo === 'torre') {
    return svg(180, 170,
      donutLado(90, 128, 1.1, 'chiclete', 'granulado', i + 1) +
      donutLado(90, 94, .92, 'baunilha', 'granulado', i + 2) +
      donutLado(90, 64, .74, 'ceu', 'listras', i + 3) +
      `<circle cx="90" cy="30" r="6" fill="#E98FB0"/>`);
  }
  if (it.tipo === 'caixa') {
    return svg(180, 140,
      donutLado(90, 46, 1, it.cor, it.deco, i + 1) +
      `<path d="M26 66h128l-8 62a6 6 0 0 1-6 5H40a6 6 0 0 1-6-5z" fill="#EBB7BC"/><rect x="22" y="58" width="136" height="14" rx="4" fill="#E2A3AA"/><circle cx="90" cy="102" r="3.5" fill="none" stroke="#fff" stroke-width="2"/>`);
  }
  if (it.tipo === 'mesa') {
    return svg(200, 150,
      `<rect x="96" y="104" width="8" height="30" fill="#E8DCCB"/><ellipse cx="100" cy="136" rx="30" ry="6" fill="#E8DCCB"/>` +
      `<ellipse cx="100" cy="104" rx="88" ry="14" fill="#FFF9F3"/><ellipse cx="100" cy="102" rx="88" ry="13" fill="#fff"/>` +
      donutLado(54, 90, .6, 'lavanda', 'granulado', i + 1) +
      donutLado(146, 90, .6, 'pistache', 'listras', i + 2) +
      donutLado(100, 74, .72, 'chiclete', 'granulado', i + 3));
  }
  return svg(160, 120, donutLado(80, 64, 1.3, it.cor, it.deco, i + 1, it.tipo === 'rosto'));
}

/* ---------- ocasiões (painéis) ---------- */
const OCASIOES = [
  { id: 'infantis', nome: 'Festas infantis', fundo: 'var(--ceu)', foto: '',
    texto: 'Nome, personagem e as cores da festa em cada mini donut.', tipoPedido: 'Aniversário infantil',
    art: [ { x: 4, y: 12, w: 54, g: 'ceu', f: 'granulado', t: 'Bia', r: -10 },
           { x: 46, y: 40, w: 46, g: 'chiclete', f: 'listras', r: 12 },
           { x: 10, y: 60, w: 36, g: 'limao', f: 'granulado', r: 0 } ] },
  { id: 'torres', nome: 'Torres de donuts', fundo: 'var(--pessego)', foto: '',
    texto: 'Um centro de mesa que também é sobremesa.', tipoPedido: 'Outra ocasião',
    art: [ { x: 6, y: 64, w: 28, g: 'tangerina', f: 'granulado', r: 0 },
           { x: 36, y: 64, w: 28, g: 'chiclete', f: 'liso', r: 8 },
           { x: 66, y: 64, w: 28, g: 'tangerina', f: 'listras', r: -6 },
           { x: 20, y: 42, w: 28, g: 'cereja', f: 'granulado', r: 4 },
           { x: 52, y: 42, w: 28, g: 'baunilha', f: 'granulado', r: -8 },
           { x: 36, y: 20, w: 28, g: 'chiclete', f: 'granulado', r: 0 } ] },
  { id: 'lembrancas', nome: 'Lembranças', fundo: 'var(--parede)', foto: '',
    texto: 'Caixinhas para agradecer convidados, clientes e equipes.', tipoPedido: 'Evento de empresa',
    art: [ { x: 14, y: 14, w: 50, g: 'baunilha', f: 'granulado', r: -8 },
           { x: 40, y: 46, w: 44, g: 'lavanda', f: 'liso', r: 10 },
           { x: 6, y: 58, w: 32, g: 'pistache', f: 'granulado', r: 0 } ] },
  { id: 'eventos', nome: 'Eventos', fundo: 'var(--biscoito-escuro)', foto: '',
    texto: 'Mesas fartas para aniversários, casamentos e chás.', tipoPedido: 'Casamento',
    art: [ { x: 4, y: 10, w: 40, g: 'cereja', f: 'listras', r: 0 },
           { x: 52, y: 14, w: 40, g: 'lavanda', f: 'granulado', r: 10 },
           { x: 20, y: 40, w: 40, g: 'chiclete', f: 'granulado', r: -6 },
           { x: 58, y: 52, w: 36, g: 'ceu', f: 'liso', r: 0 },
           { x: 4, y: 68, w: 30, g: 'limao', f: 'granulado', r: 0 } ] },
  { id: 'datas', nome: 'Datas especiais', fundo: 'var(--salvia)', foto: '',
    texto: 'Copa, Natal, Dia das Mães: sabores e cores da data.', tipoPedido: 'Outra ocasião',
    art: [ { x: 6, y: 14, w: 46, g: 'pistache', f: 'listras', r: -8 },
           { x: 46, y: 34, w: 46, g: 'limao', f: 'liso', r: 10 },
           { x: 12, y: 58, w: 40, g: 'ceu', f: 'granulado', r: 0 } ] }
];
