let buttonStart = document.getElementById('buttonStart');
let modalWindowContainer = document.getElementById('modalWindowContainer');
let modalWindow = document.getElementById('modalWindow');
let navList = document.getElementById('navList');
let menuToggle = document.getElementById('menuToggle');
let gallery = document.getElementById('gallery');
let navBar = document.getElementById('header');
let navHeight = 70;

menuToggle.addEventListener('click', () => {
  navList.classList.toggle('hidden');
});

modalWindowContainer.addEventListener('click', () => {
    modalWindowContainer.classList.toggle('disable');
});

document.body.addEventListener('scroll', () => {
    if (window.pageYOffset > navHeight) {
        navBar.classList.add('fixed','obscure');
    }
    if (window.pageYOffset < navHeight) {
        navBar.classList.remove('fixed','obscure');
    }
});

gallery.addEventListener('click', (event) => {
    if(event.target.classList.contains('screenshot-preview-container')) {
        modalWindowContainer.classList.toggle('disable');
        modalWindow.innerHTML = `<img class="screenshot-large" src="lp_data/images/${event.target.id}.jpg" alt='Screenshot' >`;
    }
});

buttonStart.addEventListener('click', () => {
    let json = localStorage.getItem('LOTR-Game-array-results');
    let arrayResults = JSON.parse(json) || [];
    let playerName = document.forms['registration-form'].elements['registration-form-name'].value;
    let startTime = Date.now();
    let gameData = {};

    gameData['playerName'] = playerName;
    gameData['startTime'] = startTime;

    arrayResults.push(gameData);
    localStorage.setItem('LOTR-Game-array-results', JSON.stringify(arrayResults));
});

