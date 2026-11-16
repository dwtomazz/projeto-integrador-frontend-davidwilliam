// js/script.js - Aulas 11 e 12: funções, DOM e eventos
// Padrão: evento -> atualiza os dados -> redesenha

const producoes = [
    { id: 1, titulo: "Vlog de viagem", categoria: "video", horas: 12, semanas: 3, favorita: false },
    { id: 2, titulo: "Curta-metragem autoral", categoria: "video", horas: 30, semanas: 4, favorita: false },
    { id: 3, titulo: "Site do portfólio", categoria: "web", horas: 20, semanas: 5, favorita: false },
    { id: 4, titulo: "Projeto de banco de dados", categoria: "academico", horas: 8, semanas: 4, favorita: false },
    { id: 5, titulo: "Edição de trilha sonora", categoria: "criativo", horas: 4, semanas: 2, favorita: false },
    { id: 6, titulo: "Animação de abertura", categoria: "criativo", horas: 15, semanas: 1, favorita: false },
];

const ROTULOS_RITMO = {
    leve: "Ritmo leve",
    moderado: "Ritmo moderado",
    intenso: "Ritmo intenso",
    maratona: "Maratona",
};

const ROTULOS_CATEGORIA = {
    video: "Vídeo",
    web: "Web",
    academico: "Acadêmico",
    criativo: "Criativo",
};

// ---------------------------------------------------------------
// Funções que calculam (puras: não mexem na página nem nos dados)
// ---------------------------------------------------------------

// Processa: quantas horas por semana a produção exigiu.
// "semanas" tem valor padrão 1, e a divisão por zero é evitada.
function calcularHorasPorSemana(horas, semanas = 1) {
    if (semanas <= 0) {
        return 0;
    }
    return Math.round((horas / semanas) * 10) / 10;
}

// Classifica: devolve a faixa. A ordem vai do menor limite ao maior.
function classificarRitmo(horasPorSemana) {
    if (horasPorSemana < 2.5) {
        return "leve";
    } else if (horasPorSemana < 5) {
        return "moderado";
    } else if (horasPorSemana < 10) {
        return "intenso";
    } else {
        return "maratona";
    }
}

// Formata: texto pronto para mostrar na página
function formatarHorasPorSemana(valor) {
    return (
        valor.toLocaleString("pt-BR", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }) + " h/semana"
    );
}

// map: cria uma NOVA lista com o resultado de cada item (sem alterar a original)
function analisarProducoes(lista) {
    return lista.map((item) => {
        const horasPorSemana = calcularHorasPorSemana(item.horas, item.semanas);
        return { ...item, horasPorSemana, ritmo: classificarRitmo(horasPorSemana) };
    });
}

// filter: só as produções em ritmo intenso ou maratona
function filtrarIntensas(lista) {
    return lista.filter((item) => item.ritmo === "intenso" || item.ritmo === "maratona");
}

// sort altera o array original, então ordenamos uma CÓPIA
function ordenarPorRitmo(lista) {
    return [...lista].sort((a, b) => b.horasPorSemana - a.horasPorSemana);
}

// Texto sem acento e em minúsculas, para a busca ignorar maiúsculas e acentos
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// Pura: calcula o resumo a partir dos dados (não escreve na página)
function calcularResumo(visiveis, todas) {
    const horas = visiveis.reduce((soma, item) => soma + item.horas, 0);
    const favoritas = todas.filter((item) => item.favorita).length;
    return { mostradas: visiveis.length, total: todas.length, horas, favoritas };
}

// ---------------------------------------------------------------
// Estado e referências da página
// ---------------------------------------------------------------
let proximoId = Math.max(...producoes.map((item) => item.id)) + 1;

const elListaProducoes = document.querySelector("#lista");
const elResumo = document.querySelector("#resumo");
const elBusca = document.querySelector("#busca");
const elFiltroCategoria = document.querySelector("#filtro-categoria");
const elPainel = document.querySelector("#painel-novo");
const elBotaoNovo = document.querySelector("#btn-novo");
const elFormNovo = document.querySelector("#form-novo");

// ---------------------------------------------------------------
// Dados -> tela (o padrão: evento -> atualiza dados -> redesenha)
// ---------------------------------------------------------------

// Cria UM item da lista. Nenhum texto do dado passa por innerHTML.
function criarItemLista(item) {
    const li = document.createElement("li");
    li.classList.add("item-lista", `ritmo-${item.ritmo}`);
    li.dataset.id = String(item.id);

    const info = document.createElement("div");
    info.classList.add("item-lista__info");

    const titulo = document.createElement("strong");
    titulo.textContent = item.titulo;

    const detalhes = document.createElement("span");
    detalhes.textContent =
        `${ROTULOS_CATEGORIA[item.categoria]} · ${item.horas} h em ${item.semanas} ` +
        `semana(s) · ${formatarHorasPorSemana(item.horasPorSemana)}`;

    const selo = document.createElement("span");
    selo.classList.add("selo");
    selo.textContent = ROTULOS_RITMO[item.ritmo];

    info.append(titulo, detalhes, selo);

    const acoes = document.createElement("div");
    acoes.classList.add("item-lista__acoes");

    const favoritar = document.createElement("button");
    favoritar.type = "button";
    favoritar.classList.add("botao-secundario");
    favoritar.dataset.acao = "favoritar";
    favoritar.textContent = "Favorita";
    favoritar.setAttribute("aria-pressed", String(item.favorita));

    const remover = document.createElement("button");
    remover.type = "button";
    remover.classList.add("botao-secundario");
    remover.dataset.acao = "remover";
    remover.textContent = "Remover";
    remover.setAttribute("aria-label", `Remover ${item.titulo}`);

    acoes.append(favoritar, remover);
    li.append(info, acoes);
    return li;
}

