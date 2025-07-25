document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    const boardId = localStorage.getItem('selectedBoardId');
    const boardTitle = localStorage.getItem('selectedBoardTitle');
    if (!token || !boardId) { window.location.href = 'dashboard.html'; return; }

    const boardTitleEl = document.getElementById('board-title');
    const listsContainer = document.getElementById('lists-container');
    const logoutButton = document.getElementById('logout-button');
    const createListForm = document.getElementById('create-list-form');
    const listTitleInput = document.getElementById('list-title-input'); // Corregido

    boardTitleEl.textContent = boardTitle;
    logoutButton.addEventListener('click', () => { localStorage.clear(); window.location.href = 'index.html'; });

    const fetchBoardContent = async () => {
        try {
            const listsRes = await fetch(`http://localhost:5001/api/boards/${boardId}/lists`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!listsRes.ok) throw new Error('Error al cargar listas.');
            const lists = await listsRes.json();
            
            document.querySelectorAll('.list:not(.add-list-container)').forEach(el => el.remove());

            for (const list of lists) {
                const cardsRes = await fetch(`http://localhost:5001/api/lists/${list._id}/cards`, { headers: { 'Authorization': `Bearer ${token}` } });
                const cards = cardsRes.ok ? await cardsRes.json() : [];
                renderList(list, cards);
            }
        } catch (error) { console.error(error); }
    }

    function renderList(list, cards) {
        const listElement = document.createElement('div');
        listElement.className = 'list';
        let cardsHTML = '';
        cards.forEach(card => { cardsHTML += `<div class="card">${card.title}</div>`; });
        listElement.innerHTML = `
            <div class="list-header">${list.title}</div>
            <div class="cards-container">${cardsHTML}</div>
            <form class="add-card-form"><input type="text" class="add-card-input" placeholder="Añadir tarjeta..."><button type="submit">Añadir</button></form>
        `;
        listsContainer.insertBefore(listElement, listsContainer.querySelector('.add-list-container'));
        
        const addCardForm = listElement.querySelector('.add-card-form');
        addCardForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const cardTitleInput = addCardForm.querySelector('.add-card-input');
            const title = cardTitleInput.value.trim();
            if(!title) return;
            try {
                await fetch(`http://localhost:5001/api/lists/${list._id}/cards`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ title })
                });
                await fetchBoardContent();
            } catch (error) { console.error(error); }
        });
    }

    createListForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = listTitleInput.value.trim();
        if (!title) return;
        try {
            await fetch(`http://localhost:5001/api/boards/${boardId}/lists`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ title })
            });
            listTitleInput.value = '';
            await fetchBoardContent();
        } catch (error) { console.error("Error creando lista:", error); }
    });

    fetchBoardContent();
});