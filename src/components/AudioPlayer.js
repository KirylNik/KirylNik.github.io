import { listAudioTrack } from './Utils';

export default class AudioPlayer {

    constructor () {
        this.audio = new Audio();
        this.currentTrack = 0;
        this.init();
    }

    init () {
        this.playInitalTrack();
        this.createAudioPlayerInDOM();
        this.addHandlerAudioPlayer();
    }

    playInitalTrack () {
        const nameInitalTrack = listAudioTrack[0];
        this.audio.src = `audio/${nameInitalTrack}`;
        this.audio.play();
    }

    createAudioPlayerInDOM () {
        const playerContainer = document.createElement('div');
        const arrNamesButton = ['back', 'pause', 'play', 'next'];
        
        playerContainer.classList.add('audio-player-container');
        playerContainer.id = 'audio-player-container';

        for (let i = 0; i < arrNamesButton.length; i++) {
            const button = document.createElement('div');
            button.classList.add('audio-player-button');
            button.id = `audio-player-button-${arrNamesButton[i]}`;
            playerContainer.append(button);
        }

        document.body.append(playerContainer);
    }

    play () {
        this.audio.play();
    }

    pause () {
        this.audio.pause();
    }

    playNextTrack () {
        this.audio.pause();

        if (this.currentTrack < listAudioTrack.length - 1) {
            this.currentTrack++;
        } else {
            this.currentTrack = 0;
        }

        this.audio.src = `audio/${listAudioTrack[this.currentTrack]}`;
        this.audio.play();
    }

    playPrevTrack () {
        this.audio.pause();

        if (this.currentTrack === 0) {
            this.currentTrack = listAudioTrack.length - 1;
        } else {
            this.currentTrack --;
        }

        this.audio.src = `audio/${listAudioTrack[this.currentTrack]}`;
        this.audio.play();
    }
    // Add a handler for the background music menu.
    addHandlerAudioPlayer () {
        let audioPlayerContainer = document.getElementById('audio-player-container');
    
        this.handlerAudioPlayerButtons = (event) => {
            if (event.target.id === 'audio-player-button-pause') {
                this.pause();
            } else if (event.target.id === 'audio-player-button-play'){
                this.play();
            } else if (event.target.id === 'audio-player-button-next'){
                this.playNextTrack();
            } else if (event.target.id === 'audio-player-button-back'){
                this.playPrevTrack();
            }
        };

        audioPlayerContainer.addEventListener('click', this.handlerAudioPlayerButtons);
    }
}