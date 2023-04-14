document.addEventListener('DOMContentLoaded', () => {
    const essayForm = document.getElementById('essayForm');
    essayForm.style.transition = 'opacity 0.5s, transform 0.5s';
    
    setTimeout(() => {
        essayForm.style.opacity = '1';
        essayForm.style.transform = 'translateY(0)';
    }, 100);
});

const wordCount = document.getElementById('wordCount');
const essayText = document.getElementById('essayText');

essayText.addEventListener('input', () => {
    const words = essayText.value.trim().split(/\s+/);
    const wordCountVal = words.length === 1 && words[0] === '' ? 0 : words.length;
    wordCount.textContent = `${wordCountVal} words`;
});

const essayForm = document.getElementById('essayForm');
essayForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const evaluatingMessage = document.getElementById('evaluatingMessage');
    const progressContainer = document.querySelector('.progress-container');
    const progressBar = document.querySelector('.progress-bar');
    evaluatingMessage.style.display = 'block';
    progressContainer.style.display = 'block';

    let progressValue = 0;
    const updateProgressBar = () => {
        if (progressValue < 100) {
            progressValue += Math.random() * 10;
            progressBar.style.width = Math.min(progressValue, 100) + '%';
            progressBar.querySelector('.progress-percentage').textContent = Math.min(Math.floor(progressValue), 100) + '%';
            setTimeout(updateProgressBar, 500);
        }
    };
    updateProgressBar();

    const formData = new FormData(essayForm);
    const request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                const response = JSON.parse(request.responseText);
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = '/result';

                for (const key in response) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = response[key];
                    form.appendChild(input);
                }

                setTimeout(() => {
                  document.body.appendChild(form);
                  form.submit();
                }, 10); // Adjust this value to control how long the progress bar takes to fill up (in milliseconds)
            } else {
                console.error('Error occurred while evaluating the essay');
            }
        }
    };

    request.open('POST', '/');
    request.send(formData);
});
