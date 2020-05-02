import * as Phaser from 'phaser';
import { BootScene, GameScene, PlatformScene, MainMenuScene } from './scenes';

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Invisible (Working Title)',

    type: Phaser.AUTO,

    width: window.innerWidth,
    height: window.innerHeight,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        },
    },

    scene: [BootScene, MainMenuScene, GameScene, PlatformScene],

    parent: 'content',
    backgroundColor: '#000000',
};

export const game = new Phaser.Game(gameConfig);
