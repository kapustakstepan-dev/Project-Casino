const dictionary = {
    en: {
        "nav.logo": "CASINO",
        "hero.title": "THE NEON EXPERIENCE",
        "hero.subtitle": "A showcase of fluid motion, SVG mapping, and exact parameter orchestration. Pure dynamic minimalism.",
        "hero.btn.play": "INITIALIZE",
        "lobby.roulette.title": "ROULETTE",
        "lobby.roulette.desc": "Simulate the wheel with radial staggered motion.",
        "lobby.blackjack.title": "BLACKJACK",
        "lobby.blackjack.desc": "Elastic playing card timelines and 3D transforms.",
        "lobby.sports.title": "SPORTS",
        "lobby.sports.desc": "Grid orchestrations and slip state updates.",
        "footer.contact": "CONTACT",
        "footer.advertense": "RESPONSIBLE GAMING"
    },
    es: {
        "nav.logo": "CASINO",
        "hero.title": "LA EXPERIENCIA NEÓN",
        "hero.subtitle": "Una exhibición de movimiento fluido, mapeo SVG y orquestación exacta de parámetros. Minimalismo dinámico puro.",
        "hero.btn.play": "INICIALIZAR",
        "lobby.roulette.title": "RULETA",
        "lobby.roulette.desc": "Simula la rueda con movimiento radial escalonado.",
        "lobby.blackjack.title": "BLACKJACK",
        "lobby.blackjack.desc": "Líneas de tiempo elásticas de cartas y transformaciones 3D.",
        "lobby.sports.title": "DEPORTES",
        "lobby.sports.desc": "Orquestaciones de cuadrícula y actualizaciones de estado de apuestas.",
        "footer.contact": "CONTACTO",
        "footer.advertense": "JUEGO RESPONSABLE"
    },
    uk: {
        "nav.logo": "КАЗИНО",
        "hero.title": "НЕОНОВИЙ ДОСВІД",
        "hero.subtitle": "Демонстрація плавного руху, SVG-маппінгу та точної оркестрації параметрів. Чистий динамічний мінімалізм.",
        "hero.btn.play": "ІНІЦІАЛІЗУВАТИ",
        "lobby.roulette.title": "РУЛЕТКА",
        "lobby.roulette.desc": "Симулюйте колесо з радіальним каскадним рухом.",
        "lobby.blackjack.title": "БЛЕКДЖЕК",
        "lobby.blackjack.desc": "Еластичні часові шкали ігрових карт і 3D-трансформації.",
        "lobby.sports.title": "СПОРТ",
        "lobby.sports.desc": "Оркестрація сіток і оновлення стану ставки.",
        "footer.contact": "КОНТАКТИ",
        "footer.advertense": "ВІДПОВІДАЛЬНА ГРА"
    }
};

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('anime_casino_lang') || 'en';
        this.init();
    }

    init() {
        this.bindButtons();
        this.updateActiveBtn();
        // Translate without animation on initial load
        this.translateDOM();
    }

    bindButtons() {
        const btns = document.querySelectorAll('.lang-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                if (lang !== this.currentLang) {
                    this.changeLanguage(lang);
                }
            });
        });
    }

    updateActiveBtn() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    changeLanguage(lang) {
        if (!dictionary[lang]) return;
        this.currentLang = lang;
        localStorage.setItem('anime_casino_lang', lang);
        this.updateActiveBtn();

        const elementsToTranslate = document.querySelectorAll('[data-i18n]');

        // Anime.js powered translation swap
        if (window.anime) {
            // Stagger out letters or elements
            anime({
                targets: elementsToTranslate,
                opacity: 0,
                translateY: 10,
                duration: 300,
                easing: 'easeInQuad',
                complete: () => {
                    this.translateDOM();

                    // Check if we need to re-split letters for SVG borders/buttons
                    this.recomputeSpans();

                    // Stagger back in
                    anime({
                        targets: elementsToTranslate,
                        opacity: 1,
                        translateY: [10, 0],
                        duration: 500,
                        delay: anime.stagger(50),
                        easing: 'easeOutBounce'
                    });
                }
            });
        } else {
            this.translateDOM();
        }
    }

    translateDOM() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dictionary[this.currentLang][key]) {
                // Determine if element contains split spans
                if (el.querySelector('.letter') || el.querySelector('.btn-letter')) {
                    el.dataset.rawText = dictionary[this.currentLang][key]; // Store raw text for split
                } else {
                    el.textContent = dictionary[this.currentLang][key];
                }
            }
        });

        this.recomputeSpans();
    }

    recomputeSpans() {
        // Re-split text for elements that use Anime.js letter targeting
        const resplit = (selector, spanClass) => {
            const el = document.querySelector(selector);
            if (el && el.dataset.rawText) {
                const html = el.dataset.rawText.split(' ').map(word => {
                    const letters = word.split('').map(char => `<span class="${spanClass}" style="display:inline-block;">${char}</span>`).join('');
                    return `<span class="word" style="display:inline-block; margin-right:15px;">${letters}</span>`;
                }).join('');
                el.innerHTML = html;
            }
        };

        resplit('#logo-text', 'letter');
        resplit('#hero-title', 'letter');
        resplit('#btn-text', 'btn-letter');
    }
}

// Instantiate globally to allow access if needed
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
});
