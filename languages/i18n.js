const translations = {
  en: {
    "nav.logo": "CASINO",
    "nav.balance": "Balance",
    "hero.title": "THE NEON EXPERIENCE",
    "hero.subtitle": "Step into the most advanced fictional casino. High-stakes simulation, purely zero risk.",
    "hero.btn.play": "PLAY NOW",
    "hero.btn.support": "SUPPORT",
    "lobby.roulette.title": "Cyber Roulette",
    "lobby.roulette.desc": "Experience the classic wheel with a futuristic twist. Predict the glow.",
    "lobby.blackjack.title": "Neon Blackjack",
    "lobby.blackjack.desc": "21 is the magic number. Beat the dealer in this sleek card grid.",
    "lobby.sports.title": "Virtual Sports",
    "lobby.sports.desc": "Place your fictional bets on simulated futuristic racing and matches.",
    "footer.contact": "Contact Us",
    "footer.advertense": "Responsible Gaming",
    "footer.copyright": "© 2026 Project Casino. Simulator Only."
  },
  es: {
    "nav.logo": "CASINO",
    "nav.balance": "Saldo",
    "hero.title": "LA EXPERIENCIA NEÓN",
    "hero.subtitle": "Adéntrate en el casino ficticio más avanzado. Simulación de altas puestas, riesgo cero.",
    "hero.btn.play": "JUGAR AHORA",
    "hero.btn.support": "SOPORTE",
    "lobby.roulette.title": "Ruleta Cibernética",
    "lobby.roulette.desc": "Experimenta la rueda clásica con un toque futurista. Predice el resplandor.",
    "lobby.blackjack.title": "Blackjack Neón",
    "lobby.blackjack.desc": "21 es el número mágico. Vence al crupier en esta elegante cuadrícula de cartas.",
    "lobby.sports.title": "Deportes Virtuales",
    "lobby.sports.desc": "Realiza apuestas ficticias en carreras y partidos futuristas simulados.",
    "footer.contact": "Contáctanos",
    "footer.advertense": "Juego Responsable",
    "footer.copyright": "© 2026 Project Casino. Solo Simulador."
  },
  uk: {
    "nav.logo": "КАЗИНО",
    "nav.balance": "Баланс",
    "hero.title": "НЕОНОВИЙ ДОСВІД",
    "hero.subtitle": "Зробіть крок у найсучасніше вигадане казино. Симуляція високих ставок, нульовий ризик.",
    "hero.btn.play": "ГРАТИ ЗАРАЗ",
    "hero.btn.support": "ПІДТРИМКА",
    "lobby.roulette.title": "Кібер Рулетка",
    "lobby.roulette.desc": "Відчуйте класичну гру з футуристичним поворотом. Передбачте сяйво.",
    "lobby.blackjack.title": "Неоновий Блекджек",
    "lobby.blackjack.desc": "21 - магічне число. Переграйте дилера на цьому стильному картковому столі.",
    "lobby.sports.title": "Віртуальний Спорт",
    "lobby.sports.desc": "Робіть вигадані ставки на симульовані футуристичні перегони та матчі.",
    "footer.contact": "Контакти",
    "footer.advertense": "Відповідальна Гра",
    "footer.copyright": "© 2026 Project Casino. Лише симулятор."
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('casino_lang') || 'en';
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateUI();
    this.setLanguage(this.currentLang);
  }

  bindEvents() {
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.target.getAttribute('data-lang');
        this.setLanguage(lang);
      });
    });
  }

  updateUI() {
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
      if(btn.getAttribute('data-lang') === this.currentLang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  setLanguage(lang) {
    if (!translations[lang]) return;
    
    this.currentLang = lang;
    localStorage.setItem('casino_lang', lang);
    this.updateUI();

    const elementsToTranslate = document.querySelectorAll('[data-i18n]');
    
    // Optional: Add Anime.js transition for text switch if loaded
    if (window.anime) {
      anime({
        targets: elementsToTranslate,
        opacity: [1, 0, 1],
        duration: 600,
        easing: 'easeInOutSine',
        update: (anim) => {
          if (anim.progress > 50 && !anim.textUpdated) {
            this.replaceText(elementsToTranslate, lang);
            anim.textUpdated = true;
          }
        },
        complete: () => {
           elementsToTranslate.forEach(el => el.textUpdated = false);
        }
      });
    } else {
      this.replaceText(elementsToTranslate, lang);
    }
  }
  
  replaceText(elements, lang) {
      elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
          if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
              el.placeholder = translations[lang][key];
          } else {
              el.textContent = translations[lang][key];
          }
        }
      });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.i18n = new I18nManager();
});
