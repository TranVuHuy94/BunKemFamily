document.addEventListener('DOMContentLoaded', async () => {
    // Typewriter effect function
    async function typeWriter(element, speed = 50) {
        // Keep the original content structure but clear it from DOM
        const originalNodes = Array.from(element.childNodes);
        element.innerHTML = '';
        element.style.opacity = '1';

        for (const node of originalNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                const textNode = document.createTextNode('');
                element.appendChild(textNode);
                for (const char of text) {
                    textNode.textContent += char;
                    await new Promise(r => setTimeout(r, speed));
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // For elements like span, we clone the tag but type its content
                const clone = node.cloneNode(false); // shallow clone
                element.appendChild(clone);
                // Recursively type into the child element
                // We use the original node as the source of truth for content
                await typeWriterSource(clone, node, speed);
            }
        }
    }

    // Helper to type into a destination using a source node's content
    async function typeWriterSource(dest, source, speed) {
        const nodes = Array.from(source.childNodes);
        for (const node of nodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                const textNode = document.createTextNode('');
                dest.appendChild(textNode);
                for (const char of text) {
                    textNode.textContent += char;
                    await new Promise(r => setTimeout(r, speed));
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const clone = node.cloneNode(false);
                dest.appendChild(clone);
                await typeWriterSource(clone, node, speed);
            }
        }
    }

    // Main execution sequence
    const greeting = document.querySelector('.greeting');
    const paragraphs = document.querySelectorAll('.letter-body p');

    // Initial state
    if (greeting) greeting.style.opacity = '0';
    if (paragraphs) paragraphs.forEach(p => p.style.opacity = '0'); // Hide initially

    // 1. Reveal Date
    const date = document.querySelector('.letter-date');
    // Date animation is handled by CSS (fadeInUp), let's keep it or wait for it.
    // CSS delay is 0.3s. Let's wait a bit.
    await new Promise(r => setTimeout(r, 1000));

    // 2. Type Greeting
    if (greeting) {
        greeting.style.opacity = '1';
        await typeWriter(greeting, 70);
    }

    // 3. Type Paragraphs
    if (paragraphs) {
        for (const p of paragraphs) {
            p.style.opacity = '1';
            await typeWriter(p, 40); // Slightly faster for body text
            await new Promise(r => setTimeout(r, 300)); // Pause between paragraphs
        }
    }
});
