/**
 * auth.js
 * Handles the comprehensive Casino Royale user flow:
 * 1. Age Verification (Must be >= 18)
 * 2. Legal Terms Acceptance
 * 3. Persistent Registration (Login)
 */

window.CasinoAuth = {
    // Keys in localStorage
    KEYS: {
        AGE_VERIFIED: 'casino_age_verified',
        LEGAL_ACCEPTED: 'casino_legal_accepted',
        USER_REGISTERED: 'casino_user_registered',
        USER_DATA: 'casino_user_data'
    },

    /**
     * Call this on every protected page (Index, Games) to ensure the flow is valid.
     */
    checkFlow: function () {
        const path = window.location.pathname;
        const page = path.split('/').pop().split('?')[0];

        // Skip checks on system pages themselves to avoid infinite loops
        if (['age.html', 'underage.html', 'legal.html', 'login.html'].includes(page)) {
            return;
        }

        // 1. Age check
        if (!localStorage.getItem(this.KEYS.AGE_VERIFIED)) {
            this.redirect('age.html');
            return;
        }
        if (localStorage.getItem(this.KEYS.AGE_VERIFIED) === 'false') {
            this.redirect('underage.html');
            return;
        }

        // 2. Legal check
        if (!localStorage.getItem(this.KEYS.LEGAL_ACCEPTED)) {
            this.redirect('legal.html');
            return;
        }

        // Note: We don't force login for index.html so users can see the lobby.
        // But we DO force login for /model/ (game pages).
        if (path.includes('/model/') && !this.isRegistered()) {
            this.redirect(`../login.html?redirect=${encodeURIComponent(page)}`);
            return;
        }
    },

    /**
     * Set age verification
     * @param {boolean} isAdult
     */
    verifyAge: function (isAdult) {
        localStorage.setItem(this.KEYS.AGE_VERIFIED, isAdult ? 'true' : 'false');
        if (isAdult) {
            this.redirect('legal.html');
        } else {
            this.redirect('underage.html');
        }
    },

    /**
     * Accept legal terms
     */
    acceptLegal: function () {
        localStorage.setItem(this.KEYS.LEGAL_ACCEPTED, 'true');
        this.redirect('index.html');
    },

    /**
     * Register a persistent user
     */
    registerUser: function (name, email) {
        localStorage.setItem(this.KEYS.USER_REGISTERED, 'true');
        localStorage.setItem(this.KEYS.USER_DATA, JSON.stringify({ name, email }));

        // Initialize wallet if not exists
        if (localStorage.getItem('casino_balance') === null) {
            localStorage.setItem('casino_balance', '0');
        }

        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');

        if (redirect) {
            this.redirect(`model/${redirect}`);
        } else {
            this.redirect('index.html');
        }
    },

    isRegistered: function () {
        return localStorage.getItem(this.KEYS.USER_REGISTERED) === 'true';
    },

    getUser: function () {
        const data = localStorage.getItem(this.KEYS.USER_DATA);
        return data ? JSON.parse(data) : null;
    },

    redirect: function (page) {
        // Handle pathing (if currently in /model/, go up a directory for root pages)
        const inModel = window.location.pathname.includes('/model/');
        const isRootPage = ['age.html', 'underage.html', 'legal.html', 'index.html', 'login.html'].includes(page);

        if (inModel && isRootPage) {
            window.location.href = `../${page}`;
        } else {
            window.location.href = page;
        }
    }
};

// Automagically run flow check when included
document.addEventListener('DOMContentLoaded', () => {
    window.CasinoAuth.checkFlow();
});
