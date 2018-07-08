// Class Enemy
import Personage from './Personage';
import { game} from './index.js';
import { orcNames, listEnemies } from './Utils';
import { replaceBlanksOnDashes } from './Utils';

export default class Enemy extends Personage {
    
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