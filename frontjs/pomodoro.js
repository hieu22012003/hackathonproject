let timer;
let timeLeft = 25 * 60;
let sessionCount = 0;
let isBreak = false;

function setPomodoro() {
    clearInterval(timer);
    timeLeft = 25 * 60;
    document.getElementById('timer').innerText = '25:00';
    document.getElementById('pomodoro-button').classList.add('active');
    document.getElementById('short-break-button').classList.remove('active');
    document.getElementById('long-break-button').classList.remove('active');
    isBreak = false;
}

function setShortBreak() {
    clearInterval(timer);
    timeLeft = 5 * 60;
    document.getElementById('timer').innerText = '05:00';
    document.getElementById('pomodoro-button').classList.remove('active');
    document.getElementById('short-break-button').classList.add('active');
    document.getElementById('long-break-button').classList.remove('active');
    isBreak = true;
}

function setLongBreak() {
    clearInterval(timer);
    timeLeft = 15 * 60;
    document.getElementById('timer').innerText = '15:00';
    document.getElementById('pomodoro-button').classList.remove('active');
    document.getElementById('short-break-button').classList.remove('active');
    document.getElementById('long-break-button').classList.add('active');
    isBreak = true;
}

function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timer);
        if (isBreak) {
            if (document.getElementById('short-break-button').classList.contains('active')) {
                setPomodoro();
            } else if (document.getElementById('long-break-button').classList.contains('active')) {
                setPomodoro();
            }
        } else {
            sessionCount++;
            if (sessionCount % 4 === 0) {
                setLongBreak();
            } else {
                setShortBreak();
            }
        }
        startTimer(); // Start the timer for the next session or break
    }

    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById('timer').innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    timeLeft--;
}

// Drag and drop functionality
dragElement(document.getElementById("timer-container"));

function dragElement(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Get the mouse cursor position at startup
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calculate the new cursor position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Set the element's new position
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // Stop moving when mouse button is released
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
function toggleTimer() {
    const timer = document.getElementById('timer-container');
    if (timer.style.display === 'none') {
        timer.style.display = 'block';
    } else {
        timer.style.display = 'none';
    }
}