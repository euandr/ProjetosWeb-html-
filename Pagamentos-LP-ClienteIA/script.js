// Função para copiar a chave PIX
function copyPixKey() {
    const pixKeyInput = document.getElementById('pixKey');
    const copyBtn = document.querySelector('.copy-btn');
    
    // Seleciona o texto
    pixKeyInput.select();
    pixKeyInput.setSelectionRange(0, 99999); // Para dispositivos móveis
    
    // Copia o texto
    navigator.clipboard.writeText(pixKeyInput.value).then(() => {
        // Feedback visual
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        copyBtn.style.background = '#27ae60';
        
        // Restaura o texto original após 2 segundos
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '#feca57';
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
        // Fallback para navegadores mais antigos
        document.execCommand('copy');
    });
}

// Animação de entrada para elementos
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .platform-card, .pricing-card, .guarantee-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Contador animado para estatísticas
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = stat.textContent;
        const isCurrency = target.includes('R$');
        const isPercentage = target.includes('%');
        
        if (isCurrency) {
            const number = parseInt(target.replace('R$ ', ''));
            animateNumber(stat, 0, number, 2000, 'R$ ');
        } else if (isPercentage) {
            const number = parseInt(target.replace('%', ''));
            animateNumber(stat, 0, number, 2000, '', '%');
        } else {
            const number = parseInt(target);
            animateNumber(stat, 0, number, 2000);
        }
    });
}

function animateNumber(element, start, end, duration, prefix = '', suffix = '') {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = prefix + current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Smooth scroll para links internos
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Efeito de parallax suave no hero
function initParallax() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    });
}

// Adiciona classe ativa ao menu quando scrollar
function initScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Efeito de hover nos cards
function initHoverEffects() {
    const cards = document.querySelectorAll('.feature-card, .platform-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Função para mostrar notificação
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Adiciona estilos CSS inline
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Anima a entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove após 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Inicializa todas as funcionalidades quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    initHoverEffects();
    initSmoothScroll();
    
    // Anima as estatísticas quando o hero estiver visível
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                heroObserver.unobserve(entry.target);
            }
        });
    });
    
    const hero = document.querySelector('.hero');
    if (hero) {
        heroObserver.observe(hero);
    }
    
    // Adiciona efeito de clique nos botões de contato
    const contactButtons = document.querySelectorAll('.contact-btn');
    contactButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const platform = button.classList.contains('whatsapp') ? 'WhatsApp' : 'Instagram';
            showNotification(`Abrindo ${platform}...`, 'success');
        });
    });
});

// Adiciona efeito de loading suave
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}); 