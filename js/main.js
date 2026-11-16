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