function criarMensagemVazia() {
    const li = document.createElement("li");
    li.classList.add("lista-vazia");
    li.textContent = "Nenhuma produção encontrada com esses filtros.";
    return li;
}

function obterVisiveis() {
    const termo = normalizarTexto(elBusca.value.trim());
    const categoria = elFiltroCategoria.value;

    return analisarProducoes(producoes).filter((item) => {
        const bateTitulo = normalizarTexto(item.titulo).includes(termo);
        const bateCategoria = categoria === "todas" || item.categoria === categoria;
        return bateTitulo && bateCategoria;
    });
}

function escreverResumo(resumo) {
    elResumo.textContent =
        `Mostrando ${resumo.mostradas} de ${resumo.total} produções · ` +
        `${resumo.horas} horas · ${resumo.favoritas} favorita(s)`;
}

// Lê os dados, aplica o filtro, substitui a lista e atualiza o resumo
function desenhar() {
    const visiveis = obterVisiveis();

    if (visiveis.length === 0) {
        elListaProducoes.replaceChildren(criarMensagemVazia());
    } else {
        elListaProducoes.replaceChildren(...visiveis.map(criarItemLista));
    }

    escreverResumo(calcularResumo(visiveis, producoes));
}

// ---------------------------------------------------------------
// Alterações nos dados
// ---------------------------------------------------------------
function alternarFavorita(id) {
    const item = producoes.find((p) => p.id === id);
    if (item) {
        item.favorita = !item.favorita;
    }
}

function removerProducao(id) {
    const indice = producoes.findIndex((p) => p.id === id);
    if (indice >= 0) {
        producoes.splice(indice, 1);
    }
}

// ---------------------------------------------------------------
// Ouvintes (funções nomeadas, cada um registrado UMA vez)
// ---------------------------------------------------------------

// Delegação: UM ouvinte na lista. closest acha o botão mesmo que o clique caia
// num filho dele; dataset diz de qual item é. Funciona para itens criados depois.
function tratarCliqueLista(evento) {
    const botao = evento.target.closest("button[data-acao]");
    if (botao === null) {
        return;
    }
    const li = botao.closest("li[data-id]");
    const id = Number(li.dataset.id);

    if (botao.dataset.acao === "favoritar") {
        alternarFavorita(id);
        desenhar();
        // desenhar() recria os botões: devolve o foco ao mesmo botão
        const novoBotao = elListaProducoes.querySelector(
            `li[data-id="${id}"] button[data-acao="favoritar"]`
        );
        if (novoBotao) {
            novoBotao.focus();
        }
    } else if (botao.dataset.acao === "remover") {
        removerProducao(id);
        desenhar();
        // O item sumiu: o foco vai para o primeiro botão da lista (ou para "Adicionar")
        const primeiro = elListaProducoes.querySelector("button");
        (primeiro || elBotaoNovo).focus();
    }
}

function definirPainelAberto(aberto) {
    elBotaoNovo.setAttribute("aria-expanded", String(aberto));
    elFormNovo.hidden = !aberto;
    if (aberto) {
        elFormNovo.querySelector("input").focus();
    }
}

function tratarCliqueBotaoNovo() {
    const aberto = elBotaoNovo.getAttribute("aria-expanded") === "true";
    definirPainelAberto(!aberto);
}

// Escape fecha o painel e devolve o foco ao botão que o abriu
function tratarTeclaPainel(evento) {
    if (evento.key === "Escape" && !elFormNovo.hidden) {
        definirPainelAberto(false);
        elBotaoNovo.focus();
    }
}

function tratarEnvioFormulario(evento) {
    evento.preventDefault();

    const dados = new FormData(elFormNovo);
    const titulo = String(dados.get("titulo")).trim();
    const horas = Number(dados.get("horas"));
    const semanas = Number(dados.get("semanas"));

    if (titulo === "" || !(horas > 0) || !(semanas > 0)) {
        return; // a validação nativa (required, min) já cobre quase tudo
    }

    const novo = {
        id: proximoId,
        titulo, // texto digitado: entra por textContent, nunca por innerHTML
        categoria: String(dados.get("categoria")),
        horas,
        semanas,
        favorita: false,
    };
    proximoId += 1;
    producoes.push(novo);

    elFormNovo.reset();
    elBusca.value = "";
    elFiltroCategoria.value = "todas";
    definirPainelAberto(false);
    desenhar();

    const botaoNovoItem = elListaProducoes.querySelector(
        `li[data-id="${novo.id}"] button[data-acao="favoritar"]`
    );
    if (botaoNovoItem) {
        botaoNovoItem.focus();
    }
}

// ---------------------------------------------------------------
// Inicialização: uma função iniciar...() por recurso
// ---------------------------------------------------------------
function iniciarLista() {
    elListaProducoes.addEventListener("click", tratarCliqueLista);
}

function iniciarPainel() {
    elBotaoNovo.addEventListener("click", tratarCliqueBotaoNovo);
    elPainel.addEventListener("keydown", tratarTeclaPainel);
    elFormNovo.addEventListener("submit", tratarEnvioFormulario);
}

function iniciarFiltros() {
    elBusca.addEventListener("input", desenhar);
    elFiltroCategoria.addEventListener("change", desenhar);
}

iniciarLista();
iniciarPainel();
iniciarFiltros();
desenhar(); // a página já nasce preenchida
