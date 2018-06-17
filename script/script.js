// The class that controls the game.
class Main {

    constructor () {
        this.player;
        this.enemy;
        this.control;
        this.currentTask;
        this.currentStep;
        this.quantityKilledEnemy = 0;
        this.copyQuestions = [];
        this.questions;
        this.orcNames;
        this.listEnemies;
    }

    init () {
        this.loadData();
        this.player = new Player('Gandalf', 100);
        this.enemy = new Enemy('Orc', 20, 'orc');
        this.player.enterArena();
        this.enemy.enterArena();
        this.currentStep = 'player';
        this.control = new ControlInterface();
        this.control.addHundlerButtonRun();
        this.control.addHundlerButtonCloseWindow();
        this.control.addHundlerButtonTypeAct('attack');
        this.control.addHundlerButtonTypeAct('epic-attack');
        this.control.addHundlerButtonTypeAct('potions');
        this.control.addHundlerButtonConcreteTypeAct();
        this.control.addHundlerAudioPlayer();
        this.addHundlerAnswerContainer();
        this.updateStatusBar();
    }

    loadData () {
        loadQuestions()
        .then(() => loadOrcNames())
        .then(() => loadListEnemy())
    }
    // Create a new task for the player.
    createNewTask (event) {
        this.currentTask = new Task(event);
    }
    // Update the names and health of the personages.
    updateStatusBar () {
        let playerNameContainer = document.getElementById('status-bar-player-name');
        let enemyNameContainer = document.getElementById('status-bar-enemy-name');
        let playerHeathContainer = document.getElementById('status-bar-player-health');
        let enemyHeathContainer = document.getElementById('status-bar-enemy-health');

        playerNameContainer.textContent = game.player.name;
        enemyNameContainer.textContent = game.enemy.name;
        playerHeathContainer.textContent = game.player.health;
        enemyHeathContainer.textContent = game.enemy.health;
    }
    // Go to the next move of the game.
    takeNextStep () {
        this.checkHealthPersonages();
        setTimeout(() => (this.transferNextTurn()), 8000);
    }
    // Check the health of the personages and perform actions if someone died.
    checkHealthPersonages () {
        if (this.player.health <= 0) {
            this.player.die();
            game.currentTask.displayTaskResult('You lose!');
            setTimeout(() => {
                savePlayerResult();
                this.goToResults();
            }, 4000);
        } else if (this.enemy.health <= 0 && this.enemy.name === 'Sauron') {
            this.quantityKilledEnemy++;
            this.enemy.die(this.enemy.enemyType);
            game.currentTask.displayTaskResult('You won!');
            setTimeout(() => {
                savePlayerResult();
                this.goToResults();
            }, 4000);
        } else if (this.enemy.health <= 0) {
            this.quantityKilledEnemy++;
            this.enemy.die(this.enemy.enemyType)
            .then(() => this.callNextEnemy());
            this.currentStep = 'enemy';
        }
    }

