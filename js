// --- DOM ELEMENTS ---
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverModal = document.getElementById('game-over-modal');

const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const submitBtn = document.getElementById('submit-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const answerInput = document.getElementById('answer-input');

const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const difficultyDisplay = document.getElementById('difficulty-display');
const questionEl = document.getElementById('question');
const finalScoreEl = document.getElementById('final-score');

// --- GAME STATE ---
let score;
let timeLeft;
let timerInterval;
let currentDifficulty;
let currentAnswer;

const GAME_TIME = 30; // 30 seconds

// --- 1. START GAME ---
function startGame(difficulty) {
    currentDifficulty = difficulty;
    score = 0;
    timeLeft = GAME_TIME;
    
    // Update display
    scoreEl.textContent = score;
    timerEl.textContent = timeLeft;
    difficultyDisplay.textContent = difficulty;
    
    // Switch screens
    startScreen.classList.add('hidden');
    gameOverModal.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    generateQuestion();
    
    // Start timer
    timerInterval = setInterval(updateTimer, 1000);
}

// --- 2. UPDATE TIMER ---
function updateTimer() {
    timeLeft--;
    timerEl.textContent = timeLeft;
    
    if (timeLeft <= 0) {
        endGame();
    }
}

// --- 3. END GAME ---
function endGame() {
    clearInterval(timerInterval); // Stop the timer
    
    // Show game over modal
    finalScoreEl.textContent = score;
    gameOverModal.classList.remove('hidden');
    gameScreen.classList.add('hidden');
}

// --- 4. GENERATE QUESTION ---
function generateQuestion() {
    answerInput.value = ''; // Clear input
    
    let num1, num2, operation, question;

    // Generate numbers based on difficulty
    if (currentDifficulty === 'easy') {
        num1 = Math.floor(Math.random() * 10) + 1; // 1-10
        num2 = Math.floor(Math.random() * 10) + 1; // 1-10
        operation = Math.random() < 0.5 ? '+' : '-'; // Add or Subtract
        
        // Ensure subtraction is not negative
        if (operation === '-' && num1 < num2) {
            [num1, num2] = [num2, num1]; // Swap numbers
        }
        
    } else if (currentDifficulty === 'medium') {
        num1 = Math.floor(Math.random() * 11) + 2; // 2-12
        num2 = Math.floor(Math.random() * 11) + 2; // 2-12
        operation = '*'; // Multiplication only
        
    } else { // Hard
        const opType = Math.floor(Math.random() * 4); // 0-3
        
        if (opType === 0) { // Addition
            num1 = Math.floor(Math.random() * 50) + 10; // 10-59
            num2 = Math.floor(Math.random() * 50) + 10; // 10-59
            operation = '+';
        } else if (opType === 1) { // Subtraction
            num1 = Math.floor(Math.random() * 50) + 10; // 10-59
            num2 = Math.floor(Math.random() * 50) + 10; // 10-59
            if (num1 < num2) {
                [num1, num2] = [num2, num1]; // Swap
            }
            operation = '-';
        } else if (opType === 2) { // Multiplication
            num1 = Math.floor(Math.random() * 11) + 5; // 5-15
            num2 = Math.floor(Math.random() * 11) + 5; // 5-15
            operation = '*';
        } else { // Division (guaranteed whole number)
            num2 = Math.floor(Math.random() * 10) + 2; // 2-11
            currentAnswer = Math.floor(Math.random() * 10) + 2; // 2-11
            num1 = num2 * currentAnswer;
            operation = '/';
        }
    }

    // Calculate the answer
    if (operation === '+') currentAnswer = num1 + num2;
    if (operation === '-') currentAnswer = num1 - num2;
    if (operation === '*') currentAnswer = num1 * num2;
    // (Division answer is already set)

    // Format the question
    question = `What is ${num1} ${operation} ${num2}?`;
    questionEl.textContent = question;
}

// --- 5. CHECK ANSWER ---
function checkAnswer() {
    const userAnswer = parseInt(answerInput.value, 10);
    
    if (isNaN(userAnswer)) {
        return; // Ignore if input is not a number
    }

    if (userAnswer === currentAnswer) {
        score++;
        scoreEl.textContent = score;
    }
    
    generateQuestion(); // Generate next question
}

// --- EVENT LISTENERS ---

// Difficulty selection
difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        startGame(button.dataset.difficulty);
    });
});

// Submit answer
submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

// Play again
playAgainBtn.addEventListener('click', () => {
    // Hide modal and show start screen
    gameOverModal.classList.add('hidden');
    startScreen.classList.remove('hidden');
});
