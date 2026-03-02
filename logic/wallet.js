/**
 * WALLET.JS - LOGIC MODULE
 * Manages the "Fictional Credits" (CRD) balance.
 * Utilizes Promises and setTimeouts to simulate realistic API latency.
 */

class FictionalWallet {
    constructor(initialBalance = 10000) {
        let stored = localStorage.getItem('casino_balance');
        this.balance = stored ? parseFloat(stored) : initialBalance;
        this.isUpdating = false;

        // Immediately render
        this.initialRender();
    }

    // Fake Network Request Delay Generator
    _simulateNetworkDelay(ms = 800) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Update DOM explicitly
    async initialRender() {
        this._updateDOM(this.balance);
    }

    _updateDOM(newVal) {
        const display = document.getElementById('credits-amount');
        const walletBox = document.getElementById('wallet-display');

        if (!display) return;

        // Animate numbers spinning
        if (window.anime) {
            const obj = { val: parseFloat(display.innerText) || 0 };

            anime({
                targets: obj,
                val: newVal,
                round: 1, // Round integer
                duration: 1000,
                easing: 'easeOutExpo',
                update: function () {
                    display.innerHTML = obj.val.toLocaleString();
                }
            });

            // Flash wallet border
            if (walletBox) {
                anime({
                    targets: walletBox,
                    borderColor: ['rgba(255, 215, 0, 0.8)', 'rgba(255, 215, 0, 0.2)'],
                    boxShadow: ['0 0 20px rgba(255, 215, 0, 0.4)', '0 0 15px rgba(255, 215, 0, 0.05)'],
                    duration: 800,
                    easing: 'easeOutSine'
                });
            }
        } else {
            display.innerText = newVal.toLocaleString();
        }
    }

    // Public Methods
    async getBalance() {
        await this._simulateNetworkDelay(300);
        return this.balance;
    }

    /**
     * Deduct credits. Returns true if successful, false if insufficient bounds.
     */
    async wager(amount) {
        if (this.isUpdating) return false;
        this.isUpdating = true;

        await this._simulateNetworkDelay(600); // Fake API latency

        if (this.balance >= amount) {
            this.balance -= amount;
            this._saveAndRender();
            this.isUpdating = false;
            return true;
        } else {

            
            console.warn("Insufficient Crits");
            this._pulseError();
            this.isUpdating = false;
            return false;
        }
    }

    /**
     * Add credits (Win or Top-up)
     */
    async win(amount) {
        if (this.isUpdating) return false;
        this.isUpdating = true;

        await this._simulateNetworkDelay(400);

        this.balance += amount;
        this._saveAndRender();
        this.isUpdating = false;

        // Super flash for wins
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
            borderColor: ['#FF073A', 'rgba(255, 215, 0, 0.2)'],
            easing: 'easeInOutSine'
        });
    }

    _pulseWin() {
        const walletBox = document.getElementById('wallet-display');
        if (!walletBox || !window.anime) return;

        anime({
            targets: walletBox,
            scale: [1, 1.1, 1],
            borderColor: ['#39FF14', 'rgba(255, 215, 0, 0.2)'],
            duration: 600,
            easing: 'easeOutBounce'
        });
    }
}

// Instantiate and expose globally
document.addEventListener('DOMContentLoaded', () => {
    window.casinoWallet = new FictionalWallet(15000); // 15k starting credits
});
