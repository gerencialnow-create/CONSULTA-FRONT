document.addEventListener('DOMContentLoaded', () => {
    const API_BASE = '/api';

    const fileInput   = document.getElementById('file-input');
    const fileButton  = document.getElementById('file-button');
    const fileName    = document.getElementById('file-name');
    const uploadArea  = document.getElementById('upload-area');
    const modelButton = document.getElementById('model-button');
    const statusButton = document.getElementById('status-button');
    const sendButton  = document.getElementById('send-button');  // 🔹 botão de envio

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
            const response = await fetch(`${API_BASE}/facta/upload`, {
                method: "POST",
                body: formData
            });

            let resultText = await response.text();
            let result;

            try {
                result = JSON.parse(resultText);
            } catch {
                result = { raw: resultText };
            }

            if (response.ok) {
                alert("Arquivo enviado com sucesso! A higienização foi iniciada.");
                console.log(result);
            } else {
                alert("Erro no envio: " + (result.error || JSON.stringify(result)));
                console.error(result);
            }

        } catch (error) {
            alert("Erro ao conectar com o servidor.");
            console.error(error);
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
        alert("Aqui vai abrir a tela de acompanhamento da higienização.");
    });
});
