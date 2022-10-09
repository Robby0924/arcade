//Screens declaration
let gameStart = document.getElementById("gameStart");
let playerSelection = document.getElementById("playerSelection");
let vsPlayer = document.getElementById("vsPlayer");
let vsComputer = document.getElementById("vsComputer");
let gamePhase = document.getElementById("gamePhase");

//gameStart Screen
let buttonStart = document.getElementById("buttonStart");
buttonStart.addEventListener("click", toPlayerSelection);

function toPlayerSelection() {
  gameStart.style.display = "none";
  playerSelection.style.display = "flex";
}

//playerSelection Screen

//modeSelection is the value that's selected in the drop down menu
let modeSelection;

let vsSelect = document.getElementById("vsSelect");
vsSelect.addEventListener("change", function (vsOpponentChoice) {
  modeSelection = vsOpponentChoice.target.value;
});

let toVsButton = document.getElementById("toVsButton");
toVsButton.addEventListener("click", selectOpponent);

function selectOpponent() {
  //Display changes depending on modeSelection's value
  playerSelection.style.display = "none";
  if (modeSelection === "vsPlayer") {
    vsPlayer.style.display = "flex";
  } else if (modeSelection === "vsComputer") {
    vsComputer.style.display = "flex";
  } else {
    playerSelection.style.display = "flex";
  }
}

//backButton for both vsPlayer and vsComputer screen
let backButton = document.getElementsByClassName("backButton");
for (let i = 0; i < backButton.length; i++) {
  backButton[i].addEventListener("click", returnToSelectOpponent);

  function returnToSelectOpponent() {
    vsPlayer.style.display = "none";
    vsComputer.style.display = "none";
    playerSelection.style.display = "flex";
  }
}

//continueButton for vsPlayer and vsComputer screen
let continueButton = document.getElementsByClassName("continueButton");
for (let i = 0; i < continueButton.length; i++) {
  continueButton[i].addEventListener("click", toGamePhase);

  function toGamePhase() {
    //Set gamePhase to display
    vsPlayer.style.display = "none";
    vsComputer.style.display = "none";
    gamePhase.style.display = "flex";
    //Run randomizer function
    determineStartPlayer(2);
  }
}

//Randomizes player start
let playerNameOne;
let playerNameTwo;
let playerOne;
let playerTwo;
let activePlayer;


//Takes player names from HTML and puts them in a variable for calling
function determineStartPlayer(param) {
  if (modeSelection === "vsPlayer") {
    playerNameOne = document.getElementById("playerNameOne").value;
    playerNameTwo = document.getElementById("playerNameTwo").value;
  } else if (modeSelection === "vsComputer") {
    playerNameOne = document.getElementById("playerSolo").value;
    playerNameTwo = "Computer";
  }
  //Takes player names and equates it to a start position randomly
  //Player one goes first, player two goes second
  let positionNumber = Math.floor(Math.random() * param);
  if (positionNumber === 0) {
    playerOne = playerNameOne;
    playerTwo = playerNameTwo;
  } else {
    playerOne = playerNameTwo;
    playerTwo = playerNameOne;
  }

  //Sets the first player as the active player
  activePlayer = playerOne;

  //Displays the first player as the player's turn
  statusDisplay.innerText = `It's ${activePlayer}'s turn`;

  //If the modeSelection is vs comp and the first player is comp, prep start button
  if (modeSelection === "vsComputer" && playerOne === playerNameTwo) {
    computerMove.innerText = "Start!";
    computerMove.style.display = "block";
  }

  //If first player is not comp, enables clicking of the game table
  if (activePlayer !== "Computer") {
    let boxes = document.getElementsByClassName("box");
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].classList.remove("disabled");
    }
  }
}

//Game Phase

//gameBoard is clickable @ game start. If false, only buttons are clickable
let gameRun = true;
//Displays board @ game start
let boardArr = ["", "", "", "", "", "", "", "", ""];
//Starts playerOne as X
let playerSymbol = "X";

//Declares any displays that should be showing
let statusDisplay = document.getElementById("declareTurnWinDraw");
let computerMoveDisplay = document.getElementById("computerMoveDisplay");

//------------------------------------------------------
//COMPUTER ANSWER CODE BELOW THIS LINE

let computerMove = document.getElementById("computerMove");
computerMove.addEventListener("click", computerInput);

//Function runs a randomized computer answer, marks it on the table, checks win condition, then switches player
function computerInput() {
  //Turn on "Computing move..." display
  computerMoveDisplay.style.display = "block";

  //Turns off "Next" button
  computerMove.style.display = "none";

  //Sets everything to fire in 1 second
  setTimeout(function () {
    //Empty array for dumping empty indexes in boardArr
    let emptyBoxArray = [];

    //Takes the empty values in boardArr and pushes it into a new empty box array
    for (let i = 0; i <= boardArr.length - 1; i++) {
      let boardBox = boardArr[i];
      if (boardBox === "") {
        let indexForEmptyBox = i;
        emptyBoxArray.push(indexForEmptyBox);
      }
    }

    //Selects a random index num from empty box array
    function randomizeIndexNum(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min);
    }

    //Returns a random index in the empty box array (values are the index from boardArr)
    //min @ 0 is first index of empty array, max is the last index of the empty array
    let randomEmptyBoxIndex = randomizeIndexNum(0, emptyBoxArray.length);

    //Takes the value at the empty box array at empty box index and uses it as the random index for boardArr
    let boardArrRandomIndex = emptyBoxArray[randomEmptyBoxIndex];

    //Takes the class "box", turns it into an array, and equates the random boardArr index on it
    //Finds the box that equals the board array index
    let emptyBox = document.getElementsByClassName("box")[boardArrRandomIndex];

    //Marks whatever symbol was designated in the boardArr in JS and reflects the answer to HTML
    boardArr[boardArrRandomIndex] = playerSymbol;
    emptyBox.innerText = playerSymbol;

    //Turn off "Computing move..." display
    computerMoveDisplay.style.display = "none";

    //Check win condition
    checkWinCondition();

    //If game is still running, switch player
    if (gameRun) {
      switchPlayer();
    }

    //Fires entire computerInput func only after 1000ms to simulate calculating
  }, 1000);
}

