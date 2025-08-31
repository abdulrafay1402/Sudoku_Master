
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
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notification-text');

// Game state
let gridSize = 9;
let selectedCell = null;
let startTime = null;
let timerInterval = null;
let score = 0;
let solution = [];
let currentPuzzle = [];

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
    if (!selectedCell || selectedCell.classList.contains('fixed')) return;

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

// Show notification
function showNotification(message, isError = false) {
    notificationText.textContent = message;
    notification.classList.remove('error');

    if (isError) {
        notification.classList.add('error');
    }

    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Check if a value is safe in a position
function isSafe(board, row, col, num) {
    // Check row
    for (let i = 0; i < gridSize; i++) {
        if (board[row][i] === num) return false;
    }

    // Check column
    for (let i = 0; i < gridSize; i++) {
        if (board[i][col] === num) return false;
    }

    // Check subgrid
    const subSize = Math.sqrt(gridSize);
    const startRow = Math.floor(row / subSize) * subSize;
    const startCol = Math.floor(col / subSize) * subSize;

    for (let i = 0; i < subSize; i++) {
        for (let j = 0; j < subSize; j++) {
            if (board[startRow + i][startCol + j] === num) return false;
        }
    }

    return true;
}

// Solve the Sudoku using backtracking
function solveSudoku(board) {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= gridSize; num++) {
                    if (isSafe(board, row, col, num)) {
                        board[row][col] = num;

                        if (solveSudoku(board)) {
                            return true;
                        }

                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Generate a valid Sudoku puzzle
function generateValidPuzzle(difficulty) {
    // Create an empty grid
    let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));

    // Fill the diagonal subgrids
    const subSize = Math.sqrt(gridSize);
    for (let i = 0; i < gridSize; i += subSize) {
        fillSubgrid(grid, i, i);
    }

    // Solve the complete grid
    solveSudoku(grid);

    // Store the solution
    solution = JSON.parse(JSON.stringify(grid));

    // Based on difficulty, remove numbers
    let cellsToRemove;
    switch (difficulty) {
        case 'easy':
            cellsToRemove = Math.floor(gridSize * gridSize * 0.4);
            break;
        case 'medium':
            cellsToRemove = Math.floor(gridSize * gridSize * 0.5);
            break;
        case 'hard':
            cellsToRemove = Math.floor(gridSize * gridSize * 0.6);
            break;
        case 'expert':
            cellsToRemove = Math.floor(gridSize * gridSize * 0.7);
            break;
        default:
            cellsToRemove = Math.floor(gridSize * gridSize * 0.5);
    }

    // Remove numbers to create the puzzle
    let removed = 0;
    while (removed < cellsToRemove) {
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);

        if (grid[row][col] !== 0) {
            grid[row][col] = 0;
            removed++;
        }
    }

    return grid;
}

// Fill a subgrid with random numbers
function fillSubgrid(grid, row, col) {
    const subSize = Math.sqrt(gridSize);
    const numbers = Array.from({ length: gridSize }, (_, i) => i + 1);

    // Shuffle the numbers
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    // Fill the subgrid
    for (let i = 0; i < subSize; i++) {
        for (let j = 0; j < subSize; j++) {
            grid[row + i][col + j] = numbers[i * subSize + j];
        }
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

    // Generate a valid puzzle
    currentPuzzle = generateValidPuzzle(difficulty);

    // Display the puzzle
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const index = row * gridSize + col;
            if (currentPuzzle[row][col] !== 0) {
                cells[index].textContent = currentPuzzle[row][col];
                cells[index].classList.add('fixed');
            }
        }
    }

    startTimer();
    showNotification(`New ${difficulty} puzzle generated!`);
}

// Solve the puzzle
function solvePuzzle() {
    const cells = document.querySelectorAll('.cell');

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const index = row * gridSize + col;
            cells[index].textContent = solution[row][col];
            cells[index].classList.remove('user-input', 'error');
        }
    }

    stopTimer();
    updateScore(1000); // Bonus for solving
    showNotification('Puzzle solved!');
}

// Check the solution
function checkSolution() {
    const cells = document.querySelectorAll('.cell');
    let hasErrors = false;

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const index = row * gridSize + col;
            const cellValue = cells[index].textContent ? parseInt(cells[index].textContent) : 0;

            if (cellValue !== solution[row][col]) {
                cells[index].classList.add('error');
                hasErrors = true;
            } else {
                cells[index].classList.remove('error');
            }
        }
    }

    if (!hasErrors) {
        // Check if the puzzle is complete
        let isComplete = true;
        for (let i = 0; i < cells.length; i++) {
            if (!cells[i].textContent) {
                isComplete = false;
                break;
            }
        }

        if (isComplete) {
            showNotification('Congratulations! Your solution is correct!');
            updateScore(500);
            stopTimer();
        } else {
            showNotification('So far so good! Keep going!');
        }
    } else {
        showNotification('There are errors in your solution. Please check again.', true);
    }
}

// Clear the grid
function clearGrid() {
    const cells = document.querySelectorAll('.cell');

    cells.forEach(cell => {
        if (!cell.classList.contains('fixed')) {
            cell.textContent = '';
            cell.classList.remove('user-input', 'error');
        }
    });

    stopTimer();
    timerElement.textContent = '00:00';
    showNotification('Grid cleared!');
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
