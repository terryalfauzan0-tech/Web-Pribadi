// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation (Intersection Observer)
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80, // Adjust for sticky header
                behavior: 'smooth'
            });
        }
    });
});

// Mobile Menu Toggle (Basic)
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        // Here you could implement a real mobile overlay
        // For now, let's keep it simple or expand if needed
        alert('Menu Mobile akan segera hadir di versi selanjutnya!');
    });
}

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const html = document.documentElement;

// Function to set theme
function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update Icon
    if (theme === 'light') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

// Initialize Theme
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    setTheme(savedTheme);
} else if (prefersDark) {
    setTheme('dark');
} else {
    setTheme('light');
}

// Toggle Event
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// Custom Cursor Logic with Smooth Lerp
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0; // Mouse position
let cursorX = 0, cursorY = 0; // Current dot position
let followerX = 0, followerY = 0; // Current follower position

if (cursor && follower) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth movement loop
    function animateCursor() {
        // Lerp for Dot (very fast)
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Lerp for Follower (slower/smooth)
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Web Audio API for Sound
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    function playClickSound() {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }

    // Particle Explosion Logic
    function createExplosion(x, y) {
        const particleCount = 12;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            document.body.appendChild(particle);

            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const velocity = 50 + Math.random() * 100;
            const tx = Math.cos(angle) * velocity + 'px';
            const ty = Math.sin(angle) * velocity + 'px';

            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--tx', tx);
            particle.style.setProperty('--ty', ty);
            particle.style.animation = 'particle-explode 0.6s ease-out forwards';

            // Clean up
            setTimeout(() => particle.remove(), 600);
        }
    }

    // Click effect
    document.addEventListener('mousedown', (e) => {
        document.body.classList.add('cursor-clicked');
        createExplosion(e.clientX, e.clientY);
        playClickSound();
    });
    
    document.addEventListener('mouseup', () => document.body.classList.remove('cursor-clicked'));

    // Hover effect for links and buttons
    const interactiveElements = document.querySelectorAll('a, .btn, .skill-item, .stat-card, .social-icon, #theme-toggle');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

// --- Interactive Liquid Glow Animation ---
class FluidAnimation {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numberOfParticles = 12;
        this.mouse = { x: null, y: null, radius: 250 };
        
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => {
            this.resize();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    init() {
        this.resize();
        this.particles = [];
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        // Subtle clear to leave trails
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            this.ctx.fillStyle = 'rgba(248, 250, 252, 0.4)'; // Match --bg-color
        } else {
            this.ctx.fillStyle = 'rgba(5, 5, 5, 0.4)'; // Match --bg-color
        }
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });
        requestAnimationFrame(this.animate.bind(this));
    }
}

class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 200 + 150;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.friction = 0.95;
        this.ease = 0.05;
    }

    draw(ctx) {
        const theme = document.documentElement.getAttribute('data-theme');
        let color1, color2;
        
        if (theme === 'light') {
            color1 = 'rgba(14, 165, 233, 0.2)'; // Light primary
            color2 = 'rgba(2, 132, 199, 0.0)';
        } else {
            color1 = 'rgba(0, 210, 255, 0.15)'; // Dark primary
            color2 = 'rgba(58, 123, 213, 0.0)';
        }

        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    update(mouse) {
        // Friction / Base movement
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction (Floating follow)
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                this.x += dx * force * this.ease;
                this.y += dy * force * this.ease;
            }
        }

        // Bouncing logic
        if (this.x < -this.size) this.x = this.canvasWidth + this.size;
        if (this.x > this.canvasWidth + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = this.canvasHeight + this.size;
        if (this.y > this.canvasHeight + this.size) this.y = -this.size;
    }
}

// Initial check for reveals on load
window.addEventListener('load', () => {
    new FluidAnimation(); // Start the new animation
    
    revealElements.forEach(element => {
        if (element.getBoundingClientRect().top < window.innerHeight) {
            element.classList.add('active');
        }
    });
});
