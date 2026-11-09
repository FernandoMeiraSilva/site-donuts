/* ==========================================================
   Petidoci · comportamento das páginas
   Cada bloco só roda se o elemento existir na página, então o
   mesmo arquivo serve ao site de várias páginas e à página única.
   ========================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const estado = Pedido.estado;
const DESTINO = document.body.dataset.destino || 'encomendar.html';   // '#pedido' na página única
const reduzMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

function irParaPedido() {
  if (DESTINO.startsWith('#')) $(DESTINO).scrollIntoView({ behavior: reduzMovimento ? 'auto' : 'smooth' });
  else location.href = DESTINO;
}

/* ==========================================================
   Comum a todas as páginas
   ========================================================== */
function comum() {
  $$('[data-wa]').forEach(a => { a.href = Pedido.link('Olá! Vim pelo site da Petidoci.'); a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-ig]').forEach(a => { a.href = CONFIG.instagram; a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-map]').forEach(a => { a.href = CONFIG.mapa; a.target = '_blank'; a.rel = 'noopener'; });
  $$('[data-telefone]').forEach(e => e.textContent = CONFIG.telefone);
  $$('[data-usuario]').forEach(e => e.textContent = CONFIG.usuarioInstagram);
  $$('[data-endereco]').forEach(e => e.textContent = CONFIG.endereco);
  $$('[data-ano]').forEach(e => e.textContent = new Date().getFullYear());
  $$('[data-pedido]').forEach(a => a.addEventListener('click', e => {
    if (DESTINO.startsWith('#')) { e.preventDefault(); irParaPedido(); }
  }));

  // página atual no menu
  const atual = location.pathname.split('/').pop() || 'index.html';
  $$('.menu a').forEach(a => { if (a.getAttribute('href') === atual) a.setAttribute('aria-current', 'page'); });

  // menu no celular
  const btn = $('.menu-btn'), topo = $('.topo');
  if (btn) btn.addEventListener('click', () => {
    const aberto = topo.classList.toggle('aberto');
    btn.setAttribute('aria-expanded', aberto);
  });
  $$('.menu a').forEach(a => a.addEventListener('click', () => { topo.classList.remove('aberto'); if (btn) btn.setAttribute('aria-expanded', 'false'); }));

  // espaços de foto
  $$('figure.foto').forEach(f => {
    const src = CONFIG.fotos[f.dataset.foto];
    if (!src) return;
    const img = new Image();
    img.src = src; img.alt = f.dataset.alt || ''; img.loading = 'lazy';
    f.prepend(img); f.classList.add('com-imagem');
  });

  // mini cenas de vitrine: <div data-item="torre">
  $$('[data-item]').forEach(e => {
    const it = ITENS.find(i => i.id === e.dataset.item);
    if (it) e.innerHTML = arteVitrine(it, ITENS.indexOf(it) * 5);
  });

  barra();
}

/* barra fixa: resume o que o cliente já escolheu */
function barra() {
  const el = $('#barra');
  if (!el) return;
  const alvo = $('#pedido');
  let sobre = false;
  const mostrar = () => {
    const n = Pedido.totalItens();
    const naPaginaDoPedido = document.body.dataset.pagina === 'encomendar';
    el.hidden = n === 0 || naPaginaDoPedido;
    el.style.visibility = sobre ? 'hidden' : 'visible';
    $('#barraTexto').textContent = `${n} no pedido`;
  };
  if (alvo && DESTINO.startsWith('#')) {
    new IntersectionObserver(([e]) => { sobre = e.isIntersecting; mostrar(); }, { threshold: 0.2 }).observe(alvo);
  }
  document.addEventListener('pedido:mudou', mostrar);
  mostrar();
}

/* ==========================================================
   Caixa montável
   ========================================================== */
