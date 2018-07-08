// Class TaskPuzzle
import Task from '../../Task';

export default class TaskPuzzle extends Task {
    
    constructor(objQuestion, answerContainer, questionContainer) {
        super();
        this.createPuzzle (objQuestion, answerContainer, questionContainer);
    }

    createPuzzle (objQuestion, answerContainer, questionContainer) {
        let pazzleContainer = document.createElement('div');
        let puzzleImageArr = objQuestion.Parts;
        let buttonCheck = document.createElement('div');

        pazzleContainer.id = 'puzzle-container';
        pazzleContainer.classList.add('puzzle-container');
        pazzleContainer.setAttribute('data-correct-order', objQuestion.CorrectOrder);
    
        questionContainer.textContent = '';
    
        for (let i = 0; i < puzzleImageArr.length; i++) {
            let div = document.createElement('div');
            div.classList.add('puzzle-parts');
            div.style.backgroundImage = `url(puzzle_images/${puzzleImageArr[i]})`;
            div.setAttribute('data-ordinal-number', i);
            pazzleContainer.append(div);
        };
    
        buttonCheck.textContent = 'Check';
        buttonCheck.id = 'button-answer-puzzle';
        buttonCheck.classList.add('menu-button');
    
        answerContainer.append(pazzleContainer);
        answerContainer.append(buttonCheck);
    
        $( function() {
            $( "#puzzle-container" ).sortable();
            $( "#puzzle-container" ).disableSelection();
        } );
    }
}