document.addEventListener("DOMContentLoaded", () => {
  /************  HTML ELEMENTS  ************/
  const quizView = document.querySelector("#quizView");
  const endView = document.querySelector("#endView");

  const progressBar = document.querySelector("#progressBar");
  const questionCount = document.querySelector("#questionCount");
  const questionContainer = document.querySelector("#question");
  const choiceContainer = document.querySelector("#choices");
  const nextButton = document.querySelector("#nextButton");

  const resultContainer = document.querySelector("#result");
  const timeRemainingContainer = document.querySelector("#timeRemaining span");
  const restartButton = document.querySelector("#restartButton");

  /************  SET VISIBILITY OF VIEWS  ************/
  // Show the quiz view (div#quizView) and hide the end view (div#endView)
  quizView.style.display = "block";
  endView.style.display = "none";

  /************  QUIZ DATA  ************/
  // Array with the quiz questions
  const questions = [
    new Question("What is 2 + 2?", ["3", "4", "5", "6"], "4", 1),
    new Question("What is the capital of France?", ["Miami", "Paris", "Oslo", "Rome"], "Paris", 1),
    new Question("Who created JavaScript?", ["Plato", "Brendan Eich", "Lea Verou", "Bill Gates"], "Brendan Eich", 2),
    new Question("What is the mass–energy equivalence equation?", ["E = mc^2", "E = m*c^2", "E = m*c^3", "E = m*c"], "E = mc^2", 3)
  ];
  const quizDuration = 120; // 120 seconds (2 minutes)

  /************  QUIZ INSTANCE  ************/
  const quiz = new Quiz(questions, quizDuration, quizDuration);
  quiz.shuffleQuestions();

  /************  TIMER ************/
  let timer = 0;
  let intervalId = null;

  function startTimer() {
    clearInterval(intervalId); // Stop any existing timer
    timer = quiz.timeLimit;

    intervalId = setInterval(() => {
      timer--;
      const minutes = Math.floor(timer / 60).toString().padStart(2, "0");
      const seconds = (timer % 60).toString().padStart(2, "0");
      timeRemainingContainer.innerText = `${minutes}:${seconds}`;

      if (timer <= 0) {
        clearInterval(intervalId);
        showResults();
      }
    }, 1000);
  }

  /************  SHOW INITIAL CONTENT  ************/
  showQuestion();
  startTimer();

  /************  EVENT LISTENERS  ************/
  nextButton.addEventListener("click", nextButtonHandler);
  restartButton.addEventListener("click", restartQuiz);

  /************  FUNCTIONS  ************/

  // showQuestion() - Displays the current question and its choices
  function showQuestion() {
    if (quiz.hasEnded()) {
      showResults();
      return;
    }

    // Clear the previous question text and question choices
    questionContainer.innerText = "";
    choiceContainer.innerHTML = "";

    // Get the current question from the quiz
    const question = quiz.getQuestion();
    question.shuffleChoices();

    // 1. Show the question
    questionContainer.innerText = question.text;

    // 2. Update the green progress bar
    const progress = ((quiz.currentQuestionIndex + 1) / quiz.questions.length) * 100;
    progressBar.style.width = `${progress}%`;

    // 3. Update the question count text
    questionCount.innerText = `Question ${quiz.currentQuestionIndex + 1} of ${quiz.questions.length}`;

    // 4. Create and display radio inputs for each choice
    question.choices.forEach((choice) => {
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "choice";
      input.value = choice;

      const label = document.createElement("label");
      label.innerText = choice;

      const br = document.createElement("br");

      choiceContainer.appendChild(input);
      choiceContainer.appendChild(label);
      choiceContainer.appendChild(br);
    });
  }

  // nextButtonHandler() - Handles the click on the next button
  function nextButtonHandler() {
    const choices = document.querySelectorAll("input[name='choice']");
    let selectedAnswer = null;

    // Check which choice is selected
    choices.forEach((choice) => {
      if (choice.checked) {
        selectedAnswer = choice.value;
      }
    });

    // If none selected, do nothing
    if (!selectedAnswer) return;

    // Check answer and go to next question
    quiz.checkAnswer(selectedAnswer);
    quiz.moveToNextQuestion();
    showQuestion();
  }

  // showResults() - Displays the end view and the quiz results
  function showResults() {
    clearInterval(intervalId); // Stop timer
    quizView.style.display = "none";
    endView.style.display = "block";
    resultContainer.innerText = `You got ${quiz.correctAnswers} out of ${quiz.questions.length} correct.`;
  }

  // restartQuiz() - Resets the quiz and timer
  function restartQuiz() {
    endView.style.display = "none";
    quizView.style.display = "block";

    quiz.currentQuestionIndex = 0;
    quiz.correctAnswers = 0;
    quiz.shuffleQuestions();

    showQuestion();
    startTimer();
  }
});
