export default class BeginningScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BeginningScene' });
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
        if (!this.isMuted) this.sound.play(key, { volume: this.sfxVolume });
    }

    preload() {
        this.load.audio('bgm_beginning', 'bgm/bgm_beginning.mp3');
        this.load.audio('pull', 'audio/pull.mp3');
        this.load.audio('mission_warning', 'audio/missionwarning.mp3');
        this.load.image('bg_real_dark_room', 'images/real_dark_room.jpg');
    }

    create() {
        this.sound.stopAll();
        this.bgm = this.sound.add('bgm_beginning', {
            volume: this.isMuted ? 0 : this.bgmVolume,
            loop: true
        });
        this.bgm.play();
        this.storyData = [
            { text: "昏暗的房間內，身穿黑色帽T的大學牲坐在滿是程式碼與報告的電腦桌前奮鬥。" },
            { text: "隨著時間的流逝，他漸漸感到力不從心。" },
            { name: "YOU", text: "（再撐一下...就快...寫...完...）" },
            { name: "YOU", text: "呃...(兩眼一黑)" },
            { name: "YOU", text: "(撲通)" },
            { name: "YOU", text: "..." },
            { name: "YOU", text: "......" },
            { text: "在意識模糊之際，一個扭曲的元智校園噩夢開始將其吞噬。" }
        ];
        this.currentDialogIndex = 0;
        this.isTyping = false;
        this.typeTimer = null;
        this.time.paused = false; 
        this.isPaused = false;
        this.pauseContainer = null;
        this.volumeContainer = null;
        this.input.keyboard.on('keydown-SPACE', () => {
            this.togglePauseMenu();
        });
        this.input.setDefaultCursor('default');
        this.centerX = this.cameras.main.centerX;
        this.centerY = this.cameras.main.centerY;

        this.setupSceneEnvironment();
        this.setupDialogUI();
        this.setupInput();
        this.showNextDialog();
        this.input.keyboard.on('keydown-F', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        });
    }

    setupSceneEnvironment() {
        this.cameras.main.setBackgroundColor('#050000');
        const bg = this.add.image(this.centerX, this.centerY, 'bg_real_dark_room');
        bg.setDepth(-1);
    }

    setupDialogUI() {
        const boxX = 600, boxY = 480, w = 1000, h = 150;
        this.dialogContainer = this.add.container(boxX, boxY);
        this.dialogContainer.setDepth(100);

        this.dialogBg = this.add.graphics();
        this.dialogBg.fillStyle(0x0a0000, 0.9);
        this.drawCustomBox(this.dialogBg, -w / 2, -h / 2, w, h, 20);
        this.dialogBg.fillPath();
        this.dialogBg.lineStyle(2, 0x880000, 1);
        this.drawCustomBox(this.dialogBg, -w / 2, -h / 2, w, h, 20); this.dialogBg.strokePath();

        this.nameTag = this.add.graphics();
        this.nameTag.fillStyle(0x330000, 1);
        this.nameTag.beginPath();
        this.nameTag.moveTo(-w / 2, -h / 2); this.nameTag.lineTo(-w / 2 + 150, -h / 2);
        this.nameTag.lineTo(-w / 2 + 170, -h / 2 + 35); this.nameTag.lineTo(-w / 2, -h / 2 + 35);
        this.nameTag.closePath(); this.nameTag.fillPath();
        this.nameTag.lineStyle(2, 0xff0000, 1); this.nameTag.strokePath();

        this.nameText = this.add.text(-w / 2 + 75, -h / 2 + 17, '', { fontSize: '28px', fill: '#ff3333', fontFamily: '"DotGothic16", sans-serif' }).setOrigin(0.5);
        this.dialogText = this.add.text(-w / 2 + 40, -15, '', { fontSize: '26px', fill: '#cccccc', fontFamily: '"DotGothic16", sans-serif', wordWrap: { width: 920, useAdvancedWrap: true }, lineSpacing: 10 }).setOrigin(0, 0);
        this.nextIcon = this.add.text(w / 2 - 40, h / 2 - 30, '▼', { fontSize: '24px', fill: '#ff0000', fontFamily: '"DotGothic16", sans-serif' }).setOrigin(0.5).setVisible(false);
        this.tweens.add({ targets: this.nextIcon, alpha: 0, duration: 400, yoyo: true, repeat: -1 });
        this.dialogContainer.add([this.dialogBg, this.nameTag, this.nameText, this.dialogText, this.nextIcon]);
    }

    setupInput() {
        this.input.on('pointerdown', () => {
            if (this.isPaused) return; 

            if (this.isTyping) { 
                this.completeDialog(); 
            } else { 
                this.currentDialogIndex++; 
                this.showNextDialog(); 
            }
        });
    }

    drawCustomBox(g, x, y, w, h, s) {
        g.beginPath();
        g.moveTo(x + s, y); g.lineTo(x + w, y); g.lineTo(x + w, y + h - s);
        g.lineTo(x + w - s, y + h); g.lineTo(x, y + h); g.lineTo(x, y + s);
        g.closePath();
    }

    showNextDialog() {
        if (this.currentDialogIndex < this.storyData.length) {
            const data = this.storyData[this.currentDialogIndex];
            const specialCharacters = ["YOU"];
            const shouldShowNameTag = specialCharacters.includes(data.name);

            this.nameTag.setVisible(shouldShowNameTag);
            this.nameText.setVisible(shouldShowNameTag);
            this.nameText.setText(data.name || "");

            this.nextIcon.setVisible(false);
            this.typeText(data.text);
            this.playSFX('btn_hover');

            if (data.text === "呃...(兩眼一黑)") {
                this.playEyesCloseAnimation();
            } else if (data.text === "(撲通)") {
                this.cameras.main.shake(300, 0.03);
            }

        } else {
            this.input.off('pointerdown');
            this.tweens.add({
                targets: this.dialogContainer, alpha: 0, duration: 500,
                onComplete: () => {
                    this.dialogContainer.setVisible(false);
                    this.showGameObjective();
                }
            });
        }
    }

    playEyesCloseAnimation() {
        const blackOverlay = this.add.rectangle(this.centerX, this.centerY, 2000, 1500, 0x000000);
        blackOverlay.setDepth(80);
        blackOverlay.setAlpha(0);

        this.tweens.add({
            targets: blackOverlay,
            alpha: 1,
            duration: 800,
            ease: 'Power2'
        });
    }

    typeText(fullText) {
        this.isTyping = true;
        this.dialogText.setText('');
        let charIndex = 0;
        let currentString = '';

        if (this.typeTimer) this.typeTimer.remove();

        this.typeTimer = this.time.addEvent({
            delay: 50, repeat: fullText.length - 1,
            callback: () => {
                currentString += fullText[charIndex];
                this.dialogText.setText(currentString);
                charIndex++;
                if (charIndex === fullText.length) { 
                    this.isTyping = false; 
                    this.nextIcon.setVisible(true); 
                }
            }
        });
    }

    completeDialog() {
        if (this.typeTimer) this.typeTimer.remove();
        this.dialogText.setText(this.storyData[this.currentDialogIndex].text);
        this.isTyping = false;
        this.nextIcon.setVisible(true);
    }

    showGameObjective() {
        const objectiveBox = this.add.container(this.centerX, this.centerY);
        const objBg = this.add.graphics();
        objBg.fillStyle(0x440000, 0.8); objBg.fillRect(-400, -60, 800, 120);
        objBg.lineStyle(2, 0xff0000, 1); objBg.strokeRect(-400, -60, 800, 120);
        const objText = this.add.text(0, 0, 'MISSION: 逃離元智大門，醒過來！', { fontSize: '40px', fill: '#ff0000', fontFamily: '"DotGothic16", sans-serif' }).setOrigin(0.5);
        objectiveBox.add([objBg, objText]);
        
        const redFlashLayer = this.add.rectangle(this.centerX, this.centerY, this.cameras.main.width, this.cameras.main.height, 0xff0000);
        redFlashLayer.setDepth(90);
        redFlashLayer.setAlpha(0);

        objectiveBox.setAlpha(0.1);
        objectiveBox.setDepth(100);

        let flashCount = 0;

        this.time.addEvent({
            delay: 1000,
            repeat: 4,
            startAt: 1000,
            callback: () => {
                
                this.playSFX('mission_warning'); 

                redFlashLayer.setAlpha(0.5); 
                objectiveBox.setAlpha(1);

                this.tweens.add({
                    targets: redFlashLayer,
                    alpha: 0,
                    duration: 900,
                    ease: 'Sine.easeOut'
                });

                this.tweens.add({
                    targets: objectiveBox,
                    alpha: 0.1,
                    duration: 900,
                    ease: 'Sine.easeOut'
                });

                flashCount++;

                if (flashCount === 5) {
                    this.time.delayedCall(1000, () => {
                        this.cameras.main.fadeOut(2000, 0, 0, 0);
                        this.cameras.main.once('camerafadeoutcomplete', () => {
                            this.scene.start('StageTitleScene', {
                                nextSceneKey: 'LevelScene1',
                                stageNumStr: '第一關',
                                stageNameStr: '法老王的C++審判'
                            });
                        });
                    });
                }
            }
        });
    }

    togglePauseMenu() {
        if (this.volumeContainer) return;

        if (this.isPaused) {
            this.isPaused = false;
            this.time.paused = false;
            
            if (this.tweens) this.tweens.resumeAll();   
            if (this.physics && this.physics.world) this.physics.resume();

            if (this.pauseContainer) {
                this.pauseContainer.destroy();
                this.pauseContainer = null;
            }
        } else {
            this.isPaused = true;
            this.time.paused = true;
            
            if (this.tweens) this.tweens.pauseAll();   
            if (this.physics && this.physics.world) this.physics.pause();

            this.showPauseMenu();
        }
    }

    showPauseMenu() {
        this.pauseContainer = this.add.container(0, 0).setDepth(400);

        const centerX = this.centerX || this.cameras.main.centerX;
        const centerY = this.centerY || this.cameras.main.centerY;

        const mask = this.add.rectangle(centerX, centerY, 1200, 600, 0x000000, 0.85);
        mask.setInteractive();
        
        const drawChamferedRect = (graphics, x, y, w, h, cutSize) => {
            graphics.beginPath();
            graphics.moveTo(x + cutSize, y); graphics.lineTo(x + w, y); graphics.lineTo(x + w, y + h - cutSize);
            graphics.lineTo(x + w - cutSize, y + h); graphics.lineTo(x, y + h); graphics.lineTo(x, y + cutSize);
            graphics.closePath();
        };

        const boxWidth = 450, boxHeight = 380;
        const boxX = centerX - boxWidth / 2, boxY = centerY - boxHeight / 2;
        const box = this.add.graphics();
        
        box.fillStyle(0x110000, 1);
        drawChamferedRect(box, boxX, boxY, boxWidth, boxHeight, 30);
        box.fillPath();
        
        box.lineStyle(2, 0x880000, 1);
        drawChamferedRect(box, boxX, boxY, boxWidth, boxHeight, 30);
        box.strokePath();

        const titleText = this.add.text(centerX, centerY - 140, '>> SYSTEM PAUSED', {
            fontSize: '24px', fill: '#ff3333', fontFamily: '"DotGothic16", Courier New', padding: 8
        }).setOrigin(0.5);

        const hintText = this.add.text(centerX, centerY - 105, '( PRESS SPACE TO CONTINUE )', {
            fontSize: '16px', fill: '#ff3333', fontFamily: '"DotGothic16", sans-serif'
        }).setOrigin(0.5);

        this.pauseContainer.add([mask, box, titleText, hintText]);

        const btnW = 280, btnH = 60;
        
        const createMenuButton = (yOffset, label, callback) => {
            const btnContainer = this.add.container(centerX, centerY + yOffset);
            const bg = this.add.graphics();

            const drawBtn = (isHover) => {
                bg.clear();
                bg.fillStyle(isHover ? 0x4a0000 : 0x1f0000, 1);
                const cut = 15;
                
                bg.beginPath();
                bg.moveTo(-btnW / 2 + cut, -btnH / 2); bg.lineTo(btnW / 2, -btnH / 2);
                bg.lineTo(btnW / 2, btnH / 2 - cut); bg.lineTo(btnW / 2 - cut, btnH / 2);
                bg.lineTo(-btnW / 2, btnH / 2); bg.lineTo(-btnW / 2, -btnH / 2 + cut);
                bg.closePath(); bg.fillPath();

                bg.lineStyle(2, isHover ? 0xff3333 : 0x880000, 1);
                bg.beginPath();
                bg.moveTo(-btnW / 2 + cut, -btnH / 2); bg.lineTo(btnW / 2, -btnH / 2);
                bg.lineTo(btnW / 2, btnH / 2 - cut); bg.lineTo(btnW / 2 - cut, btnH / 2);
                bg.lineTo(-btnW / 2, btnH / 2); bg.lineTo(-btnW / 2, -btnH / 2 + cut);
                bg.closePath(); bg.strokePath();
            };

            drawBtn(false);

            const txt = this.add.text(0, 0, label, { fontSize: '24px', fill: '#880000', fontFamily: '"DotGothic16", serif' }).setOrigin(0.5);
            const lStr = this.add.text(-btnW / 2 + 20, 0, '< >', { fontSize: '18px', fill: '#880000', fontFamily: '"DotGothic16", monospace' }).setOrigin(0, 0.5);
            const rStr = this.add.text(btnW / 2 - 20, 0, '</>', { fontSize: '18px', fill: '#880000', fontFamily: '"DotGothic16", monospace' }).setOrigin(1, 0.5);

            btnContainer.add([bg, lStr, rStr, txt]);
            this.pauseContainer.add(btnContainer);

            bg.setInteractive(new Phaser.Geom.Rectangle(-btnW / 2, -btnH / 2, btnW, btnH), Phaser.Geom.Rectangle.Contains);

            bg.on('pointerover', () => {
                if (typeof this.playSFX === 'function') this.playSFX('btn_hover'); 
                drawBtn(true); txt.setFill('#ff0000'); txt.setShadow(0, 0, '#ff0000', 10);
                lStr.setFill('#fff'); rStr.setFill('#fff'); this.input.setDefaultCursor('pointer');
            });

            bg.on('pointerout', () => {
                drawBtn(false); txt.setFill('#880000'); txt.setShadow(0, 0, 'transparent', 0);
                lStr.setFill('#880000'); rStr.setFill('#880000');
                this.input.setDefaultCursor('default'); btnContainer.setScale(1);
            });

            bg.on('pointerdown', () => { 
                if (typeof this.playSFX === 'function') this.playSFX('btn_click'); 
                btnContainer.setScale(0.95); 
            });

            bg.on('pointerup', () => {
                btnContainer.setScale(1); this.input.setDefaultCursor('default'); callback(); 
            });
        };

        const isLevelScene = this.scene.key.includes('LevelScene');
        const firstBtnText = isLevelScene ? '重新挑戰' : '重新觀看';

        createMenuButton(-35, firstBtnText, () => {
            this.scene.restart();
        });

        createMenuButton(45, '音量設置', () => {
            this.openVolumeSettings();
        });

        createMenuButton(125, '回到主選單', () => {
            this.sound.stopAll(); 
            this.scene.start('MainMenu'); 
        });
    }

    openVolumeSettings() {
        if (this.volumeContainer) return;

        const centerX = this.centerX;
        const centerY = this.centerY;

        let currentBGM = this.bgmVolume;
        let currentSFX = this.sfxVolume;
        let currentMute = this.isMuted;

        const drawChamferedRect = (graphics, x, y, w, h, cutSize) => {
            graphics.beginPath();
            graphics.moveTo(x + cutSize, y); graphics.lineTo(x + w, y); graphics.lineTo(x + w, y + h - cutSize);
            graphics.lineTo(x + w - cutSize, y + h); graphics.lineTo(x, y + h); graphics.lineTo(x, y + cutSize);
            graphics.closePath();
        };

        const createSlider = (x, y, label, startVal, callback) => {
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

            const onDrag = (pointer, dragX) => {
                if (this.isMuted) return;
                let pcent = Phaser.Math.Clamp((dragX - sliderStartX) / trackWidth, 0, 1);
                
                let currentStep = Math.round(pcent * 20);

                if (currentStep !== lastStep) {
                    lastStep = currentStep;
                    this.playSFX('pull'); 
                }

                update(pcent); callback(pcent);
            };
            
            knob.on('drag', onDrag);
            knob.on('pointerover', () => { if (!this.isMuted) { knob.setAlpha(0.8); this.input.setDefaultCursor('pointer'); } });
            knob.on('pointerout', () => { knob.setAlpha(1); this.input.setDefaultCursor('default'); });

            update(startVal);
            container.add([title, valText, trackBg, trackFill, knob]);

            return { container, updateLabel: (v) => update(v), setDisabled: (disabled) => { container.setAlpha(disabled ? 0.4 : 1); }, knob, onDrag };
        };

        const createSmallBtn = (x, y, label, callback) => {
            const container = this.add.container(x, y);
            const bg = this.add.graphics();

            const draw = (isHover) => {
                bg.clear();
                bg.fillStyle(isHover ? 0x4a0000 : 0x1f0000, 1);
                drawChamferedRect(bg, -70, -25, 140, 50, 10); bg.fillPath();
                bg.lineStyle(2, isHover ? 0xff3333 : 0x880000, 1);
                drawChamferedRect(bg, -70, -25, 140, 50, 10); bg.strokePath();
            };

            draw(false);
            const txt = this.add.text(0, 0, label, { fontSize: '18px', fill: '#880000', fontFamily: '"DotGothic16", serif', padding: 8 }).setOrigin(0.5);
            container.add([bg, txt]);
            bg.setInteractive(new Phaser.Geom.Rectangle(-70, -25, 140, 50), Phaser.Geom.Rectangle.Contains);

            bg.on('pointerover', () => { 
                if (!this.isMuted) this.sound.play('btn_hover', { volume: this.sfxVolume });
                draw(true); txt.setFill('#ff0000'); txt.setShadow(0, 0, '#ff0000', 10); this.input.setDefaultCursor('pointer'); 
            });
            bg.on('pointerout', () => { draw(false); txt.setFill('#880000'); txt.setShadow(0, 0, 'transparent', 0); this.input.setDefaultCursor('default'); container.setScale(1); });
            bg.on('pointerdown', () => { 
                if (!this.isMuted) this.sound.play('btn_click', { volume: this.sfxVolume });
                container.setScale(0.95); 
            });
            bg.on('pointerup', () => { container.setScale(1); callback(); });

            return container;
        };

        this.volumeContainer = this.add.container(0, 0).setDepth(450);

        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.85);
        overlay.fillRect(0, 0, 1200, 600);
        overlay.setInteractive(new Phaser.Geom.Rectangle(0, 0, 1200, 600), Phaser.Geom.Rectangle.Contains);
        
        const boxWidth = 450, boxHeight = 350;
        const boxX = centerX - boxWidth / 2, boxY = centerY - boxHeight / 2;
        const box = this.add.graphics();
        box.fillStyle(0x110000, 1);
        drawChamferedRect(box, boxX, boxY, boxWidth, boxHeight, 30);
        box.fillPath();
        box.lineStyle(2, 0x880000, 1);
        drawChamferedRect(box, boxX, boxY, boxWidth, boxHeight, 30);
        box.strokePath();

        const titleText = this.add.text(centerX, centerY - 130, '>> AUDIO SYSTEM', {
            fontSize: '24px', fill: '#ff3333', fontFamily: '"DotGothic16", Courier New', padding: 8
        }).setOrigin(0.5);

        const bgmSlider = createSlider(centerX, centerY - 65, '背景音樂', this.bgmVolume, (v) => {
            this.bgmVolume = v; 
            this.sound.sounds.forEach(snd => {
                if (snd.key.includes('bgm')) snd.setVolume(this.isMuted ? 0 : v);
            });
        });
        
        const sfxSlider = createSlider(centerX, centerY - 5, '音效音量', this.sfxVolume, (v) => {
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
            this.isMuted = !this.isMuted; 
            this.sound.mute = this.isMuted; 
            if (!this.isMuted) this.sound.play('btn_click', { volume: this.sfxVolume });
            redrawMuteUI();
            muteLabel.setFill(this.isMuted ? '#ff0000' : '#880000');
            bgmSlider.updateLabel(this.isMuted ? 0 : this.bgmVolume); 
            sfxSlider.updateLabel(this.isMuted ? 0 : this.sfxVolume);
            bgmSlider.setDisabled(this.isMuted); 
            sfxSlider.setDisabled(this.isMuted);
        });
        
        muteHitArea.on('pointerover', () => { this.input.setDefaultCursor('pointer'); muteBtnBox.setAlpha(0.7); });
        muteHitArea.on('pointerout', () => { this.input.setDefaultCursor('default'); muteBtnBox.setAlpha(1); });

        muteGroup.add([muteLabel, muteBtnBox, checkIcon, muteHitArea]);
        
        const saveBtn = createSmallBtn(centerX, centerY + 130, 'SAVE', () => {
            localStorage.setItem('sys_bgm', this.bgmVolume);
            localStorage.setItem('sys_sfx', this.sfxVolume);
            localStorage.setItem('sys_mute', this.isMuted);
            
            bgmSlider.knob.off('drag', bgmSlider.onDrag);
            sfxSlider.knob.off('drag', sfxSlider.onDrag);

            this.volumeContainer.destroy();
            this.volumeContainer = null;
        });

        this.volumeContainer.add([overlay, box, titleText, bgmSlider.container, sfxSlider.container, muteGroup, saveBtn]);
    }
}