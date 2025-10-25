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

const hiddenInput = document.createElement('input');
hiddenInput.type = 'text';
hiddenInput.inputMode = 'numeric';
hiddenInput.style.position = 'fixed';
hiddenInput.style.opacity = '0';
hiddenInput.style.pointerEvents = 'none';
hiddenInput.maxLength = '1';
document.body.appendChild(hiddenInput);

let gridSize = 9;
let selectedCell = null;
let startTime = null;
let timerInterval = null;
let score = 0;
let solution = [];
let currentPuzzle = [];

function init() {
    createGrid(gridSize);
    setupEventListeners();
}

function createGrid(size) {
    gridContainer.innerHTML = '';
    gridSize = size;

    gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;

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

function setupEventListeners() {
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.dataset.size === '16' && window.innerWidth <= 768) {
                alert('16x16 puzzles are only available on desktop devices.');
                return;
            }

            sizeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            createGrid(parseInt(button.dataset.size));
        });
    });

    generateButton.addEventListener('click', generatePuzzle);
    solveButton.addEventListener('click', solvePuzzle);
    checkButton.addEventListener('click', checkSolution);
    clearButton.addEventListener('click', clearGrid);

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

    gridContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('cell')) {
            selectCell(e.target);
            hiddenInput.focus();
        }
    });

    document.addEventListener('keydown', handleKeyPress);

    hiddenInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (value) {
            handleMobileInput(value);
            e.target.value = '';
        }
    });

    hiddenInput.addEventListener('keydown', (e) => {
        if ((e.key === 'Backspace' || e.key === 'Delete') && selectedCell && !selectedCell.classList.contains('fixed')) {
            selectedCell.textContent = '';
            selectedCell.classList.remove('user-input', 'error');
            e.target.value = '';
        }
    });
}
function selectCell(cell) {
    if (selectedCell) {
        selectedCell.classList.remove('selected');
    }

    selectedCell = cell;
    cell.classList.add('selected');
}

function handleKeyPress(e) {
    if (!selectedCell || selectedCell.classList.contains('fixed')) return;

    const key = e.key;

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

function handleMobileInput(value) {
    if (!selectedCell || selectedCell.classList.contains('fixed')) return;

    const key = value.toUpperCase();

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
    }
}

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

function isSafe(board, row, col, num) {
    for (let i = 0; i < gridSize; i++) {
        if (board[row][i] === num) return false;
    }

    for (let i = 0; i < gridSize; i++) {
        if (board[i][col] === num) return false;
    }

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

function generateValidPuzzle(difficulty) {
    let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));

    const subSize = Math.sqrt(gridSize);
    for (let i = 0; i < gridSize; i += subSize) {
        fillSubgrid(grid, i, i);
    }

    solveSudoku(grid);
    solution = JSON.parse(JSON.stringify(grid));
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

function fillSubgrid(grid, row, col) {
    const subSize = Math.sqrt(gridSize);
    const numbers = Array.from({ length: gridSize }, (_, i) => i + 1);

    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    for (let i = 0; i < subSize; i++) {
        for (let j = 0; j < subSize; j++) {
            grid[row + i][col + j] = numbers[i * subSize + j];
        }
    }
}
function generatePuzzle(difficulty = 'medium') {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('fixed', 'user-input', 'error', 'selected');
    });

    selectedCell = null;

    currentPuzzle = generateValidPuzzle(difficulty);

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
    showNotification(`Puzzle generated!`);
}

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
    updateScore(1000); 
    showNotification('Puzzle solved!');
}
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

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
}

function startApp() {
    document.querySelector('.welcome-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('instructions').classList.remove('hidden');
    document.getElementById('footer').classList.remove('hidden');

    init();
}

function isMobile() {
    return window.innerWidth <= 768;
}
window.addEventListener('load', () => {
    if (isMobile()) {
        document.querySelector('[data-size="16"]').classList.add('disabled');
    }
});