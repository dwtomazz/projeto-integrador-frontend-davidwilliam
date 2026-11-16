// js/main.js - scripts do portfólio

// ---------------------------------------------------------------
// Aula 4: descobrir qual formato de vídeo o navegador vai usar
// ---------------------------------------------------------------
(function () {
    const video = document.getElementById("video-portfolio");
    const aviso = document.getElementById("formato-video");
    if (!video || !aviso) return;

    // canPlayType devolve "probably", "maybe" ou "" (vazio = não reproduz)
    const webm = video.canPlayType('video/webm; codecs="vp9"');
    const mp4 = video.canPlayType('video/mp4; codecs="avc1.42E01E"');
    console.log("canPlayType WebM (VP9):", webm || "(vazio)");
    console.log("canPlayType MP4 (H.264):", mp4 || "(vazio)");

    // Mesma ordem dos <source> no HTML: o primeiro que funcionar é o usado.
    if (webm) {
        aviso.textContent = "Formato provável neste navegador: WebM.";
    } else if (mp4) {
        aviso.textContent = "Formato provável neste navegador: MP4.";
    } else {
        aviso.textContent = "Este navegador pode não reproduzir os formatos disponíveis.";
    }
})();

// ---------------------------------------------------------------
// Aula 5: gráfico de barras animado em <canvas>
// ---------------------------------------------------------------
(function () {
    const canvas = document.getElementById("grafico-producoes");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Valores de exemplo: troque pelos seus (e atualize o texto de fallback no HTML)
    const dados = [
        { rotulo: "Vídeos", valor: 5, cor: "#1d4ed8" },
        { rotulo: "Projetos web", valor: 3, cor: "#0891b2" },
        { rotulo: "Acadêmicos", valor: 4, cor: "#7c3aed" },
        { rotulo: "Criativos", valor: 2, cor: "#db2777" },
    ];

    const margem = { topo: 20, base: 40, esq: 30, dir: 10 };
    const larguraUtil = canvas.width - margem.esq - margem.dir;
    const alturaUtil = canvas.height - margem.topo - margem.base;
    const maximo = Math.max(...dados.map((d) => d.valor));
    const larguraBarra = larguraUtil / dados.length - 20;

    let progresso = 0; // 0 a 1

    function desenhar() {
        // clearRect a cada quadro: apaga o desenho anterior, senão os
        // quadros se acumulam uns sobre os outros (Erro 2 da teoria).
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Eixo base
        ctx.strokeStyle = "#94a3b8";
        ctx.beginPath();
        ctx.moveTo(margem.esq, margem.topo);
        ctx.lineTo(margem.esq, canvas.height - margem.base);
        ctx.lineTo(canvas.width - margem.dir, canvas.height - margem.base);
        ctx.stroke();

        dados.forEach((d, i) => {
            const altura = (d.valor / maximo) * alturaUtil * progresso;
            const x = margem.esq + 10 + i * (larguraUtil / dados.length);
            const y = canvas.height - margem.base - altura;

            ctx.fillStyle = d.cor;
            ctx.fillRect(x, y, larguraBarra, altura);

            ctx.fillStyle = "#1f2937";
            ctx.font = "13px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(d.rotulo, x + larguraBarra / 2, canvas.height - margem.base + 18);
            if (progresso === 1) {
                ctx.fillText(String(d.valor), x + larguraBarra / 2, y - 6);
            }
        });
    }

    function animar() {
        progresso = Math.min(progresso + 0.02, 1);
        desenhar();
        if (progresso < 1) {
            requestAnimationFrame(animar);
        }
    }

    requestAnimationFrame(animar);
})();
