const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");
const header = document.querySelector(".brand");
const ANSWER_LENGTH = 5;
const ROUNDS = 6;


function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function setLoading(isLoading) {
  loadingDiv.classList.toggle("show",isLoading);
}
// to check if the word have duplicated letter so you can mark it as close or wrong
function makeMap(array){
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if(obj[element]){
      obj[element]++;
    } else {
      obj[element] = 1;
    }
  }
  return obj;
}




async function init(){
  let currentGuess = "";
  let currentRow = 0;
  let gameFinished = false;

  setLoading(true);
  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const resObject = await res.json();
  const word = resObject.word.toUpperCase();
  setLoading(false);

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
    setLoading(true);
    const res = await fetch("https://words.dev-apis.com/validate-word",{
      method: "POST",
      body: JSON.stringify({word: currentGuess})
    });
    const resObj = await res.json();
    const validWord = resObj.validWord
    setLoading(false);

    if(validWord){
      // do the marking as "correct" "close" "wrong"
      const guessLetters = currentGuess.split("");
      const wordLetters = word.split("");
      const map = makeMap(wordLetters);

      for (let i = 0; i < ANSWER_LENGTH; i++) {
        if(guessLetters[i] === wordLetters[i]){
          letters[ANSWER_LENGTH * currentRow + i].classList.add("correct");
          map[guessLetters[i]]--;
        } else if (wordLetters.includes(guessLetters[i]) && map[guessLetters[i]] > 0){
          letters[ANSWER_LENGTH * currentRow + i].classList.add("close");
          map[guessLetters[i]]--;
        } else {
          letters[ANSWER_LENGTH * currentRow + i].classList.add("wrong");
        }
      }
    } else {
        for (let i = 0; i < ANSWER_LENGTH; i++) {
          letters[ANSWER_LENGTH * currentRow + i].classList.add("invalid");
        }
    }

    

    //check win or lose

    if(currentGuess === word){
      header.classList.add("winner");
      header.textContent = "Congratz you win!"
      gameFinished = true;
    }
    
    if(currentRow + 1 === ROUNDS){
      header.textContent = `You lose! Word of the day was ${word}`;
      gameFinished = true;
    }


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
    if(gameFinished){
      return
    } else {
      const action = event.key;
  
      if(action === "Enter"){
        commit();
      }else if (action === "Backspace"){
        erase();
      }else if (isLetter(action)){
        addLetter(action.toUpperCase())
      }else {
        //do nothing
    }} 
  }

  document.addEventListener("keydown", handleKeypress);
}

init();