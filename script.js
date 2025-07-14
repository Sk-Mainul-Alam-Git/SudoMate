const board = document.getElementById("board");
let cells = [];

for (let row = 0; row < 9; row++) {
  cells[row] = [];
  for (let col = 0; col < 9; col++) {
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("maxlength", "1");
    board.appendChild(input);
    cells[row][col] = input;
  }
}

function getBoard() {
  return cells.map(row => row.map(cell => {
    const val = parseInt(cell.value);
    return isNaN(val) ? 0 : val;
  }));
}

function setBoard(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      cells[row][col].value = board[row][col] !== 0 ? board[row][col] : "";
    }
  }
}

function isValid(board, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num || board[x][col] === num) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (board[startRow + i][startCol + j] === num) return false;

  return true;
}

async function solveSudokuVisual(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            cells[row][col].value = num;
            cells[row][col].classList.add("highlight");
            await new Promise(resolve => setTimeout(resolve, 30));
            cells[row][col].classList.remove("highlight");

            if (await solveSudokuVisual(board)) return true;

            board[row][col] = 0;
            cells[row][col].value = "";
          }
        }
        return false;
      }
    }
  }
  return true;
}

async function solve() {
  const spinner = document.getElementById("spinner");
  spinner.classList.add("show");
  const board = getBoard();
  await solveSudokuVisual(board);
  spinner.classList.remove("show");
}

function clearBoard() {
  for (let row = 0; row < 9; row++)
    for (let col = 0; col < 9; col++) {
      cells[row][col].value = "";
      cells[row][col].classList.remove("highlight");
    }
}

function loadExample(difficulty) {
  const puzzles = {
    easy: [
      [5,3,0,0,7,0,0,0,0], [6,0,0,1,9,5,0,0,0], [0,9,8,0,0,0,0,6,0],
      [8,0,0,0,6,0,0,0,3], [4,0,0,8,0,3,0,0,1], [7,0,0,0,2,0,0,0,6],
      [0,6,0,0,0,0,2,8,0], [0,0,0,4,1,9,0,0,5], [0,0,0,0,8,0,0,7,9]
    ],
    medium: [
      [0,0,0,0,0,0,2,0,0], [0,8,0,0,0,7,0,9,0], [6,0,2,0,0,0,5,0,0],
      [0,7,0,0,6,0,0,0,0], [0,0,0,9,0,1,0,0,0], [0,0,0,0,2,0,0,4,0],
      [0,0,5,0,0,0,6,0,3], [0,9,0,4,0,0,0,7,0], [0,0,6,0,0,0,0,0,0]
    ],
    hard: [
      [0,0,0,6,0,0,4,0,0], [7,0,0,0,0,3,6,0,0], [0,0,0,0,9,1,0,8,0],
      [0,0,0,0,0,0,0,0,0], [0,5,0,1,8,0,0,0,3], [0,0,0,3,0,6,0,4,5],
      [0,4,0,2,0,0,0,6,0], [9,0,3,0,0,0,0,0,0], [0,2,0,0,0,0,1,0,0]
    ]
  };

  const data = puzzles[difficulty];
  if (data) setBoard(data);
}

const toggleBtn = document.getElementById("themeToggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
