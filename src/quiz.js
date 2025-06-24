class Quiz {
    constructor(questions, timeLimit, timeRemaining) {
        this.questions = questions;
        this.timeLimit = timeLimit;
        this.timeRemaining = timeRemaining;
        this.correctAnswers = 0;
        this.currentQuestionIndex = 0;
    }

    getQuestion() {
        return this.questions[this.currentQuestionIndex]
    }


    moveToNextQuestion() {
        ++this.currentQuestionIndex
    }

    shuffleQuestions() {
        for (let i = this.questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
        }
    }

    checkAnswer(answer) {
        if (answer === this.questions[this.currentQuestionIndex].answer) {
            ++this.correctAnswers
        }
    }

    hasEnded() {
        if (this.currentQuestionIndex < this.questions.length)
            return false
        else (this.currentQuestionIndex = this.questions.length)
        return true
    }

    filterQuestionsByDifficulty(difficulty) {
        this.difficulty = difficulty;
        if (difficulty >= 1 && difficulty <= 3) {
            this.questions = this.questions.filter(question => question.difficulty === difficulty)
        }
    }
    averageDifficulty() {
        const result = this.questions.reduce((acc, question) => {
            if (question.difficulty !== undefined) {
                acc.sum += question.difficulty;
                acc.count += 1;
            }
            return acc;
        }, { sum: 0, count: 0 });
        const avg = result.count > 0 ? result.sum / result.count : 0;
        return avg;
    }
}
