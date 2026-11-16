/*
 * logica.js - Aula 9: mini-analisador de dados do portfólio
 *
 * TEMA: portfólio pessoal. Cada item é uma produção (vídeo, projeto web,
 *       trabalho acadêmico ou experiência criativa).
 * ENTRADA: o mínimo de horas de produção para listar (prompt) e, depois,
 *          comandos digitados (uma categoria ou "sair").
 * PROCESSAMENTO: classificar cada produção pelo esforço, indicar o destino
 *          de cada categoria e resumir o conjunto.
 * SAÍDA: frases no console (template literal) e relatório com console.table.
 *
 * PSEUDOCÓDIGO:
 *   1. pedir o mínimo de horas e validar (cancelar, vazio, texto, faixa)
 *   2. para cada produção:
 *        classificar o esforço (rápida, média, longa ou maratona)
 *        somar as horas e guardar a maior produção
 *        se as horas forem >= mínimo, contar a produção
 *   3. mostrar o resumo (total, média, maior e quantidade)
 *   4. repetir: pedir uma categoria e listar seus itens, até digitar "sair"
 *
 * TESTE DE MESA (mínimo digitado = 10), três primeiras voltas do for...of:
 *   volta | produção                | horas | esforço  | contador | total | maior
 *   ------+-------------------------+-------+----------+----------+-------+-----------------------
 *     1   | Vlog de viagem          |  12   | média    |    1     |  12   | Vlog de viagem
 *     2   | Curta-metragem autoral  |  30   | maratona |    2     |  42   | Curta-metragem autoral
 *     3   | Site do portfólio       |  20   | longa    |    3     |  62   | Curta-metragem autoral
 */

(function () {
    "use strict";

    const producoes = [
        { titulo: "Vlog de viagem", categoria: "video", horas: 12 },
        { titulo: "Curta-metragem autoral", categoria: "video", horas: 30 },
        { titulo: "Site do portfólio", categoria: "web", horas: 20 },
        { titulo: "Projeto de banco de dados", categoria: "academico", horas: 8 },
        { titulo: "Edição de trilha sonora", categoria: "criativo", horas: 4 },
        { titulo: "Animação de abertura", categoria: "criativo", horas: 15 },
    ];

    // ---------- entrada com validação ----------
    function lerMinimoHoras() {
        const resposta = prompt("Listar produções a partir de quantas horas? (de 0 a 100)");

        if (resposta === null) {
            // Cancelar devolve null: não dá para chamar trim() nele
            alert("Análise cancelada.");
            return null;
        }

        const texto = resposta.trim();
        if (texto === "") {
            alert("Você não digitou nada.");
            return null;
        }

        const numero = Number(texto);
        if (Number.isNaN(numero)) {
            alert("Digite apenas números (use ponto para decimais).");
            return null;
        }

        if (numero < 0 || numero > 100) {
            alert("O valor precisa estar entre 0 e 100.");
            return null;
        }

        return numero;
    }

    // ---------- classificação com if / else if / else ----------
    // A ordem importa: do menor para o maior limite, senão tudo cairia na 1ª faixa.
    function classificarEsforco(horas) {
        if (horas < 5) {
            return "rápida";
        } else if (horas < 15) {
            return "média";
        } else if (horas < 30) {
            return "longa";
        } else {
            return "maratona";
        }
    }

    // ---------- switch sobre a categoria ----------
    function indicarDestino(categoria) {
        let destino;
        switch (categoria) {
            case "video":
                destino = "seção Vídeos e Produções";
                break;
            case "web":
                destino = "seção Meus Projetos";
                break;
            case "academico":
                destino = "lista de projetos acadêmicos";
                break;
            case "criativo":
                destino = "galeria de produções";
                break;
            default:
                destino = "sem destino definido";
        }
        return destino;
    }

    // ---------- laço de repetição: resumo ----------
    function analisar(minimo) {
        let contador = 0;      // padrão: contador
        let totalHoras = 0;    // padrão: acumulador
        let maior = producoes[0]; // padrão: máximo
        const relatorio = [];

        for (const item of producoes) {
            const esforco = classificarEsforco(item.horas);

            totalHoras += item.horas;
            if (item.horas > maior.horas) {
                maior = item;
            }
            if (item.horas >= minimo) {
                contador++;
            }

            relatorio.push({
                titulo: item.titulo,
                categoria: item.categoria,
                horas: item.horas,
                esforco: esforco,
                destino: indicarDestino(item.categoria),
            });
        }

        const media = totalHoras / producoes.length;
        return { contador, totalHoras, maior, media, relatorio };
    }

    // ---------- while: comandos até digitar "sair" ----------
    function lerComando() {
        const resposta = prompt(
            'Digite uma categoria (video, web, academico, criativo) ou "sair":'
        );
        // Cancelar (null) é tratado como "sair", para o laço sempre terminar
        return resposta === null ? "sair" : resposta.trim().toLowerCase();
    }

    function listarCategoria(categoria) {
        const itens = producoes.filter((item) => item.categoria === categoria);
        if (itens.length === 0) {
            console.log(`Nenhuma produção na categoria "${categoria}".`);
            return;
        }
        console.log(`Produções de "${categoria}":`);
        console.table(itens);
    }

    function iniciarAnalise() {
        const minimo = lerMinimoHoras();
        if (minimo === null) {
            return;
        }

        const resultado = analisar(minimo);

        console.log(`Produções com pelo menos ${minimo} horas: ${resultado.contador}`);
        console.log(`Total de horas produzidas: ${resultado.totalHoras}`);
        console.log(`Média por produção: ${resultado.media.toFixed(1)} horas`);
        console.log(
            `Maior produção: ${resultado.maior.titulo} (${resultado.maior.horas} horas)`
        );
        console.table(resultado.relatorio);

        let comando = lerComando();
        while (comando !== "sair") {
            listarCategoria(comando);
            comando = lerComando(); // atualiza a condição dentro do laço
        }
        console.log("Análise encerrada.");
    }

    const botao = document.getElementById("btn-analise");
    if (botao) {
        botao.addEventListener("click", iniciarAnalise);
    }
    // Também pode ser chamada pelo Console: iniciarAnalise()
    window.iniciarAnalise = iniciarAnalise;
})();