function caixa() {
  const tray = $('#tray');
  if (!tray) return;
  const sel = { cobertura: 'chiclete', acabamento: 'granulado' };
  const animar = !estado.caixaTocada;
  if (animar) AMOSTRA.forEach(([g, f], i) => { estado.caixa[i] = { g, f, s: i + 1 }; });

  const tocar = () => { estado.caixaTocada = true; estado.incluirCaixa = true; };
  const rotulo = (d, i) => d
    ? `Lugar ${i + 1}: ${nomeCobertura(d.g)} ${d.f}. Toque para trocar ou remover.`
    : `Lugar ${i + 1}, vazio. Toque para colocar um donut.`;

  function pintarLugar(i) {
    const d = estado.caixa[i], el = tray.children[i];
    el.classList.toggle('vazio', !d);
    el.innerHTML = d ? donutTopo(d) : '';
    el.setAttribute('aria-label', rotulo(d, i));
    return el;
  }
  function resumo() {
    const total = estado.caixa.filter(Boolean).length;
    $('#status').textContent = total ? `${total} de ${CONFIG.lugares} lugares preenchidos` : 'A caixa está vazia. Toque nos lugares para começar.';
    const grupos = {};
    estado.caixa.filter(Boolean).forEach(d => { const k = d.g + '|' + d.f; grupos[k] = (grupos[k] || 0) + 1; });
    $('#resumo').innerHTML = Object.entries(grupos).map(([k, n]) => {
      const [g, f] = k.split('|');
      return `<li><i style="--c:${COR[g]}"></i>${n} ${nomeCobertura(g)}, ${f}</li>`;
    }).join('');
  }
  function desenhar(comQueda) {
    tray.innerHTML = '';
    for (let i = 0; i < CONFIG.lugares; i++) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'lugar';
      b.addEventListener('click', () => {
        const atual = estado.caixa[i];
        const igual = atual && atual.g === sel.cobertura && atual.f === sel.acabamento;
        estado.caixa[i] = igual ? null : { g: sel.cobertura, f: sel.acabamento, s: Math.floor(Math.random() * 1e6) + 1 };
        tocar(); salvar();
        const el = pintarLugar(i);
        el.classList.remove('queda', 'pop'); void el.offsetWidth;
        if (estado.caixa[i]) el.classList.add('pop');
        resumo();
      });
      tray.appendChild(b);
      pintarLugar(i);
      if (comQueda && estado.caixa[i] && !reduzMovimento) {
        b.classList.add('queda');
        b.style.setProperty('--d', (0.25 + i * 0.07).toFixed(2) + 's');
      }
    }
    resumo();
  }
  const salvar = () => Pedido.salvar();

  // controles
  const caixaAmostras = $('#swatches');
  COBERTURAS.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'amostra';
    b.style.setProperty('--c', c.cor);
    b.setAttribute('aria-pressed', c.id === sel.cobertura);
    b.innerHTML = `<i></i>${c.nome}`;
    b.addEventListener('click', () => {
      sel.cobertura = c.id;
      $$('.amostra', caixaAmostras).forEach(x => x.setAttribute('aria-pressed', x === b));
    });
    caixaAmostras.appendChild(b);
  });
  $$('input[name="acab"]').forEach(r => r.addEventListener('change', () => { sel.acabamento = r.value; }));

  $('#mix').addEventListener('click', () => {
    estado.caixa = estado.caixa.map(() => ({ g: COBERTURAS[Math.floor(Math.random() * COBERTURAS.length)].id, f: sel.acabamento, s: Math.floor(Math.random() * 1e6) + 1 }));
    tocar(); salvar(); desenhar(false);
  });
  $('#fill').addEventListener('click', () => {
    estado.caixa = estado.caixa.map(d => d || { g: sel.cobertura, f: sel.acabamento, s: Math.floor(Math.random() * 1e6) + 1 });
    tocar(); salvar(); desenhar(false);
  });
  $('#clear').addEventListener('click', () => {
    estado.caixa = Array(CONFIG.lugares).fill(null);
    tocar(); salvar(); desenhar(false);
  });
  $('#sendBox').addEventListener('click', () => { tocar(); salvar(); irParaPedido(); });

  desenhar(animar);
}

/* ==========================================================
   Vitrine (prateleiras com etiquetas)
   ========================================================== */
