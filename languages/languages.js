const dictionary = {
    en: {
        "nav.logo": "ROYALE",
        "hero.title": "THE ROYALE EXPERIENCE",
        "hero.subtitle": "A showcase of extravagance, golden details and realistic physical animations. Pure luxury.",
        "hero.btn.play": "ENTER",
        "lobby.roulette.title": "ROULETTE",
        "lobby.roulette.desc": "Simulate the wheel with premium aesthetics.",
        "lobby.blackjack.title": "BLACKJACK",
        "lobby.blackjack.desc": "Realistic physical cards and luxurious table.",
        "lobby.sports.title": "SPORTS",
        "lobby.sports.desc": "High-end betting slips.",
        "footer.contact": "CONTACT",
        "footer.advertense": "RESPONSIBLE GAMING",
        "age.title": "RESTRICTED ACCESS",
        "age.question": "Are you 18 years of age or older?",
        "age.yes": "YES",
        "age.no": "NO"
    },
    es: {
        "nav.logo": "ROYALE",
        "hero.title": "LA EXPERIENCIA ROYALE",
        "hero.subtitle": "Una exhibicion de extravagancia, detalles dorados y animaciones fisicas realistas. Luxuria pura.",
        "hero.btn.play": "ENTRAR",
        "lobby.roulette.title": "RULETA",
        "lobby.roulette.desc": "Simula la rueda con estetica premium.",
        "lobby.blackjack.title": "BLACKJACK",
        "lobby.blackjack.desc": "Cartas fisicas realistas y mesa lujosa.",
        "lobby.sports.title": "DEPORTES",
        "lobby.sports.desc": "Billetes de apuesta de alta gama.",
        "footer.contact": "CONTACTO",
        "footer.advertense": "JUEGO RESPONSABLE",
        "age.title": "ACCESO RESTRINGIDO",
        "age.question": "¿Eres mayor de 18 anos?",
        "age.yes": "SI",
        "age.no": "NO"
    },
    uk: {
        "nav.logo": "РОЯЛЬ",
        "hero.title": "ДОСВІД ROYALE",
        "hero.subtitle": "Демонстрація екстравагантності, золотих деталей та реалістичних фізичних анімацій. Чиста розкіш.",
        "hero.btn.play": "УВІЙТИ",
        "lobby.roulette.title": "РУЛЕТКА",
        "lobby.roulette.desc": "Симулюйте колесо з преміальною естетикою.",
        "lobby.blackjack.title": "БЛЕКДЖЕК",
        "lobby.blackjack.desc": "Реалістичні фізичні карти та розкішний стіл.",
        "lobby.sports.title": "СПОРТ",
        "lobby.sports.desc": "Ставки високого класу.",
        "footer.contact": "КОНТАКТИ",
        "footer.advertense": "ВІДПОВІДАЛЬНА ГРА",
        "age.title": "ОБМЕЖЕНИЙ ДОСТУП",
        "age.question": "Вам виповнилося 18 років?",
        "age.yes": "ТАК",
        "age.no": "НІ"
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
        // traducir sin animacion en la carga inicial
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

        // traduccion con transicion anime.js
        if (window.anime) {
            anime({
                targets: elementsToTranslate,
                opacity: 0,
                translateY: 10,
                duration: 300,
                easing: 'easeInQuad',
                complete: () => {
                    this.translateDOM();
                    this.recomputeSpans();
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
                if (el.querySelector('.letter') || el.querySelector('.btn-letter')) {
                    el.dataset.rawText = dictionary[this.currentLang][key]; // guardar texto crudo para dividir
                } else {
                    el.textContent = dictionary[this.currentLang][key];
                }
            }
        });

        this.recomputeSpans();
    }

    recomputeSpans() {
        // volver a dividir texto para elementos que usan segmentacion de letras anime.js
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

// instanciar globalmente para permitir acceso
document.addEventListener('DOMContentLoaded', () => {
    window.languageManager = new LanguageManager();
});