    transferNextTurn () {
        if (this.currentStep === 'player') {
            this.currentStep === 'enemy';
            this.giveTurnEnemy();
        } else {
            this.currentStep === 'player';
        }
    }
    // Call the next enemy.
    callNextEnemy () {
        this.enemy.createNextEnemy();
        this.enemy.enterArena();
        this.player.health = 100;
        this.updateStatusBar();
    }
    // Pass the course to the enemy.
    giveTurnEnemy () {
        game.enemy.selectedTypeAction = 'attack';
        game.enemy.selectedAction = getRandomTypeAttack();
        game.currentStep = 'enemy';
        game.enemy.attack();
    }
    // If the current enemy is an orc, but generate a name for it.
    checkNameEnemy () {
        if (this.enemy.enemyType === 'orc') {
            this.enemy.name = this.enemy.generateRandomName();
            this.updateStatusBar();
        }
    }
    // Check if the level of health of one of the personages is negative and correct, if so.
    checkNegativeHealth () {
        if (game.player.health < 0) {
            game.player.health = 0;
        }

        if (game.enemy.health < 0) {
            game.enemy.health = 0;
        }
    }
    // Add a handler for the response container.
    addHundlerAnswerContainer () {
        let answerContainer = document.getElementById('answer-container');
        this.hundlerAnswerContainer = (event) => {
            if (event.target.id === 'button-send-introduced-answer') {
                let input = document.getElementById('form-input-answer');
                let correctAnswer = input.dataset.answer;
                let userAnswer = input.value;
                this.currentTask.checkUserAnswer(correctAnswer, userAnswer);

            } else if (event.target.id === 'button-answer-audio-question') {
                let input = document.getElementById('input-answer-audio-question');
                let correctAnswer = input.dataset.answer;
                let userAnswer = input.value;
                this.currentTask.checkUserAnswer(correctAnswer, userAnswer);

            } else if (event.target.classList.contains('answerOption')) {
                this.currentTask.checkUserAnswer(event.target.dataset.answer, 'ok');

            } else if (event.target.id === 'button-answer-puzzle') {
                let puzzleContainer = document.getElementById('puzzle-container');
                let partsPuzzle = [...puzzleContainer.childNodes];
                let correctOrderPuzzle = puzzleContainer.dataset.correctOrder;
                let currentOrderPuzzle = '';

                for (let i = 0; i < partsPuzzle.length; i++) {
                    currentOrderPuzzle += partsPuzzle[i].dataset.ordinalNumber;
                };
                
                this.currentTask.checkUserAnswer(correctOrderPuzzle, currentOrderPuzzle);
            };
        };
        answerContainer.addEventListener('click', this.hundlerAnswerContainer);
    }
    // Go to the results table window.
    goToResults () {
        createWindowResults();
        fillWindowResults();
        displayWindowResults();
    }

}

// The personage class of the game.
class Personage {

    constructor(name, health) {
        this.name = name;
        this.health = health;
        this.selectedTypeAction;
        this.selectedAction;
    }
    // Go to the battle arena.
    enterArena () {
        this.creatPersonageContainer(this.enemyType); 
        this.animationEnterArena(this.enemyType);
    }
    // Perform an attack or treatment action.
    act () {
        if (this.selectedTypeAction === 'potions') {
            this.getImpact();
        } else {
            this.attack();
        };
        game.takeNextStep();
    }
    // Perform an attack action.
    attack () {
        let damage = calculateValueImpact(this.selectedTypeAction);

        if (this.selectedTypeAction === 'attack') {
            this.animateSimpleAttack();
        } else {
            this.animateEpicAttack();
        };

        if (game.currentStep === 'player') {
            game.enemy.health -= damage;
        } else {
            game.player.health -= damage;
        }

        game.checkNegativeHealth();
        game.updateStatusBar();
        game.checkHealthPersonages();
    }
    // Get impact, damage, or treatment.
    getImpact () {
        let valueImpact = calculateValueImpact(this.selectedTypeAction);
        game.player.health += valueImpact;
        this.animateGetImpact();
        game.updateStatusBar();
    }
    // Animate a simple pesrsonage attack.
    animateSimpleAttack () {
        let personageContainer = getPersonageContainer(this.enemyType);
        let typePersonageAttack;

        if (this.enemyType) {
            typePersonageAttack = this.enemyType;
        } else {
            typePersonageAttack = game.currentStep;
        }

        this.hundlerAnimationEnd = () => {
            personageContainer.classList.remove(`animate-${typePersonageAttack}-${this.selectedAction}`);
        };

        personageContainer.addEventListener('animationend', this.hundlerAnimationEnd);
        personageContainer.classList.add(`animate-${typePersonageAttack}-${this.selectedAction}`);
    }
    // Animate the epic attack of the personage.
    animateEpicAttack () {
        let personageContainer = getPersonageContainer(this.enemyType);
        let effectContainer = document.createElement('div');
        let currentStep = game.currentStep;
        effectContainer.id = 'effectContainer';

        this.hundlerAnimationEnd = () => {
            let effectContainer = document.getElementById('effectContainer');
            document.body.removeChild(effectContainer);
            personageContainer.classList.remove(`${currentStep}-epyc-attack`);
        };
        effectContainer.addEventListener('animationend', this.hundlerAnimationEnd);
        document.body.append(effectContainer);
        personageContainer.classList.add(`${game.currentStep}-epyc-attack`);
        effectContainer.classList.add(`animate-${game.currentStep}-${this.selectedAction}`);
    }
    // Animate the getting impact.
    animateGetImpact () {
        let effectContainer = document.createElement('div');
        effectContainer.id = 'effectContainer';

        this.hundlerAnimationEnd = () => {
            let effectContainer = document.getElementById('effectContainer');
            document.body.removeChild(effectContainer);
        };
        effectContainer.addEventListener('animationend', this.hundlerAnimationEnd);
        document.body.append(effectContainer);
        effectContainer.classList.add(`animate-${game.currentStep}-${this.selectedAction}`);
    }
    // Death of the personage.
    die (personage = 'player') {
        return new Promise((resolve, reject) => {
            let personageContainer = document.getElementById(personage);
            this.hundlerAnimationEnd = () => {
                document.body.removeChild(personageContainer);
                resolve();
            };
            personageContainer.addEventListener('animationend', this.hundlerAnimationEnd);
            personageContainer.classList.add('animate-die');
        })
    }
    // Create a container for the personage.
    creatPersonageContainer (personage = 'player') {
        let personageContainer = document.createElement('div');
        personageContainer.id = personage;
        document.body.append(personageContainer);
    }
    // Set the animation output of the personage to the arena.
    animationEnterArena (personage = 'player') {
        setTimeout(function () {
            let personageContainer = document.getElementById(personage);
            personageContainer.classList.add(`${personage}-come`);
            personage == 'player'
            ? personageContainer.classList.add('enter-arena-left')
            : personageContainer.classList.add('enter-arena-right');
        }, 0);
        setTimeout(function () {
            let personageContainer = document.getElementById(personage);
            personageContainer.classList.remove('enter-arena-left');
            personageContainer.classList.remove('enter-arena-right');
            personageContainer.classList.remove(`${personage}-come`);
            personageContainer.classList.add(`${personage}-stand`);
        }, 5000)
    }
}

