// Smooth transition for result container
window.addEventListener('DOMContentLoaded', () => {
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.style.transition = 'opacity 0.5s, transform 0.5s';
    setTimeout(() => {
        resultContainer.style.opacity = '1';
        resultContainer.style.transform = 'translateY(0)';
    }, 100);
});

// Add this code to the displayResult function in scripts.js
document.getElementById('originalEssay').innerText = result.original_essay;
document.getElementById('revisedEssay').innerText = result.revised_essay;

