let balance = 0;
const ROWS = 3;
const COLS = 3;
const SYMBOLS_COUNT = { "🍌": 2, "🍒": 4, "🍋": 5, "🍇": 6 };
const SYMBOL_VALUES = { "🍌": 5, "🍒": 2, "🍋": 3, "🍇": 1 };

function deposit() {
  const depositInput = document.getElementById("deposit");
  const depositAmount = parseFloat(depositInput.value);

  if (isNaN(depositAmount) || depositAmount <= 0) {
    alert("Invalid deposit amount.");
    return;
  }

  balance += depositAmount;
  updateBalance();

  depositInput.value = "";
}

// Get number of lines
function getNumberOfLines() {
  const lines = parseInt(document.getElementById("lines").value);
  if (isNaN(lines) || lines < 1 || lines > 3) {
    alert("Invalid number of lines. Enter between 1 and 3.");
    return null;
  }
  return lines;
}

// Get bet amount
function getBet(lines) {
  const bet = parseFloat(document.getElementById("bet").value);
  if (isNaN(bet) || bet <= 0 || bet > balance / lines) {
    alert("Invalid bet amount.");
    return null;
  }
  return bet;
}

// Spin function
function spin() {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      reels[i].push(reelSymbols[randomIndex]);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
}

// Transpose function
function transpose(reels) {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
}

// Get winnings function
function getWinnings(rows, bet, lines) {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    if (symbols.every((symbol) => symbol === symbols[0])) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }
  return winnings;
}

// Update balance display
function updateBalance() {
  document.getElementById("balance").innerText = `Balance: $${balance}`;
}

// Print reels correctly
function printReels(reels) {
  reels.forEach((reel, index) => {
    const reelElement = document.getElementById(`reel${index + 1}`);
    reelElement.innerHTML = ""; 

    reel.forEach((symbol) => {
      const symbolElement = document.createElement("div");
      symbolElement.innerText = symbol;
      reelElement.appendChild(symbolElement);
    });
  });
}

// Start game
function startGame() {
  const lines = getNumberOfLines();
  if (lines === null) return;

  const bet = getBet(lines);
  if (bet === null) return;

  balance -= bet * lines;
  updateBalance();

  const reels = spin();
  printReels(reels);
  const rows = transpose(reels);
  const winnings = getWinnings(rows, bet, lines);
  balance += winnings;
  updateBalance();

  document.getElementById("winnings").innerText = `Winnings: $${winnings}`;
}
