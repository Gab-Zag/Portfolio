const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');
const navLinks = nav.querySelectorAll('a');
const header = document.getElementById('header');
const backToTop = document.getElementById('back-to-top');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});

window.addEventListener('scroll', () => {
    // Header shrink
    if(window.scrollY > 80){
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    if(window.scrollY > 400){
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }

    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if(window.scrollY >= sectionTop){
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href') === `#${current}`){
            link.classList.add('active');
        }
    });

    // Skill bars animation
    animateSkillBars();
});

function animateSkillBars(){
    const bars = document.querySelectorAll('.progress');
    bars.forEach(bar => {
        const rect = bar.parentElement.getBoundingClientRect();
        if(rect.top < window.innerHeight - 50 && !bar.classList.contains('animated')){
            bar.style.width = bar.parentElement.dataset.width || bar.style.width;
            bar.classList.add('animated');
        }
    });
}

document.querySelectorAll('.progress').forEach(bar => {
    const w = bar.style.width;
    bar.parentElement.dataset.width = w;
    bar.style.width = '0';
});

const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .timeline-item, .exp-card, .contact-item, .badge').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
    observer.observe(el);
});

document.addEventListener('animationend', () => {}, true);

const style = document.createElement('style');
style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

const form = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    try {
        const response = await fetch('https://SEU-BACKEND.railway.app/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name:    document.getElementById('name').value,
                email:   document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
            })
        });

        if (response.ok) {
            formSuccess.textContent = '✓ Mensagem enviada com sucesso!';
            formSuccess.style.color = '#4caf50';
            form.reset();
        } else {
            throw new Error('Erro no servidor');
        }
    } catch (err) {
        formSuccess.textContent = '✗ Erro ao enviar. Tente novamente.';
        formSuccess.style.color = '#f44336';
    } finally {
        btn.textContent = 'Enviar Mensagem';
        btn.disabled = false;
        formSuccess.classList.add('show');
        setTimeout(() => formSuccess.classList.remove('show'), 4000);
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
        const target = document.querySelector(this.getAttribute('href'));
        if(target){
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
