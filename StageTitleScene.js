export default class StageTitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StageTitleScene' });
    }

    init(data) {
        this.nextSceneKey = data.nextSceneKey || 'LevelSceneNumber';
        this.stageNumStr = data.stageNumStr || 'LevelNumber';
        this.stageNameStr = data.stageNameStr || 'StageName';
    }

    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;

        this.cameras.main.setBackgroundColor('#000000');
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        const boxW = 800;
        const boxH = 200;
        const panel = this.add.graphics();
        panel.fillStyle(0x0a0000, 0.95);
        this.drawCustomBox(panel, -boxW / 2, -boxH / 2, boxW, boxH, 20);
        panel.fillPath();
        panel.lineStyle(2, 0xff0000, 1);
        this.drawCustomBox(panel, -boxW / 2, -boxH / 2, boxW, boxH, 20);
        panel.strokePath();

        const textStr = `${this.stageNumStr}：${this.stageNameStr}`;
        const stageText = this.add.text(0, 0, textStr, {
            fontSize: '36px',
            fill: '#ff3333',
            fontFamily: '"DotGothic16", sans-serif',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        stageText.setShadow(0, 0, '#ff0000', 15);

        this.titleContainer = this.add.container(centerX, centerY, [panel, stageText]);

        this.time.delayedCall(4000, () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start(this.nextSceneKey);
            });
        });

        this.input.keyboard.on('keydown-F', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        });
    }

    drawCustomBox(g, x, y, w, h, s) {
        g.beginPath();
        g.moveTo(x + s, y); g.lineTo(x + w, y); g.lineTo(x + w, y + h - s);
        g.lineTo(x + w - s, y + h); g.lineTo(x, y + h); g.lineTo(x, y + s);
        g.closePath();
    }
}