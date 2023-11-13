const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");
const ANSWER_LENGTH = 5;


function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}




async function init(){
  let currentGuess = "";
  let currentRow = 0;

  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const resObject = await res.json();
  const word = resObject.word.toUpperCase();

  console.log(word);




  function addLetter(letter){
    if(currentGuess.length < ANSWER_LENGTH){
      currentGuess += letter;
    } else {
      //replace the last letter
      currentGuess = currentGuess.substring(0,currentGuess.length-1) + letter;
    }
    //move to next line
    letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].textContent = letter;
  }

  async function commit() {
    if(currentGuess.length !== ANSWER_LENGTH){
      return;
    }

    //validate the word


    // do the marking as "correct" "close" "wrong"


    //check win or lose


    currentRow++;
    currentGuess = "";
  }

  function erase() {
    if(currentGuess.length === 0){
      return
    }else {
      currentGuess = currentGuess.substring(0,currentGuess.length -1);
      letters[ANSWER_LENGTH * currentRow + currentGuess.length].textContent = "";
    }
  }

  function handleKeypress(event) {
    const action = event.key;
  
    if(action === "Enter"){
      commit();
    }else if (action === "Backspace"){
      erase();
    }else if (isLetter(action)){
      addLetter(action.toUpperCase())
    }else {
      //do nothing
    }
  }

  document.addEventListener("keydown", handleKeypress);
}

init();