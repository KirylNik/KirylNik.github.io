// Class TaskAudioQuestion
import Task from '../Task';

export default class TaskAudioQuestion extends Task {
    
    constructor(objQuestion, answerContainer) {
        super();
        this.fillAnswerContainer (objQuestion, answerContainer);
    }

    fillAnswerContainer (objQuestion, answerContainer) {
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
    
        buttonPlayAudio.addEventListener('click', this.handlerButtonPlayQuestion.bind(this));
    
        answerContainer.append(buttonPlayAudio, input, buttonAnswer);
    }
    // Add a handler for the audio issue start button.
    handlerButtonPlayQuestion (event) {
        let audioQuestion = event.target.dataset.audioQuestion;
        let voices = speechSynthesis.getVoices();
        let utterance = new SpeechSynthesisUtterance(audioQuestion);
        
        utterance.voice = voices[2];
        utterance.lang = 'en-US';
        utterance.rate = 0.7;
        speechSynthesis.speak(utterance);
    }
}