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
    const nomeCliente = document.getElementById('nome-cliente');
    const observacoes = document.getElementById('observacoes');
    const couponInput = document.getElementById('coupon-input');
    const couponApplyBtn = document.getElementById('coupon-apply-btn');
    const couponStatus = document.getElementById('coupon-status');
    let discountApplied = false;
    let originalTotal = 0;

    // Sistema de Gamificação
    let gamificationData = JSON.parse(localStorage.getItem('gamification')) || {
        points: 0,
        level: 1,
        ordersCompleted: 0,
        combosOrdered: 0,
        badges: {
            primeiroPedido: false,
            fieis: false,
            gourmet: false,
            comboMaster: false
        }
    };

    const POINTS_PER_ITEM = 10;
    const POINTS_PER_ORDER = 50;
    const POINTS_PER_LEVEL = 100;
    const userLevelEl = document.getElementById('user-level');
    const userPointsEl = document.getElementById('user-points');
    const nextLevelPointsEl = document.getElementById('next-level-points');
    const progressFillEl = document.getElementById('progress-fill');

    function saveGamification() {
        localStorage.setItem('gamification', JSON.stringify(gamificationData));
    }

    function updateGamificationUI() {
        userLevelEl.textContent = gamificationData.level;
        userPointsEl.textContent = gamificationData.points;
        nextLevelPointsEl.textContent = gamificationData.level * POINTS_PER_LEVEL;
        const progress = (gamificationData.points % POINTS_PER_LEVEL) / POINTS_PER_LEVEL * 100;
        progressFillEl.style.width = progress + '%';

        // Atualizar badges
        Object.keys(gamificationData.badges).forEach(badgeKey => {
            const badgeEl = document.getElementById(`badge-${badgeKey.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
            if (gamificationData.badges[badgeKey]) {
                badgeEl.classList.add('unlocked');
                badgeEl.classList.remove('locked');
            } else {
                badgeEl.classList.add('locked');
                badgeEl.classList.remove('unlocked');
            }
        });
    }

    function addPoints(points) {
        gamificationData.points += points;
        let newLevel = Math.floor(gamificationData.points / POINTS_PER_LEVEL) + 1;
        if (newLevel > gamificationData.level) {
            gamificationData.level = newLevel;
            showNotification(`Parabéns! Você subiu para o Nível ${newLevel}! 🎉`, 'success');
        }
        saveGamification();
        updateGamificationUI();
    }

    function checkBadges() {
        if (!gamificationData.badges.primeiroPedido && gamificationData.ordersCompleted >= 1) {
            gamificationData.badges.primeiroPedido = true;
            showNotification('Badge desbloqueado: Primeiro Pedido! 🍔', 'success');
            saveGamification();
        }
        if (!gamificationData.badges.fieis && gamificationData.ordersCompleted >= 3) {
            gamificationData.badges.fieis = true;
            showNotification('Badge desbloqueado: Cliente Fiel! ⭐', 'success');
            saveGamification();
        }
        if (!gamificationData.badges.gourmet && gamificationData.points >= 500) {
            gamificationData.badges.gourmet = true;
            showNotification('Badge desbloqueado: Gourmet! 👑', 'success');
            saveGamification();
        }
        if (!gamificationData.badges.comboMaster && gamificationData.combosOrdered >= 5) {
            gamificationData.badges.comboMaster = true;
            showNotification('Badge desbloqueado: Combo Master! 🎁', 'success');
            saveGamification();
        }
        updateGamificationUI();
    }

    // Player de rádio
    const radio = document.getElementById("radio-audio");
    const playBtn = document.getElementById("play-btn");
    const pauseBtn = document.getElementById("pause-btn");
    const vuMeter = document.getElementById("vu-meter");

    // Cupons (lista completa truncada para exemplo; adicione mais se quiser)
    const validCoupons = [
        'DEGUSTO5-001', 'DEGUSTO5-002', 'DEGUSTO5-003', 'DEGUSTO5-004', 'DEGUSTO5-005',
        'DEGUSTO5-006', 'DEGUSTO5-007', 'DEGUSTO5-008', 'DEGUSTO5-009', 'DEGUSTO5-010',
        'DEGUSTO5-011', 'DEGUSTO5-012', 'DEGUSTO5-013', 'DEGUSTO5-014', 'DEGUSTO5-015',
        'DEGUSTO5-016', 'DEGUSTO5-017', 'DEGUSTO5-018', 'DEGUSTO5-019', 'DEGUSTO5-020',
        'DEGUSTO5-021', 'DEGUSTO5-022', 'DEGUSTO5-023', 'DEGUSTO5-024', 'DEGUSTO5-025',
        'DEGUSTO5-026', 'DEGUSTO5-027', 'DEGUSTO5-028', 'DEGUSTO5-029', 'DEGUSTO5-030',
        'DEGUSTO5-031', 'DEGUSTO5-032', 'DEGUSTO5-033', 'DEGUSTO5-034', 'DEGUSTO5-035',
        'DEGUSTO5-036', 'DEGUSTO5-037', 'DEGUSTO5-038', 'DEGUSTO5-039', 'DEGUSTO5-040',
        'DEGUSTO5-041', 'DEGUSTO5-042', 'DEGUSTO5-043', 'DEGUSTO5-044', 'DEGUSTO5-045',
        'DEGUSTO5-046', 'DEGUSTO5-047', 'DEGUSTO5-048', 'DEGUSTO5-049', 'DEGUSTO5-050'
    ];

    function formatCurrency(value) {
        return 'R$ ' + parseFloat(value).toFixed(2).replace('.', ',');
    }

    function updateCartButton() {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    function calculateTotal() {
        const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        originalTotal = subtotal;
        if (discountApplied) {
            return subtotal * 0.95;
        }
        return subtotal;
    }

    function updateCheckoutTotal() {
        const total = calculateTotal();
        checkoutTotal.textContent = `Total: ${formatCurrency(total)}`;
        modalTotal.textContent = `Total: ${formatCurrency(total)}`;
    }

    function applyCoupon() {
        const couponCode = couponInput.value.trim().toUpperCase();
        if (validCoupons.includes(couponCode)) {
            if (!discountApplied) {
                discountApplied = true;
                updateCheckoutTotal();
                couponStatus.textContent = `Cupom ${couponCode} aplicado! Desconto de 5% (R$ ${formatCurrency(originalTotal * 0.05)} economizado)`;
                couponStatus.style.color = '#4caf50';
                showNotification('Cupom aplicado com sucesso! 5% de desconto!', 'success');
                couponInput.value = '';
            } else {
                showNotification('Desconto já aplicado! Apenas um cupom por pedido.', 'error');
            }
        } else {
            couponStatus.textContent = 'Cupom inválido. Tente novamente.';
            couponStatus.style.color = '#e63946';
            showNotification('Cupom inválido!', 'error');
        }
    }

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
                    <div style="flex: 1; display: flex; flex-direction: column; align-items: flex-start;">
                        <span style="font-weight: bold; margin-bottom: 5px;">${item.name}</span>
                        <span style="color: #cccccc; font-size: 14px;">${formatCurrency(item.price)} x ${item.quantity}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button onclick="updateQuantity(${index}, -1)" style="background: #ffcc00; color: #000; border: none; padding: 5px 10px; border-radius: 50%; cursor: pointer; font-size: 16px; min-width: 30px;">−</button>
                        <span style="font-weight: bold; min-width: 20px; text-align: center;">${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)" style="background: #ffcc00; color: #000; border: none; padding: 5px 10px; border-radius: 50%; cursor: pointer; font-size: 16px; min-width: 30px;">+</button>
                        <button onclick="removeFromCart(${index})" style="background: #e63946; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 12px;">Remover</button>
                    </div>
                `;
                modalCartItems.appendChild(div);
            });
            modalTotal.textContent = `Total: ${formatCurrency(total)}`;
            checkoutButton.style.display = 'block';
        }
        updateCheckoutTotal();
    }

    window.updateQuantity = (index, change) => {
        if (cart[index].quantity + change > 0) {
            cart[index].quantity += change;
            if (cart[index].quantity === 0) {
                cart.splice(index, 1);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartButton();
            populateModal();
            showNotification(`${change > 0 ? 'Quantidade aumentada' : 'Quantidade diminuída'}!`);
        }
    };

    // Adicionar ao carrinho com gamificação
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const item = e.target.closest('.item');
            const name = item.dataset.name;
            const price = item.dataset.price;
            const existingItem = cart.find(cartItem => cartItem.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartButton();
            updateCheckoutTotal();

            // Gamificação
            addPoints(POINTS_PER_ITEM);
            showNotification(`${name} adicionado ao carrinho! +${POINTS_PER_ITEM} pts!`, 'success');
            button.classList.add('added');
            button.textContent = 'Adicionado! ✓';
            button.disabled = true;
            setTimeout(() => {
                button.classList.remove('added');
                button.textContent = 'Adicionar ao Carrinho';
                button.disabled = false;
            }, 2000);
        });
    });

    window.removeFromCart = (index) => {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartButton();
        populateModal();
        showNotification('Item removido do carrinho! 🗑️');
        if (cart.length === 0) {
            discountApplied = false;
        }
    };

    clearCartBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar o carrinho? Todos os itens serão removidos.')) {
            cart.length = 0;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartButton();
            populateModal();
            discountApplied = false;
            showNotification('Carrinho limpo com sucesso! 🛒', 'success');
        }
    });

    function showNotification(message, type = '') {
        notification.innerHTML = `<span>${type === 'success' ? '✅' : 'ℹ️'} ${message}</span>`;
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

    openModalBtn.addEventListener('click', () => {
        populateModal();
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        modal.style.animation = 'fadeIn 0.3s ease-out';
    });

    closeModal.addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.3s ease-in';
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    });

    checkoutButton.addEventListener('click', () => {
        modal.style.display = 'none';
        checkoutForm.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        updateCheckoutTotal();
    });

    document.querySelector('#checkout-form .close-modal').addEventListener('click', () => {
        checkoutForm.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    pagamentoRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            trocoDiv.style.display = radio.value === 'Dinheiro' ? 'block' : 'none';
            pixDetails.style.display = radio.value === 'PIX' ? 'block' : 'none';
        });
    });

    couponApplyBtn.addEventListener('click', applyCoupon);

    window.copyPix = () => {
        navigator.clipboard.writeText('10738419605').then(() => {
            showNotification('Chave PIX copiada para a área de transferência! 📋', 'success');
        }).catch(() => {
            showNotification('Erro ao copiar PIX. Copie manualmente: 10738419605');
        });
    };

    // Enviar pedido com gamificação
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            showNotification('Seu carrinho está vazio! Adicione itens antes de finalizar.', 'error');
            return;
        }

        const selectedPagamento = document.querySelector('input[name="pagamento"]:checked');
        if (!selectedPagamento) {
            showNotification('Por favor, selecione um método de pagamento!', 'error');
            return;
        }

        const nome = nomeCliente ? nomeCliente.value.trim() : 'Cliente';
        const rua = document.getElementById('rua').value;
        const numero = document.getElementById('numero').value;
        const bairro = document.getElementById('bairro').value;
        const referencia = document.getElementById('referencia').value;
        const metodo = selectedPagamento.value;
        const troco = document.getElementById('troco').value || '';
        const obs = observacoes ? observacoes.value.trim() : '';

        if (!rua || !numero || !bairro) {
            showNotification('Preencha todos os campos do endereço!', 'error');
            return;
        }

        let total = calculateTotal();
        let orderDetails = `*🍔 Novo Pedido - DêGusto Lanchonete Premium* 📱\n\n`;
        orderDetails += `👤 *Nome:* ${nome}\n\n`;
        orderDetails += `*🛒 Itens do Pedido:*\n`;
        cart.forEach(item => {
            orderDetails += `• ${item.name} (x${item.quantity}) - ${formatCurrency(item.price * item.quantity)}\n`;
            if (item.name.includes('COMBO')) {
                gamificationData.combosOrdered += item.quantity;
            }
        });
        orderDetails += `\n💰 *Subtotal:* ${formatCurrency(originalTotal)}\n`;
        if (discountApplied) {
            orderDetails += `🛍️ *Desconto (5%):* -${formatCurrency(originalTotal * 0.05)}\n`;
        }
        orderDetails += `💰 *Total Final:* ${formatCurrency(total)}\n\n`;
        orderDetails += `📍 *Endereço de Entrega:*\nRua ${rua}, Nº ${numero} - Bairro ${bairro}`;
        if (referencia) orderDetails += `\nRef: ${referencia}`;
        orderDetails += `\n\n💳 *Forma de Pagamento:* ${metodo}`;
        if (metodo === 'Dinheiro' && troco) orderDetails += ` (Troco para R$ ${troco})`;
        if (metodo === 'PIX') orderDetails += `\n*PIX Chave:* 10738419605`;
        if (obs) orderDetails += `\n\n📝 *Observações:* ${obs}`;

        orderDetails += `\n\n*Delivery em até 30min! Atendimento a partir das 19h. 🔥*`;

        const whatsappUrl = `https://wa.me/+5534999537698?text=${encodeURIComponent(orderDetails)}`;
        window.open(whatsappUrl, '_blank');

        // Gamificação
        gamificationData.ordersCompleted += 1;
        addPoints(POINTS_PER_ORDER);
        checkBadges();

        // Limpar
        cart.length = 0;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartButton();
        checkoutForm.reset();
        if (nomeCliente) nomeCliente.value = '';
        if (observacoes) observacoes.value = '';
        trocoDiv.style.display = 'none';
        pixDetails.style.display = 'none';
        discountApplied = false;
        couponStatus.textContent = '';
        checkoutForm.style.display = 'none';
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        showNotification('Pedido enviado com sucesso para o WhatsApp! +50 pts! 📲🚀', 'success');
        populateModal();
    });

    helpButton.addEventListener('click', () => {
        helpModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

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

    mobileToggle.addEventListener('click', () => mainNav.classList.toggle('active'));

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
    updateGamificationUI();

    // Controles de rádio
    if (radio && playBtn && pauseBtn && vuMeter) {
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
    }
});