// Class Player
class Player extends Personage {
    
    constructor(role, health) {
        super(role, health);
    }
}

// Class Enemy
class Enemy extends Personage {
    
    constructor(role, health, enemyType) {
        super(role, health);
        this.enemyType = enemyType;
    }
    // Create a random name.
    generateRandomName () {
        let randomValueForName = Math.floor(Math.random() * orcNames["Names"].length);
        let randomValueForProperty = Math.floor(Math.random() * orcNames['Properties'].length);
        let randomName = orcNames["Names"][randomValueForName];
        let randomProperty = orcNames['Properties'][randomValueForProperty];

        let resultName = `${randomProperty} Orc ${randomName}`;
        return resultName;
    }
    // Create the next enemy.
    createNextEnemy () {
        let nextEnemyObj = listEnemies.shift();
        let enemyType = replaceBlanksOnDashes(nextEnemyObj.name);
        game.enemy = new Enemy(nextEnemyObj.name, nextEnemyObj.health, enemyType);
    }
}

// Interface management class.
class ControlInterface {
    // Add a Handler for the Run Button.
    addHundlerButtonRun () {
        let buttonRun = document.getElementById('button-run');
        this.hundlerButtonRun = () => {
            let selectAction = document.getElementById('select-action');
            let modalWindowBackground = document.getElementById('modal-window-background');
            selectAction.classList.toggle('displayBlock');
            modalWindowBackground.classList.toggle('displayBlock');
            setTimeout(function () {
                selectAction.classList.toggle('select-action-animate-appear'); 
            },0);
        };
        buttonRun.addEventListener('click', this.hundlerButtonRun);
    }
    // Add a handler for the button closing the action selection and task solving windows.
    addHundlerButtonCloseWindow () {
        let buttonCloseWindow = document.body.querySelectorAll('.select-action-close');
        buttonCloseWindow.forEach((item) => {
            item.addEventListener('click', this.hundlerButtonCloseWindow);
        });
    }
    // Close button handler.
    hundlerButtonCloseWindow (event) {
        let selectAction;
        if (event) {
            selectAction = event.target.parentElement;
        } else {
            selectAction = document.getElementById('task-container');
            let taskResultContainer = document.getElementById('taskResultContainer');
            document.body.removeChild(taskResultContainer);
        }
        let modalWindowBackground = document.getElementById('modal-window-background');
        if (selectAction.classList.contains('select-action-animate-appear')) {
            selectAction.classList.remove('select-action-animate-appear');
        } else {
            selectAction.classList.remove('task-container-animate-appear');
        }
        setTimeout(function () {
            selectAction.classList.remove('displayBlock');
            modalWindowBackground.classList.remove('displayBlock');
            clearAnswerContainer();
        },1000);
    };
    // Add a handler for action buttons.
    addHundlerButtonTypeAct (typeAct) {
        let buttonTypeAct = document.getElementById(`menu-action-button-${typeAct}`);
        this.hundlerButtonTypeAct = () => {
            game.player.selectedTypeAction = typeAct;
            let selectAction = document.getElementById('select-action');
            selectAction.classList.toggle('select-action-animate-appear');
            setTimeout(function () {
                selectAction.classList.toggle('displayBlock');
                let newMenuTypeAct = document.getElementById(`select-${typeAct}`);
                newMenuTypeAct.classList.toggle('displayBlock');
                setTimeout(function () {
                    newMenuTypeAct.classList.toggle('select-action-animate-appear');
                },50);
            },1000);
        };
        buttonTypeAct.addEventListener('click', this.hundlerButtonTypeAct);
    }
    // Add a handler for the buttons to select a particular type of impact.
    addHundlerButtonConcreteTypeAct () {
        let actionTypeContainers = document.body.querySelectorAll('.menu-action-type-container'); 
        this.hundlerButtonConcreteTypeAct = (event) => {
            if (event.target.classList.contains('concrete-type-act-button')) {
                game.player.selectedAction = getTypeSelectedAction(event);
                event.target.parentElement.parentElement.parentElement.classList.toggle('select-action-animate-appear');
                setTimeout(function () {
                    event.target.parentElement.parentElement.parentElement.classList.toggle('displayBlock');
                    let taskContainer = document.getElementById('task-container');
                    taskContainer.classList.toggle('displayBlock');
                    setTimeout(function () {
                        game.createNewTask(event);
                        taskContainer.classList.toggle('task-container-animate-appear');
                    },50);
                },1000);
            };
        };
        actionTypeContainers.forEach((item) => {
            item.addEventListener('click', this.hundlerButtonConcreteTypeAct);
        });
    }
    // Add a handler for the background music menu.
    addHundlerAudioPlayer () {
        let audioContainer = document.getElementById('audio-container');
        let contentAudioContainer = [...audioContainer.children];
        let audioPlayerButtonsContainer = document.getElementById('audio-player-buttons-container');
        let currentTrack = 0;
    
        this.hundlerAudioPlayerButtons = (event) => {
            if (event.target.id === 'audio-player-button-pause') {
                contentAudioContainer[currentTrack].pause();
            } else if (event.target.id === 'audio-player-button-play'){
                contentAudioContainer[currentTrack].play();
            } else if (event.target.id === 'audio-player-button-next'){
                contentAudioContainer[currentTrack].pause();
                contentAudioContainer[currentTrack].currentTime = 0;
                if (currentTrack < contentAudioContainer.length - 1) {
                    currentTrack++;
                    contentAudioContainer[currentTrack].play();
                } else {
                    currentTrack = 0;
                    contentAudioContainer[currentTrack].play();
                }
            } else if (event.target.id === 'audio-player-button-back'){
                contentAudioContainer[currentTrack].pause();
                contentAudioContainer[currentTrack].currentTime = 0;
                if (currentTrack === 0) {
                    currentTrack = contentAudioContainer.length - 1;
                    contentAudioContainer[currentTrack].play();
                } else {
                    currentTrack --;
                    contentAudioContainer[currentTrack].play();
                }
            }
        };
        audioPlayerButtonsContainer.addEventListener('click', this.hundlerAudioPlayerButtons);
    };
}
// Class task for the player.
class Task {
    constructor (event) {
        this.fillTaskContainer(event);
    }
    // Fill in the task window.
    fillTaskContainer (event) {
        let typeAction = getTypeAction(event);
        let objQuestion = getObjQuestion(typeAction);
        let typeQuestion = getTypeQuestion(objQuestion);
        let questionContainer = document.getElementById('question-container');
        let answerContainer = document.getElementById('answer-container');
        
        if (typeQuestion === 'Puzzle') {
            this.createPuzzle(questionContainer, answerContainer, objQuestion);
        } else {
            let questionText = getQuestionText(objQuestion);
            questionContainer.textContent = questionText;
            this.fillAnserContainer(typeQuestion, questionText, objQuestion, answerContainer);
        }
    }
    // Fill the task answer container.
    fillAnserContainer (typeQuestion, questionText, objQuestion, answerContainer) {
        if (typeQuestion === 'Select answer') {
            this.fillAnserContainerOptions(objQuestion, answerContainer);
        } else if (typeQuestion === 'Enter answer') {
            this.fillAnserContainerInput(objQuestion, answerContainer);
        } else if (typeQuestion === 'Answer the audio question') {
            this.fillAnserContainerAudioTest(objQuestion, answerContainer);
        }
    }
    // Fill in the list of answers to the question.
    fillAnserContainerOptions (objQuestion, answerContainer) {
        let answerOptions = objQuestion.Options;
        for (let i = 0; i < answerOptions.length; i++) {
            let div = document.createElement('div');
            div.classList.add('answerOption');
            div.textContent = answerOptions[i];
            if (objQuestion.Answer === answerOptions[i]) {
                div.setAttribute('data-answer', 'ok');
            };
            answerContainer.append(div);
        }
    }
    
