# Sudoku Master 🎯

A modern, responsive Sudoku puzzle generator and solver built with vanilla JavaScript, HTML, and CSS. Features multiple grid sizes, difficulty levels, and an elegant glassmorphism UI design.

## 🌐 Live Demo

**[Play Sudoku Master](https://soduko-master.vercel.app)**

## ✨ Features

### 🎮 Game Modes
- **Multiple Grid Sizes**: 4x4, 9x9, and 16x16 (desktop only)
- **Four Difficulty Levels**: Easy, Medium, Hard, and Expert
- **Real-time Timer**: Track your solving time
- **Score System**: Earn points for completing puzzles
- **Solution Validation**: Check your progress and get instant feedback

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Beautiful frosted glass effects with backdrop blur
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: CSS animations and transitions for enhanced user experience
- **Visual Feedback**: Color-coded cells for fixed numbers, user input, and errors
- **Interactive Notifications**: Toast notifications for game events

### ⌨️ Controls
- **Click to Select**: Click any cell to select it
- **Keyboard Input**: Type numbers 1-9 (or 1-4 for 4x4, 1-9 and A-G for 16x16)
- **Clear Cells**: Use Delete or Backspace to clear selected cells
- **Visual Indicators**: Selected cells are highlighted with distinct colors

### 🧠 Smart Features
- **Automatic Puzzle Generation**: Creates valid Sudoku puzzles with unique solutions
- **Backtracking Solver**: Efficient algorithm that can solve any valid Sudoku
- **Error Detection**: Highlights conflicting numbers in real-time
- **Progress Saving**: Maintains your current state during the session

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abdulrafay1402/sudoku-master.git
   cd sudoku-master
   ```

2. **Open the application**
   ```bash
   # Simply open index.html in your browser
   open index.html
   # or
   python -m http.server 8000  # For a local server
   ```

3. **Start playing**
   - Click "Start Playing" on the welcome screen
   - Select your preferred grid size and difficulty
   - Generate a new puzzle and start solving!

## 🎯 How to Play

### Basic Rules
1. **Rows**: Each row must contain all numbers from 1 to N (where N is the grid size) without repetition
2. **Columns**: Each column must contain all numbers from 1 to N without repetition
3. **Subgrids**: Each subgrid (√N × √N) must contain all numbers from 1 to N without repetition

### Game Controls
- **Select Cell**: Click on any empty cell
- **Enter Number**: Type the desired number (1-9 for 9x9 grid)
- **Clear Cell**: Press Delete or Backspace
- **Check Solution**: Use the "Check Solution" button to validate your progress
- **Generate New Puzzle**: Click "Generate New" to create a fresh puzzle
- **Auto-Solve**: Use "Solve Puzzle" to see the complete solution

### Difficulty Levels
- 🌱 **Easy**: 40% of cells removed
- ⚖️ **Medium**: 50% of cells removed  
- 🔥 **Hard**: 60% of cells removed
- 💀 **Expert**: 70% of cells removed

## 📱 Device Compatibility

- **Desktop**: Full feature support including 16x16 grids
- **Tablet**: Optimized layout with touch-friendly controls
- **Mobile**: Responsive design with 4x4 and 9x9 grids only

## 🛠️ Technical Details

### Architecture
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Icons**: Font Awesome 6.4.0
- **Animations**: Animate.css 4.1.1

### Key Algorithms
- **Puzzle Generation**: Random diagonal filling with backtracking solver
- **Sudoku Solver**: Recursive backtracking algorithm
- **Validation**: Real-time constraint checking for rows, columns, and subgrids

### File Structure
```
sudoku-master/
├── index.html          # Main HTML structure
├── style.css           # Styling and responsive design
├── app.js              # Core game logic and DOM manipulation
└── README.md           # Project documentation
```

## 🎨 Design Features

### Color Scheme
- **Primary**: Deep blues and purples for main UI elements
- **Accent**: Pink highlights for interactive elements
- **Status Colors**: Green (success), Yellow (warning), Red (errors)
- **Background**: Gradient from deep blue to red to gold

### Visual Effects
- **Glassmorphism**: Frosted glass appearance with backdrop blur
- **Hover Animations**: Smooth transform effects on interactive elements
- **Cell Highlighting**: Visual feedback for selected cells and errors
- **Responsive Typography**: Scalable text for different screen sizes

## 🔧 Customization

### Adding New Difficulty Levels
Modify the `generateValidPuzzle()` function in `app.js`:

```javascript
// Add your custom difficulty
case 'custom':
    cellsToRemove = Math.floor(gridSize * gridSize * 0.8); // 80% removed
    break;
```

### Changing Grid Sizes
The app supports any perfect square grid size. To add new sizes:

1. Add a new button in the HTML
2. Update the `createGrid()` function if needed
3. Ensure keyboard input validation covers the new range

## 🐛 Known Issues

- 16x16 grids are disabled on mobile devices for optimal UX
- Large grids may take longer to generate on slower devices
- Browser storage is not used (in-memory state only)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is for academic and institutional use. Credit the developers if reused or modified for deployment.

## 👨‍💻 Author

**Abdul Rafay**
- GitHub: [@abdulrafay1402](https://github.com/abdulrafay1402)
- Email: abdulrafay14021997@gmail.com

## 🙏 Acknowledgments

- Font Awesome for the beautiful icons
- Animate.css for smooth animations
- The Sudoku community for inspiration and algorithm insights

---

**Enjoy playing Sudoku Master!** 🎉

*Built with ❤️ and deployed on Vercel*
