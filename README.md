# Nina Fisioterapia: site

Site institucional de página única (HTML + CSS + JS puro, sem build).
Basta subir a pasta inteira em qualquer hospedagem estática (Hostinger, Vercel, Netlify, GitHub Pages, cPanel).

```
site/
├── index.html      -> todo o conteúdo
├── styles.css      -> estilos (paleta tirada da logo)
├── script.js       -> menu, animações, carrossel, player, galeria
└── assets/
    ├── img/        -> logo, foto da Dra. Noemi, fotos da clínica, capas dos vídeos
    └── video/      -> 9 depoimentos em vídeo (~88 MB no total)
```

## Como testar localmente

```bash
cd site && python3 -m http.server 4173
```

Depois abra http://localhost:4173

---

## ⚠️ O que precisa ser preenchido antes de publicar

Todos os pontos estão marcados no código com o comentário `SUBSTITUIR`.
Busque por essa palavra no `index.html` para achar cada um.

| Onde | O que falta |
|---|---|
| Seção **Sobre** | Formação, CREFITO e anos de experiência da Dra. Noemi |
| **Hero** | `assets/img/hero-fisioterapia.jpg` é uma foto de banco de imagens, recortada de um print do Google Imagens. Confirmar a licença antes de publicar (comprar no banco de origem, usar um site de licença livre como Pexels/Unsplash, ou trocar por uma foto real de atendimento na clínica). Tem 864×486px, o que fica um pouco suave em tela retina. |
| **FAQ → "Onde fica a clínica?"** | Endereço completo + ponto de referência |
| **Rodapé → Horários** | Horários reais de atendimento (estão como `00h, 00h`) |
| **Rodapé → Contato** | E-mail, se houver |
| `JSON-LD` no `<head>` | Rua e número, para o Google entender a localização |

## Depoimentos em vídeo

São 9 vídeos, os mesmos criativos que já rodam no Meta Ads. Ficam em `assets/video/`,
com as capas (posters) em `assets/img/poster-*.jpg`.

O carrossel é infinito: o JavaScript clona o conjunto de cards antes e depois, e
salta a rolagem a largura de um bloco quando a pessoa passa do limite. Como os três
blocos são idênticos, o salto não aparece, e não existe começo nem fim visível.
O card que está no meio fica limpo; os das laterais ficam atrás de uma camada de vidro.

A mesma esteira roda na galeria de fotos da clínica (a função `montaEsteira` no
`script.js` serve as duas). A diferença é o parâmetro `limpos`: nos depoimentos 1 card
fica sem vidro, na galeria 3. Os cards das esteiras não podem ter a classe `reveal`,
senão as cópias nascem invisíveis, porque o observer de animação só enxerga os originais.

Nada de vídeo é baixado quando a página abre, só a capa, que tem ~50 KB.
O arquivo só começa a carregar quando a pessoa clica em play, e abre num player sobreposto.

| Vídeo | Duração | Peso |
|---|---|---|
| `depo-andreia.mp4`, dor na cervical, tórax e ombros | 1:18 | 15,8 MB |
| `depo-hernia-l4l5.mp4`, hérnia L4-L5, 4 sessões | 0:31 | 4,9 MB |
| `depo-casal.mp4`, casal atendido, hérnia de disco | 0:31 | 5,9 MB |
| `depo-lombar-1.mp4`, dor na lombar | 1:13 | 13,1 MB |
| `depo-carla.mp4`, Carla | 0:54 | 9,0 MB |
| `depo-lombar-2.mp4`, dor na lombar | 0:30 | 4,9 MB |
| `depo-bursite.mp4`, bursite no quadril | 1:01 | 10,8 MB |
| `depo-paciente-1.mp4`, depoimento de paciente | 0:59 | 10,7 MB |
| `depo-paciente-2.mp4`, paciente e acompanhante | 1:12 | 12,9 MB |

