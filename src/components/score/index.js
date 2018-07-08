import { getResultsPlayers } from './../Utils';

export default class Score {

    constructor () {
        this.init();
    }

    init () {
        this.createWindowResults();
        this.fillWindowResults();
        this.displayWindowResults();
    }

    createWindowResults () {
        let windowResults = document.createElement('div');
        let windowResultsTitle = document.createElement('div');
        let tableResultsContainer = document.createElement('div');
    
        windowResults.classList.add('score-container');
        windowResults.id = 'windowResults';
        windowResultsTitle.classList.add('window-score-title');
        windowResultsTitle.textContent = 'Table of the results of the game';
        tableResultsContainer.classList.add('table-results-container');
        tableResultsContainer.id = 'tableResultsContainer';
        tableResultsContainer.innerHTML = `<table id="tableResults"><tr><th>Player name</th><th>Killed the enemies</th><th>Time of game</th><th></th</tr></table>`;
        
        windowResults.append(windowResultsTitle);
        windowResults.append(tableResultsContainer);
        document.body.append(windowResults);
    }
    
    fillWindowResults () {
        let arrayResultsPlayers = getResultsPlayers();
        let tableResults = document.getElementById('tableResults');
    
        for (let i = 0; i < arrayResultsPlayers.length; i++) {
            let playerName = arrayResultsPlayers[i].playerName;
            let gameTime = arrayResultsPlayers[i].gameTime;
            let killedEnemy = arrayResultsPlayers[i].killedEnemy;
            let tableRow = document.createElement('tr');
    
            tableRow.innerHTML = `<td>${playerName}</td><td>${killedEnemy}</td><td>${gameTime}</td>`;
            tableResults.append(tableRow);
        }
    }
    
    displayWindowResults () {
        let windowResults = document.getElementById('windowResults');
    
        windowResults.classList.add('displayBlock');
        windowResults.classList.add('animate-appear-score-container');
    }
}