function vitrine() {
  const alvo = $('#prateleiras');
  if (!alvo) return;
  const SUPORTE = `<svg viewBox="0 0 50 56" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" aria-hidden="true"><path d="M4 0v54M4 48C4 28 26 16 46 12"/><circle cx="46" cy="12" r="2.5" fill="currentColor"/></svg>`;

  for (let p = 0; p < 3; p++) {
    const prat = document.createElement('div');
    prat.className = 'prateleira';
    const fila = document.createElement('div');
    fila.className = 'fila' + (p === 1 ? ' deslocada' : '');
    ITENS.filter(i => i.prat === p).forEach(it => {
      const el = document.createElement('div');
      el.className = 'item';
      el.style.setProperty('--w', it.w + 'px');
      el.innerHTML = `<div class="arte">${arteVitrine(it, ITENS.indexOf(it) * 5)}</div>
        <span class="etiqueta" style="--r:${it.r}deg">
          <button type="button" class="tag" data-id="${it.id}" aria-pressed="false"><b>${it.nome}</b><span>${it.desc}</span><em>Adicionar ao pedido</em></button>
        </span>`;
      fila.appendChild(el);
    });
    if (p === 2) {
      const nota = document.createElement('div');
      nota.className = 'nota';
      nota.innerHTML = `<h3>Não achou o seu?</h3><p>Nada aqui é de prateleira: cada encomenda é feita sob medida. Descreva a sua ideia no pedido.</p>`;
      fila.appendChild(nota);
    }
    prat.appendChild(fila);
    prat.insertAdjacentHTML('beforeend', `<div class="tabua"></div><span class="mao e">${SUPORTE}</span><span class="mao d">${SUPORTE}</span>`);
    alvo.appendChild(prat);
  }

  const pintar = () => $$('.tag', alvo).forEach(b => {
    const on = estado.lista.includes(b.dataset.id);
    b.setAttribute('aria-pressed', on);
    $('em', b).textContent = on ? 'No pedido' : 'Adicionar ao pedido';
  });
  alvo.addEventListener('click', e => {
    const b = e.target.closest('.tag');
    if (!b) return;
    const id = b.dataset.id;
    estado.lista = estado.lista.includes(id) ? estado.lista.filter(x => x !== id) : [...estado.lista, id];
    Pedido.salvar();
  });
  document.addEventListener('pedido:mudou', pintar);
  pintar();
}

/* ==========================================================
   Ocasiões (painéis que expandem)
   ========================================================== */
function ocasioes() {
  const wrap = $('#panels');
  if (!wrap) return;
  OCASIOES.forEach((o, i) => {
    const p = document.createElement('div');
    p.className = 'painel' + (i === 0 ? ' aberto' : '');
    p.style.setProperty('--bg', o.fundo);
    const arte = o.foto
      ? `<img src="${o.foto}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">`
      : o.art.map((d, k) => `<span style="position:absolute;left:${d.x}%;top:${d.y}%;width:${d.w}%;transform:rotate(${d.r || 0}deg);filter:drop-shadow(0 10px 8px rgba(58,36,32,.22))">${donutTopo({ g: d.g, f: d.f, s: i * 10 + k + 3, t: d.t || '' })}</span>`).join('');
    p.innerHTML = `
      <button type="button" class="painel-toggle" aria-expanded="${i === 0}" aria-label="${o.nome}"><span class="v-titulo">${o.nome}</span></button>
      <div class="arte-painel" aria-hidden="true">${arte}</div>
      <div class="painel-corpo"><h3>${o.nome}</h3><p>${o.texto}</p><button type="button" class="botao escolher">Pedir para esta ocasião</button></div>`;
    $('.painel-toggle', p).addEventListener('click', () => $$('.painel', wrap).forEach((q, k) => {
      q.classList.toggle('aberto', k === i);
      $('.painel-toggle', q).setAttribute('aria-expanded', k === i);
    }));
    $('.escolher', p).addEventListener('click', () => {
      estado.tipo = o.tipoPedido;
      if (!estado.tema) estado.tema = o.nome;
      Pedido.salvar();
      irParaPedido();
    });
    wrap.appendChild(p);
  });
}

/* ==========================================================
   Pedido em quatro passos
   ========================================================== */
