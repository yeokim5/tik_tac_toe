// selectors
const gameBoard = document.querySelector("#board");
const info = document.querySelector("#info");
let turn;
let count = 0;
const winningCombos = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal from top-left to bottom-right
  [2, 4, 6], // Diagonal from top-right to bottom-left
];

createGameBoard();

// create the gameboard
function createGameBoard() {
  const emptyTiles = " ".repeat(9).split("");
  const tileGrid = emptyTiles
    .map((t) => '<button class="tile"></button>')
    .join("");
  gameBoard.innerHTML = tileGrid;
  turn = "X";
  document.documentElement.style.setProperty("--hue", 10);
  info.textContent = `${turn}'s turn`;
  gameBoard.addEventListener("click", handleGameBoardClick);
  const allTiles = gameBoard.querySelectorAll(".tile");
  allTiles.forEach((t) => {
    t.addEventListener("mouseenter", handelMouseEnter);
    t.addEventListener("mouseleave", handleMouseLeave);
  });
  gameBoard.removeAttribute("inhert", true);
}

function handleGameBoardClick(e) {
  const valueExists = e.target.dataset.value;
  if (!valueExists) {
    e.target.dataset.value = turn;
    e.target.style.setProperty("--hue", turn === "X" ? 10 : 200);
    info.style.backgroundColor =
      turn === "O" ? "hsl(10, 60%, 50%)" : "hsl(200, 60%, 50%)";
    checkScore();
  }
}

function checkScore() {
  const allTiles = [...document.querySelectorAll(".tile")];
  const tileValues = allTiles.map((t) => t.dataset.value);
  // looop winning combo
  const isWinner = winningCombos.some((combo) => {
    const [a, b, c] = combo;
    return (
      // check if all element is same sign
      tileValues[a] &&
      tileValues[a] === tileValues[b] &&
      tileValues[a] === tileValues[c]
    );
  });
  if (isWinner) {
    return showCongrats();
  }

  updateTurn();
  if (count < 8) {
    count++;
  } else {
    info.textContent = "Nobody Won...";
    setTimeout(restartGame, 3000);
  }
}

function updateTurn() {
  turn = turn === "X" ? "O" : "X";
  info.textContent = `${turn}'s turn`;
}

function handelMouseEnter(e) {
  const valueExists = e.target.dataset.value;
  if (!valueExists) {
    e.target.dataset.hover = turn;
    e.target.style.setProperty("--hue", turn === "X" ? 10 : 200);
  }
}

function handleMouseLeave(e) {
  delete e.target.dataset.hover;
}

function showCongrats() {
  info.textContent = `${turn} wins!`;
  gameBoard.removeEventListener("click", handleGameBoardClick);
  gameBoard.setAttribute("inhert", true);

  const jsConfetti = new JSConfetti();
  jsConfetti.addConfetti({
    emojis: ["✨", "🧨", "🎉", "🎈"],
    emojiSize: 40,
  });

  setTimeout(restartGame, 1000);
}

function restartGame() {
  count = 0;
  let second = 3;
  const timer = setInterval(() => {
    info.textContent = `Restarting in ${second}...`;
    second--;
    if (second < 0) {
      // clear the interval
      clearInterval(timer);

      // restart game
      createGameBoard();
    }
  }, 1000);
}
