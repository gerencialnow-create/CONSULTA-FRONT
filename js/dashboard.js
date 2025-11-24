document.addEventListener('DOMContentLoaded', () => {
    // Base da API – sempre via NGINX
    const API_BASE = '/api';

    const fileInput    = document.getElementById('file-input');
    const fileButton   = document.getElementById('file-button');
    const fileName     = document.getElementById('file-name');
    const uploadArea   = document.getElementById('upload-area');
    const modelButton  = document.getElementById('model-button');
    const statusButton = document.getElementById('status-button');
    const sendButton   = document.getElementById('send-button');  // botão de envio

    // ============================
    // Seleção do arquivo
    // ============================
    fileButton.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            fileName.textContent = fileInput.files[0].name;
        } else {
            fileName.textContent = 'Nenhum arquivo selecionado';
        }
    });

    // ============================
    // Drag & Drop
    // ============================
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, e => {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.add('upload-area-active');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, e => {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.classList.remove('upload-area-active');
        });
    });

    uploadArea.addEventListener('drop', e => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            fileName.textContent = files[0].name;
        }
    });

    // ==================================
    // ENVIO DO ARQUIVO PARA O BACKEND
    // ==================================
    sendButton.addEventListener('click', async () => {
        if (!fileInput.files.length) {
            alert("Selecione um arquivo primeiro!");
            return;
        }

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        try {
            console.log('[UPLOAD] Enviando para:', `${API_BASE}/facta/upload`);

            const response = await fetch(`${API_BASE}/facta/upload`, {
                method: "POST",
                body: formData
            });

            const rawText = await response.text();
            let result;

            try {
                result = JSON.parse(rawText);
            } catch {
                result = { raw: rawText };
            }

            console.log('[UPLOAD] Status:', response.status, 'Body:', result);

            if (response.ok && result.ok) {
                alert(
                    "Arquivo enviado com sucesso! A higienização foi iniciada.\n\n" +
                    "Você pode acompanhar o andamento em \"Acompanhar status da higienização\" " +
                    "no menu da esquerda."
                );
            } else {
                alert("Erro no envio: " + (result.error || JSON.stringify(result)));
            }

        } catch (error) {
            console.error('[UPLOAD] Erro de conexão:', error);
            alert("Erro ao conectar com o servidor.");
        }
    });

    // ============================
    // Botão "Baixar modelo"
    // ============================
    modelButton.addEventListener('click', () => {
        alert("Aqui vamos apontar para o arquivo modelo.");
    });

    // ============================
    // Botão "Acompanhar status"
    // ============================
    statusButton.addEventListener('click', () => {
        // Por enquanto só abre uma mensagem.
        // Depois vamos redirecionar para a tela/tabela de acompanhamento.
        alert("Em breve você poderá acompanhar aqui o status detalhado das higienizações.");
    });
});
