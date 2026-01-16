/**
 * Interactive Particle Background
 * Creates a subtle constellation effect that reacts to mouse movement.
 */

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

// Configuration
const PARTICLE_COUNT = 60;
const CONNECTION_DISTANCE = 150;
const MOUSE_DISTANCE = 200;
const PARTICLE_COLOR = 'rgba(236, 72, 153, '; // Pink/Rose base (r, g, b, 
const BACKGROUND_COLOR = '#FDF2F8'; // Tailwind pink-50 very light

// Mouse state
const mouse = { x: null, y: null };

document.body.appendChild(canvas);
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < MOUSE_DISTANCE) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (MOUSE_DISTANCE - distance) / MOUSE_DISTANCE;
                const directionX = forceDirectionX * force * this.size * 0.05;
                const directionY = forceDirectionY * force * this.size * 0.05;

                // Move away from mouse slightly
                this.x -= directionX * 2;
                this.y -= directionY * 2;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = PARTICLE_COLOR + this.opacity + ')';
        ctx.fill();
    }
}

function init() {
    resize();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Optional: Draw background if not set in CSS
    // ctx.fillStyle = BACKGROUND_COLOR;
    // ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Draw connections
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONNECTION_DISTANCE) {
                ctx.beginPath();
                ctx.strokeStyle = PARTICLE_COLOR + (1 - distance / CONNECTION_DISTANCE) * 0.2 + ')';
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

// Event Listeners
window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});
window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

init();
animate();
