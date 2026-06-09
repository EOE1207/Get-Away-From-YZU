export default class LevelScene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelScene1' });
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
        this.load.crossOrigin = 'anonymous';
        this.load.audio('bgm_level1', 'bgm/bgm_level1.mp3');
        this.load.audio('bossappear', 'audio/bossappear.mp3');
        this.load.audio('countdown', 'audio/countdown.mp3');
        this.load.audio('point', 'audio/point.mp3');
        this.load.audio('powerup', 'audio/powerup.mp3');
        this.load.audio('punch', 'audio/punch.mp3');
        this.load.audio('sword', 'audio/sword.mp3');
        this.load.audio('swordhit', 'audio/swordhit.mp3');
        this.load.audio('shield', 'audio/shield.mp3');
        this.load.audio('defend', 'audio/defend.mp3');
        this.load.audio('run', 'audio/run.mp3');
        this.load.audio('jump', 'audio/jump.mp3');
        this.load.audio('dash', 'audio/dash.mp3');
        this.load.audio('squatdown', 'audio/squatdown.mp3');
        this.load.audio('land', 'audio/land.mp3');
        this.load.audio('playerhit', 'audio/playerhit.mp3');
        this.load.audio('bullet', 'audio/bullet.mp3');
        this.load.audio('throwing', 'audio/throwing.mp3');
        this.load.audio('explosion', 'audio/explosion.mp3');
        this.load.audio('warning', 'audio/warning.mp3');
        this.load.audio('pyramid', 'audio/pyramid.mp3');
        this.load.audio('gameover', 'audio/gameover.mp3');
        this.load.audio('level_complete', 'audio/level_complete.mp3');
        this.load.audio('disappear1', 'audio/disappear1.mp3');
        this.load.audio('pull', 'audio/pull.mp3');
        this.load.spritesheet('player_run', 'images/student_run.png?v=1', { frameWidth: 250, frameHeight: 363 });
        this.load.image('player_stand', 'images/student_stand.png');
        this.load.image('player_squatdown', 'images/student_squatdown.png');
        this.load.spritesheet('player_jump', 'images/student_jump.png', { frameWidth: 250, frameHeight: 363 });
        this.load.image('main_bg', 'images/firstbg.png');
        this.load.image('item_jump', 'images/W.png');
        this.load.image('item_fastfall', 'images/S.png');
        this.load.image('item_dash', 'images/D.png');
        this.load.image('item_credit', 'images/point.png');
        this.load.image('item_ball', 'images/substitute_ball.png');
        this.load.spritesheet('AI_support', 'images/AI_support.png', { frameWidth: 250, frameHeight: 363 });
        this.load.image('player_avatar', 'images/player_avatar.png');
        this.load.image('pharaoh_avatar', 'images/pharaoh_avatar.png');
        this.load.image('item_skill1', 'images/shield.png');
        this.load.image('item_skill2', 'images/weapon_skill.png');
        this.load.image('item_shield', 'images/shield.png');
        this.load.image('item_shootbomb', 'images/bullet.png');
        this.load.image('item_extraATK', 'images/pyramid.png');
        this.load.image('item_bomb', 'images/rollcall_bomb.png');
        this.load.image('fx_boom', 'images/boom.png');
        this.load.spritesheet('pharaoh_boss', 'images/pharaoh.png', { frameWidth: 690, frameHeight: 752 });
    }

    create() {
        this.sound.stopAll();
        this.bgm = this.sound.add('bgm_level1', {
            volume: this.isMuted ? 0 : this.bgmVolume,
            loop: true
        });
        this.bgm.play();
        this.storyData = [
            { name: "YOU", text: "（這...這裡是哪裡？我剛剛不是還在宿舍趕報告嗎？）" },
            { name: "YOU", text: "（對了，我好像做到一半睡著了。）" },
            { name: "YOU", text: "（這裡是夢嗎？話說這裡好眼熟，好像是我上程式設計的教室。）" },
            { name: "YOU", text: "（後面好像是死路，只能往前了。）" },
            { name: "？？？", text: "同學，你的跳棋程式還沒交，現在我要把你當掉喔~" },
            { name: "YOU", text: "我就是因為寫你的這個作業才睡著的！法老王！" },
            { name: "法老王", text: "來都來了，就別走了。" },
            { name: "YOU", text: "雅美漏！如果沒有學分的話，哇塔西..." },
            { name: "法老王", text: "好課值得一修再修~" },
            { name: "YOU", text: "饒了我吧...我只想拿學分畢業。" },
            { name: "法老王", text: "不然這樣，只要你贏了，我就放你走。" },
            { name: "YOU", text: "等等...贏什麼？" }
        ];
        this.currentDialogIndex = 0;
        this.typeTimer = null;
        this.itemTutorialData = [
            { key: 'item_jump', title: '按鍵：跳躍 (W)', text: '按W鍵跳躍，連點兩下可二段跳。' },
            { key: 'item_fastfall', title: '按鍵：快速下墜 (S)', text: '按下S鍵在空中快速下墜以加速落地。' },
            { key: 'item_dash', title: '按鍵：衝刺 (D)', text: '按下D鍵進行衝刺，可進行瞬間加速，若能搭配跳躍...' },
            { key: 'item_credit', title: '【學分】', text: '在跑酷過程中努力收集它們，累積能量可以施放特殊技能！' },
            { key: 'item_ball', title: '【替身球】', text: '攻擊手段之一，碰到它會召喚替身攻擊敵人！' },
            { key: 'item_skill1', title: '【爆肝】(E)', text: '不須能量即可使用，按下E鍵使用後10秒內可減少50%受到的傷害，冷卻時間30秒。' },
            { key: 'item_skill2', title: '【武器技能】(Q)', text: '攻擊手段之一，能量滿了可以按Q鍵釋放劍氣，清空障礙(extra攻擊除外)並對敵人造成可觀的傷害！' },
            { key: 'item_shootbomb', title: '【砲彈】', text: '要注意避開的攻擊，被擊中會減少生命值的！' },
            { key: 'item_extraATK', title: '【特殊攻擊】', text: '每個BOSS都有各自的專屬特殊攻擊，具有強大破壞力，被擊中會損失大量生命，攻擊前會有紅色警報，一定要小心！' },
            { key: 'item_bomb', title: '【點名炸彈】', text: '每個BOSS都會的攻擊，當過學生的都知道這招的威力，要小心迴避！' },
            { key: 'item_credit', title: '', text: '後面的攻擊與玩法請自行探索。如果準備好的話就點擊畫面開始吧！(小提醒：按F鍵可以切換全螢幕或退出全螢幕，按空白鍵可以叫出暫停選單)' }
        ];
        this.time.paused = false;
        this.currentDialogIndex = 0;
        this.isTyping = false;
        this.isGamePlaying = false;
        this.isItemTutorialActive = false;
        this.currentItemTutIndex = 0;
        this.isBossAttacking = false;

        this.isLevelCleared = false;
        this.isEndingDialog = false;

        this.input.setDefaultCursor('default');
        this.horizonY = 570;
        this.centerX = this.cameras.main.centerX;
        this.centerY = this.cameras.main.centerY;

        this.setupEnvironment(this.horizonY);
        this.setupPhysicsGround(this.horizonY);
        this.setupPlayer(this.horizonY);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.jumpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dashKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        
        this.input.keyboard.on('keydown-F', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        });
        
        this.isPaused = false;
        this.pauseContainer = null;
        this.volumeContainer = null;

        this.input.keyboard.on('keydown-SPACE', () => {
            this.togglePauseMenu();
        });
        this.jumpVelocity = -700;
        this.fastFallAccel = 15000;
        this.maxJumps = 2;
        this.jumpsUsed = 0;

        this.physics.add.collider(this.player, this.physicsGround);

        this.playerMaxHP = 100;
        this.playerHP = 100;

        this.obstacleGroup = this.physics.add.group();
        this.physics.add.overlap(this.player, this.obstacleGroup, this.hitObstacle, null, this);

        this.itemGroup = this.physics.add.group();
        this.physics.add.overlap(this.player, this.itemGroup, this.collectItem, null, this);

        this.weaponGroup = this.physics.add.group();
        this.physics.add.overlap(this.weaponGroup, this.obstacleGroup, this.weaponHitObstacle, null, this);

        this.setupBoss(this.horizonY);

        this.skill2Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.currentEnergy = 0;
        this.maxEnergy = 5;

        this.isSkill1Active = false;
        this.isSkill1OnCD = false;
        this.playerShield = this.add.graphics().setDepth(21);
        this.skill1Key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        if (!this.anims.exists('AI_support')) {
            this.anims.create({
                key: 'AI_support',
                frames: this.anims.generateFrameNumbers('AI_support', { start: 0, end: 5 }),
                frameRate: 15,
                repeat: 0
            });
        }

        if (!this.textures.exists('glow_particle')) {
            const gfx = this.add.graphics();
            gfx.fillStyle(0xffffff, 1);
            gfx.fillCircle(4, 4, 4);
            gfx.generateTexture('glow_particle', 8, 8);
            gfx.destroy();
        }

        this.playerShield = this.add.sprite(0, 0, 'item_shield');
        this.playerShield.setDepth(22);
        this.playerShield.setVisible(false);
        this.playerShield.setScale(0.8);

        this.shieldEmitter = this.add.particles(0, 0, 'glow_particle', {
            scale: { start: 0.6, end: 0 },
            alpha: { start: 0.6, end: 0 },
            tint: 0xffd700,
            blendMode: 'ADD',
            lifspan: 500,
            speed: { min: 20, max: 60 },
            angle: { min: 0, max: 360 },
            frequency: 20,
            emitting: false
        });
        this.shieldEmitter.setDepth(21);

        if (this.textures.exists('sword_aura')) {
            this.textures.remove('sword_aura');
        }

        const auraGraphics = this.add.graphics();
        auraGraphics.generateTexture('sword_aura', 100, 200);
        auraGraphics.destroy();

        this.setupUI();
        this.setupDialogUI();
        this.setupItemTutorialUI();

        this.setupInput();
        this.showNextDialog();
    }

    update(time, delta) {
        if (this.isGamePlaying) {

            const bgSpeed = this.isDashing ? 5 * 1.5 : 5;
            if (this.bgLayer) {
                this.bgLayer.tilePositionX += bgSpeed;
            }

            const body = this.player.body;

            const onGround = body.onFloor() || body.blocked.down || (body.touching && body.touching.down);
            if (onGround && !this.wasOnGround) {
                this.playSFX('land');
            }
            this.wasOnGround = onGround;

            const isRealFloor = body.onFloor() || body.blocked.down;
            const downHeld = this.downKey.isDown;

            if (isRealFloor && this.isDashJumping) {
                this.endDashJump();
            }

            if (onGround) {
                this.jumpsUsed = 0;
                if (!this.player.anims.currentAnim || this.player.anims.currentAnim.key !== 'run') {
                    this.player.play('run', true);
                    this.player.setOrigin(0.5, 1);
                    this.player.setScale(0.3);
                    this.player.body.setSize(150, 350);
                    this.player.body.setOffset(50, 13);
                }

            } else {
                if (downHeld) {
                    if (this.player.texture.key !== 'player_squatdown') {
                        this.playSFX('squatdown');
                        this.player.anims.stop();
                        this.player.setTexture('player_squatdown');
                        this.player.setOrigin(0.5, 1);
                        this.player.setScale(0.3);
                        this.player.body.setSize(150, 350);
                        this.player.body.setOffset(50, 13);
                    }
                } else {
                    if (!this.player.anims.currentAnim || this.player.anims.currentAnim.key !== 'jump') {
                        this.player.play('jump', true);
                        this.player.setOrigin(0.5, 1);
                        this.player.setScale(0.3);
                        this.player.body.setSize(150, 350);
                        this.player.body.setOffset(50, 13);
                    }
                }
            }

            if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
                if (onGround) {
                    this.playSFX('jump');
                    this.jumpsUsed = 1;
                    this.player.setVelocityY(this.jumpVelocity);
                    this.triggerDashJump();
                } else if (this.jumpsUsed < this.maxJumps) {
                    this.playSFX('jump');
                    this.jumpsUsed = 2;
                    this.player.setVelocityY(this.jumpVelocity);
                    this.triggerDashJump();
                }
            }

            if (!onGround && downHeld) {
                const extra = this.fastFallAccel * (delta / 1000);
                this.player.setVelocityY(Math.min(body.velocity.y + extra, 3000));
            }

            if (Phaser.Input.Keyboard.JustDown(this.dashKey) && !this.isDashing && !this.isDashOnCD && onGround) {
                this.executeDash();
            }

            this.itemGroup.getChildren().forEach(item => {
                if (item.x < -100) {
                    item.destroy();
                }
            });

            if (Phaser.Input.Keyboard.JustDown(this.skill1Key)) {
                this.activateSkill1();
            }

            if (this.isSkill1Active) {
                let currentAlpha = this.shieldAlpha;

                if (this.isShieldBlinking) {
                    currentAlpha = this.shieldAlpha * (0.5 + 0.5 * Math.sin(time * 0.02));
                }

                const shieldX = this.player.x;
                const shieldY = this.player.y - (this.player.displayHeight / 2);

                if (this.playerShield) {
                    this.playerShield.setPosition(shieldX, shieldY);
                    this.playerShield.setAlpha(currentAlpha * 0.8);
                }

                if (this.shieldEmitter) {
                    this.shieldEmitter.setPosition(shieldX, shieldY);
                    this.shieldEmitter.setAlpha(currentAlpha);
                }
            }

            if (Phaser.Input.Keyboard.JustDown(this.skill2Key)) {
                this.activateSkill2();
            }

            if (this.obstacleGroup) {
                this.obstacleGroup.getChildren().forEach(obstacle => {
                    if (obstacle.x < -100 || obstacle.y > this.cameras.main.height + 100) {
                        if (obstacle.texture && obstacle.texture.key === 'item_extraATK') {
                            return;
                        }
                        obstacle.destroy();
                    }
                });
            }
        }
    }

    setupPlayerRunSettings() {
        this.player.setOrigin(0.5, 1);
        this.player.play('run', true);
        this.player.body.setSize(150, 350);
        this.player.body.setOffset(50, 13);
    }

    startBossAttacks() {
        if (!this.isGamePlaying) return;
        this.time.addEvent({
            delay: 2000,
            callback: () => { this.triggerRandomAttack(); }
        });
    }

    triggerRandomAttack() {
        if (!this.isGamePlaying) return;
        this.isBossAttacking = true;

        const attackType = Phaser.Math.Between(1, 4);

        switch (attackType) {
            case 1: this.attackPattern1(); break;
            case 2: this.attackPattern2(); break;
            case 3: this.attackPattern3(); break;
            case 4: this.attackPattern4(); break;
        }
    }

    finishAttack(delayTime = 2000) {
        this.isBossAttacking = false;
        this.time.delayedCall(delayTime, () => {
            this.triggerRandomAttack();
        });
    }

    attackPattern1() {
        let waves = 0;

        const highY = this.horizonY - 100;
        const lowY = this.horizonY - 40;

        let isNextHigh = Phaser.Math.Between(0, 1) === 1;

        this.time.addEvent({
            delay: 1150,
            repeat: 3,
            callback: () => {
                if (!this.isGamePlaying || this.bossHP <= 0) return;
                const currentY = isNextHigh ? highY : lowY;

                isNextHigh = !isNextHigh;

                for (let i = 0; i < 3; i++) {
                    const bomb = this.obstacleGroup.create(1250 + (i * 120), currentY, 'item_shootbomb');
                    bomb.setScale(0.5);
                    bomb.body.setSize(224, 80);
                    bomb.body.setOffset(0, 72);

                    bomb.body.allowGravity = false;
                    const dashMultiplier = this.isDashing ? 1.5 : 1;
                    bomb.setVelocityX(-600 * dashMultiplier);
                }

                waves++;
                if (waves === 4) {
                    this.finishAttack(3000);
                }
            }
        });
    }

    attackPattern2() {
        let cycles = 0;
        const waveInterval = 1800;

        this.time.addEvent({
            delay: waveInterval * 2,
            repeat: 2,
            callback: () => {
                if (!this.isGamePlaying || this.bossHP <= 0) return;

                for (let i = 0; i < 4; i++) {
                    const bomb = this.obstacleGroup.create(1200 + i * 70, this.horizonY - 160 + i * 50, 'item_shootbomb');
                    bomb.setScale(0.5);
                    bomb.body.setSize(224, 80);
                    bomb.body.setOffset(0, 72);
                    bomb.body.allowGravity = false;
                    bomb.setVelocityX(this.isDashing ? -750 : -500);
                }

                this.time.delayedCall(waveInterval, () => {
                    if (!this.isGamePlaying || this.bossHP <= 0) return;
                    for (let i = 0; i < 4; i++) {
                        const bomb = this.obstacleGroup.create(1200 + i * 70, this.horizonY - 10 - i * 50, 'item_shootbomb');
                        bomb.setScale(0.5);
                        bomb.body.setSize(224, 80);
                        bomb.body.setOffset(0, 72);
                        bomb.body.allowGravity = false;
                        bomb.setVelocityX(this.isDashing ? -750 : -500);
                    }
                });

                cycles++;
                if (cycles === 3) this.finishAttack(waveInterval + 2500);
            }
        });
    }

    attackPattern3() {
        let waves = 0;
        this.time.addEvent({
            delay: 2000,
            repeat: 7,
            callback: () => {
                if (!this.isGamePlaying || this.bossHP <= 0 || !this.player || !this.player.active) {
                    return;
                }

                const bombCount = Phaser.Math.Between(1, 2);
                this.playSFX('throwing');
                for (let i = 0; i < bombCount; i++) {
                    let randomX = Phaser.Math.Between(400, 1100);

                    if (Math.abs(randomX - this.player.x) < 150) {
                        randomX += 200;
                    }

                    const bomb = this.obstacleGroup.create(randomX, -50, 'item_bomb');
                    bomb.setScale(0.5);
                    bomb.body.setCircle(60, 40, 40);
                    bomb.body.allowGravity = true;

                    this.physics.add.collider(bomb, this.physicsGround);

                    bomb.setGravityY(300);
                    const dashMultiplier = this.isDashing ? 1.5 : 1;
                    bomb.setVelocityX(Phaser.Math.Between(-100, -200) * dashMultiplier);
                    bomb.setBounce(0.4);
                    bomb.setAngularVelocity(Phaser.Math.Between(-150, 150));
                }

                waves++;
                if (waves === 8) {
                    this.finishAttack(6000);
                }
            }
        });
    }

    attackPattern4() {
        if (!this.isGamePlaying || this.bossHP <= 0) return;
        this.isBossAttacking = true;

        this.playSFX('warning');
        for (let i = 0; i < 3; i++) {
            this.time.delayedCall(i * 1000, () => {
                this.cameras.main.flash(500, 255, 0, 0, 0.5);
            });
        }

        this.time.delayedCall(3000, () => {
            if (!this.isGamePlaying || this.bossHP <= 0) {
                this.isBossAttacking = false;
                return;
            }

            const bottomPyramid = this.obstacleGroup.create(600, this.horizonY + 800, 'item_extraATK');
            this.playSFX('pyramid');

            const p1Width = 1200;
            const p1Height = 700;

            bottomPyramid.setScale(p1Width / 224, p1Height / 224);
            bottomPyramid.setOrigin(0.5, 1);
            bottomPyramid.setDepth(30);

            bottomPyramid.body.allowGravity = false;
            bottomPyramid.body.immovable = true;
            bottomPyramid.body.moves = true;

            const origSize = 224;
            bottomPyramid.body.setSize(origSize * 2, origSize * 0.1);
            bottomPyramid.body.setOffset(origSize * 0, origSize * 0.55);

            this.tweens.add({
                targets: bottomPyramid,
                y: this.horizonY + 120,
                duration: 500,
                ease: 'Cubic.easeOut',
                yoyo: true,
                hold: 300,
                delay: 500,
                onComplete: () => {
                    bottomPyramid.destroy();

                    if (!this.isGamePlaying || this.bossHP <= 0) {
                        this.isBossAttacking = false;
                        return;
                    }

                    this.time.delayedCall(1000, () => {
                        const topPyramid = this.obstacleGroup.create(600, -800, 'item_extraATK');
                        this.playSFX('pyramid');

                        const p2Width = 1800;
                        const p2Height = 1200;

                        topPyramid.setScale(p2Width / 224, p2Height / 224);
                        topPyramid.setOrigin(0.5, 0);
                        topPyramid.setFlipY(true);
                        topPyramid.setDepth(30);

                        topPyramid.body.allowGravity = false;
                        topPyramid.body.immovable = true;
                        topPyramid.body.moves = true;

                        const origSize = 224;
                        topPyramid.body.setSize(origSize * 2, origSize * 0.1);
                        topPyramid.body.setOffset(origSize * 0, origSize * 0.4);

                        this.tweens.add({
                            targets: topPyramid,
                            y: this.horizonY - 750,
                            duration: 800,
                            ease: 'Bounce.easeOut',
                            yoyo: true,
                            hold: 1000,
                            onComplete: () => {
                                topPyramid.destroy();
                                this.finishAttack(2000);
                            }
                        });
                    });
                }
            });
        });
    }

    hitObstacle(player, obstacle) {
        if (!this.isGamePlaying || this.isLevelCleared) return;
        if (!obstacle || obstacle.hasHit) return;

        let damage = 10;
        switch (obstacle.texture.key) {
            case 'item_shootbomb': damage = 5; break;
            case 'item_bomb': damage = 20; break;
            case 'item_extraATK': damage = 50; break;
        }

        obstacle.hasHit = true;

        if (this.isSkill1Active) {
            damage = Math.floor(damage / 2);
            this.playSFX('defend');

            let oriScale = this.playerShield.scaleX || 1;
            this.playerShield.setBlendMode(Phaser.BlendModes.ADD);
            this.playerShield.setTint(0xccffff);
            this.tweens.add({
                targets: this.playerShield,
                scale: oriScale * 1.3,
                duration: 100,
                yoyo: true,
                ease: 'Quad.easeOut',
                onComplete: () => {
                    this.playerShield.setBlendMode(Phaser.BlendModes.NORMAL);
                    this.playerShield.clearTint();
                    this.playerShield.setScale(oriScale);
                }
            });
        }

        this.playerHP -= damage;
        if (this.playerHP < 0) this.playerHP = 0;

        if (this.playerHpMask) {
            this.tweens.addCounter({
                from: this.lastPlayerHP, to: this.playerHP, duration: 200, ease: 'Power2',
                onUpdate: (tween) => this.updatePlayerHPBar(tween.getValue())
            });
            this.lastPlayerHP = this.playerHP;
        }

        let blinkCount = 0;
        this.time.addEvent({
            delay: 100, repeat: 5,
            callback: () => {
                blinkCount++;
                if (blinkCount % 2 !== 0) { player.setTintFill(0xff0000); }
                else { player.clearTint(); }
            }
        });

        this.cameras.main.shake(200, 0.01);

        if (obstacle.texture.key === 'item_bomb') {
            const emitter = this.add.particles(obstacle.x, obstacle.y, 'fx_boom', {
                speed: { min: 50, max: 150 }, angle: { min: 0, max: 360 }, scale: { start: 0.05, end: 0.35 },
                alpha: { start: 1, end: 0 }, rotation: { min: 0, max: 180 }, lifespan: 400, blendMode: 'ADD', emitting: false
            });
            emitter.setDepth(35);
            emitter.explode(3);
            this.playSFX('explosion');
            this.time.delayedCall(500, () => { emitter.destroy(); });
        }
        else if (obstacle.texture.key === 'item_shootbomb') {
            this.playSFX('bullet');
            this.playSFX('playerhit');
        }
        else {
            this.playSFX('playerhit');
        }

        if (obstacle.texture.key !== 'item_extraATK') {
            obstacle.destroy();
        }

        if (this.playerHP <= 0) {
            this.gameOver();
        }
    }

    activateSkill1() {
        if (!this.isGamePlaying || this.isSkill1Active || this.isSkill1OnCD) return;

        this.isSkill1Active = true;
        this.playSFX('shield');

        this.shieldAlpha = 0.8;
        this.isShieldBlinking = false;

        if (this.playerShield) this.playerShield.setVisible(true);
        if (this.shieldEmitter) this.shieldEmitter.start();

        this.skill1Icon.setTint(0x555555);
        this.skill1CDText.setText('🚫');

        this.time.delayedCall(7000, () => {
            if (!this.isSkill1Active) return;
            this.isShieldBlinking = true;
            this.tweens.add({
                targets: this,
                shieldAlpha: 0,
                duration: 3000,
                ease: 'Linear'
            });
        });

        this.time.delayedCall(10000, () => {
            this.isSkill1Active = false;
            this.isShieldBlinking = false;
            if (this.playerShield) this.playerShield.setVisible(false);
            if (this.shieldEmitter) this.shieldEmitter.stop();

            this.isSkill1OnCD = true;
            let cdTimer = 30;
            this.skill1CDText.setText(cdTimer);

            this.time.addEvent({
                delay: 1000,
                repeat: 29,
                callback: () => {
                    if (!this.isGamePlaying || this.bossHP <= 0) return;
                    cdTimer--;
                    if (cdTimer > 0) {
                        this.skill1CDText.setText(cdTimer);
                    } else {
                        this.skill1CDText.setText('');
                        this.skill1Icon.clearTint();
                        this.isSkill1OnCD = false;
                    }
                }
            });
        });
    }

    activateSkill2() {
        if (!this.isGamePlaying || this.currentEnergy < this.maxEnergy) return;

        this.currentEnergy = 0;
        this.skill2Icon.setTint(0x555555);
        this.updateEnergyBar();
        this.playSFX('sword');

        const aura = this.weaponGroup.create(this.player.x + 50, this.player.y - 60, 'item_skill2');
        aura.setBlendMode(Phaser.BlendModes.ADD);
        aura.body.allowGravity = false;
        aura.setVelocityX(1200);
        aura.setScale(3);
        aura.body.setSize(aura.width * 0.5, aura.height * 0.8);
        aura.body.setOffset(aura.width * 0.25, aura.height * 0.1);

        this.tweens.add({
            targets: aura,
            scaleX: 3,
            scaleY: 3,
            duration: 250,
            ease: 'Power2'
        });

        this.time.addEvent({
            delay: 30,
            repeat: 15,
            callback: () => {
                if (!aura.active) return;

                const ghost = this.add.sprite(aura.x, aura.y, 'item_skill2');
                ghost.setBlendMode(Phaser.BlendModes.ADD);
                ghost.setScale(aura.scaleX, aura.scaleY);
                ghost.setAlpha(0.6);
                ghost.setDepth(29);

                this.tweens.add({
                    targets: ghost,
                    scaleX: 0.1,
                    scaleY: 0.1,
                    alpha: 0,
                    duration: 350,
                    ease: 'Sine.easeOut',
                    onComplete: () => ghost.destroy()
                });
            }
        });

        if (this.boss) {
            let auraCollider = this.physics.add.overlap(aura, this.boss, () => {
                auraCollider.destroy();

                this.tweens.add({
                    targets: aura,
                    scaleX: 3.5,
                    scaleY: 3.5,
                    alpha: 0,
                    duration: 150,
                    onComplete: () => aura.destroy()
                });

                this.weaponHitBoss();
            }, null, this);
        }
    }

    weaponHitObstacle(aura, obstacle) {
        if (obstacle.texture.key !== 'item_extraATK') {
            this.playSFX('swordhit');
            obstacle.destroy();
        }
    }

    weaponHitBoss() {
        if (this.bossHP <= 0) return;

        this.bossHP -= 25;

        if (this.bossHpMask) {
            this.tweens.addCounter({
                from: this.lastBossHP,
                to: this.bossHP,
                duration: 200,
                ease: 'Power2',
                onUpdate: (tween) => this.updateBossHPBar(tween.getValue())
            });
            this.lastBossHP = this.bossHP;
        }

        this.playSFX('swordhit');

        if (this.boss && this.boss.active) {
            this.boss.setTintFill(0xffffff);
            this.time.delayedCall(150, () => {
                if (this.boss && this.boss.active) this.boss.clearTint();
            });
        }

        this.cameras.main.shake(200, 0.01);

        if (this.bossHP <= 0) {
            this.bossHP = 0;
            this.triggerWinSequence();
        }
    }

    summonAIPhantom() {
        if (!this.boss || !this.boss.active) return;

        const spawnX = this.boss.x - 120;
        const spawnY = this.boss.y;

        const phantom = this.physics.add.sprite(spawnX, spawnY, 'AI_support');
        phantom.setOrigin(0.5, 1);
        phantom.setScale(0.7);
        phantom.setDepth(19);
        phantom.body.allowGravity = false;
        phantom.setTint(0x00ffff);
        phantom.hasHit = false;
        phantom.play('AI_support');

        phantom.on('animationupdate', (anim, frame) => {
            if (frame.index === 6 && !phantom.hasHit) {
                phantom.hasHit = true;
                this.phantomHitBoss(phantom);
            }
        });

        phantom.on('animationcomplete', () => {
            this.tweens.add({
                targets: phantom,
                alpha: 0,
                duration: 150,
                onComplete: () => phantom.destroy()
            });
        });
    }

    phantomHitBoss(phantom) {
        if (this.bossHP <= 0) return;

        this.bossHP -= 10;
        if (this.bossHP < 0) this.bossHP = 0;

        if (this.bossHpMask) {
            this.tweens.addCounter({
                from: this.lastBossHP,
                to: this.bossHP,
                duration: 200,
                ease: 'Power2',
                onUpdate: (tween) => this.updateBossHPBar(tween.getValue())
            });
            this.lastBossHP = this.bossHP;
        }

        this.playSFX('punch');

        if (this.boss && this.boss.active) {
            this.boss.setTintFill(0xffffff);
            this.time.delayedCall(150, () => {
                if (this.boss && this.boss.active) this.boss.clearTint();
            });
        }
        this.cameras.main.shake(150, 0.005);

        if (this.bossHP <= 0) {
            this.bossHP = 0;
            this.triggerWinSequence();
        }
    }

    updatePlayerHPBar(hp) {
        if (!this.playerHpMask) return;
        const percentage = Math.max(0, hp / this.playerMaxHP);
        const w = 420 * percentage;

        this.playerHpMask.clear();
        this.playerHpMask.fillStyle(0xffffff, 1);
        this.playerHpMask.fillRect(90, 40, w, 40);

        if (this.playerHpText) {
            this.playerHpText.setText(`${Math.round(hp)} / 100`);
        }
    }

    updateBossHPBar(hp) {
        if (!this.bossHpMask) return;
        if (hp === undefined) hp = this.bossHP;
        if (hp <= 0) hp = 0;

        const percentage = Math.max(0, hp / this.bossMaxHP);
        const w = 420 * percentage;
        const startX = 1110 - w;

        this.bossHpMask.clear();
        this.bossHpMask.fillStyle(0xffffff, 1);
        this.bossHpMask.fillRect(startX, 40, w, 40);
    }

    triggerWinSequence() {
        if (this.typeTimer) {
            this.typeTimer.remove();
        }
        this.isTyping = false;
        this.dialogText.setText('');
        this.isDashing = false;
        this.isDashJumping = false;
        if (this.dashPhase1) this.dashPhase1.stop();
        if (this.dashPhase2) this.dashPhase2.stop();
        this.toggleWorldSpeed(false);
        this.isLevelCleared = true;
        this.isGamePlaying = false;

        this.obstacleGroup.clear(true, true);
        this.itemGroup.clear(true, true);
        this.weaponGroup.clear(true, true);

        this.skill1Icon.setTint(0x555555);
        this.skill2Icon.setTint(0x555555);
        this.currentEnergy = 0;
        this.updateEnergyBar();

        this.player.anims.stop();
        this.player.setTexture('player_stand');

        this.isEndingDialog = true;
        this.storyData = [
            { name: '法老王', text: '同學你不差嘛...竟然撐過了我的『死當風暴』...' },
            { name: '法老王', text: '那恭喜你通過了考驗，暫時免於被當的命運。' },
            { name: '法老王', text: '繼續往前吧！後面的教授可沒我這麼好說話。' }
        ];
        this.currentDialogIndex = 0;

        this.input.on('pointerdown', this.handleDialogClick, this);

        this.dialogContainer.setAlpha(1);
        this.dialogContainer.setVisible(true);
        this.showNextDialog();
    }

    updateEnergyBar() {
        this.energyRing.clear();
        if (this.currentEnergy === 0) return;

        const skill2X = 1120;
        const skill2Y = 510;
        const radius = 38;

        const startAngle = Phaser.Math.DegToRad(-90);
        const percentage = this.currentEnergy / this.maxEnergy;
        const endAngle = startAngle + (Phaser.Math.PI2 * percentage);

        this.energyRing.lineStyle(5, 0x00ffff, 1);
        this.energyRing.beginPath();
        this.energyRing.arc(skill2X, skill2Y, radius, startAngle, endAngle, false);
        this.energyRing.strokePath();

        if (this.currentEnergy >= this.maxEnergy) {
            this.energyRing.lineStyle(2, 0xffffff, 1);
            this.energyRing.beginPath();
            this.energyRing.arc(skill2X, skill2Y, radius + 3, 0, Phaser.Math.PI2, false);
            this.energyRing.strokePath();
        }
    }

    startItemSpawner() {
        if (!this.isGamePlaying) return;
        this.time.addEvent({
            delay: 5000,
            loop: true,
            callback: () => {
                if (!this.isGamePlaying) return;

                const screenHeight = this.cameras.main.height;
                const minY = screenHeight * 0.25;
                const maxY = this.horizonY - 50;

                const randomY = Phaser.Math.Between(minY, maxY);
                const spawnX = this.cameras.main.width + 50;

                const credit = this.itemGroup.create(spawnX, randomY, 'item_credit');
                credit.setScale(0.3);
                credit.body.allowGravity = false;
                
                const dashMultiplier = this.isDashing ? 1.5 : 1;
                credit.setVelocityX(-400 * dashMultiplier);

                this.tweens.add({
                    targets: credit,
                    y: randomY - 15,
                    duration: 800,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });
    }

    startBallSpawner() {
        if (!this.isGamePlaying) return;
        this.time.addEvent({
            delay: 15000,
            loop: true,
            callback: () => {
                if (!this.isGamePlaying) return;

                const screenHeight = this.cameras.main.height;
                const minY = screenHeight * 0.25;
                const maxY = this.horizonY - 50;
                const randomY = Phaser.Math.Between(minY, maxY);
                const spawnX = this.cameras.main.width + 50;

                const ball = this.itemGroup.create(spawnX, randomY, 'item_ball');
                this.playSFX('powerup');
                ball.body.allowGravity = false;
                ball.setScale(0.3);
                const dashMultiplier = this.isDashing ? 1.5 : 1;
                ball.setVelocityX(-400 * dashMultiplier);

                this.tweens.add({
                    targets: ball,
                    y: randomY - 15,
                    duration: 800,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });
    }

    executeDash() {
        this.isDashing = true;
        this.playSFX('dash');
        this.toggleWorldSpeed(true);

        const originalX = this.player.x;
        const origScaleX = 0.3;
        const origScaleY = 0.3;

        this.dashPhase1 = this.tweens.add({
            targets: this.player, x: originalX + 120, scaleX: origScaleX * 1.2, scaleY: origScaleY * 0.9, angle: 15, duration: 150, ease: 'Expo.easeOut',
            onComplete: () => {
                if (this.isDashJumping) return;
                this.dashPhase2 = this.tweens.add({
                    targets: this.player, x: originalX, scaleX: origScaleX, scaleY: origScaleY, angle: 0, duration: 250, ease: 'Sine.easeOut',
                    onComplete: () => {
                        if (this.isDashJumping) return;
                        this.isDashing = false;
                        this.toggleWorldSpeed(false);
                        this.startDashCooldown();
                    }
                });
            }
        });

        if (this.dashTrailTimer) this.dashTrailTimer.remove();
        this.dashTrailTimer = this.time.addEvent({
            delay: 30, repeat: 12,
            callback: () => { if (!this.isDashJumping) this.createDashTrail(); }
        });
    }

    createDashTrail() {
        const trail = this.add.sprite(this.player.x - 50, this.player.y, this.player.texture.key);
        trail.setOrigin(0.5, 1);
        trail.setScale(this.player.scaleX, this.player.scaleY);
        trail.angle = this.player.angle;
        trail.setTint(0x00ffff); trail.setAlpha(0.4); trail.setDepth(this.player.depth - 1);
        this.tweens.add({ targets: trail, alpha: 0, scaleX: trail.scaleX * 1.1, duration: 400, onComplete: () => trail.destroy() });
    }

    triggerDashJump() {
        if (this.isDashing) {
            this.isDashJumping = true;
            if (this.dashPhase1) this.dashPhase1.stop();
            if (this.dashPhase2) this.dashPhase2.stop();
            this.player.angle = 15;
            this.player.scaleX = 0.3 * 1.2;
            this.player.scaleY = 0.3 * 0.9;
            this.toggleWorldSpeed(true);
            if (this.dashTrailTimer) this.dashTrailTimer.remove();
            this.dashTrailTimer = this.time.addEvent({ delay: 30, repeat: -1, callback: () => this.createDashTrail() });
        }
    }

    endDashJump() {
        this.isDashJumping = false;
        this.isDashing = false;
        this.toggleWorldSpeed(false);
        if (this.dashTrailTimer) this.dashTrailTimer.remove();
        this.startDashCooldown();
        this.tweens.add({ targets: this.player, x: 100, scaleX: 0.3, scaleY: 0.3, angle: 0, duration: 250, ease: 'Sine.easeOut' });
    }

    startDashCooldown() {
        this.isDashOnCD = true;
        this.time.delayedCall(250, () => { this.isDashOnCD = false; });
    }

    toggleWorldSpeed(isSpeedingUp) {
        const factor = isSpeedingUp ? 1.5 : (1 / 1.5);
        this.obstacleGroup.getChildren().forEach(obs => {
            if (obs && obs.active && obs.body && !obs.isHoming) {
                obs.body.velocity.x *= factor;
                obs.body.velocity.y *= factor;
            }
        });
        if (this.itemGroup) {
            this.itemGroup.getChildren().forEach(item => {
                if (item && item.active && item.body) {
                    item.body.velocity.x *= factor;
                    item.body.velocity.y *= factor;
                }
            });
        }
    }

    startAutoHeal() {
        this.healTimer = this.time.addEvent({
            delay: 2000,
            repeat: -1,
            callback: () => {
                if (this.isGamePlaying && this.playerHP > 0 && this.playerHP < this.playerMaxHP) {
                    this.playerHP = Math.min(this.playerHP + 2, this.playerMaxHP);

                    if (this.playerHpMask) {
                        this.tweens.addCounter({
                            from: this.lastPlayerHP,
                            to: this.playerHP,
                            duration: 200,
                            ease: 'Power2',
                            onUpdate: (tween) => this.updatePlayerHPBar(tween.getValue())
                        });
                        this.lastPlayerHP = this.playerHP;
                    }
                }
            }
        });
    }

    collectItem(player, item) {
        if (!item.active) return;

        if (item.texture.key === 'item_credit') {
            this.playSFX('point');
            item.destroy();

            if (this.currentEnergy < this.maxEnergy) {
                this.currentEnergy++;
                this.updateEnergyBar();

                this.tweens.add({ targets: player, tint: 0x00ffff, duration: 100, yoyo: true });
                this.time.delayedCall(100, () => player.clearTint());

                if (this.currentEnergy >= this.maxEnergy) {
                    this.skill2Icon.clearTint();
                    const fullText = this.add.text(this.player.x, this.player.y - 80, 'ENERGY FULL!', {
                        fontSize: '20px', fill: '#00ffff', fontFamily: '"DotGothic16", sans-serif', fontStyle: 'bold'
                    }).setOrigin(0.5);
                    this.tweens.add({
                        targets: fullText, y: this.player.y - 120, alpha: 0, duration: 1000, onComplete: () => fullText.destroy()
                    });
                }
            } else {
                this.tweens.add({ targets: player, tint: 0xffffff, duration: 100, yoyo: true });
                this.time.delayedCall(100, () => player.clearTint());
            }
        }
        else if (item.texture.key === 'item_ball') {
            this.playSFX('powerup');
            item.destroy();
            this.summonAIPhantom();
        }
    }

    togglePauseMenu() {
        if (this.playerHP <= 0 || this.isLevelCleared || this.isItemTutorialActive || this.isHealthTutActive) return;
        if (this.volumeContainer) return;
        
        if (this.isPaused) {
            this.isPaused = false;
            this.time.paused = false;

            if (this.wasGamePlaying) {
                this.isGamePlaying = true;
            }

            this.physics.resume();
            this.tweens.resumeAll();
            if (this.boss) this.boss.anims.resume();
            if (this.player) this.player.anims.resume();

            if (this.pauseContainer) {
                this.pauseContainer.destroy();
                this.pauseContainer = null;
            }
        } else {
            this.isPaused = true;
            this.wasGamePlaying = this.isGamePlaying;
            this.isGamePlaying = false;
            
            this.time.paused = true;

            this.physics.pause();
            this.tweens.pauseAll();
            if (this.boss) this.boss.anims.pause();
            if (this.player) this.player.anims.pause();

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

            bg.on('pointerover', () => { this.playSFX('btn_hover'); draw(true); txt.setFill('#ff0000'); txt.setShadow(0, 0, '#ff0000', 10); this.input.setDefaultCursor('pointer'); });
            bg.on('pointerout', () => { draw(false); txt.setFill('#880000'); txt.setShadow(0, 0, 'transparent', 0); this.input.setDefaultCursor('default'); container.setScale(1); });
            bg.on('pointerdown', () => { this.playSFX('btn_click'); container.setScale(0.95); });
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
            this.playSFX('btn_click');
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

    gameOver() {
        if (!this.isGamePlaying) return;
        this.playSFX('gameover');

        this.isGamePlaying = false;
        this.isBossAttacking = false;
        this.player.anims.pause();
        this.physics.pause(); 

        this.add.rectangle(this.centerX, this.centerY, 1200, 600, 0x000000, 0.85).setDepth(300);

        const deadTitle = this.add.text(this.centerX, this.centerY - 80, 'YOU DIED', {
            fontSize: '80px', fill: '#ff0000', fontFamily: '"DotGothic16", sans-serif', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(301);
        deadTitle.setShadow(0, 0, '#ff0000', 20); 

        this.add.text(this.centerX, this.centerY - 10, '被法老王當掉了...', {
            fontSize: '36px', fill: '#ff3333', fontFamily: '"DotGothic16", sans-serif'
        }).setOrigin(0.5).setDepth(301);

        const btnY = this.centerY + 100;
        const width = 280;
        const height = 65;
        const gap = 40; 

        const leftBtnX = this.centerX - (width / 2) - (gap / 2);
        const rightBtnX = this.centerX + (width / 2) + (gap / 2);

        const createCyberButton = (x, y, textLabel, callback) => {
            const btnContainer = this.add.container(x, y).setDepth(301);
            const bg = this.add.graphics();

            const drawBtn = (isHover) => {
                bg.clear();
                bg.fillStyle(isHover ? 0x4a0000 : 0x1f0000, 1);

                const cut = 15; 
                bg.beginPath();
                bg.moveTo(-width / 2 + cut, -height / 2);
                bg.lineTo(width / 2, -height / 2);
                bg.lineTo(width / 2, height / 2 - cut);
                bg.lineTo(width / 2 - cut, height / 2);
                bg.lineTo(-width / 2, height / 2);
                bg.lineTo(-width / 2, -height / 2 + cut);
                bg.closePath();
                bg.fillPath();

                bg.lineStyle(2, isHover ? 0xff3333 : 0x880000, 1);
                bg.beginPath();
                bg.moveTo(-width / 2 + cut, -height / 2);
                bg.lineTo(width / 2, -height / 2);
                bg.lineTo(width / 2, height / 2 - cut);
                bg.lineTo(width / 2 - cut, height / 2);
                bg.lineTo(-width / 2, height / 2);
                bg.lineTo(-width / 2, -height / 2 + cut);
                bg.closePath();
                bg.strokePath();
            };

            drawBtn(false);

            const txt = this.add.text(0, 0, textLabel, {
                fontSize: '26px', fill: '#880000', fontFamily: '"DotGothic16", serif', padding: 10
            }).setOrigin(0.5);
            const l = this.add.text(-width / 2 + 20, 0, '< >', {
                fontSize: '20px', fill: '#880000', fontFamily: '"DotGothic16", monospace'
            }).setOrigin(0, 0.5);
            const r = this.add.text(width / 2 - 20, 0, '</>', {
                fontSize: '20px', fill: '#880000', fontFamily: '"DotGothic16", monospace'
            }).setOrigin(1, 0.5);

            btnContainer.add([bg, l, r, txt]);

            bg.setInteractive(new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height), Phaser.Geom.Rectangle.Contains);

            bg.on('pointerover', () => {
                this.playSFX('btn_hover');
                drawBtn(true);
                txt.setFill('#ff0000');
                txt.setShadow(0, 0, '#ff0000', 10);
                l.setFill('#fff'); r.setFill('#fff');
                this.input.setDefaultCursor('pointer');
            });

            bg.on('pointerout', () => {
                drawBtn(false);
                txt.setFill('#880000');
                txt.setShadow(0, 0, 'transparent', 0);
                l.setFill('#880000'); r.setFill('#880000');
                this.input.setDefaultCursor('default');
                btnContainer.setScale(1);
            });

            bg.on('pointerdown', () => {
                this.playSFX('btn_click');
                btnContainer.setScale(0.95); 
            });

            bg.on('pointerup', () => {
                btnContainer.setScale(1);
                this.input.setDefaultCursor('default');
                callback(); 
            });
        };

        createCyberButton(leftBtnX, btnY, '重新挑戰', () => {
            this.scene.restart();
        });

        createCyberButton(rightBtnX, btnY, '回到主選單', () => {
            this.sound.stopAll();
            this.scene.start('MainMenu');
        });
    }

    setupDialogUI() {
        const boxX = 600, boxY = 480, w = 1000, h = 150;
        this.dialogContainer = this.add.container(boxX, boxY);
        this.dialogContainer.setDepth(100);

        this.dialogBg = this.add.graphics();
        this.dialogBg.fillStyle(0x0a0000, 0.9);
        this.drawCustomBox(this.dialogBg, -w / 2, -h / 2, w, h, 20); this.dialogBg.fillPath();
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
        this.input.on('pointerdown', this.handleDialogClick, this);
    }

    handleDialogClick() {
        if (this.isGamePlaying || this.isItemTutorialActive || this.isPaused) return;

        if (this.isTyping) {
            this.completeDialog();
        } else {
            this.currentDialogIndex++;
            this.showNextDialog();
        }
    }

    drawCustomBox(g, x, y, w, h, s) {
        g.beginPath();
        g.moveTo(x + s, y); g.lineTo(x + w, y); g.lineTo(x + w, y + h - s);
        g.lineTo(x + w - s, y + h); g.lineTo(x, y + h); g.lineTo(x, y + s);
        g.closePath();
    }

    drawCyberBar(graphics, x, y, width, height, slant, isFill, fillColor, borderColor) {
        graphics.beginPath();
        graphics.moveTo(x + slant, y);
        graphics.lineTo(x + width + slant, y);
        graphics.lineTo(x + width, y + height);
        graphics.lineTo(x, y + height);
        graphics.closePath();

        if (isFill) {
            graphics.fillStyle(fillColor, 1);
            graphics.fillPath();
        } else {
            graphics.fillStyle(0x110000, 1);
            graphics.fillPath();

            graphics.lineStyle(2, borderColor, 1); 
            graphics.strokePath();
        }
    }

    showNextDialog() {
        if (this.currentDialogIndex < this.storyData.length) {
            const data = this.storyData[this.currentDialogIndex];

            if (this.currentDialogIndex === 6) {
                this.tweens.add({
                    targets: this.boss,
                    alpha: 1,
                    duration: 800,
                    ease: 'Linear'
                });
                this.cameras.main.shake(300, 0.005);
                this.playSFX('bossappear');
            }

            const specialCharacters = ["YOU", "法老王", "？？？"];
            const shouldShowNameTag = specialCharacters.includes(data.name);

            this.nameTag.setVisible(shouldShowNameTag);
            this.nameText.setVisible(shouldShowNameTag);
            this.nameText.setText(data.name || "");

            this.nextIcon.setVisible(false);
            this.typeText(data.text);
            this.playSFX('btn_hover');
        } else {
            this.input.off('pointerdown', this.handleDialogClick, this);
            this.tweens.add({
                targets: this.dialogContainer, alpha: 0, duration: 500,
                onComplete: () => {
                    this.dialogContainer.setVisible(false);

                    if (this.isEndingDialog) {
                        this.playBossOutro();
                    } else {
                        this.startStartCountdown();
                    }
                }
            });
        }
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

    playBossOutro() {
        this.playSFX('disappear1'); 
        this.tweens.add({
            targets: this.boss,
            y: this.boss.y - 200,
            duration: 3000, 
            ease: 'Sine.easeInOut',
            onComplete: () => {
                let blinkCount = 0;
                this.time.addEvent({
                    delay: 150,
                    repeat: 9, 
                    callback: () => {
                        this.boss.setVisible(!this.boss.visible);
                        blinkCount++;
                        if (blinkCount === 10) {
                            this.boss.destroy(); 
                            this.time.delayedCall(500, () => {
                                this.showLevelClearUI(); 
                            });
                        }
                    }
                });
            }
        });
    }

    showLevelClearUI() {
        this.playSFX('level_complete');
        const uiGroup = this.add.container(this.centerX, this.centerY).setDepth(100).setScrollFactor(0);

        const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.85);
        uiGroup.add(bg);

        const title = this.add.text(0, -50, 'SYSTEM OVERRIDE...\n>> STAGE 1 CLEARED <<', {
            fontSize: '42px',
            fill: '#ff3333', 
            fontFamily: '"DotGothic16", sans-serif',
            align: 'center'
        }).setOrigin(0.5);
        title.setShadow(0, 0, '#ff0000', 10); 
        uiGroup.add(title);

        const btnW = 340, btnH = 75;
        const btnX = 0, btnY = 60;

        const btnContainer = this.add.container(btnX, btnY);
        const btnBg = this.add.graphics();

        const drawBtn = (isHover) => {
            btnBg.clear();
            btnBg.fillStyle(isHover ? 0x4a0000 : 0x1f0000, 1);
            this.drawCustomBox(btnBg, -btnW / 2, -btnH / 2, btnW, btnH, 15);
            btnBg.fillPath();

            btnBg.lineStyle(2, isHover ? 0xff3333 : 0x880000, 1);
            this.drawCustomBox(btnBg, -btnW / 2, -btnH / 2, btnW, btnH, 15);
            btnBg.strokePath();
        };

        drawBtn(false);

        const btnText = this.add.text(0, 0, '前往第二關', {
            fontSize: '28px', fill: '#880000', fontFamily: '"DotGothic16", serif'
        }).setOrigin(0.5);

        const l = this.add.text(-btnW / 2 + 30, 0, '< >', {
            fontSize: '24px', fill: '#880000', fontFamily: '"DotGothic16", monospace'
        }).setOrigin(0, 0.5);

        const r = this.add.text(btnW / 2 - 30, 0, '</>', {
            fontSize: '24px', fill: '#880000', fontFamily: '"DotGothic16", monospace'
        }).setOrigin(1, 0.5);

        btnContainer.add([btnBg, l, r, btnText]);
        uiGroup.add(btnContainer);

        const hitArea = new Phaser.Geom.Rectangle(-btnW / 2, -btnH / 2, btnW, btnH);
        btnBg.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

        btnBg.on('pointerover', () => {
            this.playSFX('btn_hover');
            drawBtn(true);
            btnText.setFill('#ff0000');
            btnText.setShadow(0, 0, '#ff0000', 10);
            l.setFill('#ffffff');
            r.setFill('#ffffff');
            this.input.setDefaultCursor('pointer');
        });

        btnBg.on('pointerout', () => {
            drawBtn(false);
            btnText.setFill('#880000');
            btnText.setShadow(0, 0, 'transparent', 0);
            l.setFill('#880000');
            r.setFill('#880000');
            this.input.setDefaultCursor('default');
            btnContainer.setScale(1);
        });

        btnBg.on('pointerdown', () => {
            this.playSFX('btn_click');
            btnContainer.setScale(0.95);
        });

        btnBg.on('pointerup', () => {
            btnContainer.setScale(1);
            this.input.setDefaultCursor('default');
            this.scene.start('StageTitleScene', {
                nextSceneKey: 'LevelScene2',
                stageNumStr: '第二關',
                stageNameStr: '漁夫帽老頭的死亡凝視'
            });
        });
    }

    completeDialog() {
        if (this.typeTimer) this.typeTimer.remove();
        this.dialogText.setText(this.storyData[this.currentDialogIndex].text);
        this.isTyping = false;
        this.nextIcon.setVisible(true);
    }

    setupUI() {
        this.uiContainer = this.add.container(0, 0);
        this.uiContainer.setDepth(90);
        this.uiContainer.setScrollFactor(0);

        const uiGraphics = this.add.graphics().setDepth(90).setScrollFactor(0);

        const playerBg = this.add.circle(60, 60, 40, 0x440000).setDepth(88).setScrollFactor(0);
        this.uiContainer.add(playerBg);

        const playerAvatar = this.add.image(60, 60, 'player_avatar').setDepth(89).setScrollFactor(0);
        playerAvatar.setScale(80 / 224);
        
        const playerMaskShape = this.make.graphics();
        playerMaskShape.fillStyle(0xffffff);
        playerMaskShape.fillCircle(60, 60, 40);
        const playerMask = playerMaskShape.createGeometryMask();
        playerAvatar.setMask(playerMask);
        this.uiContainer.add(playerAvatar);

        uiGraphics.lineStyle(4, 0x880000, 1);
        uiGraphics.strokeCircle(60, 60, 40);

        this.drawCyberBar(uiGraphics, 110, 45, 380, 30, 20, false, null, 0x880000);

        const playerFill = this.add.graphics().setDepth(90).setScrollFactor(0);
        this.drawCyberBar(playerFill, 110, 45, 380, 30, 20, true, 0xff2222);

        this.playerHpMask = this.add.graphics().setVisible(false);
        playerFill.setMask(this.playerHpMask.createGeometryMask());


        const bossBg = this.add.circle(1140, 60, 40, 0x440000).setDepth(88).setScrollFactor(0);
        this.uiContainer.add(bossBg);

        const bossAvatar = this.add.image(1140, 60, 'pharaoh_avatar').setDepth(89).setScrollFactor(0);
        bossAvatar.setScale(80 / 224);

        const bossMaskShape = this.make.graphics();
        bossMaskShape.fillStyle(0xffffff);
        bossMaskShape.fillCircle(1140, 60, 40);
        const bossMask = bossMaskShape.createGeometryMask();
        bossAvatar.setMask(bossMask);
        this.uiContainer.add(bossAvatar);

        uiGraphics.lineStyle(4, 0x880000, 1);
        uiGraphics.strokeCircle(1140, 60, 40);

        this.drawCyberBar(uiGraphics, 710, 45, 380, 30, -20, false, null, 0x880000);

        const bossFill = this.add.graphics().setDepth(90).setScrollFactor(0);
        this.drawCyberBar(bossFill, 710, 45, 380, 30, -20, true, 0xff2222);

        this.bossHpMask = this.add.graphics().setVisible(false);
        bossFill.setMask(this.bossHpMask.createGeometryMask());

        const skillY = 510;
        const skill1X = 1020;
        const skill1Bg = this.add.graphics();
        skill1Bg.fillStyle(0x000000, 0.6); skill1Bg.fillCircle(skill1X, skillY, 35);
        skill1Bg.lineStyle(2, 0x888888, 1); skill1Bg.strokeCircle(skill1X, skillY, 35);
        this.uiContainer.add(skill1Bg);
        this.skill1Icon = this.add.image(skill1X, skillY, 'item_skill1').setDisplaySize(45, 45).setDepth(91).setScrollFactor(0);
        this.skill1Icon.setInteractive({ useHandCursor: true });
        this.skill1Icon.on('pointerdown', () => this.activateSkill1());
        this.uiContainer.add(this.skill1Icon);
        this.skill1CDText = this.add.text(skill1X, skillY, '', { fontSize: '26px', fill: '#ff4444', fontFamily: '"DotGothic16", sans-serif', fontStyle: 'bold', stroke: '#000000', strokeThickness: 4 }).setOrigin(0.5).setDepth(92).setScrollFactor(0);
        this.uiContainer.add(this.skill1CDText);

        const skill2X = 1120;
        const skill2Bg = this.add.graphics();
        skill2Bg.fillStyle(0x000000, 0.6); skill2Bg.fillCircle(skill2X, skillY, 35);
        skill2Bg.lineStyle(4, 0x333333, 1); skill2Bg.strokeCircle(skill2X, skillY, 38);
        this.uiContainer.add(skill2Bg);
        this.skill2Icon = this.add.image(skill2X, skillY, 'item_skill2').setDisplaySize(45, 45).setDepth(91).setScrollFactor(0);
        this.skill2Icon.setTint(0x555555);
        this.skill2Icon.setInteractive({ useHandCursor: true });
        this.skill2Icon.on('pointerdown', () => this.activateSkill2());
        this.uiContainer.add(this.skill2Icon);

        this.energyRing = this.add.graphics().setDepth(92).setScrollFactor(0);
        this.uiContainer.add(this.energyRing);

        this.lastPlayerHP = 100;
        this.lastBossHP = 100;
        this.updateEnergyBar();
        this.updatePlayerHPBar(100);
        this.updateBossHPBar(100);
    }

    startStartCountdown() {
        if (this.boss) {
            this.boss.setAlpha(1);
        }
        const countdownMask = this.add.rectangle(this.centerX, this.centerY, 1200, 600, 0x000000, 0.6);
        countdownMask.setDepth(50);
        this.playSFX('countdown');

        let countNum = 3;
        const countdownText = this.add.text(this.centerX, this.centerY, countNum.toString(), {
            fontSize: '120px', fill: '#ff3333', fontFamily: '"DotGothic16", sans-serif', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(51);

        this.tweens.add({ targets: countdownText, scale: { from: 1.5, to: 1 }, duration: 200 });

        this.countdownTimer = this.time.addEvent({
            delay: 1000, repeat: 4,
            callback: () => {
                countNum--;

                if (countNum > 0) {
                    countdownText.setText(countNum.toString());
                    this.tweens.add({ targets: countdownText, scale: { from: 1.5, to: 1 }, duration: 200 });
                }
                else if (countNum === 0) {
                    countdownText.setText('START!!');
                    countdownText.setFill('#ff3333');
                    this.tweens.add({ targets: countdownText, scale: { from: 2, to: 1 }, duration: 200 });
                }
                else {
                    this.countdownTimer.remove();
                    this.tweens.add({
                        targets: [countdownMask, countdownText], alpha: 0, duration: 300,
                        onComplete: () => {
                            countdownMask.destroy();
                            countdownText.destroy();
                            this.startHealthBarTutorialSequence();
                        }
                    });
                }
            }
        });
    }

    createFloatingTutorial(x, y, text) {
        const boxW = 560, boxH = 80;
        const container = this.add.container(x, y);
        container.setDepth(95);

        const tutBox = this.add.graphics();
        tutBox.fillStyle(0x110000, 0.9);
        tutBox.fillRect(-boxW / 2, 0, boxW, boxH);
        tutBox.lineStyle(2, 0xff0000, 1);
        tutBox.strokeRect(-boxW / 2, 0, boxW, boxH);

        const tutText = this.add.text(0, boxH / 2, text, {
            fontSize: '22px', fill: '#ffffff', fontFamily: '"DotGothic16", sans-serif', align: 'center'
        }).setOrigin(0.5);

        const tutArrow = this.add.text(0, -30, '▲', { fontSize: '50px', fill: '#ff0000' }).setOrigin(0.5);
        container.add([tutBox, tutText, tutArrow]);

        this.tweens.add({ targets: tutArrow, y: -20, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        return container;
    }

    startHealthBarTutorialSequence() {
        this.isHealthTutActive = true;
        this.healthTutStep = 1;
        if (this.boss) {
            this.boss.anims.pause();
        }
        this.healthMask = this.add.rectangle(this.centerX, this.centerY, 1200, 600, 0x000000, 0.6).setDepth(85);
        this.currentTutBubble = this.createFloatingTutorial(360, 130, '這是你的血量，每兩秒會回2點血，但歸零就會死！\n(點擊畫面繼續)');
        this.input.on('pointerdown', this.handleHealthTutClick, this);
    }

    handleHealthTutClick() {
        if (!this.isHealthTutActive) return;

        if (this.healthTutStep === 1) {
            this.currentTutBubble.destroy();
            this.healthTutStep = 2;
            this.currentTutBubble = this.createFloatingTutorial(890, 130, '這是BOSS的血量，將它歸零吧！\n(點擊畫面繼續)');
        }
        else if (this.healthTutStep === 2) {
            this.currentTutBubble.destroy();
            this.healthMask.destroy();
            this.isHealthTutActive = false;
            this.input.off('pointerdown', this.handleHealthTutClick, this);
            this.startItemTutorialSequence();
        }
    }

    setupItemTutorialUI() {
        this.itemTutContainer = this.add.container(this.centerX, this.centerY);
        this.itemTutContainer.setDepth(200);

        const mask = this.add.rectangle(0, 0, 1200, 600, 0x000000, 0.8);

        const boxW = 700, boxH = 340;
        const box = this.add.graphics();
        box.fillStyle(0x110000, 0.9);
        this.drawCustomBox(box, -boxW / 2, -boxH / 2, boxW, boxH, 20); box.fillPath();
        box.lineStyle(2, 0x00ffff, 1);
        this.drawCustomBox(box, -boxW / 2, -boxH / 2, boxW, boxH, 20); box.strokePath();

        this.itemTutImage = this.add.image(0, -60, 'item_credit').setDisplaySize(140, 140);

        this.itemTutTitle = this.add.text(0, 50, '', {
            fontSize: '28px', fill: '#00ffff', fontFamily: '"DotGothic16", sans-serif', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.itemTutDesc = this.add.text(0, 110, '', {
            fontSize: '20px', fill: '#cccccc', fontFamily: '"DotGothic16", sans-serif',
            wordWrap: { width: 640, useAdvancedWrap: true }, align: 'center', lineSpacing: 8
        }).setOrigin(0.5);

        this.itemTutPrompt = this.add.text(0, 150, '>> 點擊畫面繼續 (點左側可回上一步) <<', {
            fontSize: '18px', fill: '#00ffff', fontFamily: '"DotGothic16", sans-serif'
        }).setOrigin(0.5);
        this.tweens.add({ targets: this.itemTutPrompt, alpha: 0.2, duration: 600, yoyo: true, repeat: -1 });

        this.itemTutContainer.add([mask, box, this.itemTutImage, this.itemTutTitle, this.itemTutDesc, this.itemTutPrompt]);
        this.itemTutContainer.setVisible(false);
    }

    startItemTutorialSequence() {
        this.isItemTutorialActive = true;
        this.currentItemTutIndex = 0;
        this.itemTutContainer.setVisible(true);
        this.itemTutContainer.setAlpha(0);

        this.tweens.add({ targets: this.itemTutContainer, alpha: 1, duration: 300 });
        this.updateItemTutorialDisplay();
        this.input.on('pointerdown', this.handleItemTutorialClick, this);
    }

    updateItemTutorialDisplay() {
        const data = this.itemTutorialData[this.currentItemTutIndex];
        const isLast = (this.currentItemTutIndex === this.itemTutorialData.length - 1);

        this.itemTutImage.setTexture(data.key);
        this.itemTutTitle.setText(data.title || '');

        if (isLast) {
            this.itemTutImage.setVisible(false);
            this.itemTutTitle.setVisible(false);
            this.itemTutDesc.setStyle({ fontSize: '32px' });
            this.itemTutDesc.setText(data.text);
            this.itemTutDesc.setPosition(0, 0);
            this.itemTutDesc.setOrigin(0.5);
            if (this.itemTutPrompt) this.itemTutPrompt.setVisible(false);
        } else {
            this.itemTutImage.setVisible(true);
            this.itemTutTitle.setVisible(true);
            this.itemTutDesc.setStyle({ fontSize: '20px' });
            this.itemTutDesc.setText(data.text);
            this.itemTutDesc.setPosition(0, 110);
            this.itemTutDesc.setOrigin(0.5);
            if (this.itemTutPrompt) this.itemTutPrompt.setVisible(true);

            this.itemTutImage.setScale(0);
            this.tweens.add({
                targets: this.itemTutImage,
                scaleX: { value: 140 / this.itemTutImage.width, ease: 'Back.easeOut' },
                scaleY: { value: 140 / this.itemTutImage.height, ease: 'Back.easeOut' },
                duration: 400
            });
        }
    }

    handleItemTutorialClick(pointer) {
        if (!this.isItemTutorialActive) return;
        const clickX = pointer.x;
        const midX = this.cameras.main.centerX;

        if (clickX < midX) {
            if (this.currentItemTutIndex > 0) {
                this.currentItemTutIndex--;
                this.playSFX('btn_hover');
                this.updateItemTutorialDisplay();
            } else {
                this.playSFX('btn_hover');
            }
        } else {
            this.playSFX('btn_click');
            this.currentItemTutIndex++;

            if (this.currentItemTutIndex < this.itemTutorialData.length) {
                this.updateItemTutorialDisplay();
            } else {
                this.playSFX('btn_click');
                this.currentItemTutIndex++;

                if (this.currentItemTutIndex < this.itemTutorialData.length) {
                    this.updateItemTutorialDisplay();
                } else {
                    this.isItemTutorialActive = false;
                    this.input.off('pointerdown', this.handleItemTutorialClick, this);

                    this.tweens.add({
                        targets: this.itemTutContainer, alpha: 0, duration: 300,
                        onComplete: () => {
                            this.itemTutContainer.destroy();

                            this.isGamePlaying = true;

                            if (this.boss) {
                                this.boss.anims.resume();
                            }

                            this.player.clearTint();

                            this.player.play('run', true);

                            this.player.body.setSize(150, 350);
                            this.player.body.setOffset(50, 13);

                            this.player.setPosition(100, this.horizonY);

                            this.startBossAttacks();
                            this.startAutoHeal();
                            this.startItemSpawner();
                            this.startBallSpawner();
                        }
                    });
                }
            }
        }
    }

    setupPhysicsGround(horizonY) {
        this.physicsGround = this.physics.add.staticGroup();
        const groundObject = this.add.rectangle(600, horizonY + 5, 1200, 10, 0x000000, 0);
        this.physicsGround.add(groundObject);
    }

    setupPlayer(horizonY) {
        if (!this.anims.exists('run')) {
            this.anims.create({
                key: 'run',
                frames: this.anims.generateFrameNumbers('player_run', { start: 0, end: 7 }),
                frameRate: 15,
                repeat: -1
            });
        }
        if (!this.anims.exists('jump')) {
            this.anims.create({
                key: 'jump',
                frames: this.anims.generateFrameNumbers('player_jump', { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        }

        this.player = this.physics.add.sprite(100, horizonY, 'player_stand');
        this.player.setOrigin(0.5, 1);
        this.player.setScale(0.3);
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(20);

        this.player.body.setSize(150, 350);
        this.player.body.setOffset(50, 13);
    }

    setupBoss(horizonY) {
        const bossX = this.cameras.main.width - 150;
        const bossY = horizonY;

        this.boss = this.add.sprite(bossX, bossY, 'pharaoh_boss');
        this.boss.setOrigin(0.5, 1);
        this.boss.setDepth(15);
        this.boss.setScrollFactor(0);
        this.boss.setAlpha(0); 

        if (!this.anims.exists('boss_idle')) {
            this.anims.create({
                key: 'boss_idle',
                frames: this.anims.generateFrameNumbers('pharaoh_boss', { start: 0, end: 7 }),
                frameRate: 6,
                repeat: -1
            });
        }

        this.boss.anims.play('boss_idle');
        this.boss.setScale(0.25);

        this.physics.add.existing(this.boss);
        this.boss.body.allowGravity = false;
        this.boss.body.immovable = true; 

        this.bossMaxHP = 100;
        this.bossHP = 100;
    }

    setupEnvironment(horizonY) {
        this.bgLayer = this.add.tileSprite(0, 0, 1200, 600, 'main_bg');
        this.bgLayer.setOrigin(0, 0);
        this.bgLayer.setDepth(0); 
    }
}