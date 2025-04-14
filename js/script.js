// constants to hold the elements

// buttons
const IDButton = document.getElementById("studentID");
const startGameButton = document.getElementById("startButton");
const finishGameButton = document.getElementById("finishButton");
const randomBackgroundButton = document.getElementById("randomBackground");

// containers and forms
const questionContainer = document.getElementById("questionContainer");
const questionGenerationForm = document.querySelector("main section:nth-of-type(1)");
const questionSection = document.querySelector("main section:nth-of-type(2)");
const body = document.querySelector("body");
const footer = document.querySelector("footer");

// form elements
const qCount = document.getElementById("qCount");
const difficulty = document.getElementById("difficulty");
const qType = document.getElementById("qType");

// constant URL to the API
const API_URL = "https://opentdb.com/api.php";

// call the random background function to set a random background image
randomBackground();

// add listeners

// when the user clicks the ID button, it will show the student ID
IDButton.addEventListener("click", function() {
    IDButton.textContent = "Kai Thompson: 1284787";
});
// when the user click a button, call the corresponding function
startGameButton.addEventListener("click", startGame);
finishGameButton.addEventListener("click", finishGame);
randomBackgroundButton.addEventListener("click", randomBackground);

// function to set a random background image
function randomBackground() {

    // get a random background image with the help of the Unsplash API
    let UnsplashURL = "https://api.unsplash.com/photos/random?orientation=portrait&client_id=";
    // store the access key in a variable (bad practice)
    data = "FPgNpfIEf78_OCkdFwpFHtgugbtwewi7CbjnQ6uyYho";

    // add the access key to the URL
    UnsplashURL += data;

    // then fetch an image from the Unsplash API
    fetch(UnsplashURL)
    // convert the response to JSON
    .then(response => response.json())
    // then get the image data
    .then(data => {
        // set the background image to the html element
        body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${data.urls.full})`;
        // set the footer to credit the image to the author
        footer.innerHTML = `<p>Image by <a href="${data.user.links.html}" target="_blank">${data.user.name}</a> on Unsplash</p>`;
    });
};


// generates new trivia questions based on the user input
function startGame() {
    // set variables

    // get the number of questions from the input field
    let numberOfQuestions = qCount.value;
    let selectedDifficulty = "";
    let selectedType = "";

    // if the difficulty or type is not random, set the selected difficulty and type to the value of the input field
    if (difficulty.value !== "random") {
        selectedDifficulty = `&difficulty=${difficulty.value}`; // default value
    }
    // same with the type
    if(qType.value !== "random") {
        selectedType = `&type=${qType.value}`; // default value
    }
    // create the final link to the API
    let url = `${API_URL}?amount=${numberOfQuestions}${selectedDifficulty}${selectedType}`;

    // fetch the questions from the API
    fetch(url)
    // convert the response to JSON
    .then(response => response.json())
    // then get the data from the response
    .then(data => {
        questionContainer.innerHTML = ""; // Clear previous questions
        // for each question in the data
        data.results.forEach(question => {
            // create a new div element for the question
            let questionElement = document.createElement("div");
            // create an h3 with the question text
            questionElement.innerHTML = `<h3>${question.question}</h3>`;
            // create a new div element for the answers
            let answerDiv = document.createElement("div");
            // add the answer div to the question div
            questionElement.appendChild(answerDiv);
            // create a new array of both of the correct and incorrect answers
            let answers = question.incorrect_answers.concat(question.correct_answer);
            // shuffle the array into a random order
            answers = shuffleArray(answers); 
            // for each answer in the answers array
            answers.forEach(answer => {
                // create a new div element for the answer
                let answerElement = document.createElement("div");
                // create an variable to track if it is correct or not
                let correct = false;
                // if the answer is correct, set the correct variable to true
                if (answer === question.correct_answer) {
                    correct = true;
                }
                // set the answer element to a radio button with the answer text
                // set the name of the radio button to the question text
                // set the id of the radio button to the question text + answer text (so true and false are always are unique)
                // set the value of the radio button to true or false based on the correct variable
                // set the label of the radio button to the answer text
                // set the for attribute of the label to the id of the radio button
                answerElement.innerHTML = `<input type="radio" name="${question.question}" id="${question.question}${answer}" value="${correct}"> <label for="${question.question}${answer}">${answer}</label>`;
                // add the answer element to the answer div
                answerDiv.appendChild(answerElement);
            });
            // add the question element to the question container
            questionContainer.appendChild(questionElement);
            // then repeat for each question
        });
    });
    // after everything is added, show the question container and hide the question generation form
    questionSection.style.display = "block"; // Show question container
    questionGenerationForm.style.display = "none"; // Hide question generation form

}

// function to finish the game and show the results
function finishGame() {
    // give the user how many questions they got right

    // how many they got correct
    let correctAnswers = 0;
    // how many questions there are
    let totalQuestions = 0;
    // select every div that holds a group of answers in the question container
    let questions = document.querySelectorAll("#questionContainer > div > div"); // Select all answer divs
    questions.forEach(q => {
        totalQuestions++; // Increment total questions
        
        // Select all radio buttons in the question div
        let answers = q.querySelectorAll("input");
        // for each answer in the answers array
        answers.forEach(answer => {
            // if the answer is checked and the value is true, then the answer is correct, otherwise it is not
            if (answer.checked && answer.value === "true") 
            {
            // If the answer is correct, increment the correct answers counter
                correctAnswers++;
            }
            else {
                answer.checked = false; // Uncheck the radio button if incorrect
            }
        });
    });
    // Show the result to the user using an alert
    alert(`You got ${correctAnswers} out of ${totalQuestions} questions right!`);
    // Show the options again
    questionGenerationForm.style.display = "flex"; // Show question generation form
}


// a classic function to shuffle an array
function shuffleArray(Array)
{
    // create a copy of the array to avoid modifying the original that holds the randmized array
    let returnArray = Array.slice();
    // loop through the array and swap each element with a random element in the array
    Array.forEach(element => {
        // get a random index
        let randomIndex = Math.floor(Math.random() * returnArray.length);
        // swap the elements
        let temp = returnArray[randomIndex];
        returnArray[randomIndex] = element;
        returnArray[returnArray.indexOf(element)] = temp;
    });
    // return the shuffled array
    return returnArray;
}