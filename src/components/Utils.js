import { game } from './index.js';

// Objects for the loaded data.
export var questions;
export var orcNames;
export var listAudioTrack;
export var listEnemies;
export var copyQuestions = [];

// Utilities

// Get a random element from a given half of the array.
export function getRandomElemArrayFromDesiredHalf (array, half) {
    let halfLengthArray = Math.round(array.length / 2);
    let randomNumber = Math.round(Math.random() * halfLengthArray) || 1;
    if (half === 'first') {
        let randomElem = array.splice(randomNumber, 1);
        return randomElem[0];
    } else {
        let randomElem = array.splice((array.length - randomNumber), 1);
        return randomElem[0];
    }
}

// Check the occurrence of one line in another.
export function isPartString (original, verifiable) {
    let verifiableLowerCase = verifiable.toLowerCase();
    
    if (verifiableLowerCase.indexOf(original) !== -1) {
        return (true);
    } else {
        return (false);
    }
}
// Get the object with the question.
export function getObjQuestion (typeAction) {
    if (copyQuestions.length == 0) {
        copyQuestions = [...questions];
    }

    if (typeAction == 'select-epic-attack') {
        return(getRandomElemArrayFromDesiredHalf(copyQuestions, 'second'));
    } else {
        return(getRandomElemArrayFromDesiredHalf(copyQuestions, 'first'));
    }
}

export function calculateValueImpact (selectedTypeAction) {
    let value;

    if (selectedTypeAction === 'epic-attack') {
        value = getRandomArbitrary(40, 50);
    } else {
        value = getRandomArbitrary(20, 25);
    };

    return Math.round(value);
}

export function getRandomArbitrary (min, max) {
    return Math.random() * (max - min) + min;
}

export function getRandomTypeAttack () {
    let typeAttack = 'attack';

    let randomValue = Math.round(Math.random() * (3 - 1) + 1);
    typeAttack = `${typeAttack}${randomValue}`;

    return typeAttack;
}

export function replaceBlanksOnDashes (str) {
    let result;

    let arrWords = str.split(' ');
    result = arrWords.join('-');

    return result;
}
// Get the results of previous games.
export function getResultsPlayers () {
    let jsonString = localStorage.getItem('LOTR-Game-array-results');
    return(JSON.parse(jsonString));
}
// Save the results of the current player.
export function savePlayerResult () {
    let arrayResultsPlayers = getResultsPlayers();
    let currentPlayer = arrayResultsPlayers.pop();
    let serialArrayResultsPlayers;

    currentPlayer['killedEnemy'] = game.quantityKilledEnemy;
    currentPlayer['gameTime'] = getTimeDifference(Date.now(), currentPlayer.startTime);
    arrayResultsPlayers.push(currentPlayer);
    serialArrayResultsPlayers = JSON.stringify(arrayResultsPlayers);

    localStorage.setItem('LOTR-Game-array-results', serialArrayResultsPlayers);
}

export function getTimeDifference (old, young) {
    let result;
    let differenceSeconds = new Date(old - young);
    let minutes = differenceSeconds.getMinutes();
    let seconds = differenceSeconds.getSeconds();

    result = `${minutes}:${seconds}`;
    return result;
}

export function soundAttackPlayer () {
    let audio = new Audio();
    audio.src = 'audio/YouShallNotPass.mp3';
    audio.autoplay = true;
}

export function soundAttackEnemy () {
    let audio = new Audio();
    audio.src = 'audio/NazgulAudio.mp3';
    audio.autoplay = true;
}

// Function for loading JSON.
function getJSON (url/*, callback*/) {
    return fetch(url)
        .then((response) => response.json())
}

export function loadQuestions () {
    return getJSON('https://raw.githubusercontent.com/KirylNik/KirylNik.github.io/master/json/questions.json')
    .then((data) => {questions = data})
    .catch((error) => alert('Something went wrong: ' + error))
}

export function loadOrcNames () {
    return getJSON('https://raw.githubusercontent.com/KirylNik/KirylNik.github.io/master/json/names-orc.json')
    .then((data) => {orcNames = data})
    .then(() => game.checkNameEnemy())
    .catch((error) => alert('Something went wrong: ' + error))
}

export function loadListEnemy () {
    return getJSON('https://raw.githubusercontent.com/KirylNik/KirylNik.github.io/master/json/list-enemy.json')
    .then((data) => {listEnemies = data})
    .catch((error) => alert('Something went wrong: ' + error))
}

export function loadListAudioTrack () {
    return getJSON('https://raw.githubusercontent.com/KirylNik/KirylNik.github.io/master/json/list-audio-track.json')
    .then((data) => {listAudioTrack = data})
    .catch((error) => alert('Something went wrong: ' + error))
}