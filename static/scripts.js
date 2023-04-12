// Smooth form transition
window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('essayForm');
    form.style.transition = 'opacity 0.5s, transform 0.5s';
    setTimeout(() => {
        form.style.opacity = '1';
        form.style.transform = 'translateY(0)';
    }, 100);
});

// Word counter for essay textarea
const wordCount = document.getElementById('wordCount');
const essayText = document.getElementById('essayText');

essayText.addEventListener('input', () => {
    const words = essayText.value.trim().split(/\s+/);
    const wordCountVal = words.length === 1 && words[0] === '' ? 0 : words.length;
    wordCount.textContent = `${wordCountVal} words`;
});

