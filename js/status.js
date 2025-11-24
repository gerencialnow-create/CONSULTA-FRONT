document.addEventListener("DOMContentLoaded", () => {

    const API_BASE = "/api";
    const tbody = document.getElementById("status-body");

    // Badge de status (cores diferentes)
    function statusBadge(status) {
        const colors = {
            "PENDENTE": "#ffaa00",
            "EM ANDAMENTO": "#00aaff",
            "CONCLUÍDO": "#00cc66",
            "ERRO": "#ff4444"
        };

        const color = colors[status] || "#ffffff";
        return `<span class="status-badge" style="background:${color}">${status}</span>`;
    }

    // Barra de progresso
    function progressBar(value) {
        return `
            <div class="progress-container">
                <div class="progress-bar" style="width:${value}%;"></div>
            </div>
        `;
    }

    async function loadStatus() {
        tbody.innerHTML = `
            <tr><td colspan="6" class="loading">Carregando...</td></tr>
        `;

        try {
            const r = await fetch(`${API_BASE}/status`);
            const data = await r.json();

            if (!data.ok) {
                tbody.innerHTML = `
                    <tr><td colspan="6" class="error">Erro ao carregar status.</td></tr>
                `;
                return;
            }

            const jobs = data.jobs;

            if (jobs.length === 0) {
                tbody.innerHTML = `
                    <tr><td colspan="6" class="empty">Nenhuma higienização registrada.</td></tr>
                `;
                return;
            }

            tbody.innerHTML = jobs.map(job => `
                <tr>
                    <td>${job.file}</td>
                    <td>${job.bank}</td>
                    <td>${job.created_at}</td>
                    <td>${statusBadge(job.status)}</td>
                    <td>${progressBar(job.progress)}</td>
                    <td>
                        ${
                            job.can_download
                            ? `<a class="btn-download" href="/api/facta/download?file=${job.file}">Baixar</a>`
                            : `<span class="disabled-text">—</span>`
                        }
                    </td>
                </tr>
            `).join("");

        } catch (e) {
            console.error(e);
            tbody.innerHTML = `
                <tr><td colspan="6" class="error">Falha ao conectar ao servidor.</td></tr>
            `;
        }
    }

    // Carrega ao abrir a página
    loadStatus();

    // Atualiza automaticamente a cada 5s
    setInterval(loadStatus, 5000);
});
