// js/dashboard.js - VERSIÓN ESTABLE
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (!token) { window.location.href = 'index.html'; return; }
    const workspacesList = document.getElementById('workspaces-list');
    const createWorkspaceForm = document.getElementById('create-workspace-form');
    const workspaceNameInput = document.getElementById('workspace-name');
    const createWorkspaceContainer = document.getElementById('create-workspace-container');

    function renderWorkspaces(workspaces) {
        workspacesList.innerHTML = '';
        if (workspaces.length === 0) {
            workspacesList.innerHTML = '<p>No tienes espacios de trabajo.</p>';
        } else {
            workspaces.forEach(ws => {
                const card = document.createElement('div');
                card.className = 'workspace-card';
                card.innerHTML = `<h3>${ws.name}</h3>`;
                card.addEventListener('click', () => {
                    localStorage.setItem('selectedWorkspaceId', ws._id);
                    localStorage.setItem('selectedWorkspaceName', ws.name);
                    window.location.href = 'workspace.html';
                });
                workspacesList.appendChild(card);
            });
        }
    }

    async function fetchAndRenderWorkspaces() {
        try {
            const res = await fetch('http://localhost:5001/api/workspaces', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error('Error al cargar');
            const workspaces = await res.json();
            renderWorkspaces(workspaces);
        } catch (error) { console.error(error); }
    }

    createWorkspaceForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = workspaceNameInput.value.trim();
        if (!name) return;
        try {
            await fetch('http://localhost:5001/api/workspaces', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name })
            });
            workspaceNameInput.value = '';
            createWorkspaceContainer.classList.add('hidden');
            await fetchAndRenderWorkspaces();
        } catch (error) { alert(error.message); }
    });

    document.getElementById('logout-button').addEventListener('click', () => { localStorage.clear(); window.location.href = 'index.html'; });
    document.getElementById('show-create-workspace-form-btn').addEventListener('click', () => createWorkspaceContainer.classList.remove('hidden'));
    document.getElementById('cancel-create-btn').addEventListener('click', () => createWorkspaceContainer.classList.add('hidden'));

    fetchAndRenderWorkspaces();
});