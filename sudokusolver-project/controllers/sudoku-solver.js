class SudokuSolver {
  constructor() {
    this.gridSize = 9;
    this.boxSize = 3;
  }

  validate(puzzleString) {
    // check length
    if (puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }

    // check characters
    if (!/^[1-9.]+$/.test(puzzleString)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }

    return { valid: true };
  }

  convertToGrid(puzzleString) {
    const grid = [];
    for (let i = 0; i < this.gridSize; i++) {
      grid.push(puzzleString.slice(i * this.gridSize, (i + 1) * this.gridSize).split(''));
    }
    return grid;
  }

  convertToString(grid) {
    return grid.flat().join('');
  }

  checkRowPlacement(grid, row, value) {
    for (let col = 0; col < this.gridSize; col++) {
      if (grid[row][col] === value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(grid, col, value) {
    for (let row = 0; row < this.gridSize; row++) {
      if (grid[row][col] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(grid, row, col, value) {
    const startRow = Math.floor(row / this.boxSize) * this.boxSize;
    const startCol = Math.floor(col / this.boxSize) * this.boxSize;

    for (let r = startRow; r < startRow + this.boxSize; r++) {
      for (let c = startCol; c < startCol + this.boxSize; c++) {
        if (grid[r][c] === value) {
          return false;
        }
      }
    }
    return true;
  }

  checkPlacement(puzzleString, row, column, value) {
    const validation = this.validate(puzzleString);
    if (!validation.valid) {
      return { valid: false, error: validation.error };
    }

    if (row < 0 || row >= this.gridSize || column < 0 || column >= this.gridSize) {
      return { valid: false, error: 'Invalid coordinate' };
    }

    if (!/^[1-9]$/.test(value)) {
      return { valid: false, error: 'Invalid value' };
    }

    const grid = this.convertToGrid(puzzleString);
    const conflicts = [];

    // if the cell is already filled with the same value, its valid
    if (grid[row][column] === value) {
      return { valid: true };
    }

    // check if the cell is already filled with a different value
    if (grid[row][column] !== '.' && grid[row][column] !== value) {
      return { valid: false, error: 'Cell is already filled' };
    }

    // check for conflicts in row, column, and region
    // FIX
    if (!this.checkRowPlacement(grid, row, value)) {
      conflicts.push('row');
    }

    if (!this.checkColPlacement(grid, column, value)) {
      conflicts.push('column');
    }

    if (!this.checkRegionPlacement(grid, row, column, value)) {
      conflicts.push('region');
    }

    if (conflicts.length > 0) {
      return { valid: false, conflict: conflicts };
    }

    return { valid: true };
  }

  findEmptyCell(grid) {
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (grid[row][col] === '.') {
          return [row, col];
        }
      }
    }
    return null;
  }

  solveSudoku(grid) {
    const emptyCell = this.findEmptyCell(grid);
    
    if (!emptyCell) {
      return grid; // puzzle solved
    }

    const [row, col] = emptyCell;

    for (let num = 1; num <= 9; num++) {
      const value = num.toString();
      
      if (this.checkRowPlacement(grid, row, value) &&
          this.checkColPlacement(grid, col, value) &&
          this.checkRegionPlacement(grid, row, col, value)) {
        
        grid[row][col] = value;

        if (this.solveSudoku(grid)) {
          return grid;
        }

        grid[row][col] = '.'; // backtrack
      }
    }

    return false; // no solution found
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (!validation.valid) {
      return { error: validation.error };
    }

    const grid = this.convertToGrid(puzzleString);
    const solvedGrid = this.solveSudoku(grid);

    if (!solvedGrid) {
      return { error: 'Puzzle cannot be solved' };
    }

    const solution = this.convertToString(solvedGrid);
    return { solution };
  }
}

module.exports = SudokuSolver;
