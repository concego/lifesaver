const { ipcRenderer } = require('electron');

const campoTexto = document.getElementById('campo-texto');
const preview = document.getElementById('preview');

campoTexto.addEventListener('input', () => {
    preview.innerHTML = marked.parse(campoTexto.value);
});

function inserirTexto(template) {
    const inicio = campoTexto.selectionStart;
    const fim = campoTexto.selectionEnd;
    const textoOriginal = campoTexto.value;
    campoTexto.value = textoOriginal.substring(0, inicio) + template + textoOriginal.substring(fim);
    campoTexto.focus();
    campoTexto.dispatchEvent(new Event('input')); 
}

ipcRenderer.on('comando-menu', (event, acao) => {
    if (acao === 'salvar-txt') ipcRenderer.send('salvar-arquivo', { conteudo: campoTexto.value, extensao: 'txt' });
    else if (acao === 'salvar-md') ipcRenderer.send('salvar-arquivo', { conteudo: campoTexto.value, extensao: 'md' });
    else if (acao === 'pdf') window.print();
    else if (acao === 'link') {
        const url = prompt("Cole a URL:");
        if (url) inserirTexto(`[Link](${url})`);
    } 
    else if (acao === 'imagem') {
        const caminho = prompt("Caminho da imagem:");
        const alt = prompt("Descrição (Acessibilidade):");
        if (caminho) inserirTexto(`![${alt}](${caminho})`);
    }
    else if (acao === 'estatisticas') {
        const t = campoTexto.value;
        const carac = t.length;
        const pal = t.trim() === '' ? 0 : t.trim().split(/\s+/).length;
        const lin = t === '' ? 0 : t.split('\n').length;
        const pag = carac === 0 ? 0 : Math.ceil(carac / 1400);
        alert(`Estatísticas:\n\nPalavras: ${pal}\nCaracteres: ${carac}\nLinhas: ${lin}\nPáginas (Laudas): ${pag}`);
        campoTexto.focus();
    }
});