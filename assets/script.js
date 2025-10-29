// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
const nav = document.getElementById('navigation');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Skills data
const skills = [
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "Laravel", icon: "https://files.svgcdn.io/material-icon-theme/laravel.svg" },
    { name: "HTML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "TailwindCSS", icon: "https://files.svgcdn.io/devicon/tailwindcss.svg" },
    { name: "CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "Vite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" },
    { name: "GitHub", icon: "https://files.svgcdn.io/simple-icons/github.svg" },
    { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
    { name: "Canva", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg" },
    { name: "Power BI", icon: "https://files.svgcdn.io/logos/microsoft-power-bi.svg" },
    { name: "Tableau", icon: "https://files.svgcdn.io/logos/tableau-icon.svg" },
    { name: "Google Sheets", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" },
    { name: "MS Excel", icon: "https://files.svgcdn.io/vscode-icons/file-type-excel.svg" },
    { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
];

// Create skill badges for marquee
function createSkillBadges(containerId, addGradient = false) {
    const container = document.getElementById(containerId);
    const duplicatedSkills = [...skills, ...skills]; // Duplicate for seamless loop
    
    duplicatedSkills.forEach(skill => {
        const badge = document.createElement('div');
        badge.className = addGradient ? 'skill-badge skill-badge-gradient' : 'skill-badge';
        
        const icon = document.createElement('img');
        icon.src = skill.icon;
        icon.alt = `${skill.name} icon`;
        icon.className = 'skill-icon';
        
        const text = document.createElement('span');
        text.textContent = skill.name;
        
        badge.appendChild(icon);
        badge.appendChild(text);
        container.appendChild(badge);
    });
}

// Initialize skill marquees
createSkillBadges('marquee-forward', false);
createSkillBadges('marquee-reverse', true);


// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = nav.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections except hero (which animates on load)
document.querySelectorAll('section:not(#home)').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

// Add hover effect to project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.borderColor = 'var(--color-primary)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.borderColor = 'var(--color-border)';
    });
});

// Typing effect
const typingText = document.querySelector('.typing-text');
const words = ['IT Student', 'Web Developer', 'Designer'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];
    const currentChar = currentWord.substring(0, charIndex);
    typingText.textContent = currentChar;

    if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        setTimeout(typeEffect, 200);
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(typeEffect, 100);
    } else {
        isDeleting = !isDeleting;
        wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
        setTimeout(typeEffect, 1000);
    }
}

typeEffect();

// Console message
console.log('%c👋 Hello! Thanks for checking out my portfolio!', 'color: #a78bfa; font-size: 16px; font-weight: bold;');
console.log('%cFeel free to reach out if you want to collaborate!', 'color: #06b6d4; font-size: 14px;');