O da Andreia veio do Drive com 44 MB (1080×1920, master de edição) e foi recomprimido
para 720×1280, mesma qualidade na tela, três vezes mais leve. Os outros já vinham
prontos do Instagram e foram usados como estavam.

### Para trocar ou acrescentar um depoimento
1. Coloque o `.mp4` em `assets/video/`.
2. Gere uma capa (um print de um bom momento do vídeo, ~720px de largura, JPEG) em `assets/img/`.
3. Copie um bloco `<button class="reel" …>` no `index.html` e ajuste `data-video`,
   `data-titulo`, `data-sub`, o `src` da capa, o `alt` e a duração em `.reel-time`.

Peça sempre autorização de uso de imagem à paciente antes de publicar.

Dois dos vídeos ainda estão com legenda genérica ("Depoimento / Paciente da clínica"),
porque não há nada escrito na tela nem no nome do arquivo que diga a queixa. Procure por
`SUBSTITUIR` no `index.html` para achar os dois e trocar por nome e queixa reais.

### Sugestões de melhoria depois do lançamento
- Trocar as fotos da clínica por versões em alta resolução (as atuais têm 560×386px, foram extraídas do site antigo).
- A foto da Dra. Noemi (`assets/img/dra-noemi.png`) tem 720×782px. Funciona bem, mas em tela retina no desktop fica levemente suave, se ela tiver o arquivo original com ~1400px de largura, é só substituir mantendo o mesmo nome.
- Essa foto já vem com o fundo bege e o cartão verde embutidos na imagem. Se um dia sair uma versão com fundo transparente, dá para montar o cartão direto no CSS e ganhar nitidez.
- Converter as imagens para `.webp`, o carregamento fica bem mais rápido no 4G.
- Cadastrar o **Google Meu Negócio** e apontar o site para lá (a persona que pesquisa antes de decidir passa por ali).
- Trocar o link do WhatsApp por um número com CRM/bot, se a automação for implantada.

---

## Detalhes técnicos

- **Cores**: extraídas da logo, verde `#0F3D2E` e dourado `#CDA14A`. Todas em variáveis CSS no topo do `styles.css`.
- **Fontes**: Fraunces (títulos) + Inter (texto), carregadas do Google Fonts.
- **Conversão**: todos os CTAs levam para o WhatsApp `(51) 98132-4435` com mensagem pré-preenchida, cada botão manda um texto diferente, o que ajuda a saber de qual seção veio o lead.
- **SEO**: title, description, Open Graph e schema.org `Physiotherapy` já configurados.
- **Acessibilidade**: navegação por teclado, `skip link`, foco visível, textos alternativos e respeito a `prefers-reduced-motion`.
- **Ordem das seções**: hero, depoimentos em vídeo, tratamentos, como funciona, a clínica, sobre a Dra. Noemi, dúvidas e agende sua consulta. Os fundos alternam de propósito (verde escuro, creme, areia) para que duas seções vizinhas nunca tenham o mesmo tom.
- **Agende sua consulta**: mapa do Google embutido, botão de rota (o Google traça do ponto onde a pessoa está até a clínica), horários, telefone clicável e os botões de ligar e de WhatsApp, os dois no mesmo número.
- **Responsivo**: testado em 360px, 375px, 920px, 1030px, 1100px e 1440px. O menu vira gaveta abaixo de 1025px.
- **No celular** (abaixo de 620px) o layout muda de propósito: tratamentos, passos do método, galeria, números e rodapé ficam em 2 colunas, e os cards de tratamento aparecem compactos (ícone e título), abrindo o texto ao toque. Os depoimentos seguem em esteira horizontal. No desktop nada disso se aplica: os cards mostram o texto direto e a grade continua em 4 colunas.

### Se for usar Meta Ads apontando para o site
Adicione o **Pixel da Meta** antes de `</head>` no `index.html` e configure o evento
`Contact` no clique dos botões de WhatsApp, assim dá para otimizar campanha por conversão
no site, e não só por mensagem.
