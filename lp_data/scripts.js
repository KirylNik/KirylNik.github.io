const modalWindowContainer = document.getElementById('modalWindowContainer');
const modalWindow = document.getElementById('modalWindow');
const navList = document.getElementById('navList');
const menuToggle = document.getElementById('menuToggle');
const gallery = document.getElementById('gallery');
const navBar = document.getElementById('header');
const navHeight = 70;

menuToggle.addEventListener('click', (event) => {
  navList.classList.toggle('hidden');
});

modalWindowContainer.addEventListener('click', () => {
    modalWindowContainer.classList.toggle('disable');
});

window.addEventListener('scroll', (event) => {
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
        modalWindow.innerHTML = `<img class="screenshot-large" src="./images/${event.target.id}.jpg" alt='Screenshot' >`;
    }
});