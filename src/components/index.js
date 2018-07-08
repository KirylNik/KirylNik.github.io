import '../style/style.css';
import '../components/introScreensaver/style.css';
import '../components/notificationResult/style.css';
import '../components/score/style.css';
import '../components/tasks/TaskPuzzle/style.css';
import Main from './Main';

// Create a new game.
export let game = new Main();

function load() {
    game.introScreensaver.delete();
    game.player.enterArena();
    game.enemy.enterArena();
}
window.onload = load;

// Starting a new game.
game.init();