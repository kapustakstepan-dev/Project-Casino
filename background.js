// utilería: dividir texto en span para animaciones
function splitTextToSpans(elementSelector, spanClass) {
    const el = document.querySelector(elementSelector);
    if (!el) return;
    const html = el.innerText.split(' ').map(word => {
        const letters = word.split('').map(char => `<span class="${spanClass}">${char}</span>`).join('');
        return `<span class="word">${letters}</span>`;
    }).join(' ');
    el.innerHTML = html;
}

// logica principal de inicio y animaciones
document.addEventListener('DOMContentLoaded', () => {
    // 1. age gate (control de edad)
    initAgeGate();

    // 2. animacion de particulas doradas de fondo (reemplaza neones)
    initLuxuryBackground();

    // 3. animacion de carga inicial
    splitTextToSpans('#logo-text', 'letter');
    splitTextToSpans('#hero-title', 'letter');
    splitTextToSpans('#btn-text', 'btn-letter');

    const tlLoad = anime.timeline({ easing: 'easeOutExpo' });

    tlLoad
        .add({
            targets: '.logo-path',
            strokeDashoffset: [anime.setDashoffset, 0],
            duration: 1500,
            easing: 'easeInOutSine'
        })
        .add({
            targets: '#logo-text .letter',
            translateY: ['100%', '0%'],
            opacity: [0, 1],
            duration: 800,
            delay: anime.stagger(50)
        }, '-=1000')
        // controles del encabezado
        .add({
            targets: '.controls',
            opacity: [0, 1],
            translateX: [20, 0],
            duration: 1000
        }, '-=800')
        // titulo hero
        .add({
            targets: '#hero-title .letter',
            translateY: ['100%', '0%'],
            translateZ: 0,
            opacity: [0, 1],
            duration: 1200,
            delay: anime.stagger(20)
        }, '-=1000')
        // subtitulo
        .add({
            targets: '#hero-subtitle',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1000
        }, '-=800')
        // boton
        .add({
            targets: '#btn-text .btn-letter',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            delay: anime.stagger(30)
        }, '-=800')
        // cuadricula de juegos
        .add({
            targets: '.game-card-wrapper',
            translateY: [100, 0],
            opacity: [0, 1],
            duration: 1000,
            delay: anime.stagger(150, { start: 300 })
        }, '-=1000');


    // 4. interaccion hover del boton principal (estilo lujoso)
    const btnWrapper = document.getElementById('main-play-btn');
    if (btnWrapper) {
        const btnRect = btnWrapper.querySelector('rect');
        const btnLetters = btnWrapper.querySelectorAll('.btn-letter');

        let hoverAnim;
        btnWrapper.addEventListener('mouseenter', () => {
            if (hoverAnim) hoverAnim.pause();
            hoverAnim = anime.timeline()
                .add({
                    targets: btnRect,
                    strokeDashoffset: [400, 0],
                    stroke: '#D4AF37', // dorado
                    duration: 600,
                    easing: 'easeOutQuart'
                })
                .add({
                    targets: btnLetters,
                    color: '#D4AF37',
                    scale: [1, 1.05],
                    duration: 300,
                    delay: anime.stagger(20),
                    easing: 'easeOutBack'
                }, 0);
        });

        btnWrapper.addEventListener('mouseleave', () => {
            if (hoverAnim) hoverAnim.pause();
            hoverAnim = anime.timeline()
                .add({
                    targets: btnRect,
                    strokeDashoffset: 400,
                    stroke: '#D4AF37',
                    duration: 600,
                    easing: 'easeOutQuart'
                })
                .add({
                    targets: btnLetters,
                    color: '#fff', // blanco roto
                    scale: 1,
                    duration: 300,
                    easing: 'easeOutQuad'
                }, 0);
        });
    }

    // 5. hover e inclinacion 3d lujosa en las tarjetas de juego
    document.querySelectorAll('.game-card-wrapper').forEach(cardWrap => {
        const crd = cardWrap.querySelector('.game-card');
        const svgBorder = cardWrap.querySelector('.card-svg-border rect');
        const icon = cardWrap.querySelector('.game-icon-svg');
        const desc = cardWrap.querySelector('.card-desc');

        cardWrap.addEventListener('mousemove', (e) => {
            const rect = cardWrap.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // rotacion sutil para efecto de peso
            const xRot = 10 * ((y - rect.height / 2) / rect.height);
            const yRot = -10 * ((x - rect.width / 2) / rect.width);
            crd.style.transform = `rotateX(${xRot}deg) rotateY(${yRot}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        cardWrap.addEventListener('mouseenter', () => {
            // dibujado de borde dorado
            anime.remove(svgBorder);
            anime({
                targets: svgBorder,
                strokeDashoffset: [1400, 0],
                strokeOpacity: [0, 1],
                stroke: '#D4AF37',
                duration: 800,
                easing: 'easeOutQuart'
            });
            // flotacion suave de icono
            anime.remove(icon);
            anime({
                targets: icon,
                translateZ: 40,
                scale: 1.1,
                opacity: 1,
                duration: 600,
                easing: 'easeOutBack'
            });
            // revelar descripcion
            anime.remove(desc);
            anime({
                targets: desc,
                translateY: [20, 0],
                opacity: [0, 1],
                duration: 400,
                delay: 100,
                easing: 'easeOutExpo'
            });
        });

        cardWrap.addEventListener('mouseleave', () => {
            crd.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            crd.style.transition = 'transform 0.5s ease-out';
            setTimeout(() => { crd.style.transition = ''; }, 500);

            anime.remove(svgBorder);
            anime({
                targets: svgBorder,
                strokeDashoffset: 1400,
                strokeOpacity: 0,
                duration: 800,
                easing: 'easeOutQuart'
            });

            anime.remove(icon);
            anime({
                targets: icon,
                translateZ: 0,
                scale: 1,
                opacity: 0.5,
                duration: 600,
                easing: 'easeOutQuad'
            });

            anime.remove(desc);
            anime({
                targets: desc,
                translateY: 20,
                opacity: 0,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });

});

// gancho para simular rodillos de saldo en carga
window.addEventListener('load', () => {
    const wAmt = document.getElementById('credits-amount');
    if (wAmt) {
        const obj = { val: 0 };
        anime({
            targets: obj,
            val: 15000,
            round: 1,
            duration: 3000,
            easing: 'easeOutExpo',
            update: () => { wAmt.innerText = obj.val.toLocaleString(); }
        });
    }
});

// funcion para inicializar el fondo lujoso (polvo estelar u hojas doradas)
function initLuxuryBackground() {
    const bgCanvas = document.getElementById('bg-canvas');
    if (!bgCanvas) return;
    const numParticles = 30; // denso

    for (let i = 0; i < numParticles; i++) {
        const p = document.createElement('div');
        p.classList.add('luxury-particle');

        // tamano aleatorio simulando lujo
        const size = Math.random() * 8 + 2;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${Math.random() * 100}vw`;
        p.style.top = `${Math.random() * 100}vh`;

        bgCanvas.appendChild(p);
    }

    // animacion de particulas
    anime({
        targets: '.luxury-particle',
        translateY: function () { return anime.random(-50, -150); },
        translateX: function () { return anime.random(-20, 20); },
        opacity: [0, 0.8, 0],
        rotate: function () { return anime.random(0, 360); },
        scale: function () { return anime.random(0.5, 1.5); },
        easing: 'linear',
        duration: function () { return anime.random(3000, 8000); },
        delay: function () { return anime.random(0, 5000); },
        loop: true
    });
}

// funcion para la puerta de edad estricta
function initAgeGate() {
    const isAdult = localStorage.getItem('casino_age_verified');
    if (isAdult === 'true') {
        return; // ya verificado
    }

    // crear modal si no existe, bloqueando toda la ui (z-index mas alto)
    let modal = document.getElementById('age-gate-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'age-gate-modal';
        modal.className = 'age-gate-overlay';

        modal.innerHTML = `
      <div class="age-gate-box">
        <h2 class="age-gate-title" data-i18n="age.title">ACCESO RESTRINGIDO</h2>
        <p class="age-gate-text" data-i18n="age.question">¿eres mayor de 18 anos?</p>
        <div class="age-gate-buttons">
          <button id="age-btn-yes" class="btn-luxury" data-i18n="age.yes">SI</button>
          <button id="age-btn-no" class="btn-luxury btn-outline" data-i18n="age.no">NO</button>
        </div>
      </div>
    `;
        document.body.appendChild(modal);

        // re-traducir inmediatamente si la instancia local existe
        if (window.languageManager) {
            window.languageManager.translateDOM();
        }
    }

    // prevenir scroll mientras modal este
    document.body.style.overflow = 'hidden';

    // acciones estrictamente binarias
    document.getElementById('age-btn-yes').addEventListener('click', () => {
        localStorage.setItem('casino_age_verified', 'true');
        // ocultar suavemente
        anime({
            targets: modal,
            opacity: 0,
            duration: 500,
            easing: 'easeOutQuad',
            complete: () => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });

    document.getElementById('age-btn-no').addEventListener('click', () => {
        // redirigir al jugador a sitio de juego responsable
        window.location.href = 'advertense.html';
    });
} 
