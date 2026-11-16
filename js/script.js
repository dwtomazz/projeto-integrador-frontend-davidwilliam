// js/script.js - Aula 11: funções, arrays e DOM
// Padrão: processar -> classificar -> mostrar

const producoes = [
    { id: 1, titulo: "Vlog de viagem", categoria: "video", horas: 12, semanas: 3 },
    { id: 2, titulo: "Curta-metragem autoral", categoria: "video", horas: 30, semanas: 4 },
    { id: 3, titulo: "Site do portfólio", categoria: "web", horas: 20, semanas: 5 },
    { id: 4, titulo: "Projeto de banco de dados", categoria: "academico", horas: 8, semanas: 4 },
    { id: 5, titulo: "Edição de trilha sonora", categoria: "criativo", horas: 4, semanas: 2 },
    { id: 6, titulo: "Animação de abertura", categoria: "criativo", horas: 15, semanas: 1 },
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

// reduce: total de horas e média, numa única linha de resumo
function gerarResumo(lista) {
    if (lista.length === 0) {
        return "Nenhuma produção para resumir.";
    }
    const totalHoras = lista.reduce((soma, item) => soma + item.horas, 0);
    const media = totalHoras / lista.length;
    const intensas = filtrarIntensas(lista).length;
    return (
        `${lista.length} produções, ${totalHoras} horas no total ` +
        `(média de ${media.toFixed(1).replace(".", ",")} h por produção). ` +
        `Em ritmo intenso ou maratona: ${intensas}.`
    );
}

// ---------------------------------------------------------------
// Funções que mexem na página
// ---------------------------------------------------------------

// Cria o elemento de UM item (createElement + textContent, nada de innerHTML)
function criarItemResultado(item) {
    const artigo = document.createElement("article");
    artigo.classList.add("item-resultado", `ritmo-${item.ritmo}`);

    const titulo = document.createElement("h3");
    titulo.textContent = item.titulo;

    const detalhes = document.createElement("p");
    detalhes.textContent =
        `${ROTULOS_CATEGORIA[item.categoria]} · ${item.horas} h em ${item.semanas} ` +
        `semana(s) · ${formatarHorasPorSemana(item.horasPorSemana)}`;

    const selo = document.createElement("span");
    selo.classList.add("selo");
    selo.textContent = ROTULOS_RITMO[item.ritmo];

    artigo.append(titulo, detalhes, selo);
    return artigo;
}

function mostrarResultado(lista) {
    const area = document.querySelector("#resultado");
    if (area === null) {
        console.error("Área #resultado não encontrada no HTML.");
        return;
    }

    ordenarPorRitmo(lista).forEach((item) => {
        area.append(criarItemResultado(item));
    });

    const resumo = document.createElement("p");
    resumo.classList.add("resumo");
    resumo.textContent = gerarResumo(lista);
    area.append(resumo);
}

mostrarResultado(analisarProducoes(producoes));