function pedido() {
  const form = $('#assistente');
  if (!form) return;
  const passos = $$('.passo', form);
  let atual = 0;

  // campos simples <-> estado
  ['convidados', 'qtd', 'tema', 'data', 'nome', 'obs'].forEach(id => {
    const el = $('#' + id);
    el.value = estado[id] || '';
    el.addEventListener('input', () => { estado[id] = el.value.trim(); Pedido.salvar(); });
  });

  $('#tipos').innerHTML = TIPOS.map(t => `<label class="opcao"><input type="radio" name="tipo" value="${t}" ${estado.tipo === t ? 'checked' : ''}><span>${t}</span></label>`).join('');
  $('#tipos').addEventListener('change', e => { estado.tipo = e.target.value; erro(''); Pedido.salvar(); });

  $('#cores').innerHTML = COBERTURAS.map(c => `<label class="cor"><input type="checkbox" value="${c.id}" ${estado.cores.includes(c.id) ? 'checked' : ''}><i style="--c:${c.cor}"></i><span>${c.nome}</span></label>`).join('');
  $('#cores').addEventListener('change', e => {
    const marcadas = $$('#cores input:checked').map(i => i.value);
    if (marcadas.length > CONFIG.maxCores) {
      e.target.checked = false;
      erro(`Escolha até ${CONFIG.maxCores} cores. Desmarque uma para trocar.`);
      return;
    }
    erro('');
    estado.cores = marcadas;
    Pedido.salvar();
  });

  $$('[data-conv]').forEach(b => b.addEventListener('click', () => {
    const i = $('#convidados');
    i.value = Math.max(1, (parseInt(i.value, 10) || 0) + parseInt(b.dataset.conv, 10));
    estado.convidados = i.value; Pedido.salvar();
  }));

  const erro = t => { $('#erro').textContent = t; };

  function desenharPrevia() {
    const cores = estado.cores.length ? estado.cores : ['chiclete'];
    $('#previaCores').innerHTML = cores.map((id, i) => `<span style="transform:rotate(${[-8, 7, -3][i] || 0}deg)">${donutTopo({ g: id, f: 'granulado', s: i + 4 })}</span>`).join('');
  }

  function desenharResumo() {
    const caixaOk = estado.caixaTocada && Pedido.totalCaixa() > 0;
    const itens = estado.lista.map(id => ITENS.find(i => i.id === id));
    let html = '';
    if (caixaOk) {
      html += `<label class="check"><input type="checkbox" id="incluirCaixa" ${estado.incluirCaixa ? 'checked' : ''}> Incluir a caixa que montei (${Pedido.totalCaixa()} de ${CONFIG.lugares} lugares)</label>`;
    }
    if (itens.length) {
      html += `<ul class="lista-itens">${itens.map(i => `<li><span>${i.nome}</span><button type="button" class="link" data-tirar="${i.id}" aria-label="Tirar ${i.nome} do pedido">Tirar</button></li>`).join('')}</ul>`;
    }
    if (!caixaOk && !itens.length) {
      html = `<p class="vazio">Você ainda não montou a caixa nem escolheu itens na vitrine. Tudo bem: conte a sua ideia no campo acima.</p>`;
    }
    $('#junto').innerHTML = html;
    const chk = $('#incluirCaixa');
    if (chk) chk.addEventListener('change', () => { estado.incluirCaixa = chk.checked; Pedido.salvar(); });
    $$('[data-tirar]').forEach(b => b.addEventListener('click', () => { estado.lista = estado.lista.filter(x => x !== b.dataset.tirar); Pedido.salvar(); }));
    $('#previa').textContent = Pedido.mensagem();
  }

  function ir(n) {
    atual = n;
    passos.forEach((p, i) => { p.hidden = i !== n; });
    $$('#progresso li').forEach((li, i) => {
      li.classList.toggle('concluido', i < n); li.classList.toggle('atual', i === n);
      if (i === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    $('#voltar').hidden = n === 0;
    $('#avancar').hidden = n === passos.length - 1;
    $('#enviar').hidden = n !== passos.length - 1;
    erro('');
    desenharPrevia(); desenharResumo();
    const leg = $('legend', passos[n]);
    if (leg && n > 0) leg.focus({ preventScroll: true });
  }

  $('#avancar').addEventListener('click', () => {
    if (atual === 0 && !estado.tipo) return erro('Escolha o tipo de festa para continuar.');
    if (atual === 1 && !(parseInt($('#convidados').value, 10) > 0)) return erro('Informe quantas pessoas vêm, mesmo que seja uma estimativa.');
    if (atual === 2 && estado.cores.length === 0) return erro('Escolha pelo menos uma cor.');
    ir(atual + 1);
  });
  $('#voltar').addEventListener('click', () => ir(atual - 1));
  form.addEventListener('submit', e => { e.preventDefault(); window.open(Pedido.link(Pedido.mensagem()), '_blank', 'noopener'); });

  document.addEventListener('pedido:mudou', () => { desenharPrevia(); desenharResumo(); });
  // se o cliente já escolheu a festa em outra página, começa pelo passo seguinte
  ir(estado.tipo ? 1 : 0);
}

/* ==========================================================
   Início
   ========================================================== */
comum();
caixa();
vitrine();
ocasioes();
pedido();
