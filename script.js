// Menu do celular, topo ao rolar, filtro do cardápio e animações ao aparecer.
document.documentElement.classList.remove('sem-js');

document.addEventListener('DOMContentLoaded', () => {

    // Menu do celular
    const burger = document.getElementById('burger');
    const navMenu = document.getElementById('nav-menu');
    const icone = burger.querySelector('i');

    function fecharMenu() {
        navMenu.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Abrir menu');
        icone.classList.replace('fa-times', 'fa-bars');
    }

    burger.addEventListener('click', () => {
        const aberto = navMenu.classList.toggle('active');
        burger.setAttribute('aria-expanded', aberto ? 'true' : 'false');
        burger.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
        icone.classList.toggle('fa-bars', !aberto);
        icone.classList.toggle('fa-times', aberto);
    });
    navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', fecharMenu));

    // Topo mais sólido depois de rolar
    const navbar = document.getElementById('navbar');
    const calmo = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('rolou', window.scrollY > 50);
    }, { passive: true });

    // Filtro do cardápio
    const tabs = document.querySelectorAll('.menu-tab');
    const cards = document.querySelectorAll('.product-card');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-pressed', 'false'); });
            tab.classList.add('active');
            tab.setAttribute('aria-pressed', 'true');
            const filtro = tab.dataset.filter;
            cards.forEach(card => {
                const mostra = filtro === 'all' || card.dataset.category === filtro;
                card.hidden = !mostra;
                if (mostra) card.classList.add('active');
            });
        });
    });

    // Menu mostra em que parte da página a pessoa está
    const links = document.querySelectorAll('.nav-link');
    const secoes = [...links].map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
    if ('IntersectionObserver' in window) {
        const espiao = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                links.forEach(l => l.setAttribute('aria-current', l.getAttribute('href') === '#' + entry.target.id ? 'true' : 'false'));
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        secoes.forEach(s => espiao.observe(s));
    }

    // Cartões do cardápio entram um pouco depois do outro
    cards.forEach((card, i) => card.style.setProperty('--atraso', (i % 3) * 0.08 + 's'));

    // Animação ao aparecer na tela
    const reveals = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || calmo) {
        reveals.forEach(el => el.classList.add('active'));
        return;
    }
    const observador = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => observador.observe(el));
});
