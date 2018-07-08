// Class AnswerContainer
import { game } from './index.js';

export default class AnswerContainer {
    // Add a handler for the response container.
    addHandlerClick () {
        let answerContainer = document.getElementById('answer-container');
        answerContainer.addEventListener('click', this.handlerClick.bind(game));
    }

    handlerClick (event, game) {
        if (event.target.id === 'button-send-introduced-answer') {
            this.answerContainer.checkEnteredAnswer();
        } else if (event.target.id === 'button-answer-audio-question') {
            this.answerContainer.checkAudioQuestion();
        } else if (event.target.classList.contains('answer-option')) {
            this.currentTask.checkUserAnswer(event.target.dataset.answer, 'ok');
        } else if (event.target.id === 'button-answer-puzzle') {
            this.answerContainer.checkUserPuzzle();
        };
    }

    checkEnteredAnswer () {
        let input = document.getElementById('form-input-answer');
        let userAnswer = input.value;
        let correctAnswer = input.dataset.answer;

        game.currentTask.checkUserAnswer(correctAnswer, userAnswer);
    }

    checkAudioQuestion () {
        let input = document.getElementById('input-answer-audio-question');
        let userAnswer = input.value;
        let correctAnswer = input.dataset.answer;

        game.currentTask.checkUserAnswer(correctAnswer, userAnswer);
    }

    checkUserPuzzle () {
        let puzzleContainer = document.getElementById('puzzle-container');
        let partsPuzzle = [...puzzleContainer.childNodes];
        let correctOrderPuzzle = puzzleContainer.dataset.correctOrder;
        let currentOrderPuzzle = '';

        for (let i = 0; i < partsPuzzle.length; i++) {
            currentOrderPuzzle += partsPuzzle[i].dataset.ordinalNumber;
        };
        
        game.currentTask.checkUserAnswer(correctOrderPuzzle, currentOrderPuzzle);
    }

    clear () {
        document.getElementById('answer-container').textContent = '';
    }
}