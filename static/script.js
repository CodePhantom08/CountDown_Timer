let timerInterval;

function updateTimerDisplay(time) {
    document.getElementById('timeLeft').innerText = time;
}

function showMessage(message, color = 'green') {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.innerText = message;
    statusMessage.style.color = color;
}

async function startTimer() {
    const time = parseInt(document.getElementById('timerInput').value);
    if (isNaN(time) || time <= 0) {
        showMessage('Please enter a valid number of seconds.', 'red');
        return;
    }
    
    const response = await fetch('/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ time: time })
    });
    
    const data = await response.json();
    if (response.ok) {
        showMessage(data.message);
        countdown();
    } else {
        showMessage(data.message, 'red');
    }
}

async function stopTimer() {
    const response = await fetch('/stop', {
        method: 'POST',
    });

    const data = await response.json();
    if (response.ok) {
        showMessage(data.message);
        clearInterval(timerInterval);
    } else {
        showMessage(data.message, 'red');
    }
}

async function countdown() {
    timerInterval = setInterval(async () => {
        const response = await fetch('/status');
        const data = await response.json();
        updateTimerDisplay(data.time_left);
        
        if (data.time_left <= 0) {
            clearInterval(timerInterval);
        }
    }, 1000);
}
