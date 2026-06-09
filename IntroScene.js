export default class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
    }

    preload() {
        this.load.audio('bgm', 'bgm/coverbg.mp3');
        this.load.audio('btn_hover', 'audio/buttonpass.mp3');
        this.load.audio('btn_click', 'audio/buttonclick.mp3');
    }

    create() {
        this.input.keyboard.on('keydown-F', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        });
        this.setupInitialText();
    }

    setupInitialText() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        this.hintContainer = this.add.container(centerX, centerY);

        const textLine1 = this.add.text(0, -20, ' SYSTEM INITIALIZING...', {
            fontSize: '28px', fill: '#ff3333', fontFamily: '"DotGothic16", sans-serif'
        }).setOrigin(0.5);
        
        const textLine2 = this.add.text(0, 20, '>> CLICK TO START <<', {
            fontSize: '28px', fill: '#ff3333', fontFamily: '"DotGothic16", sans-serif'
        }).setOrigin(0.5);

        const textLine3 = this.add.text(0, 60, 'CLICK F KEY TO TOGGLE FULLSCREEN', {
            fontSize: '28px', fill: '#ff3333', fontFamily: '"DotGothic16", sans-serif'
        }).setOrigin(0.5);
        
        this.hintContainer.add([textLine1, textLine2, textLine3]);

        this.flashTween = this.tweens.add({
            targets: this.hintContainer, alpha: 0.2, duration: 800, yoyo: true, repeat: -1
        });
        
        this.input.once('pointerdown', () => {
            this.sound.play('btn_click');
            this.flashTween.stop();
            this.hintContainer.destroy();
            this.setupLoadingBar();
        });
    }

    setupLoadingBar() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        const loadingText = this.add.text(centerX, centerY - 40, 'SYSTEM LOADING...', {
            fontSize: '32px', fill: '#ff0000', fontFamily: '"DotGothic16", sans-serif', fontStyle: 'bold'
        }).setOrigin(0.5);
        loadingText.setShadow(0, 0, '#ff0000', 15);

        const percentText = this.add.text(centerX, centerY + 40, '0%', {
            fontSize: '24px', fill: '#ff3333', fontFamily: '"DotGothic16", monospace'
        }).setOrigin(0.5);

        const barWidth = 600;
        const barHeight = 16;
        const barX = centerX - barWidth / 2;
        const barY = centerY;

        const borderGraphics = this.add.graphics();
        borderGraphics.lineStyle(2, 0x880000, 1);
        borderGraphics.strokeRect(barX, barY - barHeight / 2, barWidth, barHeight);

        const fillGraphics = this.add.graphics();

        this.tweens.addCounter({
            from: 0,
            to: 100,
            duration: 2500,
            ease: 'Expo.easeInOut', 
            onUpdate: (tween) => {
                const val = Math.floor(tween.getValue());
                percentText.setText(`${val}%`);

                fillGraphics.clear();
                fillGraphics.fillStyle(0xff0000, 1);
                fillGraphics.fillRect(barX + 2, barY - barHeight / 2 + 2, (barWidth - 4) * (val / 100), barHeight - 4);
            },
            onComplete: () => {
                loadingText.setText('LOADING COMPLETE');
                loadingText.setFill('#ff3333');
                loadingText.setShadow(0, 0, '#ff3333', 20);
                percentText.setFill('#ff3333');
                
                this.time.delayedCall(600, () => {
                    this.transitionToMenu();
                });
            }
        });
    }

    transitionToMenu() {
        this.input.setDefaultCursor('default');
        
        this.cameras.main.flash(200, 255, 0, 0); 
        this.time.delayedCall(150, () => {
            this.scene.start('MainMenu');
        });
    }
}