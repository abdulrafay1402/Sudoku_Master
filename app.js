// DOM elements
const gridContainer = document.getElementById('grid');
const sizeButtons = document.querySelectorAll('.size-btn');
const generateButton = document.querySelector('.btn-generate');
const solveButton = document.querySelector('.btn-solve');
const clearButton = document.querySelector('.btn-clear');
const checkButton = document.querySelector('.btn-check');
const difficultyButtons = document.querySelectorAll('.btn');
const timerElement = document.getElementById('time');
const scoreElement = document.getElementById('score');

// Game state
let gridSize = 9;
let selectedCell = null;
let startTime = null;
let timerInterval = null;
let score = 0;

// Initialize the app
function init() {
    createGrid(gridSize);
    setupEventListeners();
}

// Create the Sudoku grid
function createGrid(size) {
    gridContainer.innerHTML = '';
    gridSize = size;

    // Set grid template based on size
    gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    // Create cells
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;

        // Add thicker borders for subgrids
        const subgridSize = Math.sqrt(size);
        const row = Math.floor(i / size);
        const col = i % size;

        if ((col + 1) % subgridSize === 0 && col !== size - 1) {
            cell.classList.add('border-right-thick');
        }

        if ((row + 1) % subgridSize === 0 && row !== size - 1) {
            cell.classList.add('border-bottom-thick');
        }

        gridContainer.appendChild(cell);
    }
}

// Set up event listeners
function setupEventListeners() {
    // Grid size selection
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Check if 16x16 is being selected on mobile
            if (button.dataset.size === '16' && window.innerWidth <= 768) {
                alert('16x16 puzzles are only available on desktop devices.');
                return;
            }

            sizeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            createGrid(parseInt(button.dataset.size));
        });
    });

    // Generate new puzzle
    generateButton.addEventListener('click', generatePuzzle);

    // Solve puzzle
    solveButton.addEventListener('click', solvePuzzle);

    // Check solution
    checkButton.addEventListener('click', checkSolution);

    // Clear grid
    clearButton.addEventListener('click', clearGrid);

    // Difficulty selection
    difficultyButtons.forEach(button => {
        if (button.classList.contains('btn-easy')) {
            button.addEventListener('click', () => generatePuzzle('easy'));
        } else if (button.classList.contains('btn-medium')) {
            button.addEventListener('click', () => generatePuzzle('medium'));
        } else if (button.classList.contains('btn-hard')) {
            button.addEventListener('click', () => generatePuzzle('hard'));
        } else if (button.classList.contains('btn-expert')) {
            button.addEventListener('click', () => generatePuzzle('expert'));
        }
    });

    // Cell selection
    gridContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('cell')) {
            selectCell(e.target);
        }
    });

    // Keyboard input
    document.addEventListener('keydown', handleKeyPress);
}

// Select a cell
function selectCell(cell) {
    if (selectedCell) {
        selectedCell.classList.remove('selected');
    }

    selectedCell = cell;
    cell.classList.add('selected');
}

// Handle keyboard input
function handleKeyPress(e) {
    if (!selectedCell) return;

    const key = e.key;

    // Number input
    if (/[1-9]/.test(key) && gridSize >= 9) {
        selectedCell.textContent = key;
        selectedCell.classList.add('user-input');
        selectedCell.classList.remove('error');
    } else if (/[1-4]/.test(key) && gridSize === 4) {
        selectedCell.textContent = key;
        selectedCell.classList.add('user-input');
        selectedCell.classList.remove('error');
    } else if (/[1-9A-G]/.test(key) && gridSize === 16) {
        selectedCell.textContent = key;
        selectedCell.classList.add('user-input');
        selectedCell.classList.remove('error');
    } else if (key === 'Delete' || key === 'Backspace') {
        selectedCell.textContent = '';
        selectedCell.classList.remove('user-input', 'error');
    }
}

// Generate a new puzzle
function generatePuzzle(difficulty = 'medium') {
    // Clear the grid completely before generating a new puzzle
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('fixed', 'user-input', 'error', 'selected');
    });
    
    selectedCell = null;

    let fillCount;

    switch (difficulty) {
        case 'easy':
            fillCount = Math.floor(gridSize * gridSize * 0.5);
            break;
        case 'medium':
            fillCount = Math.floor(gridSize * gridSize * 0.4);
            break;
        case 'hard':
            fillCount = Math.floor(gridSize * gridSize * 0.3);
            break;
        case 'expert':
            fillCount = Math.floor(gridSize * gridSize * 0.25);
            break;
        default:
            fillCount = Math.floor(gridSize * gridSize * 0.4);
    }

    for (let i = 0; i < fillCount; i++) {
        const randomIndex = Math.floor(Math.random() * cells.length);
        let randomValue;

        if (gridSize === 4) {
            randomValue = Math.floor(Math.random() * 4) + 1;
        } else if (gridSize === 9) {
            randomValue = Math.floor(Math.random() * 9) + 1;
        } else if (gridSize === 16) {
            randomValue = (Math.floor(Math.random() * 16) + 1).toString(16).toUpperCase();
        }

        // Make sure we don't overwrite a cell that already has a value
        if (!cells[randomIndex].textContent) {
            cells[randomIndex].textContent = randomValue;
            cells[randomIndex].classList.add('fixed');
        } else {
            // If the cell already has a value, try again
            i--;
        }
    }

    startTimer();
}

// Solve the puzzle
function solvePuzzle() {
    // In a real implementation, this would solve the puzzle
    // For this example, we'll just fill all cells with valid numbers

    const cells = document.querySelectorAll('.cell');

    cells.forEach(cell => {
        if (!cell.textContent) {
            let value;

            if (gridSize === 4) {
                value = Math.floor(Math.random() * 4) + 1;
            } else if (gridSize === 9) {
                value = Math.floor(Math.random() * 9) + 1;
            } else if (gridSize === 16) {
                value = (Math.floor(Math.random() * 16) + 1).toString(16).toUpperCase();
            }

            cell.textContent = value;
            cell.classList.remove('user-input', 'error');
        }
    });

    stopTimer();
    updateScore(1000); // Bonus for solving
}

// Check the solution
function checkSolution() {
    const cells = document.querySelectorAll('.cell');
    let hasErrors = false;

    // Simple validation - just mark empty cells as errors for demo
    cells.forEach(cell => {
        if (!cell.textContent) {
            cell.classList.add('error');
            hasErrors = true;
        }
    });

    if (!hasErrors) {
        alert('Congratulations! Your solution is correct!');
        updateScore(500);
    } else {
        alert('There are errors in your solution. Please check again.');
    }
}

// Clear the grid
function clearGrid() {
    const cells = document.querySelectorAll('.cell');

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('fixed', 'user-input', 'error', 'selected');
    });
    
    selectedCell = null;

    stopTimer();
    timerElement.textContent = '00:00';
}

// Start the timer
function startTimer() {
    stopTimer();
    startTime = new Date();

    timerInterval = setInterval(() => {
        const now = new Date();
        const elapsed = new Date(now - startTime);

        const minutes = elapsed.getMinutes().toString().padStart(2, '0');
        const seconds = elapsed.getSeconds().toString().padStart(2, '0');

        timerElement.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

// Stop the timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// Update score
function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
}

// Start the app
function startApp() {
    document.querySelector('.welcome-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('instructions').classList.remove('hidden');
    document.getElementById('footer').classList.remove('hidden');

    init();
}

// Check if device is mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Initialize on load
window.addEventListener('load', () => {
    if (isMobile()) {
        document.querySelector('[data-size="16"]').classList.add('disabled');
    }
});