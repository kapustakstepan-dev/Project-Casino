/**
 * wallet.js - modulo de logica
 * maneja el saldo de creditos ficticios (crd).
 * utiliza promesas y settimeout para simular latencia de red realista.
 */

class FictionalWallet {
    constructor(initialBalance = 10000) {
        let stored = localStorage.getItem('casino_balance');
        this.balance = stored ? parseFloat(stored) : initialBalance;
        this.isUpdating = false;

        // renderizado inicial
        this.initialRender();
    }

    // generador de retraso de red simulado
    _simulateNetworkDelay(ms = 800) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // actualizar el dom explicitamente
    async initialRender() {
        this._updateDOM(this.balance);
    }

    _updateDOM(newVal) {
        const display = document.getElementById('credits-amount');
        const walletBox = document.getElementById('wallet-display');

        if (!display) return;

        // animar los numeros girando
        if (window.anime) {
            const obj = { val: parseFloat(display.innerText.replace(/,/g, '')) || 0 };

            anime({
                targets: obj,
                val: newVal,
                round: 1, // redondear entero
                duration: 1000,
                easing: 'easeOutExpo',
                update: function () {
                    display.innerHTML = obj.val.toLocaleString();
                }
            });

            // destello en el borde de billetera (estilo dorado lujoso)
            if (walletBox) {
                anime({
                    targets: walletBox,
                    borderColor: ['rgba(212, 175, 55, 1)', 'rgba(212, 175, 55, 0.4)'],
                    boxShadow: ['0 0 20px rgba(212, 175, 55, 0.6)', '0 0 15px rgba(212, 175, 55, 0.1)'],
                    duration: 800,
                    easing: 'easeOutSine'
                });
            }
        } else {
            display.innerText = newVal.toLocaleString();
        }
    }

    // metodos publicos
    async getBalance() {
        await this._simulateNetworkDelay(300);
        return this.balance;
    }

    /**
     * deducir creditos. retorna true si es exitoso, false si no hay fondos.
     */
    async wager(amount) {
        if (this.isUpdating) return false;
        this.isUpdating = true;

        await this._simulateNetworkDelay(600); // latencia de api falsa

        if (this.balance >= amount) {
            this.balance -= amount;
            this._saveAndRender();
            this.isUpdating = false;
            return true;
        } else {
            console.warn("fondos insuficientes");
            this._pulseError();
            this.isUpdating = false;
            return false;
        }
    }

    async win(amount) {
        if (this.isUpdating) return false;
        this.isUpdating = true;

        await this._simulateNetworkDelay(400);

        this.balance += amount;
        this._saveAndRender();
        this.isUpdating = false;

        // super destello para ganancias
        this._pulseWin();
        return true;
    }

    _saveAndRender() {
        localStorage.setItem('casino_balance', this.balance);
        this._updateDOM(this.balance);
    }

    _pulseError() {
        const walletBox = document.getElementById('wallet-display');
        if (!walletBox || !window.anime) return;

        anime({
            targets: walletBox,
            translateX: [
                { value: -5, duration: 50 },
                { value: 5, duration: 50 },
                { value: -5, duration: 50 },
                { value: 5, duration: 50 },
                { value: 0, duration: 50 }
            ],
            borderColor: ['#8B0000', 'rgba(212, 175, 55, 0.4)'],
            easing: 'easeInOutSine'
            // animacion mejorada visualmente para el error
        });
    }

    _pulseWin() {
        const walletBox = document.getElementById('wallet-display');
        if (!walletBox || !window.anime) return;

        anime({
            targets: walletBox,
            scale: [1, 1.05, 1],
            borderColor: ['#D4AF37', 'rgba(212, 175, 55, 0.4)'],
            boxShadow: ['0 0 30px rgba(212, 175, 55, 0.8)', '0 0 15px rgba(212, 175, 55, 0.1)'],
            duration: 800,
            easing: 'easeOutElastic(1, .8)'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.casinoWallet = new FictionalWallet(15000); // 15k creditos iniciales
});
