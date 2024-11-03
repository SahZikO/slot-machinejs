//! Give money
//! how much line will he bet
//! collect the bet amount
//! start the machine
//! check win||lose
//! give the winnings
//! start again or leave

const prompt = require("prompt-sync")();

const ROWS = 3; //? global variables always caps
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 5,
  D: 6,
};

const SYMBOL_VALUES = {
  A: 5,
  B: 2,
  C: 3,
  D: 1,
};

const deposit = () => {
  while (true) {
    const depositAmout = prompt("Enter your amount: ");
    const numberDepositAmount = parseFloat(depositAmout); //? Convert the string in prompt to a number

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      //? make sure that the number is indeed a number and greater than 0
      alert("Invalid deposit, try again.");
    } else {
      return numberDepositAmount;
    }
  }
};

const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("Enter number of lines to bet on (1-->3): ");
    const numberOfLines = parseFloat(lines); //? Convert the string in prompt to a number

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      //? make sure that the number is indeed a number and greater than 0
      console.log("Invalid number of lines, try again.");
    } else {
      return numberOfLines;
    }
  }
};

const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt("Enter the total bet per line: ");
    const numberBet = parseFloat(bet); //? Convert the string in prompt to a number

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
      //? make sure that the number is indeed a number and greater than 0
      console.log("Invalid bet, try again.");
    } else {
      return numberBet;
    }
  }
};

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    //? Object.entries(SYMBOLS_COUNT) returns an array of key-value pairs from SYMBOLS_COUNT, so for each symbol (A, B, C, D), and its count, the inner loop repeats count times.
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }
  const reels = [];
  //? reels will be a 2D array where each inner array represents a column on the slot machine.
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
      //? reelSymbols.splice(randomIndex, 1); removes the selected symbol from reelSymbols to ensure unique symbols per column.
    }
  }
  return reels;
};

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }
  return winnings;
};

const game = () => {
  let balance = deposit();
  while (true) {
    console.log(`You have a balance of ${balance}$`);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    console.log(`You won ${winnings}$`);
    if (balance <= 0) {
      console.log("You ran out of money!");
      break;
    }

    const playAgain = prompt("Do you want to play again? (y/n)?");
    if (playAgain != "y") break;
  }
};
game();
