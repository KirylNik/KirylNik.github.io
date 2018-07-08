// Class TaskEnterAnswer
import Task from '../Task';

export default class TaskEnterAnswer extends Task {
    
    constructor(objQuestion, answerContainer) {
        super();
        this.fillAnswerContainer (objQuestion, answerContainer);
    }

    fillAnswerContainer (objQuestion, answerContainer) {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let div = document.createElement('div');
    
        input.id = 'form-input-answer'
        input.type = 'text';
        input.setAttribute('data-answer', objQuestion.Answer);
        input.placeholder = 'Inter your answer...';
        input.classList.add('input-answer');
    
        div.textContent = 'Ok';
        div.id = 'button-send-introduced-answer';
        div.classList.add('menu-button');
    
        form.append(input, div);
        answerContainer.append(form);
    }
}