    fillAnserContainerInput (objQuestion, answerContainer) {
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
    
    fillAnserContainerAudioTest (objQuestion, answerContainer) {
        let buttonPlayAudio = document.createElement('div');
        let buttonAnswer = document.createElement('div');
        let input = document.createElement('input');
        
        input.id = 'input-answer-audio-question';
        input.type = 'text';
        input.setAttribute('data-answer', objQuestion.Answer);
        input.placeholder = 'Inter your answer...';
        input.classList.add('input-answer');
    
        buttonPlayAudio.textContent = 'Play';
        buttonPlayAudio.id = 'button-play-audio-question';
        buttonPlayAudio.setAttribute('data-audio-question', objQuestion.AudioQuestion);
        buttonPlayAudio.classList.add('menu-button');
    
        buttonAnswer.textContent = 'Ok';
        buttonAnswer.id = 'button-answer-audio-question';
        buttonAnswer.classList.add('menu-button');
    
        this.addHundlerButtonPlayQuestion(buttonPlayAudio);
    
        answerContainer.append(buttonPlayAudio, input, buttonAnswer);
    }

    createPuzzle (questionContainer, answerContainer, objQuestion) {
        let pazzleContainer = document.createElement('div');
        pazzleContainer.id = 'puzzle-container';
        pazzleContainer.classList.add('puzzle-container');
        pazzleContainer.setAttribute('data-correct-order', objQuestion.CorrectOrder);
    
        questionContainer.textContent = '';
    
        let puzzleImageArr = objQuestion.Parts;
        for (let i = 0; i < puzzleImageArr.length; i++) {
            let div = document.createElement('div');
            div.classList.add('puzzle-parts');
            div.style.backgroundImage = `url(image/${puzzleImageArr[i]})`;
            div.setAttribute('data-ordinal-number', i);
            pazzleContainer.append(div);
        };
    
        let buttonCheck = document.createElement('div');
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
    // Add a handler for the audio issue start button.
    addHundlerButtonPlayQuestion (buttonPlayAudio) {
        this.hundlerButtonPlayQuestion = (event) => {
            let audioQuestion = event.target.dataset.audioQuestion;
            let voices = speechSynthesis.getVoices();
            let utterance = new SpeechSynthesisUtterance(audioQuestion);
            
            utterance.voice = voices[2];
            utterance.lang = 'en-US';
            utterance.rate = 0.7;
            speechSynthesis.speak(utterance);
        }
        buttonPlayAudio.addEventListener('click', this.hundlerButtonPlayQuestion);
    }
    // Check the player's answer.
    checkUserAnswer (correctOrderPuzzle, currentOrderPuzzle) {
        if (isPartString(correctOrderPuzzle, currentOrderPuzzle)) {
            this.displayTaskResult('Correct answer!');
            setTimeout(() => {
                game.currentStep = 'player';
                game.player.act();
                soundAttackPlayer();
            }, 6000)
        } else {
            this.displayTaskResult('Incorrect answer!');
            setTimeout(() => {
                game.giveTurnEnemy();
                soundAttackEnemy();
            }, 6000)
        }
    }
    // Display the result of the player's response.
    displayTaskResult(text) {
        let taskResultContainer = document.createElement('div');
        taskResultContainer.textContent = text;
        taskResultContainer.id = 'taskResultContainer';
        taskResultContainer.classList.add('taskResultContainer');
        if (text === 'Incorrect answer!' || text === 'You lose!') {
            taskResultContainer.classList.add('colorDarkRed');   
        }
        document.body.append(taskResultContainer);
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => {
            let taskResultContainer = document.getElementById('taskResultContainer');
            taskResultContainer.classList.add('taskResultContainer-animate-appear');
            resolve();
            }, 50);
        });
        promise.then(() => {
            setTimeout(() => {
                game.control.hundlerButtonCloseWindow();
            }, 4000);
        });
    }

};   



