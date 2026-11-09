/* ==========================================================
   Petidoci · configuração do site
   É aqui que você troca número, endereço, links e fotos.
   ========================================================== */
const CONFIG = {
  whatsapp: '5562998610506',
  telefone: '(62) 99861-0506',
  instagram: 'https://www.instagram.com/petidoci',
  usuarioInstagram: '@petidoci',
  endereco: 'Rua 104, 415, Setor Sul, Goiânia',
  mapa: 'https://www.google.com/maps/search/?api=1&query=Rua+104,+415,+Setor+Sul,+Goi%C3%A2nia',

  lugares: 12,      // lugares da caixa montável
  maxCores: 3,      // cores que o cliente pode escolher no pedido

  // Para usar uma foto real, coloque o caminho. Exemplo: capa: 'imagens/capa.jpg'
  // Sem caminho, o espaço mostra o nome da foto que deve entrar ali.
  fotos: {
    capa: '', comeco: '', cores: '', vitrine: '', abertura: '', hoje: '',
    massa: '', cobertura: '', embalagem: ''
  }
};
