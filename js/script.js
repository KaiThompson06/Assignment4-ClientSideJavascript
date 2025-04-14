// constants to hold the elements
const IDButton = document.getElementById("studentID");
const startGameButton = document.getElementById("startButton");
const finishGameButton = document.getElementById("finishButton");
const randomBackgroundButton = document.getElementById("randomBackground");
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


// randomBackground();

// add listeners
IDButton.addEventListener("click", function() {
    IDButton.textContent = "Kai Thompson: 1284787";
});

startGameButton.addEventListener("click", startGame);
finishGameButton.addEventListener("click", finishGame);
randomBackgroundButton.addEventListener("click", randomBackground);

function randomBackground() {
    // get a random background image with the help of the Unsplash API
    let UnsplashURL = "https://api.unsplash.com/photos/random?orientation=portrait&client_id=";


    data = "FPgNpfIEf78_OCkdFwpFHtgugbtwewi7CbjnQ6uyYho";
    // set the background image to the html element
    UnsplashURL += data;

    // then fetch an image from the Unsplash API
    fetch(UnsplashURL)
    .then(response => response.json())
    .then(data => {
        // set the background image to the html element
        body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${data.urls.full})`;
    
        // set the footer to credit the image to the author
        footer.innerHTML = `<p>Image by <a href="${data.user.links.html}" target="_blank">${data.user.name}</a> on Unsplash</p>`;

    });
};



function startGame() {

    let numberOfQuestions = qCount.value;
    let selectedDifficulty = "";
    let selectedType = "";


    if (difficulty.value !== "random") {
        selectedDifficulty = `&difficulty=${difficulty.value}`; // default value
    }
    if(qType.value !== "random") {
        selectedType = `&type=${qType.value}`; // default value
    }
    
    let url = `${API_URL}?amount=${numberOfQuestions}${selectedDifficulty}${selectedType}`;
    console.log(url);
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        questionContainer.innerHTML = ""; // Clear previous questions
        data.results.forEach(question => {
            let questionElement = document.createElement("div");
            questionElement.innerHTML = `<h3>${question.question}</h3>`;
            let answerDiv = document.createElement("div");
            questionElement.appendChild(answerDiv);
            let answers = question.incorrect_answers.concat(question.correct_answer);
            answers = shuffleArray(answers); // Shuffle the answers
            answers.forEach(answer => {
                let answerElement = document.createElement("div");
                let correct = false;
                if (answer === question.correct_answer) {
                    correct = true;
                }
                answerElement.innerHTML = `<input type="radio" name="${question.question}" id="${question.question}${answer}" value="${correct}"> <label for="${question.question}${answer}">${answer}</label>`;
                answerDiv.appendChild(answerElement);
            });
            questionContainer.appendChild(questionElement);
        });
    });

    questionSection.style.display = "block"; // Show question container
    questionGenerationForm.style.display = "none"; // Hide question generation form

}

function finishGame() {
    // give the user how many questions they got right
    let correctAnswers = 0;
    let totalQuestions = 0;
    let questions = document.querySelectorAll("#questionContainer > div > div"); // Select all answer divs
    questions.forEach(q => {
        totalQuestions++; // Increment total questions
        // Select all radio buttons in the question div
        let answers = q.querySelectorAll("input");
        answers.forEach(answer => {
            if (answer.checked && answer.value === "true") 
            {
            // If the answer is correct, increment the correct answers counter
                correctAnswers++;
            }
            else {
                answer.checked = false; // Uncheck the radio button if not correct
            }
            
        });
    });
    // Show the result to the user
    alert(`You got ${correctAnswers} out of ${totalQuestions} questions right!`);
    // Show the options again
    questionGenerationForm.style.display = "flex"; // Show question generation form
}



function shuffleArray(Array)
{
    let returnArray = Array.slice(); // Copy the array to avoid modifying the original
    Array.forEach(element => {
        // get a random index
        let randomIndex = Math.floor(Math.random() * returnArray.length);
        // swap the elements
        let temp = returnArray[randomIndex];
        returnArray[randomIndex] = element;
        returnArray[returnArray.indexOf(element)] = temp;
    });
    return returnArray;
}