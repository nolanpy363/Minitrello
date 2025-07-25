document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const workspaceId = localStorage.getItem('selectedWorkspaceId');
    const workspaceName = localStorage.getItem('selectedWorkspaceName');
    if (!token || !workspaceId) { window.location.href = 'dashboard.html'; return; }

    const workspaceTitleEl = document.getElementById('workspace-title');
    const boardsList = document.getElementById('boards-list');
    const createBoardForm = document.getElementById('create-board-form');
    const boardTitleInput = document.getElementById('board-title');
    const createBoardContainer = document.getElementById('create-board-container');

    workspaceTitleEl.textContent = `Espacio de Trabajo: ${workspaceName}`;

    async function fetchAndRenderBoards() {
        try {
            const res = await fetch(`http://localhost:5001/api/workspaces/${workspaceId}/boards`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error('Error al cargar');
            const boards = await res.json();
            boardsList.innerHTML = '';
            if (boards.length === 0) {
                boardsList.innerHTML = '<p>No hay tableros.</p>';
            } else {
                boards.forEach(board => {
                    const card = document.createElement('div');
                    card.className = 'board-card';
                    card.innerHTML = `<h3>${board.title}</h3>`;
                    card.addEventListener('click', () => {
                        localStorage.setItem('selectedBoardId', board._id);
                        localStorage.setItem('selectedBoardTitle', board.title);
                        window.location.href = 'board.html';
                    });
                    boardsList.appendChild(card);
                });
            }
        } catch (error) { console.error(error); }
    }

    createBoardForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = boardTitleInput.value.trim();
        if (!title) return;
        try {
            await fetch(`http://localhost:5001/api/workspaces/${workspaceId}/boards`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title })
            });
            boardTitleInput.value = '';
            createBoardContainer.classList.add('hidden');
            await fetchAndRenderBoards();
        } catch (error) { alert(error.message); }
    });

    document.getElementById('logout-button').addEventListener('click', () => { localStorage.clear(); window.location.href = 'index.html'; });
    document.getElementById('show-create-board-form-btn').addEventListener('click', () => createBoardContainer.classList.remove('hidden'));
    document.getElementById('cancel-create-board-btn').addEventListener('click', () => createBoardContainer.classList.add('hidden'));

    fetchAndRenderBoards();
});