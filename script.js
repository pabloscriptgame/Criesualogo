document.addEventListener('DOMContentLoaded', () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const cartCount = document.getElementById('cart-count');
            const notification = document.getElementById('notification');
            const pagamentoRadios = document.querySelectorAll('input[name="pagamento"]');
            const trocoDiv = document.getElementById('troco-div');
            const pixDetails = document.getElementById('pix-details');
            const checkoutForm = document.getElementById('checkout-form');
            const modal = document.getElementById('cart-modal');
            const openModalBtn = document.getElementById('open-cart-modal');
            const closeModal = document.querySelector('#cart-modal .close-modal');
            const modalCartItems = document.getElementById('modal-cart-items');
            const modalTotal = document.getElementById('modal-total');
            const clearCartBtn = document.getElementById('clear-cart');
            const checkoutButton = document.getElementById('checkout-button');
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            const mainNav = document.querySelector('.main-nav');
            const helpButton = document.getElementById('help-button');
            const helpModal = document.getElementById('help-modal');
            const closeHelpModal = document.querySelector('#help-modal .close-modal');
            const checkoutTotal = document.getElementById('checkout-total');

            // radio player
            const radio = document.getElementById("radio-audio");
            const playBtn = document.getElementById("play-btn");
            const pauseBtn = document.getElementById("pause-btn");
            const vuMeter = document.getElementById("vu-meter");

            // Função para formatar moeda brasileira
            function formatCurrency(value) {
                return 'R$ ' + parseFloat(value).toFixed(2).replace('.', ',');
            }

            // Atualizar botão do carrinho
            function updateCartButton() {
                cartCount.textContent = cart.length;
            }

            // Função para calcular total
            function calculateTotal() {
                return cart.reduce((sum, i) => sum + parseFloat(i.price), 0);
            }

            // Atualizar total no checkout
            function updateCheckoutTotal() {
                const total = calculateTotal();
                checkoutTotal.textContent = `Total: ${formatCurrency(total)}`;
                modalTotal.textContent = `Total: ${formatCurrency(total)}`;
            }

            // Função para popular modal com itens do carrinho
            function populateModal() {
                modalCartItems.innerHTML = '';
                const total = calculateTotal();
                if (cart.length === 0) {
                    modalCartItems.innerHTML = '<p style="text-align: center; color: #cccccc; padding: 20px;">🛒 Seu carrinho está vazio<br>Adicione alguns hambúrgueres deliciosos para começar seu pedido!</p>';
                    modalTotal.textContent = 'R$ 0,00';
                    checkoutButton.style.display = 'none';
                } else {
                    cart.forEach((item, index) => {
                        const div = document.createElement('div');
                        div.classList.add('cart-item-modal');
                        div.innerHTML = `
                    <span>${item.name} - ${formatCurrency(item.price)}</span>
                    <button onclick="removeFromCart(${index})">Remover</button>
                `;
                        modalCartItems.appendChild(div);
                    });
                    modalTotal.textContent = `Total: ${formatCurrency(total)}`;
                    checkoutButton.style.display = 'block';
                }
                updateCheckoutTotal();
            }

            // Adicionar ao carrinho
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    const item = e.target.closest('.item');
                    const name = item.dataset.name;
                    const price = item.dataset.price;
                    cart.push({ name, price });
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartButton();
                    updateCheckoutTotal();
                    showNotification(`${name} adicionado ao carrinho!`, 'success');
                    button.classList.add('added');
                    button.textContent = 'Adicionado!';
                    button.disabled = true;
                    setTimeout(() => {
                        button.classList.remove('added');
                        button.textContent = 'Adicionar ao Carrinho';
                        button.disabled = false;
                    }, 2000);
                });
            });

            // Remover do carrinho
            window.removeFromCart = (index) => {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartButton();
                populateModal();
                showNotification('Item removido do carrinho!');
            };

            // Limpar carrinho
            clearCartBtn.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja limpar o carrinho?')) {
                    cart.length = 0;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartButton();
                    populateModal();
                    showNotification('Carrinho limpo!');
                }
            });

            // Mostrar notificação
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

            // Abrir modal do carrinho
            openModalBtn.addEventListener('click', () => {
                populateModal();
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });

            // Fechar modal do carrinho
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });

            // Checkout button
            checkoutButton.addEventListener('click', () => {
                modal.style.display = 'none';
                checkoutForm.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                updateCheckoutTotal();
            });

            // Fechar checkout form
            document.querySelector('#checkout-form .close-modal').addEventListener('click', () => {
                checkoutForm.style.display = 'none';
                document.body.style.overflow = 'auto';
            });

            // Pagamento radio buttons
            pagamentoRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    trocoDiv.style.display = radio.value === 'Dinheiro' ? 'block' : 'none';
                    pixDetails.style.display = radio.value === 'PIX' ? 'block' : 'none';
                });
            });

            // Copiar PIX
            window.copyPix = () => {
                navigator.clipboard.writeText('10738419605').then(() => {
                    showNotification('Chave PIX copiada!');
                }).catch(() => {
                    showNotification('Erro ao copiar PIX. Copie manualmente: 10738419605');
                });
            };

            // Enviar pedido
            checkoutForm.addEventListener('submit', (e) => {
                        e.preventDefault();
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

                        let total = calculateTotal();
                        let orderDetails = `Novo Pedido - DêGusto Lanchonete\n\nItens:\n`;
                        cart.forEach(item => orderDetails += `- ${item.name} (${formatCurrency(item.price)})\n`);
                        orderDetails += `\nTotal: ${formatCurrency(total)}\n`;
                        orderDetails += `Endereço: Rua ${rua}, Nº ${numero} - Bairro ${bairro}${referencia ? `, Ref: ${referencia}` : ''}\n`;
        orderDetails += `Pagamento: ${metodo}${metodo === 'Dinheiro' && troco ? ` (Troco para R$ ${troco})` : ''}${metodo === 'PIX' ? '\nPIX Chave: 10738419605' : ''}`;

        const whatsappUrl = `https://wa.me/+5534999537698?text=${encodeURIComponent(orderDetails)}`;
        window.open(whatsappUrl, '_blank');

        cart.length = 0;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartButton();
        checkoutForm.reset();
        trocoDiv.style.display = 'none';
        pixDetails.style.display = 'none';
        checkoutForm.style.display = 'none';
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        showNotification('Pedido enviado para WhatsApp!', 'success');
        populateModal();
    });

    // Botão Ajuda - Abrir modal de ajuda
    helpButton.addEventListener('click', () => {
        helpModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    // Fechar modal de ajuda
    closeHelpModal.addEventListener('click', () => {
        helpModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (e.target === checkoutForm) {
            checkoutForm.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (e.target === helpModal) {
            helpModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Menu mobile
    mobileToggle.addEventListener('click', () => mainNav.classList.toggle('active'));

    // Tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabPanels.forEach(panel => panel.classList.remove('active'));
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    // Inicialização
    updateCartButton();
    populateModal();

    // radio simple controls - CORRIGIDO
    (function(){
        if(!radio || !playBtn || !pauseBtn || !vuMeter) {
            console.warn('Elementos do player de rádio não encontrados.');
            return;
        }
        playBtn.addEventListener('click', () => {
            radio.play().then(() => {
                vuMeter.style.display = 'flex';
                console.log('Rádio tocando.');
            }).catch(error => {
                console.error('Erro ao reproduzir áudio:', error);
                showNotification('Erro ao iniciar o player. Verifique a conexão.', 'error');
            });
        });
        pauseBtn.addEventListener('click', () => {
            radio.pause();
            vuMeter.style.display = 'none';
            console.log('Rádio pausado.');
        });
        radio.pause();
        vuMeter.style.display = 'none';
        console.log('Player de rádio inicializado.');
    })();
});