// Utilities

// Get a random element from a given half of the array.
getRandomElemArrayFromDesiredHalf = (array, half) => {
    let halfLengthArray = Math.round(array.length / 2);
    let randomNumber = Math.round(Math.random() * halfLengthArray);
    
    if (half === 'first') {
        let randomElem = array.splice((randomNumber), 1);
        return randomElem[0];
    } else {
        let randomElem = array.splice((array.length - randomNumber), 1);
        return randomElem[0];
    }
}

// Check the occurrence of one line in another.
isPartString = (original, verifiable) => {
    let verifiableLowerCase = verifiable.toLowerCase();
    
    if (verifiableLowerCase.indexOf(original) !== -1) {
        return (true);
    } else {
        return (false);
    }
}
// Get the object with the question.
getObjQuestion = (typeAction) => {
    if (copyQuestions.length == 0) {
        copyQuestions = [...questions];
    }

    if (typeAction == 'select-epic-attack') {
        return(getRandomElemArrayFromDesiredHalf(copyQuestions, 'second'));
    } else {
        return(getRandomElemArrayFromDesiredHalf(copyQuestions, 'first'));
    }
}
// Get the type of the action selected by the user.
getTypeAction = (event) => {
    switch (event.target.parentElement.parentElement.parentElement.id) {
        case 'select-attack':
            return('select-attack');
            break;

        case 'select-epic-attack':
            return('select-epic-attack');
            break;
            
        case 'select-potions':
            return('select-potions');
            break;
    }
}

