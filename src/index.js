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
  const timeRemainingContainer = document.getElementById("timeRemaining");

  /************  QUIZ DATA  ************/
  const questions = [
    new Question("What is 2 + 2?", ["3", "4", "5", "6"], "4", 1),
    new Question("What is the capital of France?", ["Miami", "Paris", "Oslo", "Rome"], "Paris", 1),
    new Question("Who created JavaScript?", ["Plato", "Brendan Eich", "Lea Verou", "Bill Gates"], "Brendan Eich", 2),
    new Question("What is the mass–energy equivalence equation?", ["E = mc^2", "E = m*c^2", "E = m*c^3", "E = m*c"], "E = mc^2", 3),
  ];
  const quizDuration = 120;

  /************  QUIZ INSTANCE  ************/
  const quiz = new Quiz(questions, quizDuration, quizDuration);
  quiz.shuffleQuestions();

  /************  INITIAL VIEW SETUP  ************/
  quizView.style.display = "block";
  endView.style.display = "none";

  const minutes = Math.floor(quiz.timeRemaining / 60).toString().padStart(2, "0");
  const seconds = (quiz.timeRemaining % 60).toString().padStart(2, "0");
  timeRemainingContainer.innerText = `${minutes}:${seconds}`;

  /************  EVENT LISTENERS  ************/
  nextButton.addEventListener("click", nextButtonHandler);

  /************  FUNKTIONEN  ************/
  function showQuestion() {
    if (quiz.hasEnded()) {
      showResults();
      return;
    }

    questionContainer.innerText = "";
    choiceContainer.innerHTML = "";

    const question = quiz.getQuestion();
    question.shuffleChoices();

    questionContainer.innerText = question.text;

    const percentage = ((quiz.currentQuestionIndex / quiz.questions.length) * 100);
    progressBar.style.width = `${percentage}%`;

    questionCount.innerText = `Question ${quiz.currentQuestionIndex + 1} of ${quiz.questions.length}`;

    question.choices.forEach(choiceText => {
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "choice";
      input.value = choiceText;

      const label = document.createElement("label");
      label.innerText = choiceText;

      choiceContainer.appendChild(input);
      choiceContainer.appendChild(label);
      choiceContainer.appendChild(document.createElement("br"));
    });
  }

  function nextButtonHandler() {
    let selectedAnswer = null;
    const choices = document.querySelectorAll('input[name="choice"]');

    choices.forEach(choice => {
      if (choice.checked) {
        selectedAnswer = choice.value;
      }
    });

    if (selectedAnswer) {
      quiz.checkAnswer(selectedAnswer);
      quiz.moveToNextQuestion();
      showQuestion();
    }
  }

  function showResults() {
    quizView.style.display = "none";
    endView.style.display = "flex";
    resultContainer.innerText = `You scored ${quiz.correctAnswers} out of ${quiz.questions.length} correct answers!`;
  }

  // Starte das Quiz
  showQuestion();
});
