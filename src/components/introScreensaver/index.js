export default class IntroScreensaver {
    constructor () {
        this.screensaver = this.create();
        this.addInDom(this.screensaver);
    }

    create () {
        const screensaver = document.createElement('div');
        const animateElem = document.createElement('div');

        screensaver.id = 'introScreensaver';
        screensaver.classList.add('intro-screensaver');
        animateElem.id = 'introScreensaverAnimateElem';
        animateElem.classList.add('intro-screensaver-animate-elem');
        screensaver.append(animateElem);

        return screensaver;
    }

    addInDom(screensaver) {
        document.body.append(screensaver);
    }

    delete () {
        const screensaver = document.getElementById('introScreensaver');
        document.body.removeChild(screensaver);
    }
}