getTypeQuestion = (objQuestion) => {
    return objQuestion.Type;
}

getQuestionText = (objQuestion) => {
    return (objQuestion.Question);
}

clearAnswerContainer = () => {
    document.getElementById('answer-container').textContent = '';
}

calculateValueImpact = (selectedTypeAction) => {
    let value;

    if (selectedTypeAction === 'epic-attack') {
        value = getRandomArbitrary(40, 50);
    } else {
        value = getRandomArbitrary(20, 25);
    };

    return Math.round(value);
};

getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
};

getTypeSelectedAction = (event) => {
    return event.target.parentElement.id.substr(19);
};

getPersonageContainer = (enemyType) => {
    let personageContainer;

    if (game.currentStep === 'player') {
        personageContainer = document.getElementById('player');
    } else {
        personageContainer = document.getElementById(enemyType);
    };

    return personageContainer;
}

getRandomTypeAttack = () => {
    let typeAttack = 'attack';

    let randomValue = Math.round(Math.random() * (3 - 1) + 1);
    typeAttack = `${typeAttack}${randomValue}`;

    return typeAttack;
}

replaceBlanksOnDashes = (str) => {
    let result;

    let arrWords = str.split(' ');
    result = arrWords.join('-');

    return result;
}

createWindowResults = () => {
    let windowResults = document.createElement('div');
    let windowResultsTitle = document.createElement('div');
    let tableResultsContainer = document.createElement('div');

    windowResults.classList.add('task-container');
    windowResults.id = 'windowResults';
    windowResultsTitle.classList.add('menu-action-title');
    windowResultsTitle.textContent = 'Table of the results of the game';
    tableResultsContainer.classList.add('question-container', 'table-results-container');
    tableResultsContainer.id = 'tableResultsContainer';
    tableResultsContainer.innerHTML = `<table id="tableResults"><tr><th>Player name</th><th>Killed the enemies</th><th>Time of game</th><th></th</tr></table>`;
    
    windowResults.append(windowResultsTitle);
    windowResults.append(tableResultsContainer);
    document.body.append(windowResults);
}

