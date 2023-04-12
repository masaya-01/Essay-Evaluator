// Smooth transition for result container
window.addEventListener('DOMContentLoaded', () => {
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.style.transition = 'opacity 0.5s, transform 0.5s';
    setTimeout(() => {
        resultContainer.style.opacity = '1';
        resultContainer.style.transform = 'translateY(0)';
    }, 100);
});
