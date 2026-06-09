import IntroScene from './IntroScene.js';
import MainMenu from './MainMenu.js';
import BeginningScene from './BeginningScene.js';
import StageTitleScene from './StageTitleScene.js';
import LevelScene1 from './LevelScene1.js';
import LevelScene2 from './LevelScene2.js';
import LevelScene3 from './LevelScene3.js';
import EndingScene from './EndingScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#000000',
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        fullscreenTarget: 'game-container'
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1500 },
            debug: false
        }
    },
    scene: [IntroScene, MainMenu, BeginningScene, StageTitleScene, LevelScene1, LevelScene2, LevelScene3, EndingScene]
};

document.fonts.ready.then(() => {
    const game = new Phaser.Game(config);
});