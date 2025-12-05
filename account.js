// account.js

document.addEventListener('DOMContentLoaded', () => {

    // 1️⃣ Carregar dados do usuário do backend
    fetch('php/account_backend.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getUserData' })
    })
    .then(res => res.json())
    .then(data => {
        if(data.sucesso) {
            document.getElementById('user-name').textContent = data.nome;
            document.getElementById('user-email').textContent = data.email;

            // Carregar histórico de pedidos
            const orderHistory = document.getElementById('orderHistory');
            orderHistory.innerHTML = '';
            data.pedidos.forEach(pedido => {
                const card = document.createElement('div');
                card.className = 'order-card';
                card.innerHTML = `
                    <h3>Pedido: ${pedido.id}</h3>
                    <p>Data: ${pedido.data}</p>
                    <p>Status: ${pedido.status}</p>
                    <p>Total: R$ ${pedido.total}</p>
                `;
                orderHistory.appendChild(card);
            });
        } else {
            alert('Erro ao carregar dados do usuário.');
        }
    })
    .catch(err => console.error('Erro:', err));

    // 2️⃣ Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        fetch('php/account_backend.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'logout' })
        })
        .then(() => {
            window.location.href = 'index.html';
        });
    });

    // 3️⃣ Botões de configuração
    document.getElementById('changePasswordBtn').addEventListener('click', () => alert('Funcionalidade de alterar senha'));
    document.getElementById('updateEmailBtn').addEventListener('click', () => alert('Funcionalidade de alterar e-mail'));
    document.getElementById('deleteAccountBtn').addEventListener('click', () => {
        if(confirm('Tem certeza que deseja excluir a conta?')) {
            fetch('php/account_backend.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'deleteAccount' })
            })
            .then(res => res.json())
            .then(data => {
                if(data.sucesso){
                    alert('Conta excluída.');
                    window.location.href = 'index.html';
                } else {
                    alert('Erro ao excluir a conta.');
                }
            });
        }
    });
});
