document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('file-input');
  const fileButton = document.getElementById('file-button');
  const fileName = document.getElementById('file-name');
  const uploadArea = document.getElementById('upload-area');
  const modelButton = document.getElementById('model-button');
  const statusButton = document.getElementById('status-button');

  // Botão escolhe arquivo
  fileButton.addEventListener('click', () => fileInput.click());

  // Mostra o nome do arquivo selecionado
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      fileName.textContent = fileInput.files[0].name;
    } else {
      fileName.textContent = 'Nenhum arquivo selecionado';
    }
  });

  // Drag & drop
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

  // Botão "baixar modelo padrão"
  modelButton.addEventListener('click', () => {
    // quando tiver o arquivo modelo, é só ajustar o caminho:
    // exemplo: 'modelos/modelo_clt_off_facta.xlsx'
    alert('Aqui vamos apontar para o arquivo modelo (xls/xlsx/csv).');
  });

  // Botão "acompanhar status"
  statusButton.addEventListener('click', () => {
    // depois vamos mandar para a página de acompanhamento
    alert('Aqui vai abrir a tela de acompanhamento do andamento da higienização.');
  });
});
