/**
 * DRA. JANAÍNA GABRIEL - ADVOCACIA PREVIDENCIÁRIA E TRABALHISTA
 * Scripts de Interatividade, Rolagem e Sobreposição (Hover)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar Ícones Lucide
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. Elementos DOM
    const header = document.getElementById('header');
    const scrollProgress = document.getElementById('scroll-progress');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const interactiveCards = document.querySelectorAll('.interactive-card');
    const sections = document.querySelectorAll('section[id]');
    const currentYearEl = document.getElementById('current-year');

    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // 3. Barra de Progresso da Rolagem & Header Fixo
    const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        // Atualizar barra de progresso no topo
        if (scrollProgress) {
            scrollProgress.style.width = `${scrollPercentage}%`;
        }

        // Header translúcido/vidro
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Link Spy baseado na posição da rolagem
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 4. Menu Mobile
    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('is-open');
            const isOpen = mainNav.classList.contains('is-open');
            mobileToggle.setAttribute('aria-expanded', isOpen);
            
            // Animação do ícone hamburger
            const bars = mobileToggle.querySelectorAll('.hamburger-bar');
            if (isOpen) {
                bars[0].style.transform = 'translateY(7px) rotate(45deg)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Fechar menu mobile ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('is-open')) {
                    mainNav.classList.remove('is-open');
                    const bars = mobileToggle.querySelectorAll('.hamburger-bar');
                    bars[0].style.transform = 'none';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'none';
                }
            });
        });
    }

    // 5. Efeito Avançado de Sobreposição & Brilho no Mouse (Mouse Spotlight Overlay)
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Define variáveis CSS para iluminar onde o mouse passa
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Leve inclinação 3D no desktop (exceto cards que possuem sobreposição total)
            if (window.innerWidth > 992 && !card.classList.contains('atuacao-card')) {
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -4;
                const rotateY = ((x - centerX) / centerX) * 4;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            if (window.innerWidth > 992 && !card.classList.contains('atuacao-card')) {
                card.style.transform = '';
            }
        });
    });

    // 6. Animações de Revelação ao Rolar (Scroll Reveal via IntersectionObserver)
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-left, .reveal-right');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('is-revealed'));
    }

    // 7. Rolagem Suave para âncoras internas
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header.offsetHeight || 70;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// 8. Envio do Formulário de Contato Direto para o WhatsApp da Dra. Janaína Gabriel
window.handleFormSubmit = function(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const area = document.getElementById('area').value;
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!nome || !telefone || !area || !mensagem) {
        alert('Por favor, preencha todos os campos do formulário para agilizar sua consulta.');
        return;
    }

    // Formata mensagem para o WhatsApp da Dra. Janaína Gabriel: (17) 99164-1128
    const mensagemFormatada = 
        `⚖️ *SOLICITAÇÃO DE CONSULTA JURÍDICA*\n` +
        `🏛️ *Dra. Janaína Gabriel - Advocacia Previdenciária e Trabalhista*\n\n` +
        `👤 *Nome:* ${nome}\n` +
        `📱 *Telefone/WhatsApp:* ${telefone}\n` +
        `📂 *Assunto:* ${area}\n` +
        `📝 *Resumo do Caso:*\n${mensagem}\n\n` +
        `_Mensagem enviada através do site oficial da Dra. Janaína Gabriel._`;

    const encodedText = encodeURIComponent(mensagemFormatada);
    const whatsappUrl = `https://wa.me/5517991641128?text=${encodedText}`;

    // Abrir em nova aba do WhatsApp
    window.open(whatsappUrl, '_blank');
};

