document.addEventListener('DOMContentLoaded', () => {
            const viewOrdersBtn = document.getElementById('view-orders-btn');
            const ordersSection = document.getElementById('orders-section');
            const ordersList = document.getElementById('orders-list');
            const closeOrdersBtn = document.getElementById('close-orders');
            const notification = document.getElementById('notification');

            // Função para formatar moeda brasileira
            function formatCurrency(value) {
                return 'R$ ' + parseFloat(value).toFixed(2).replace('.', ',');
            }

            // Função para mostrar notificação
            function showNotification(message, type = '') {
                notification.textContent = message;
                notification.className = `notification ${type}`;
                notification.style.display = 'block';
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
                setTimeout(() => {
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        notification.style.display = 'none';
                        notification.className = 'notification';
                    }, 300);
                }, 3000);
            }

            // Função para formatar data e hora
            function formatDateTime(isoString) {
                const date = new Date(isoString);
                return date.toLocaleString('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                });
            }

            // Função para exibir pedidos salvos
            function displayOrders() {
                const orders = JSON.parse(localStorage.getItem('orders')) || [];
                ordersList.innerHTML = '';

                if (orders.length === 0) {
                    ordersList.innerHTML = '<p style="text-align: center; color: #cccccc; padding: 20px;">Nenhum pedido salvo.</p>';
                    return;
                }

                orders.forEach((order, index) => {
                            const orderDiv = document.createElement('div');
                            orderDiv.classList.add('order-item');
                            let orderHTML = `
                <h3>Pedido #${index + 1} - ${formatDateTime(order.timestamp)}</h3>
                <p><strong>Itens:</strong></p>
                <ul>
            `;
                            order.items.forEach(item => {
                                orderHTML += `<li>${item.name} - ${formatCurrency(item.price)}</li>`;
                            });
                            orderHTML += `
                </ul>
                <p><strong>Total:</strong> ${formatCurrency(order.total)}</p>
                <p><strong>Endereço:</strong> Rua ${order.address.rua}, Nº ${order.address.numero}, ${order.address.bairro}${order.address.referencia ? `, Ref: ${order.address.referencia}` : ''}</p>
                <p><strong>Pagamento:</strong> ${order.pagamento.metodo}${order.pagamento.troco ? ` (Troco para R$ ${order.pagamento.troco})` : ''}${order.pagamento.pixKey ? ` (Chave PIX: ${order.pagamento.pixKey})` : ''}</p>
            `;
            orderDiv.innerHTML = orderHTML;
            ordersList.appendChild(orderDiv);
        });
    }

    // Evento para abrir a seção de pedidos
    viewOrdersBtn.addEventListener('click', () => {
        ordersSection.style.display = 'block';
        document.body.style.overflow = 'hidden';
        displayOrders();
    });

    // Evento para fechar a seção de pedidos
    closeOrdersBtn.addEventListener('click', () => {
        ordersSection.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Fechar ao clicar fora da seção
    window.addEventListener('click', (e) => {
        if (e.target === ordersSection) {
            ordersSection.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});