fillWindowResults = () => {
    let arrayResultsPlayers = getResultsPlayers();
    let tableResults = document.getElementById('tableResults');

    for (let i = 0; i < arrayResultsPlayers.length; i++) {
        let playerName = arrayResultsPlayers[i].playerName;
        let gameTime = arrayResultsPlayers[i].gameTime;
        let killedEnemy = arrayResultsPlayers[i].killedEnemy;
        let tableRow = document.createElement('tr');
        console.log(playerName);
        console.log(gameTime);

        tableRow.innerHTML = `<td>${playerName}</td><td>${killedEnemy}</td><td>${gameTime}</td>`;
        tableResults.append(tableRow);
    }
};

displayWindowResults = () => {
    let windowResults = document.getElementById('windowResults');

    windowResults.classList.add('displayBlock');
    windowResults.classList.add('animate-appear-results-players');
}
// Get the results of previous games.
getResultsPlayers = () => {
    let jsonString = localStorage.getItem('LOTR-Game-array-results');
    return(JSON.parse(jsonString));
};
// Save the results of the current player.
savePlayerResult = () => {
    let arrayResultsPlayers = getResultsPlayers();
    let currentPlayer = arrayResultsPlayers.pop();
    let serialArrayResultsPlayers;

    currentPlayer['killedEnemy'] = game.quantityKilledEnemy;
    currentPlayer['gameTime'] = getTimeDifference(Date.now(), currentPlayer.startTime);
    arrayResultsPlayers.push(currentPlayer);
    serialArrayResultsPlayers = JSON.stringify(arrayResultsPlayers);

    localStorage.setItem('LOTR-Game-array-results', serialArrayResultsPlayers);
}

getTimeDifference = (old, young) => {
    let result;
    let differenceSeconds = new Date(old - young);
    let minutes = differenceSeconds.getMinutes();
    let seconds = differenceSeconds.getSeconds();

    result = `${minutes}:${seconds}`;
    return result;
}

soundAttackPlayer = () => {
    let audio = new Audio(); // Создаём новый элемент Audio
    audio.src = 'audio/YouShallNotPass.mp3'; // Указываем путь к звуку "клика"
    audio.autoplay = true; // Автоматически запускаем
}

soundAttackEnemy = () => {
    let audio = new Audio(); // Создаём новый элемент Audio
    audio.src = 'audio/NazgulAudio.mp3'; // Указываем путь к звуку "клика"
    audio.autoplay = true; // Автоматически запускаем
}

    // Function for loading JSON.
    function getJSON (url/*, callback*/) {
        return fetch(url)
            .then((response) => response.json())
    };

    function loadQuestions () {
        return getJSON('https://raw.githubusercontent.com/KirylNik/KirylNik.github.io/master/json/questions.json')
        .then((data) => {questions = data})
        .catch((error) => alert('Something went wrong: ' + error))
    }

    function loadOrcNames () {
        return getJSON('https://raw.githubusercontent.com/KirylNik/KirylNik.github.io/master/json/names-orc.json')
        .then((data) => {orcNames = data})
        .then(() => game.checkNameEnemy())
        .catch((error) => alert('Something went wrong: ' + error))
    }

    function loadListEnemy () {
        return getJSON('https://raw.githubusercontent.com/KirylNik/KirylNik.github.io/master/json/list-enemy.json')
        .then((data) => {listEnemies = data})
        .catch((error) => alert('Something went wrong: ' + error))
    }

    // Objects for the loaded data.
    var questions;
    var orcNames;
    var listEnemies;
    var copyQuestions = [];



    // Create a new game.
    let game = new Main();
    // Starting a new game.
    game.init();