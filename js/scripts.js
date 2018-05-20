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
var openCards = [];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

//Shuffle the deck
deck = shuffle(deck);

//Find HTML container for the deck
const deckContainer = document.querySelector('.deck');

//Add click listener to the deck and flip the card if it's clicked
deckContainer.addEventListener("click", flipCard);

//Loop through each card in deck and create its HTML
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
        const card = evt.target;
        //Open the card and check for a match
        card.classList.add("show", "open");
        checkMatch(card);
    }
}

function checkMatch(card) {
    //Check if there are any open cards
    if(openCards.length != 0) {
        //Check if the opened cards match
        if(card.innerHTML == openCards[0].innerHTML){
            //If they match, leave them open and clear the opened cards list
            card.classList.add("match");
            openCards[0].classList.add("match");
            openCards = [];
        } else {
            //If they don't match, add a class indicating the mismatch to both cards
            card.classList.add("nomatch");
            openCards[0].classList.add("nomatch");
            //Wait 1 second, the reset the open cards and clear the opened cards list
            setTimeout(function () {
                card.classList.remove("show", "open", "nomatch");
                openCards[0].classList.remove("show", "open", "nomatch");
                openCards = [];
            }, 1000);
        }
    } else {
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