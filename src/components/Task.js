// Class task for the player.
import { game } from './index.js';
import { isPartString, soundAttackPlayer, soundAttackEnemy } from './Utils.js';

export default class Task {
    // Check the player's answer.
    checkUserAnswer (correctAnswer, userAnswer) {
        if (isPartString(correctAnswer, userAnswer)) {
            this.handlerCorrectUserAnswer();
        } else {
            this.handlerIncorrectUserAnswer();
        }
    }

    handlerCorrectUserAnswer () {
        game.notificationResult.displayNotification('Correct answer!')
        .then(() => {
            game.control.handlerButtonCloseWindow();
            setTimeout(() => {
                game.currentStep = 'player';
                game.player.act();
                soundAttackPlayer();
            }, 2000)
        })
    }

    handlerIncorrectUserAnswer () {
        game.notificationResult.displayNotification('Incorrect answer!')
        .then(() => {
            game.control.handlerButtonCloseWindow();
            setTimeout(() => {
                game.makeMoveEnemy();
                soundAttackEnemy();
            }, 2000)
        })
    }
}