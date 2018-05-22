var deck,
    cardList,
    openCards,
    clickDisabled,
    moveCount,
    starCount,
    stars,
    movesLabel,
    timer,
    minutesLabel,
    secondsLabel,
    totalSeconds,
    timerStarted,
    starWinText,
    possiblePairs,
    currentPairs;

//Add click listener to the deck and flip the card if it's clicked
const deckContainer = document.querySelector('.deck');
deckContainer.addEventListener('click', flipCard);

//Add click listener to the reset button
const resetButton = document.querySelector('.reset');
resetButton.addEventListener('click', resetGame);

function initializeValues() {
    //Set up starting variables
    openCards = [];
    clickDisabled = false;
    moveCount = 0;
    starCount = 3;
    starWinText = 'stars';
    currentPairs = 0;
    cardList = [
        'space-shuttle',
        'bath', 'bullhorn',
        'chess-knight',
        'dove',
        'futbol'
    ];
    possiblePairs = cardList.length;
    stars = document.querySelector('.rating');
    movesLabel = document.querySelector('.moves');
    minutesLabel = document.querySelector('.minutes');
    secondsLabel = document.querySelector('.seconds');
    totalSeconds = 0;
    timerStarted = false;
    movesLabel.innerHTML = moveCount;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
};

initializeValues();

var setupDeck = (function () {
    //Create a clone of the card list (for pairing) and push into original array, creating the final deck array
    const cardPairs = cardList;
    deck = shuffle(cardList.concat(cardPairs));
})();

function resetGame() {
    clearInterval(timer);
    initializeValues();
    deck = shuffle(deck);
    deckContainer.innerHTML = '';
    stars.getElementsByTagName('LI')[2].classList.remove('lost');
    stars.getElementsByTagName('LI')[1].classList.remove('lost');
    dealCards();
}

function setTime() {
    ++totalSeconds;
    secondsLabel.innerHTML = pad(totalSeconds % 60);
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

//Timer helper function
function pad(val) {
    var valString = val + '';
    if (valString.length < 2) {
        return '0' + valString;
    } else {
        return valString;
    }
}

function startTimer() {
    //Setup below is to enable single use only of this function
    if(!timerStarted) {
        timerStarted = true;
        timer = setInterval(setTime, 1000);
    }
};

function stopTimer() {
    clearInterval(timer);
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

function flipCard(evt) {
    //When the deck is clicked, check if the clicked element was a card
    if(evt.target.nodeName === 'LI') {
        startTimer();
        const card = evt.target;
        //Check if there are any open cards
        if (openCards.length === 0) {
            //No other cards are open so just show the card and add it to the open cards list
            //Show the card's face
            card.classList.add('show', 'open');
            //If there aren't any opened cards, add current card to the opened cards list
            openCards.push(card);
        } else {
            //Check if clicking is allowed right now
            if (clickDisabled) {
                return;
            }
            //Increase the move counter since this is the second card of the attempt
            incrementMoveCounter();
            //Adjust rating if necessary
            calculateRating();
            //Disable clicking until cards are checked
            clickDisabled = true;
            //Show the card's face (moved here from flipCard() so it could be placed after the click disabler)
            card.classList.add('show', 'open');
            //Check if the opened cards match
            if (checkMatch(card.innerHTML, openCards[0].innerHTML)) {
                successfulMatch(card, openCards[0]);
            } else {
                unsuccessfulMatch(card, openCards[0]);
            }
        }
    }
}

function incrementMoveCounter() {
    moveCount++;
    movesLabel.innerHTML = moveCount;
}

function checkMatch(firstCard, secondCard) {
    if (firstCard == secondCard) {
        return true;
    }
}

function successfulMatch(firstCard, secondCard) {
    firstCard.classList.add('match');
    secondCard.classList.add('match');
    //Clear the open cards list
    openCards = [];
    //Increase the matched pair counter
    currentPairs++;
    //Allow clicking after the check has completed
    clickDisabled = false;
    //Check for winning status
    checkWin();
}

function unsuccessfulMatch(firstCard, secondCard) {
    //If they don't match, add a class indicating the mismatch to both cards
    firstCard.classList.add('nomatch');
    secondCard.classList.add('nomatch');
    //Wait 1 second, the reset the open cards and clear the opened cards list
    setTimeout(function () {
        firstCard.classList.remove('show', 'open', 'nomatch');
        secondCard.classList.remove('show', 'open', 'nomatch');
        openCards = [];
        //Allow clicking after the check has completed
        clickDisabled = false;
    }, 1000);
}

function calculateRating() {

    if (moveCount === 11) {
        stars.getElementsByTagName('LI')[2].classList.add('lost');
        starCount = 2;
    } else if (moveCount === 21) {
        stars.getElementsByTagName('LI')[1].classList.add('lost');
        starCount = 1;
        starWinText = 'star';
    }
}

function checkWin() {
    if (currentPairs === possiblePairs) {
        clickDisabled = true;
        stopTimer();
        swal({
            type: 'success',
            title: 'Great job!',
            html: 'You won in ' + moveCount + ' moves with ' + starCount + ' ' + starWinText + '!',
            confirmButtonText: 'Play again!',
            showCancelButton: true
        }).then((result) => {
            if (result.value) {
                resetGame();
            }
        });
    }
}