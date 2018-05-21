/*
 * Create a list that holds all of your cards
 */
const cardList = [
    'space-shuttle', 
    'bath', 'bullhorn', 
    'chess-knight', 
    'dove', 
    'futbol'
];
//Create a clone of the card list (for pairing) and push into original array, creating the final deck array
const cardPairs = cardList;
var deck = cardList.concat(cardPairs);

//Set up starting variables
var openCards = [];
var clickDisabled = false;
var moveCount = 0;
var possiblePairs = cardList.length;
var currentPairs = 0;

var movesLabel = document.getElementById("moves");

/*
 * Game timer logic
 */

var timer;
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;


function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

var timerStarted = false;
var startTimer = (function() {
    //Setup below is to enable single use only of this function
    return function() {
        if(!timerStarted) {
            timerStarted = true;
            timer = setInterval(setTime, 1000);
        }
    };
})();

function stopTimer() {
    clearInterval(timer);
}


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

//Shuffle the deck
deck = shuffle(deck);


//Add click listener to the deck and flip the card if it's clicked
const deckContainer = document.querySelector('.deck');
deckContainer.addEventListener("click", flipCard);

//Add click listener to the reset button
const resetButton = document.querySelector('.reset');
resetButton.addEventListener("click", resetGame);

function resetGame() {
    clearInterval(timer);
    totalSeconds = 0;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
    moveCount = 0;
    movesLabel.innerHTML = moveCount;
    currentPairs = 0;
    openCards = [];
    deck = shuffle(deck);
    clickDisabled = false;
    timerStarted = false;
    deckContainer.innerHTML = '';
    dealCards();
}

//Loop through each card in deck and create its HTML
function dealCards() {
    for (i = 0; i < deck.length; i++) {
        //Create blank card
        const newCard = document.createElement('li');
        newCard.className = 'card';
        //Create an icon and add it to the card
        const newIcon = document.createElement('i');
        newIcon.classList.add('fas', 'fa-' + deck[i]);
        newCard.appendChild(newIcon);
        //Place the card on the page
        deckContainer.appendChild(newCard);
    }
}

dealCards();


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function checkWin() {
    if(currentPairs === possiblePairs) {
        stopTimer();
        swal({
            type: 'success',
            title: 'Great job!',
            html: 'You won in ' + moveCount + ' moves!',
            confirmButtonText: 'Play again!',
            showCancelButton: true
        }).then((result) => {
            if(result.value) {
                resetGame();
            }
        });
    }
}

function flipCard(evt) {
    //When the deck is clicked, check if the clicked element was a card
    if(evt.target.nodeName === 'LI') {
        startTimer();
        const card = evt.target;
        //Check card for a match
        checkMatch(card);
    }
}

function checkMatch(card) {
    //Check if there are any open cards
    if(openCards.length != 0) {
        //Check if clicking is allowed right now
        if(clickDisabled){
            return;
        }
        //Increase the move counter since this is the second card of the attempt
        moveCount++;
        movesLabel.innerHTML = moveCount;
        //Disable clicking until cards are checked
        clickDisabled = true;
        //Show the card's face (moved here from flipCard() so it could be placed after the click disabler)
        card.classList.add("show", "open");
        //Check if the opened cards match
        if(card.innerHTML == openCards[0].innerHTML){
            //If they match, leave them open and clear the opened cards list
            card.classList.add("match");
            openCards[0].classList.add("match");
            openCards = [];
            //Increase the matched pair counter
            currentPairs++;
            //Check for winning status
            checkWin();
            //Allow clicking after the check has completed
            clickDisabled = false;
        } else {
            //If they don't match, add a class indicating the mismatch to both cards
            card.classList.add("nomatch");
            openCards[0].classList.add("nomatch");
            //Wait 1 second, the reset the open cards and clear the opened cards list
            setTimeout(function () {
                card.classList.remove("show", "open", "nomatch");
                openCards[0].classList.remove("show", "open", "nomatch");
                openCards = [];
                //Allow clicking after the check has completed
                clickDisabled = false;
            }, 1000);
        }
    } else {
        //No other cards are open so just show the card and add it to the open cards list
        //Show the card's face
        card.classList.add("show", "open");
        //If there aren't any opened cards, add current card to the opened cards list
        openCards.push(card);
    }
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */