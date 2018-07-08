// Class TaskChooseAnswer
import Task from '../Task';

export default class TaskChooseAnswer extends Task {
    
    constructor(objQuestion, answerContainer) {
        super();
        this.fillAnswerContainer (objQuestion, answerContainer);
    }

    // Fill in the list of answers to the question.
    fillAnswerContainer (objQuestion, answerContainer) {
        let answerOptions = objQuestion.Options;

        for (let i = 0; i < answerOptions.length; i++) {
            let div = document.createElement('div');
            div.classList.add('answer-option');
            div.textContent = answerOptions[i];
            if (objQuestion.Answer === answerOptions[i]) {
                div.setAttribute('data-answer', 'ok');
            };
            answerContainer.append(div);
        }
    }
}