//COMPUTER ANSWER CODE ABOVE THIS LINE
//------------------------------------------------------

//Selects all class named with the name box in it and adds an event listener
document
  .querySelectorAll(".box")
  .forEach((box) => box.addEventListener("click", clickFunc));

//Human click function
function clickFunc(boxClicked) {
  //Sets the selected box as the div that was targeted in HTML
  let selectedBox = boxClicked.target;
  let classes = selectedBox.getAttribute("class");

  //If the word "disabled" is not found in the classes variable, human can take a turn
  //-1 indicates that it was not found
  if (classes.indexOf("disabled") === -1) {
    //Takes the title value of the box and converts it into a number so it can be used as an index.
    boxIndexNum = Number(selectedBox.getAttribute("title"));
    //Clicking box won't work if not an empty box @ index or if the game is done.
    if (boardArr[boxIndexNum] !== "" || !gameRun) {
      return;
    }

    //Shows "Next" button if modeSelection is vsComputer
    if (modeSelection === "vsComputer") {
      computerMove.style.display = "block";
      computerMove.innerText = "Next";
    }

    //Marks player symbol on board
    playedBox(selectedBox, boxIndexNum);
    //Checks if win/draw condition is fulfilled
    checkWinCondition();
    //Switches player if game is running
    if (gameRun) {
      switchPlayer();
    }
  }
}

// Marks the board with the activePlayer's symbol
function playedBox(selectedBox, boxIndexNum) {
  boardArr[boxIndexNum] = activePlayer;
  selectedBox.innerText = playerSymbol;
}

//Switches players for every click and reassigns symbol.
//This is where playerTwo gets assigned a symbol.
function switchPlayer() {
  if (activePlayer === playerOne) {
    activePlayer = playerTwo;
    playerSymbol = "O";
  } else {
    activePlayer = playerOne;
    playerSymbol = "X";
  }

  //If the modeSelection is vsComputer, the table is disabled when it's the computer's turn
  //Remember that the table is clickable during the 1000ms time.
  if (modeSelection === "vsComputer") {
    let boxes = document.getElementsByClassName("box");
    if (activePlayer === "Computer") {
      for (let i = 0; i < boxes.length; i++) {
        boxes[i].classList.add("disabled");
      }
    } else {
      for (let i = 0; i < boxes.length; i++) {
        boxes[i].classList.remove("disabled");
      }
    }
  }
  //Display's next player's turn
  statusDisplay.innerText = `It's ${activePlayer}'s turn`;
}

//Checks game win/draw condition for every click
function checkWinCondition() {
  let winningConditions = [
    //Column win condition
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    //Row win condition
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    //Diagonal win condition
    [0, 4, 8],
    [2, 4, 6],
  ];

  let winConditionMet;
  for (let i = 0; i <= winningConditions.length - 1; i++) {
    let winTrio = winningConditions[i];
    //Iterates through every array in the board and assigns player symbol into each trio index
    let trioFirstIndexCheck = boardArr[winTrio[0]];
    let trioSecondIndexCheck = boardArr[winTrio[1]];
    let trioThirdIndexCheck = boardArr[winTrio[2]];
    //If no index in the trio is equal or is empty, resume game
    if (
      trioFirstIndexCheck === "" ||
      trioSecondIndexCheck === "" ||
      trioThirdIndexCheck === ""
    ) {
      continue;
      //If all index in the trio is the same, win condition is met
    } else if (
      trioFirstIndexCheck === trioSecondIndexCheck &&
      trioSecondIndexCheck === trioThirdIndexCheck
    ) {
      winConditionMet = true;
    }
  }

  //If winning condition is met, display shows winner, game stops running, the "next" button is disabled
  if (winConditionMet) {
    statusDisplay.innerText = `Player ${activePlayer} won!`;
    computerMove.style.display = "none";
    gameRun = false;
    // document.getElementById("mainReturn").style.display = "block"
    return;
  }

  //Draw condition is met if there are no more strings in the board
  let drawConditionMet = !boardArr.includes("");
  if (drawConditionMet) {
    statusDisplay.innerText = "Game is a draw!";
    computerMove.style.display = "none";
    gameRun = false;
    // document.getElementById("mainReturn").style.display = "block"
    return;
  }
}

//Restart function  OK
document.querySelector(".gameRestart").addEventListener("click", gameRestart);
function gameRestart() {
  //Lets the board be clickable again
  gameRun = true;
  computerMove.style.display = "none";
  playerSymbol = "X";
  //Displays board
  boardArr = ["", "", "", "", "", "", "", "", ""];
  //Clears existing X and O
  document.querySelectorAll(".box").forEach((box) => (box.innerText = ""));
  //Randomizes start player again
  determineStartPlayer(2);
}

//Return to main function OK
document.getElementById("mainReturn").addEventListener("click", mainRestart);
function mainRestart() {
  gamePhase.style.display = "none";
  gameStart.style.display = "flex";
  gameRun = true;
  playerSymbol = "X";
  modeSelection = undefined;
  boardArr = ["", "", "", "", "", "", "", "", ""];
  //Empties the HTML and disables the board
  document.querySelectorAll(".box").forEach((box) => {
    box.innerText = "";
    box.classList.add("disabled");
  });
}
