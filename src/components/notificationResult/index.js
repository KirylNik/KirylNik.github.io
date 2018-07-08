export default class NotificationResult {

    constructor () {
        this.addContainerInDOM();
    }

    addContainerInDOM () {
        const notificationContainer = document.createElement('div');

        notificationContainer.id = 'notificationContainer';
        notificationContainer.classList.add('notification-container');
        document.body.append(notificationContainer);
    }
    // Display the result of the player's response.
    displayNotification(text) {
        return new Promise((resolve) => {
            const notificationContainer = document.getElementById('notificationContainer');

            notificationContainer.textContent = text;

            if (text === 'Incorrect answer!' || text === 'You lose!') {
                notificationContainer.classList.add('color-dark-red');   
            }

            this.wrapperClosenotificationContainer = this.closenotificationContainer.bind(this, notificationContainer, resolve);
            notificationContainer.classList.add('notification-container-animate-appear', 'displayBlock');
            notificationContainer.addEventListener('animationend', this.wrapperClosenotificationContainer);
        })
    }

    closenotificationContainer (notificationContainer, resolve) {
        notificationContainer.removeEventListener('animationend', this.wrapperClosenotificationContainer);
        notificationContainer.classList.remove('notification-container-animate-appear', 'color-dark-red', 'displayBlock');
        resolve();
    }
}