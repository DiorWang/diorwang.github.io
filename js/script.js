let currentLang = 'en';
let lightboxTrigger = null;

// Show section
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    const section = document.getElementById(sectionId);
    if (!section) {
        return;
    }
    section.classList.remove('hidden');
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('onclick') === `showSection('${sectionId}')`);
    });
}

// Toggle language
function toggleLanguage(shouldAnimate = true) {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    document.querySelectorAll('[data-zh]').forEach(element => {
        element.textContent = currentLang === 'zh' 
            ? element.getAttribute('data-zh') 
            : element.getAttribute('data-en');
    });
    document.querySelector('.lang-switch').textContent = currentLang === 'zh' ? 'EN' : '中';
    
    if(shouldAnimate) {
        document.querySelectorAll('section').forEach(section => {
            section.style.animation = 'none';
            void section.offsetHeight;
            section.style.animation = 'fadeIn 0.6s forwards';
        });
    }
}

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    updateThemeButton(theme);
}

function updateThemeButton(theme) {
    const themeSwitch = document.querySelector('.theme-switch');
    if (!themeSwitch) {
        return;
    }
    const icon = themeSwitch.querySelector('i');
    const isDark = theme === 'dark';
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    themeSwitch.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

function toggleTheme() {
    const currentTheme = document.documentElement.dataset.theme;
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

// Toggle achievement dropdown
function toggleDropdown(header) {
    const icon = header.querySelector('.dropdown-icon');
    const content = header.closest('.timeline-content');
    const isExpanded = content.classList.toggle('expanded');
    header.setAttribute('aria-expanded', String(isExpanded));
    icon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
}

function openImageLightbox(image) {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImage = lightbox.querySelector('.image-lightbox-image');
    lightboxTrigger = image;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.image-lightbox-close').focus();
}

function closeImageLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox.getAttribute('aria-hidden') === 'true') {
        return;
    }
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.querySelector('.image-lightbox-image').removeAttribute('src');
    document.body.style.overflow = '';
    if (lightboxTrigger) {
        lightboxTrigger.focus();
        lightboxTrigger = null;
    }
}

function sortAchievements() {
    const container = document.querySelector('.timeline-container');
    if (!container) {
        return;
    }
    Array.from(container.querySelectorAll('.timeline-item'))
        .sort((first, second) => second.dataset.date.localeCompare(first.dataset.date))
        .forEach(item => container.appendChild(item));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
    } else {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        updateThemeButton(systemPrefersDark ? 'dark' : 'light');
    }

    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    systemTheme.addEventListener('change', event => {
        if (!localStorage.getItem('theme')) {
            updateThemeButton(event.matches ? 'dark' : 'light');
        }
    });

    const nameElement = document.querySelector('.name');
    if (nameElement) {
        setTimeout(() => {
            nameElement.style.animation = 'slideUp 0.5s forwards';
        }, 500);
    }
    
    // Initialize dropdown icons
    document.querySelectorAll('.dropdown-icon').forEach(icon => {
        icon.style.transition = 'transform 0.3s ease';
    });

    document.querySelectorAll('.achievement-header').forEach(header => {
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        header.setAttribute('aria-expanded', 'false');
        header.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleDropdown(header);
            }
        });
    });

    document.querySelectorAll('.achievement-media img').forEach(image => {
        image.setAttribute('role', 'button');
        image.setAttribute('tabindex', '0');
        image.setAttribute('aria-haspopup', 'dialog');
        image.addEventListener('click', () => openImageLightbox(image));
        image.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openImageLightbox(image);
            }
        });
    });

    const imageLightbox = document.getElementById('image-lightbox');
    imageLightbox.querySelector('.image-lightbox-close').addEventListener('click', closeImageLightbox);
    imageLightbox.addEventListener('click', event => {
        if (event.target === imageLightbox) {
            closeImageLightbox();
        }
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeImageLightbox();
        }
    });
    
    showSection('home');
    sortAchievements();
    
});
