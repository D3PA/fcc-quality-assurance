'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  const solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      // check required fields
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      // validate coordinate format
      const coordRegex = /^[A-I][1-9]$/i;
      if (!coordRegex.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      // parse coordinate
      const rowLetter = coordinate[0].toUpperCase();
      const col = parseInt(coordinate[1]) - 1;
      const row = rowLetter.charCodeAt(0) - 65; // 'A' -> 0, 'B' -> 1, ..., 'I' -> 8

      // validate value
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      // check placement
      const result = solver.checkPlacement(puzzle, row, col, value);
      
      if (result.error) {
        return res.json({ error: result.error });
      }

      if (result.valid) {
        return res.json({ valid: true });
      } else {
        return res.json({ 
          valid: false, 
          conflict: result.conflict 
        });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

      const result = solver.solve(puzzle);
      
      if (result.error) {
        return res.json({ error: result.error });
      }

      res.json(result);
    });
};
