// This function returns an array of walls to be animated
export function recursiveDivisionMaze(grid, startNode, finishNode) {
  const walls = [];
  addInnerWalls(grid, 1, grid.length - 2, 1, grid[0].length - 2, "horizontal", walls, startNode, finishNode);
  return walls;
}

function addInnerWalls(grid, rowStart, rowEnd, colStart, colEnd, orientation, walls, startNode, finishNode) {
  // Base Case: If the area is too small, stop cutting
  if (rowEnd < rowStart || colEnd < colStart) return;

  if (orientation === "horizontal") {
    // --- HORIZONTAL CUT ---
    
    // 1. Pick a random row to build a wall on (must be even to allow paths)
    const possibleRows = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      possibleRows.push(number);
    }
    
    // If no room to cut, stop
    if (possibleRows.length === 0) return;
    
    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const currentRow = possibleRows[randomRowIndex];

    // 2. Pick a random spot for the "Hole" (must be odd)
    const possibleCols = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      possibleCols.push(number);
    }
    const randomColIndex = Math.floor(Math.random() * possibleCols.length);
    const randomHoleCol = possibleCols[randomColIndex];

    // 3. Draw the wall
    for (let col = colStart - 1; col <= colEnd + 1; col++) {
      if (col !== randomHoleCol && !isStartOrFinish(currentRow, col, startNode, finishNode)) {
        // Add to our list of walls to animate
        const node = grid[currentRow][col];
        walls.push(node);
      }
    }

    // 4. Recurse! (Cut the top and bottom sections)
    if (currentRow - 2 - rowStart > colEnd - colStart) {
      addInnerWalls(grid, rowStart, currentRow - 2, colStart, colEnd, "horizontal", walls, startNode, finishNode);
    } else {
      addInnerWalls(grid, rowStart, currentRow - 2, colStart, colEnd, "vertical", walls, startNode, finishNode);
    }
    
    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      addInnerWalls(grid, currentRow + 2, rowEnd, colStart, colEnd, "horizontal", walls, startNode, finishNode);
    } else {
      addInnerWalls(grid, currentRow + 2, rowEnd, colStart, colEnd, "vertical", walls, startNode, finishNode);
    }

  } else {
    // --- VERTICAL CUT (Same logic, flipped) ---
    
    const possibleCols = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }
    
    if (possibleCols.length === 0) return;
    
    const randomColIndex = Math.floor(Math.random() * possibleCols.length);
    const currentCol = possibleCols[randomColIndex];

    const possibleRows = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }
    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const randomHoleRow = possibleRows[randomRowIndex];

    for (let row = rowStart - 1; row <= rowEnd + 1; row++) {
      if (row !== randomHoleRow && !isStartOrFinish(row, currentCol, startNode, finishNode)) {
        const node = grid[row][currentCol];
        walls.push(node);
      }
    }

    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      addInnerWalls(grid, rowStart, rowEnd, colStart, currentCol - 2, "horizontal", walls, startNode, finishNode);
    } else {
      addInnerWalls(grid, rowStart, rowEnd, colStart, currentCol - 2, "vertical", walls, startNode, finishNode);
    }
    
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      addInnerWalls(grid, rowStart, rowEnd, currentCol + 2, colEnd, "horizontal", walls, startNode, finishNode);
    } else {
      addInnerWalls(grid, rowStart, rowEnd, currentCol + 2, colEnd, "vertical", walls, startNode, finishNode);
    }
  }
}

function isStartOrFinish(row, col, startNode, finishNode) {
  if (row === startNode.row && col === startNode.col) return true;
  if (row === finishNode.row && col === finishNode.col) return true;
  return false;
}