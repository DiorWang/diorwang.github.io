let currentLang = 'en';

// 切換頁面
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

// 語言切換
function toggleLanguage(shouldAnimate = true) {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    document.querySelectorAll('[data-zh]').forEach(element => {
        element.textContent = currentLang === 'zh' 
            ? element.getAttribute('data-zh') 
            : element.getAttribute('data-en');
    });
    document.querySelector('.lang-switch').textContent = currentLang === 'zh' ? 'EN' : '中';
    
    if(shouldAnimate) {
        // 触发重新动画
        document.querySelectorAll('section').forEach(section => {
            section.style.animation = 'none';
            void section.offsetHeight; // 触发重绘
            section.style.animation = 'fadeIn 0.6s forwards';
        });
    }
}
// 初始化動畫
document.addEventListener('DOMContentLoaded', () => {
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        setTimeout(() => {
            nameElement.style.animation = 'slideUp 0.5s forwards';
        }, 500);
    }
    showSection('home');
});