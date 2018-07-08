// The personage class of the game.
import { game } from './index.js';
import { calculateValueImpact } from './Utils';

export default class Personage {

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
            this.getImpact()
            .then(() => {
                game.takeNextStep();
            })
        } else {
            this.attack()
            .then(() => {
                this.getDamage();
                game.checkNegativeHealth();
                game.updateStatusBar();
                game.checkHealthPersonages()
                .then(() => game.takeNextStep());
            })
        };
    }
    // Perform an attack action.
    attack () {
        return new Promise((resolve, reject) => {
            if (this.selectedTypeAction === 'attack') {
                this.animateSimpleAttack()
                .then(() => {
                    resolve();
                })
            } else {
                this.animateEpicAttack()
                .then(() => {
                    resolve();
                })
            };
        })
    }

    getDamage () {
        let damage = calculateValueImpact(this.selectedTypeAction);

        if (game.currentStep === 'player') {
            game.enemy.health -= damage;
        } else {
            game.player.health -= damage;
        }
    }
    // Get impact, damage, or treatment.
    getImpact () {
        return new Promise((resolve, reject) => {
            let valueImpact = calculateValueImpact(this.selectedTypeAction);
            game.player.health += valueImpact;
            this.animateGetImpact()
            .then(() => {
                game.updateStatusBar();
                resolve();
            })
        })
    }
    // Animate a simple pesrsonage attack.
    animateSimpleAttack () {
        return new Promise((resolve, reject) => {
            let personageContainer = this.getPersonageContainer(this.enemyType);
            let typePersonageAttack;

            if (this.enemyType) {
                typePersonageAttack = this.enemyType;
            } else {
                typePersonageAttack = game.currentStep;
            }

            personageContainer.addEventListener('animationend', this.handlerAnimationEnd.bind(this, personageContainer, typePersonageAttack, resolve));
            personageContainer.classList.add(`animate-${typePersonageAttack}-${this.selectedAction}`);
        })
    }

    handlerAnimationEnd (personageContainer, typePersonageAttack, resolve) {
        personageContainer.classList.remove(`animate-${typePersonageAttack}-${this.selectedAction}`);
        resolve();
    }
    // Animate the epic attack of the personage.
    animateEpicAttack () {
        return new Promise((resolve, reject) => {
            let personageContainer = this.getPersonageContainer(this.enemyType);
            let effectContainer = document.createElement('div');
            let currentStep = game.currentStep;

            effectContainer.id = 'effectContainer';
            effectContainer.addEventListener('animationend', this.handlerAnimationEndEpicAttack.bind(this, personageContainer, effectContainer, currentStep, resolve));
            document.body.append(effectContainer);
            personageContainer.classList.add(`${currentStep}-epyc-attack`);
            effectContainer.classList.add(`animate-${currentStep}-${this.selectedAction}`);
        })
    }

    handlerAnimationEndEpicAttack (personageContainer, effectContainer, currentStep, resolve) {
        document.body.removeChild(effectContainer);
        personageContainer.classList.remove(`${currentStep}-epyc-attack`);
        resolve();
    }
    // Animate the getting impact.
    animateGetImpact () {
        return new Promise((resolve, reject) => {
            let effectContainer = document.createElement('div');

            effectContainer.id = 'effectContainer';
            document.body.append(effectContainer);
            effectContainer.addEventListener('animationend', this.handlerAnimationEndImpact.bind(this, effectContainer, resolve));
            effectContainer.classList.add(`animate-${game.currentStep}-${this.selectedAction}`);
        })
    }

    handlerAnimationEndImpact (effectContainer, resolve) {
        document.body.removeChild(effectContainer);
        resolve();
    }
    // Death of the personage.
    die (personage = 'player') {
        return new Promise((resolve, reject) => {
            let personageContainer = document.getElementById(personage);
            
            this.wrapperHandlerForAnimationDeath = this.handlerForAnimationDeath.bind(this, personageContainer, resolve);
            personageContainer.addEventListener('animationend', this.wrapperHandlerForAnimationDeath);
            personageContainer.classList.add('animate-die');
        })
    }

    handlerForAnimationDeath (personageContainer, resolve) {
        document.body.removeChild(personageContainer);
        personageContainer.removeEventListener('animationend', this.wrapperHandlerForAnimationDeath);
        resolve();
    }
    // Create a container for the personage.
    creatPersonageContainer (personage = 'player') {
        let personageContainer = document.createElement('div');
        personageContainer.id = personage;
        document.body.append(personageContainer);
    }
    // Set the animation output of the personage to the arena.
    animationEnterArena (personage = 'player') {
        setTimeout(() => {
            let personageContainer = document.getElementById(personage);

            this.wrapperSetAnimatePersonageStand = this.setAnimatePersonageStand.bind(this, personageContainer, personage);
            personageContainer.addEventListener('transitionend', this.wrapperSetAnimatePersonageStand);
            personageContainer.classList.add(`${personage}-come`);
            personage == 'player'
            ? personageContainer.classList.add('enter-arena-left')
            : personageContainer.classList.add('enter-arena-right');
        }, 0);
    }

    setAnimatePersonageStand (personageContainer, personage) {
        personageContainer.classList.remove('enter-arena-left');
        personageContainer.classList.remove('enter-arena-right');
        personageContainer.classList.remove(`${personage}-come`);
        personageContainer.classList.add(`${personage}-stand`);
        personageContainer.removeEventListener('transitionend', this.wrapperSetAnimatePersonageStand);
    }

    getPersonageContainer (enemyType) {
        let personageContainer;
    
        if (game.currentStep === 'player') {
            personageContainer = document.getElementById('player');
        } else {
            personageContainer = document.getElementById(enemyType);
        };
    
        return personageContainer;
    }
}