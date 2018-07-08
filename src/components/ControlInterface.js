import { game } from './index.js';

// Interface management class.
export default class ControlInterface {

    init () {
        this.addHandlerButtonRun();
        this.addHandlerButtonCloseWindow();
        this.addHandlerButtonTypeAct('attack');
        this.addHandlerButtonTypeAct('epic-attack');
        this.addHandlerButtonTypeAct('potions');
        this.addHandlerButtonConcreteTypeAct();
    }
    // Add a Handler for the Run Button.
    addHandlerButtonRun () {
        let buttonRun = document.getElementById('button-run');
        buttonRun.addEventListener('click', this.handlerButtonRun);
    }

    handlerButtonRun () {
        let selectAction = document.getElementById('select-action');
        let modalWindowBackground = document.getElementById('modal-window-background');
        
        selectAction.classList.toggle('displayBlock');
        modalWindowBackground.classList.toggle('displayBlock');
        setTimeout(function () {
            selectAction.classList.toggle('select-action-animate-appear'); 
        },0);
    }
    // Add a handler for the button closing the action selection and task solving windows.
    addHandlerButtonCloseWindow () {
        let buttonCloseWindow = document.body.querySelectorAll('.select-action-close');
        buttonCloseWindow.forEach((item) => {
            item.addEventListener('click', this.handlerButtonCloseWindow.bind(this));
        });
    }
    // Close button handler
    handlerButtonCloseWindow (event) {
        let closedElem;

        if (event) {
            closedElem = event.target.parentElement;
        } else {
            closedElem = document.getElementById('task-container');
        }

        if (closedElem.classList.contains('select-action-animate-appear')) {
            closedElem.classList.remove('select-action-animate-appear');
        } else {
            closedElem.classList.remove('task-container-animate-appear');
        }

        this.wrapperHideClosedElem = this.hideClosedElem.bind(this, closedElem);
        closedElem.addEventListener('transitionend', this.wrapperHideClosedElem)
    }

    hideClosedElem (closedElem) {
        let modalWindowBackground = document.getElementById('modal-window-background');

        closedElem.classList.remove('displayBlock');
        modalWindowBackground.classList.remove('displayBlock');
        game.answerContainer.clear();
        closedElem.removeEventListener('transitionend', this.wrapperHideClosedElem)
    }
    // Add a handler for action buttons.
    addHandlerButtonTypeAct (typeAct) {
        let buttonTypeAct = document.getElementById(`menu-action-button-${typeAct}`);
        buttonTypeAct.addEventListener('click', this.handlerButtonTypeAct.bind(this, typeAct));
    }

    handlerButtonTypeAct (typeAct) {
        let selectAction = document.getElementById('select-action');

        game.player.selectedTypeAction = typeAct;
        this.wrapperDisplayMenuTypeAct = this.displayMenuTypeAct.bind(this, typeAct, selectAction);
        selectAction.addEventListener('transitionend', this.wrapperDisplayMenuTypeAct);
        selectAction.classList.toggle('select-action-animate-appear');
    }

    displayMenuTypeAct (typeAct, selectAction) {
        let newMenuTypeAct = document.getElementById(`select-${typeAct}`);

        selectAction.classList.toggle('displayBlock');
        newMenuTypeAct.classList.toggle('displayBlock');
        setTimeout(function () {
            newMenuTypeAct.classList.toggle('select-action-animate-appear');
        },0);
        selectAction.removeEventListener('transitionend', this.wrapperDisplayMenuTypeAct);
    }
    // Add a handler for the buttons to select a particular type of impact.
    addHandlerButtonConcreteTypeAct () {
        let actionTypeContainers = document.body.querySelectorAll('.menu-action-type-container'); 
        actionTypeContainers.forEach((item) => {
            item.addEventListener('click', this.handlerButtonConcreteTypeAct.bind(this));
        });
    }

    handlerButtonConcreteTypeAct (event) {
        if (event.target.classList.contains('concrete-type-act-button')) {
            let selectActionContainer = event.target.parentElement.parentElement.parentElement;

            game.player.selectedAction = this.getTypeSelectedAction(event);
            this.wrapperDisplayTaskContainer = this.displayTaskContainer.bind(this, event, selectActionContainer);
            selectActionContainer.addEventListener('transitionend', this.wrapperDisplayTaskContainer);
            selectActionContainer.classList.toggle('select-action-animate-appear');
        };
    }

    displayTaskContainer (event, selectActionContainer) {
        let taskContainer = document.getElementById('task-container');

        taskContainer.classList.toggle('displayBlock');
        selectActionContainer.classList.toggle('displayBlock');
        setTimeout(function () {
            game.createNewTask(event);
            taskContainer.classList.toggle('task-container-animate-appear');
        },50);
        selectActionContainer.removeEventListener('transitionend', this.wrapperDisplayTaskContainer);
    }

    getTypeSelectedAction (event) {
        return event.target.parentElement.id.substr(19);
    };
}