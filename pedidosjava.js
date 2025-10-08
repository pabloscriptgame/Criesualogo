document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout-form');
    const notification = document.getElementById('notification');

    // Função para formatar moeda brasileira
    function formatCurrency(value) {
        return 'R$ ' + parseFloat(value).toFixed(2).replace('.', ',');
    }

    // Função para salvar pedido
    function saveOrder(orderDetails) {
        // Recupera pedidos existentes do localStorage ou inicializa um array vazio
        const savedOrders = JSON.parse(localStorage.getItem('orders')) || [];
        
        // Adiciona o novo pedido com data e hora
        const order = {
            id: Date.now(), // ID único baseado no timestamp
            details: orderDetails,
            date: new Date().toLocaleString('pt-BR')
        };
        
        savedOrders.push(order);
        localStorage.setItem('orders', JSON.stringify(savedOrders));
    }

    // Intercepta o evento de envio do formulário
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            showNotification('Carrinho vazio!');
            return;
        }

        const selectedPagamento = document.querySelector('input[name="pagamento"]:checked');
        if (!selectedPagamento) {
            showNotification('Selecione um método de pagamento!');
            return;
        }

        const rua = document.getElementById('rua').value;
        const numero = document.getElementById('numero').value;
        const bairro = document.getElementById('bairro').value;
        const referencia = document.getElementById('referencia').value;
        const metodo = selectedPagamento.value;
        const troco = document.getElementById('troco').value || '';

        if (!rua || !numero || !bairro) {
            showNotification('Preencha o endereço completo!');
            return;
        }

        // Calcula o total
        const total = cart.reduce((sum, i) => sum + parseFloat(i.price), 0);

        // Monta os detalhes do pedido
        let orderDetails = `Novo Pedido - DêGusto Lanchonete\n\nItens:\n`;
        cart.forEach(item => orderDetails += `- ${item.name} (${formatCurrency(item.price)})\n`);
        orderDetails += `\nTotal: ${formatCurrency(total)}\n`;
        orderDetails += `Endereço: Rua ${rua}, Nº ${numero} - Bairro ${bairro}${referencia ? `, Ref: ${referencia}` : ''}\n`;
        orderDetails += `Pagamento: ${metodo}${metodo === 'Dinheiro' && troco ? ` (Troco para R$ ${troco})` : ''}${metodo === 'PIX' ? '\nPIX Chave: 10738419605' : ''}`;

        // Salva o pedido no localStorage
        saveOrder(orderDetails);

        // Envia o pedido para o WhatsApp
        const whatsappUrl = `https://wa.me/+5534999537698?text=${encodeURIComponent(orderDetails)}`;
        window.open(whatsappUrl, '_blank');

        // Limpa o carrinho e atualiza a interface
        cart.length = 0;
        localStorage.setItem('cart', JSON.stringify(cart));
        checkoutForm.reset();
        document.getElementById('troco-div').style.display = 'none';
        document.getElementById('pix-details').style.display = 'none';
        checkoutForm.style.display = 'none';
        document.getElementById('cart-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
        showNotification('Pedido enviado e salvo com sucesso!', 'success');

        // Atualiza a interface do carrinho
        document.getElementById('cart-count').textContent = cart.length;
        document.getElementById('modal-cart-items').innerHTML = '<p style="text-align: center; color: #cccccc; padding: 20px;">🛒 Seu carrinho está vazio<br>Adicione alguns hambúrgueres deliciosos para começar seu pedido!</p>';
        document.getElementById('modal-total').textContent = 'R$ 0,00';
        document.getElementById('checkout-button').style.display = 'none';
    });

    // Função para mostrar notificação (reutilizando a função existente)
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
});