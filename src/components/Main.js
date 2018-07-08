// The class that controls the game.
import Enemy from './Enemy';
import Player from './Player';
import IntroScreensaver from './introScreensaver/index';
import TaskPuzzle from './tasks/TaskPuzzle/index';
import TaskChooseAnswer from './tasks/TaskChooseAnswer';
import TaskEnterAnswer from './tasks/TaskEnterAnswer';
import TaskAudioQuestion from './tasks/TaskAudioQuestion';
import ControlInterface from './ControlInterface';
import AnswerContainer from './AnswerContainer';
import NotificationResult from './notificationResult/index';
import AudioPlayer from './AudioPlayer';
import Score from './score/index';
import { game } from './index';
import { getObjQuestion, savePlayerResult, getRandomTypeAttack, loadQuestions, loadOrcNames, loadListEnemy, loadListAudioTrack, questions, orcNames, listEnemies, copyQuestions } from './Utils';

export default class Main {

    constructor () {
        this.player;
        this.enemy;
        this.control;
        this.currentTask;
        this.answerContainer;
        this.currentStep;
        this.quantityKilledEnemy = 0;
        this.copyQuestions = [];
        this.questions;
        this.orcNames;
        this.listEnemies;
        this.notificationResult;
        this.introScreensaver;
        this.audioPlayer;
        this.score;
    }

    init () {
        this.introScreensaver = new IntroScreensaver();
        this.loadData();
        this.player = new Player('Gandalf', 100);
        this.enemy = new Enemy('Orc', 20, 'orc');
        this.currentStep = 'player';
        this.control = new ControlInterface();
        this.control.init();
        this.answerContainer = new AnswerContainer();
        this.answerContainer.addHandlerClick();
        this.notificationResult = new NotificationResult();
        this.updateStatusBar();
    }

    loadData () {
        loadQuestions()
        .then(() => loadOrcNames())
        .then(() => loadListEnemy())
        .then(() => loadListAudioTrack())
        .then(() => {
            this.audioPlayer = new AudioPlayer()
        })
    }
    // Create a new task for the player.
    createNewTask (event) {
        let typeAction = this.getTypeAction(event);
        let objQuestion = getObjQuestion(typeAction);
        let typeQuestion = objQuestion.Type;
        let questionText = objQuestion.Question;
        let answerContainer = document.getElementById('answer-container');
        let questionContainer = document.getElementById('question-container');

        questionContainer.textContent = questionText;

        switch (typeQuestion) {
            case 'Select answer':
                this.currentTask = new TaskChooseAnswer(objQuestion, answerContainer);
                break;

            case 'Enter answer':
                this.currentTask = new TaskEnterAnswer(objQuestion, answerContainer);
                break;
                
            case 'Answer the audio question':
                this.currentTask = new TaskAudioQuestion(objQuestion, answerContainer);
                break;

            case 'Puzzle':
                this.currentTask = new TaskPuzzle(objQuestion, answerContainer, questionContainer);
                break;
        }
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
        this.transferTurnNextPersonage();
    }
    // Check the health of the personages and perform actions if someone died.
    checkHealthPersonages () {
        return new Promise((resolve) => {
            if (this.player.health <= 0) {
                this.player.die();
                game.notificationResult.displayNotification('You lose!')
                .then(() => {
                    savePlayerResult();
                    this.goToScore();
                })  
            } else if (this.enemy.health <= 0 && this.enemy.name === 'Sauron') {
                this.quantityKilledEnemy++;
                this.enemy.die(this.enemy.enemyType);
                game.notificationResult.displayNotification('You won!')
                .then(() => {
                    savePlayerResult();
                    this.goToScore();
                })  
            } else if (this.enemy.health <= 0) {
                this.quantityKilledEnemy++;
                this.enemy.die(this.enemy.enemyType)
                .then(() => this.callNextEnemy());
                this.currentStep = 'enemy';
                resolve();
            } else {
                resolve();
            }
        })
    }

    transferTurnNextPersonage () {
        if (this.currentStep === 'player') {
            this.currentStep === 'enemy';
            this.makeMoveEnemy();
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
    makeMoveEnemy () {
        game.enemy.selectedTypeAction = 'attack';
        game.enemy.selectedAction = getRandomTypeAttack();
        game.currentStep = 'enemy';
        game.enemy.attack()
        .then(() => {
            game.enemy.getDamage();
            game.checkNegativeHealth();
            game.updateStatusBar();
            game.checkHealthPersonages()
            .then(() => game.takeNextStep());
        })
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
    // Go to the results table window.
    goToScore () {
        this.score = new Score();
    }
    // Get the type of the action selected by the user.
    getTypeAction (event) {
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
}