export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
        this.isIntenseGlitch = true;
    }

    init() {
        const storedBGM = localStorage.getItem('sys_bgm');
        this.bgmVolume = storedBGM !== null ? parseFloat(storedBGM) : 0.5;

        const storedSFX = localStorage.getItem('sys_sfx');
        this.sfxVolume = storedSFX !== null ? parseFloat(storedSFX) : 0.5;

        const storedMute = localStorage.getItem('sys_mute');
        this.isMuted = storedMute !== null ? (storedMute === 'true') : false;

        this.sound.mute = this.isMuted;
    }

    playSFX(key) {
        if (!this.isMuted && this.cache.audio.exists(key)) {
            this.sound.play(key, { volume: this.sfxVolume });
        }
    }

    create() {
        this.centerX = this.cameras.main.centerX;
        this.centerY = this.cameras.main.centerY;
        const bgImage = this.add.image(this.centerX, this.centerY, 'cover');
        bgImage.setDepth(-1);

        this.setupAudio();
        this.setupBackgroundEffects();
        this.setupTitle();
        this.setupDialogs();
        this.setupMenuButtons();
        this.input.keyboard.on('keydown-F', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        });
    }

    preload() {
        this.load.image('cover', 'images/cover.png');
        this.load.audio('pull', 'audio/pull.mp3');
    }

    setupAudio() {
        this.sound.stopAll();
        this.bgm = this.sound.add('bgm', {
            loop: true,
            volume: 0.5
        });
        this.bgm.play();
    }

    setupBackgroundEffects() {
        this.isIntenseGlitch = true;
        this.cameras.main.fadeIn(100, 255, 255, 255);
        this.cameras.main.shake(400, 0.02);

        this.noiseGraphics = this.add.graphics();
        this.noiseGraphics.setDepth(300);
        this.time.addEvent({
            delay: 30, repeat: 10,
            callback: () => {
                this.noiseGraphics.clear();
                for (let i = 0; i < 40; i++) {
                    const c = Phaser.Math.Between(150, 255);
                    const color = Phaser.Display.Color.GetColor(c, c, c);
                    this.noiseGraphics.fillStyle(color, Phaser.Math.FloatBetween(0.3, 0.8));
                    this.noiseGraphics.fillRect(0, Phaser.Math.Between(0, 600), 1200, Phaser.Math.Between(2, 12));
                }
            }
        });
        this.cyanOverlay = this.add.rectangle(this.centerX, this.centerY, 1200, 600, 0x00ffff, 0.2);
        this.cyanOverlay.setBlendMode(Phaser.BlendModes.ADD);
        this.cyanOverlay.setDepth(200);

        this.redOverlay = this.add.rectangle(this.centerX, this.centerY, 1200, 600, 0xff0000, 0.2);
        this.redOverlay.setBlendMode(Phaser.BlendModes.ADD);
        this.redOverlay.setDepth(200);
        this.time.addEvent({
            delay: 50, repeat: 7,
            callback: () => {
                this.cyanOverlay.x = this.centerX + Phaser.Math.Between(-40, 40);
                this.cyanOverlay.y = this.centerY + Phaser.Math.Between(-15, 15);
                this.cyanOverlay.setAlpha(Phaser.Math.FloatBetween(0, 0.4));

                this.redOverlay.x = this.centerX + Phaser.Math.Between(-40, 40);
                this.redOverlay.y = this.centerY + Phaser.Math.Between(-15, 15);
                this.redOverlay.setAlpha(Phaser.Math.FloatBetween(0, 0.4));
            }
        });
        this.time.delayedCall(400, () => {
            this.isIntenseGlitch = false;
            this.noiseGraphics.destroy();
            this.cyanOverlay.destroy();
            this.redOverlay.destroy();
        });
    }

    setupTitle() {
        const titleStr = '元 智 大 逃 亡 _';
        const titleStyle = { fontSize: '68px', fontFamily: '"DotGothic16", serif', padding: { left: 20, right: 20, top: 20, bottom: 20 } };

        const titleAura = this.add.text(this.centerX, this.centerY - 150, titleStr, { ...titleStyle, fill: '#000000' }).setOrigin(0.5);
        titleAura.setStroke('#000000', 24);
        titleAura.setShadow(0, 0, '#000000', 30, true, true);
        titleAura.setAlpha(0.65);

        this.titleGlitch1 = this.add.text(this.centerX - 4, this.centerY - 150, titleStr, { ...titleStyle, fill: '#ffffff' }).setOrigin(0.5).setAlpha(0.5).setBlendMode(Phaser.BlendModes.ADD);
        this.titleGlitch2 = this.add.text(this.centerX + 4, this.centerY - 150, titleStr, { ...titleStyle, fill: '#660066' }).setOrigin(0.5).setAlpha(0.5).setBlendMode(Phaser.BlendModes.ADD);
        
        this.titleMain = this.add.text(this.centerX, this.centerY - 150, titleStr, { ...titleStyle, fill: '#880000' }).setOrigin(0.5);
        this.titleMain.setShadow(2, 2, '#000000', 0, false, true); 

        this.time.addEvent({
            delay: 50, loop: true,
            callback: () => {
                const offset = this.isIntenseGlitch ? 25 : 2;
                this.titleGlitch1.x = this.centerX - 4 + Phaser.Math.Between(-offset, offset);
                this.titleGlitch2.x = this.centerX + 4 + Phaser.Math.Between(-offset, offset);
            }
        });
    }

    setupMenuButtons() {
        this.createMenuButton(this.centerX, this.centerY - 10, '開始遊戲', () => {
            if (this.bgm) this.bgm.stop();
            this.cameras.main.flash(200, 255, 255, 255);
            this.time.delayedCall(150, () => {
                this.scene.start('BeginningScene', { isMuted: this.isMuted, sfxVolume: this.sfxVolume });
            });
        });
        this.createMenuButton(this.centerX, this.centerY + 90, '音量設定', () => {
            this.volumeDialog.setVisible(true);
        });
        this.createMenuButton(this.centerX, this.centerY + 190, '離開噩夢', () => {
            this.confirmDialog.setVisible(true);
        });
    }

    setupDialogs() {
        this.confirmDialog = this.createConfirmDialog(this.centerX, this.centerY);
        this.confirmDialog.setVisible(false);
        this.volumeDialog = this.createVolumeDialog(this.centerX, this.centerY);
        this.volumeDialog.setVisible(false);
    }

    drawChamferedRect(graphics, x, y, w, h, cutSize) {
        graphics.beginPath();
        graphics.moveTo(x + cutSize, y); graphics.lineTo(x + w, y); graphics.lineTo(x + w, y + h - cutSize);
        graphics.lineTo(x + w - cutSize, y + h); graphics.lineTo(x, y + h); graphics.lineTo(x, y + cutSize);
        graphics.closePath();
    }

    createVolumeDialog(centerX, centerY) {
        const dialogContainer = this.add.container(0, 0);
        dialogContainer.setDepth(100);

        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.85);
        overlay.fillRect(0, 0, 1200, 600);
        overlay.setInteractive(new Phaser.Geom.Rectangle(0, 0, 1200, 600), Phaser.Geom.Rectangle.Contains);
        const boxWidth = 450, boxHeight = 350;
        const boxX = centerX - boxWidth / 2, boxY = centerY - boxHeight / 2;
        const box = this.add.graphics();
        box.fillStyle(0x110000, 1);
        this.drawChamferedRect(box, boxX, boxY, boxWidth, boxHeight, 30);
        box.fillPath();
        box.lineStyle(2, 0x880000, 1);
        this.drawChamferedRect(box, boxX, boxY, boxWidth, boxHeight, 30);
        box.strokePath();

        const titleText = this.add.text(centerX, centerY - 130, '>> AUDIO SYSTEM', {
            fontSize: '24px', fill: '#ff3333', fontFamily: '"DotGothic16", Courier New', padding: 8
        }).setOrigin(0.5);
        const bgmSlider = this.createSlider(centerX, centerY - 65, '背景音樂', this.bgmVolume, (v) => {
            this.bgmVolume = v; if (this.bgm) this.bgm.setVolume(this.isMuted ? 0 : v);
        });
        const sfxSlider = this.createSlider(centerX, centerY - 5, '音效音量', this.sfxVolume, (v) => {
            this.sfxVolume = v;
        });
        const muteGroup = this.add.container(centerX, centerY + 55);
        const muteLabel = this.add.text(-170, 0, '一鍵靜音', {
            fontSize: '20px', fill: '#880000', fontFamily: '"DotGothic16", serif', padding: 8
        }).setOrigin(0, 0.5);
        const boxSize = 26, muteBoxX = -60;
        const muteBtnBox = this.add.graphics();
        const checkIcon = this.add.graphics();
        const redrawMuteUI = () => {
            muteBtnBox.clear();
            muteBtnBox.lineStyle(2, this.isMuted ? 0xff0000 : 0x880000, 1);
            muteBtnBox.strokeRect(muteBoxX, -boxSize / 2, boxSize, boxSize);
            checkIcon.clear();
            if (this.isMuted) {
                checkIcon.lineStyle(3, 0xff0000, 1);
                checkIcon.beginPath();
                checkIcon.moveTo(muteBoxX + 4, 0); checkIcon.lineTo(muteBoxX + 10, 8); checkIcon.lineTo(muteBoxX + 22, -8); checkIcon.strokePath();
            }
        };

        redrawMuteUI();
        const hitMargin = 8;
        const muteHitArea = this.add.graphics();
        muteHitArea.fillStyle(0x000000, 0.001);
        muteHitArea.fillRect(muteBoxX - hitMargin, -boxSize / 2 - hitMargin, boxSize + hitMargin * 2, boxSize + hitMargin * 2);
        muteHitArea.setInteractive(new Phaser.Geom.Rectangle(muteBoxX - hitMargin, -boxSize / 2 - hitMargin, boxSize + hitMargin * 2, boxSize + hitMargin * 2), Phaser.Geom.Rectangle.Contains);
        muteHitArea.on('pointerdown', () => {
            this.isMuted = !this.isMuted; this.sound.mute = this.isMuted; this.playSFX('btn_click');
            redrawMuteUI();
            muteLabel.setFill(this.isMuted ? '#ff0000' : '#880000');
            bgmSlider.updateLabel(this.isMuted ? 0 : this.bgmVolume); sfxSlider.updateLabel(this.isMuted ? 0 : this.sfxVolume);
            bgmSlider.setDisabled(this.isMuted); sfxSlider.setDisabled(this.isMuted);
        });
        muteHitArea.on('pointerover', () => { this.input.setDefaultCursor('pointer'); muteBtnBox.setAlpha(0.7); });
        muteHitArea.on('pointerout', () => { this.input.setDefaultCursor('default'); muteBtnBox.setAlpha(1); });

        muteGroup.add([muteLabel, muteBtnBox, checkIcon, muteHitArea]);
        const saveBtn = this.createSmallBtn(centerX, centerY + 130, 'SAVE', () => {
            localStorage.setItem('sys_bgm', this.bgmVolume);
            localStorage.setItem('sys_sfx', this.sfxVolume);
            localStorage.setItem('sys_mute', this.isMuted);
            dialogContainer.setVisible(false);
        });

        dialogContainer.add([overlay, box, titleText, bgmSlider.container, sfxSlider.container, muteGroup, saveBtn]);
        return dialogContainer;
    }

    createSlider(x, y, label, startVal, callback) {
        const container = this.add.container(x, y);
        const title = this.add.text(-170, 0, label, { fontSize: '20px', fill: '#880000', fontFamily: '"DotGothic16", serif', padding: 8 }).setOrigin(0, 0.5);
        const valText = this.add.text(105, 0, Math.round(startVal * 100) + '%', { fontSize: '18px', fill: '#ffffff', fontFamily: '"DotGothic16", Courier New', padding: 8 }).setOrigin(0, 0.5);
        const trackWidth = 150, sliderStartX = -60;
        const trackBg = this.add.graphics();
        trackBg.fillStyle(0x330000); trackBg.fillRect(sliderStartX, -4, trackWidth, 8);

        const trackFill = this.add.graphics();
        const knob = this.add.graphics();

        const update = (percent) => {
            trackFill.clear();
            trackFill.fillStyle(0xff0000); trackFill.fillRect(sliderStartX, -4, trackWidth * percent, 8);
            knob.clear(); knob.fillStyle(0xffffff); knob.beginPath();
            knob.moveTo(0, -10); knob.lineTo(10, 0); knob.lineTo(0, 10); knob.lineTo(-10, 0); knob.closePath(); knob.fillPath();
            knob.x = sliderStartX + (trackWidth * percent);
            valText.setText(Math.round(percent * 100) + '%');
        };

        knob.setInteractive(new Phaser.Geom.Circle(0, 0, 20), Phaser.Geom.Circle.Contains);
        this.input.setDraggable(knob);
        let lastStep = Math.round(startVal * 20);
        knob.on('drag', (pointer, dragX) => {
            if (this.isMuted) return;
            
            let pcent = Phaser.Math.Clamp((dragX - sliderStartX) / trackWidth, 0, 1);
            let currentStep = Math.round(pcent * 20);

            if (currentStep !== lastStep) {
                lastStep = currentStep;
                this.playSFX('pull'); 
            }

            update(pcent); callback(pcent);
        });
        knob.on('pointerover', () => { if (!this.isMuted) { knob.setAlpha(0.8); this.input.setDefaultCursor('pointer'); } });
        knob.on('pointerout', () => { knob.setAlpha(1); this.input.setDefaultCursor('default'); });

        update(startVal);
        container.add([title, valText, trackBg, trackFill, knob]);

        return { container, updateLabel: (v) => update(v), setDisabled: (disabled) => { container.setAlpha(disabled ? 0.4 : 1); } };
    }

    createMenuButton(x, y, text, callback) {
        const width = 280, height = 65;
        const container = this.add.container(x, y);
        const bg = this.add.graphics();

        const draw = (isHover) => {
            bg.clear();
            bg.fillStyle(isHover ? 0x4a0000 : 0x1f0000, 1);
            this.drawChamferedRect(bg, -width / 2, -height / 2, width, height, 15); bg.fillPath();
            bg.lineStyle(2, isHover ? 0xff3333 : 0x880000, 1);
            this.drawChamferedRect(bg, -width / 2, -height / 2, width, height, 15); bg.strokePath();
        };

        draw(false);
        const txt = this.add.text(0, 0, text, { fontSize: '26px', fill: '#880000', fontFamily: '"DotGothic16", serif', padding: 10 }).setOrigin(0.5);
        const l = this.add.text(-width / 2 + 20, 0, '< >', { fontSize: '20px', fill: '#880000', fontFamily: '"DotGothic16", monospace' }).setOrigin(0, 0.5);
        const r = this.add.text(width / 2 - 20, 0, '</>', { fontSize: '20px', fill: '#880000', fontFamily: '"DotGothic16", monospace' }).setOrigin(1, 0.5);
        container.add([bg, l, r, txt]);
        bg.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);
        bg.on('pointerover', () => {
            this.playSFX('btn_hover'); draw(true); txt.setFill('#ff0000'); txt.setShadow(0, 0, '#ff0000', 10);
            l.setFill('#fff'); r.setFill('#fff'); this.input.setDefaultCursor('pointer');
        });
        bg.on('pointerout', () => {
            draw(false); txt.setFill('#880000'); txt.setShadow(0, 0, 'transparent', 0);
            l.setFill('#880000'); r.setFill('#880000'); this.input.setDefaultCursor('default'); container.setScale(1);
        });
        bg.on('pointerdown', () => { this.playSFX('btn_click'); container.setScale(0.95); });
        bg.on('pointerup', () => { container.setScale(1); callback(); });
    }

    createConfirmDialog(centerX, centerY) {
        const container = this.add.container(0, 0);
        container.setDepth(100);

        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.85);
        overlay.fillRect(0, 0, 1200, 600);
        overlay.setInteractive(new Phaser.Geom.Rectangle(0, 0, 1200, 600), Phaser.Geom.Rectangle.Contains);
        const box = this.add.graphics();
        box.fillStyle(0x110000, 1);
        this.drawChamferedRect(box, centerX - 210, centerY - 110, 420, 220, 30); box.fillPath();
        box.lineStyle(2, 0x880000, 1);
        this.drawChamferedRect(box, centerX - 210, centerY - 110, 420, 220, 30); box.strokePath();
        const txt = this.add.text(centerX, centerY - 30, 'FATAL ERROR:\n確認放棄掙扎？', { fontSize: '28px', fill: '#880000', fontFamily: '"DotGothic16", serif', align: 'center', padding: 10 }).setOrigin(0.5);
        const c1 = this.createSmallBtn(centerX - 80, centerY + 50, 'CANCEL', () => { container.setVisible(false); });
        const c2 = this.createSmallBtn(centerX + 80, centerY + 50, 'CONFIRM', () => { window.close(); });

        container.add([overlay, box, txt, c1, c2]);
        return container;
    }

    createSmallBtn(x, y, label, callback) {
        const container = this.add.container(x, y);
        const bg = this.add.graphics();

        const draw = (isHover) => {
            bg.clear();
            bg.fillStyle(isHover ? 0x4a0000 : 0x1f0000, 1);
            this.drawChamferedRect(bg, -70, -25, 140, 50, 10); bg.fillPath();
            bg.lineStyle(2, isHover ? 0xff3333 : 0x880000, 1);
            this.drawChamferedRect(bg, -70, -25, 140, 50, 10); bg.strokePath();
        };

        draw(false);
        const txt = this.add.text(0, 0, label, { fontSize: '18px', fill: '#880000', fontFamily: '"DotGothic16", serif', padding: 8 }).setOrigin(0.5);
        container.add([bg, txt]);
        bg.setInteractive(new Phaser.Geom.Rectangle(-70, -25, 140, 50), Phaser.Geom.Rectangle.Contains);

        bg.on('pointerover', () => { this.playSFX('btn_hover'); draw(true); txt.setFill('#ff0000'); txt.setShadow(0, 0, '#ff0000', 10); this.input.setDefaultCursor('pointer'); });
        bg.on('pointerout', () => { draw(false); txt.setFill('#880000'); txt.setShadow(0, 0, 'transparent', 0); this.input.setDefaultCursor('default'); container.setScale(1); });
        bg.on('pointerdown', () => { this.playSFX('btn_click'); container.setScale(0.95); });
        bg.on('pointerup', () => { container.setScale(1); callback(); });

        return container;
    }
}