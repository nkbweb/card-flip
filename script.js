const cardImages = [
    "nkb.png", "nkb.png",
    "pandey.jpg", "pandey.jpg",
    "dheeraj.jpg", "dheeraj.jpg",
    "shashank.jpg", "shashank.jpg",
    "ajay.jpg", "ajay.jpg",
    "abhishek.jpg", "abhishek.jpg",
    "akash.jpg", "akash.jpg",
    "deepak.jpg", "deepak.jpg"
];

const gameBoard = document.getElementById("game-board");
const timerDisplay = document.getElementById("timer");
const restartButton = document.getElementById("restart-button");
const winMessage = document.getElementById("win-message");
const fireworksContainer = document.getElementById("fireworks");
let timer;
let timeRemaining = 40; // Change countdown to 40 seconds
let matchedPairs = 0; // Count matched pairs
let firstCard, secondCard; // Track first and second cards
let hasFlippedCard = false; // Check if a card has been flipped
let lockBoard = false; // Prevent actions during card checking
let currentCardIndex = 0; // Track the currently focused card

// Load the sounds
const flipSound = new Audio('flip.mp3');
const matchSound = new Audio('match.wav');
const winSound = new Audio('win.wav');
const loseSound = new Audio('lose.mp3');
const notMatchSound = new Audio('missMatch.mp3'); // Load not matched sound
//notMatchSound.volume=0.6;
// Shuffle function to randomize cards
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Create the game board with cards
function createBoard() {
    gameBoard.innerHTML = ""; // Clear the game board
    shuffle(cardImages); // Shuffle the card images

    cardImages.forEach((imageSrc) => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute('tabindex', '0'); // Make card focusable

        const img = document.createElement("img");
        img.src = imageSrc;
        img.className = "card-image";

        const back = document.createElement("div");
        back.className = "card-back";
        back.textContent = "?";

        // Add click event to the card
        card.addEventListener("click", () => {
            if (!lockBoard && !card.classList.contains("flipped")) {
                flipCard(card); // Allow flipping cards
            }
        });

        // Add keydown event for keyboard navigation
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                flipCard(card); // Flip card on Enter or Space
            }
        });

        card.appendChild(back); // Append the back of the card
        card.appendChild(img); // Append the image of the card
        gameBoard.appendChild(card); // Append the card to the game board
    });
    updateFocus(); // Set initial focus on the first card
}

// Update the focus on the current card
function updateFocus() {
    const cards = document.querySelectorAll('.card'); // Select all cards
    cards[currentCardIndex]?.focus(); // Set focus to the current card
}

// Function to start the game
function startGame() {
    matchedPairs = 0; // Reset matched pairs
    timeRemaining = 40; // Reset timer to 40 seconds
    restartButton.style.display = "inline"; // Show restart button
    winMessage.style.display = "none"; // Hide win message initially
    createBoard(); // Create the game board
    startTimer(); // Start the timer
    lockBoard = false; // Allow card flipping
    currentCardIndex = 0; // Reset current card index
}

// Timer logic
function startTimer() {
    timerDisplay.textContent = timeRemaining; // Display initial time
    clearInterval(timer); // Clear any existing timer to prevent overlap

    timer = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = timeRemaining;

        if (timeRemaining <= 0) {
            clearInterval(timer);
            timerDisplay.textContent = "Time's up!"; // Update timer display
            lockBoard = true; // Stop game interaction

            // Play lose sound
            loseSound.play();

            showPopup("You Lost!"); // Show "You Lost!" popup
        }
    }, 1000);
}

// Flip card logic with sound
function flipCard(card) {
    if (lockBoard) return; // Prevent flipping if cards are being checked

    card.classList.add("flipped"); // Mark the card as flipped
    const img = card.querySelector(".card-image");
    img.style.display = "block"; // Show the image

    // Play flip sound
    flipSound.play();

    if (!hasFlippedCard) {
        hasFlippedCard = true; // Mark the first card as flipped
        firstCard = card; // Store the first card
        currentCardIndex = [...document.querySelectorAll('.card')].indexOf(card); // Update current card index
        return; // Wait for the second card
    }

    // Second card flipped
    secondCard = card; // Store the second card
    checkForMatch();
}

// Check for a match between the two flipped cards
function checkForMatch() {
    lockBoard = true; // Prevent further actions while checking

    const isMatch = firstCard.querySelector(".card-image").src === secondCard.querySelector(".card-image").src;

    if (isMatch) {
        matchedPairs++;

        // Add a small delay before playing the match sound
        setTimeout(() => {
            // Play match sound
            matchSound.play();
        }, 600); // Delay before playing match sound

        resetBoard();

        // Check for game completion
        if (matchedPairs === cardImages.length / 2) {
            clearInterval(timer); // Stop timer
            setTimeout(() => {
                // Play win sound
                winSound.play();

                showPopup("You Won!"); // Show "You Won!" popup
                showFireworks(); // Show fireworks on win
            }, 500); // Delay before showing "You Won!" message
            lockBoard = true; // Stop game interaction
        }
    } else {
        // Play "not matched" sound
        setTimeout(() =>{
            notMatchSound.play();
        }, 800);

        // No match
        setTimeout(() => {
            firstCard.classList.remove("flipped"); // Flip back first card
            secondCard.classList.remove("flipped"); // Flip back second card
            resetBoard();
        }, 1000); // Delay before flipping back
    }
}

// Reset board states
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false]; // Reset flags
    firstCard = secondCard = null; // Clear card references
}

// Show popup message
function showPopup(message) {
    winMessage.textContent = message;
    winMessage.style.display = "block"; // Show the message

    setTimeout(() => {
        winMessage.style.display = "none"; // Hide the message after 3 seconds
    }, 3000); // Show for 3 seconds
}

// Show fireworks effect
function showFireworks() {
    fireworksContainer.style.display = "block";
    fireworksContainer.innerHTML = `<h1 style="color: white; font-size: 50px;">🎉</h1>`; // Simple fireworks message
    setTimeout(() => {
        fireworksContainer.style.display = "none"; // Hide after a few seconds
    }, 3000); // Show for 3 seconds
}

// Keyboard navigation logic
document.addEventListener("keydown", function(event) {
    const cards = document.querySelectorAll('.card'); // Select all cards
    switch (event.key) {
        case "ArrowRight":
            if (currentCardIndex < cards.length - 1) {
                currentCardIndex++; // Move focus to the next card
            }
            break;
        case "ArrowLeft":
            if (currentCardIndex > 0) {
                currentCardIndex--; // Move focus to the previous card
            }
            break;
        case "Enter":
        case " ":
            cards[currentCardIndex].click(); // Simulate a click on the current card
            break;
        default:
            break;
    }
    updateFocus(); // Update the focus on the new current card
});

// Restart game button event
restartButton.addEventListener("click", startGame);

// Start the game on load
startGame();
      
