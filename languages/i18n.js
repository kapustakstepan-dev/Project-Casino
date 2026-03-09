const translations = {
  en: {
    "nav.logo": "ROYALE",
    "nav.balance": "Balance",
    "hero.title": "THE ROYALE EXPERIENCE",
    "hero.subtitle": "Step into the most advanced luxury casino. High-stakes simulation, purely zero risk.",
    "hero.btn.play": "ENTER NOW",
    "hero.btn.support": "SUPPORT",
    "lobby.roulette.title": "Premium Roulette",
    "lobby.roulette.desc": "Experience the classic wheel with a luxurious VIP twist.",
    "lobby.blackjack.title": "Royale Blackjack",
    "lobby.blackjack.desc": "21 is the magic number. Beat the dealer at this elegant table.",
    "lobby.sports.title": "Virtual Sports",
    "lobby.sports.desc": "Place your fictional bets on high-end simulated races.",
    "footer.contact": "Contact Us",
    "footer.advertense": "Responsible Gaming",
    "footer.copyright": "© 2026 Project Casino Royale. Simulator Only.",
    "age.title": "RESTRICTED ACCESS",
    "age.question": "Are you 18 years of age or older?",
    "age.yes": "YES",
    "age.no": "NO"
  },
  es: {
    "nav.logo": "ROYALE",
    "nav.balance": "Saldo",
    "hero.title": "LA EXPERIENCIA ROYALE",
    "hero.subtitle": "Adentrate en el casino de lujo mas avanzado. Simulacion de altas apuestas, riesgo cero.",
    "hero.btn.play": "ENTRAR AHORA",
    "hero.btn.support": "SOPORTE",
    "lobby.roulette.title": "Ruleta Premium",
    "lobby.roulette.desc": "Experimenta la rueda clasica con un toque vip lujoso.",
    "lobby.blackjack.title": "Blackjack Royale",
    "lobby.blackjack.desc": "21 es el numero magico. Vence al crupier en esta mesa elegante.",
    "lobby.sports.title": "Deportes Virtuales",
    "lobby.sports.desc": "Realiza apuestas ficticias en carreras simuladas de alta gama.",
    "footer.contact": "Contactanos",
    "footer.advertense": "Juego Responsable",
    "footer.copyright": "© 2026 Project Casino Royale. Solo Simulador.",
    "age.title": "ACCESO RESTRINGIDO",
    "age.question": "¿eres mayor de 18 anos?",
    "age.yes": "SI",
    "age.no": "NO"
  },
  uk: {
    "nav.logo": "РОЯЛЬ",
    "nav.balance": "Баланс",
    "hero.title": "ДОСВІД ROYALE",
    "hero.subtitle": "Зробіть крок у найсучасніше розкішне казино. Симуляція високих ставок, нульовий ризик.",
    "hero.btn.play": "УВІЙТИ ЗАРАЗ",
    "hero.btn.support": "ПІДТРИМКА",
    "lobby.roulette.title": "Преміум Рулетка",
    "lobby.roulette.desc": "Відчуйте класичну гру з розкішним vip-нальотом.",
    "lobby.blackjack.title": "Блекджек Royale",
    "lobby.blackjack.desc": "21 - магічне число. Переграйте дилера на цьому елегантному столі.",
    "lobby.sports.title": "Віртуальний Спорт",
    "lobby.sports.desc": "Робіть вигадані ставки на симульовані елітні перегони.",
    "footer.contact": "Контакти",
    "footer.advertense": "Відповідальна Гра",
    "footer.copyright": "© 2026 Project Casino Royale. Лише симулятор.",
    "age.title": "ОБМЕЖЕНИЙ ДОСТУП",
    "age.question": "Вам виповнилося 18 років?",
    "age.yes": "ТАК",
    "age.no": "НІ"
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
      if (btn.getAttribute('data-lang') === this.currentLang) {
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

    // transicion opcional anime.js para cambio de texto
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
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translations[lang][key];
        } else {
          el.textContent = translations[lang][key];
        }
      }
    });
  }
}

// inicializacion al cargar el dom
document.addEventListener('DOMContentLoaded', () => {
  window.i18n = new I18nManager();
});
