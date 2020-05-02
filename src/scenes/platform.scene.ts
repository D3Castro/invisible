
import {
    // IBody,
    // ICursorKeys,
    // IRectangle,
    ISettingsConfig,
    Scene,
  } from '../lib';
  import Score from '../objects/score';
  import BombSpawner from '../objects/bomb-spawner';
  // import { getGameHeight, getGameWidth } from '../helpers';
  
  const sceneConfig: ISettingsConfig = {
    active: false,
    visible: false,
    key: 'Platform',
  };

  const SKY_KEY = 'sky';
  const GROUND_KEY = 'ground';
  const STAR_KEY = 'star';
  const PLAYER_KEY = 'player';
  const BOMB_KEY = 'bomb';
  
  export class PlatformScene extends Scene {
    private player: Phaser.Physics.Arcade.Sprite;

    private stars: Phaser.Physics.Arcade.Group;

    private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;

    private score: Score;

    private bombSpawner: BombSpawner;

    private gameOver = false;

    // private readonly platforms: Phaser.Physics.Arcade.StaticGroup; 
    
    constructor() {
      super(sceneConfig);
    }

    preload() {
      this.load.image(SKY_KEY, './src/assets/images/sky.png');
      this.load.image(GROUND_KEY, './src/assets/images/platform.png');
      this.load.image(STAR_KEY, './src/assets/images/star.png');
      this.load.image(BOMB_KEY, './src/assets/images/bomb.png');

      this.load.spritesheet(PLAYER_KEY, 
        './src/assets/images/dude.png',
        { frameWidth: 32, frameHeight: 48 }
      );
    }

    create() {
      // this.physics.world.setBounds(0, 0, getGameWidth(this), getGameHeight(this), true, true, true, true);
      this.add.image(400, 300, SKY_KEY);
      
      const platforms = this.createPlatforms();
      this.player = this.createPlayer();
      this.stars = this.createStars();

      this.score = this.createScoreLabel(16, 16, 0)

      this.bombSpawner = new BombSpawner(this, BOMB_KEY);
      const bombsGroup = this.bombSpawner.group;

      this.physics.add.collider(this.player, platforms);
      this.physics.add.collider(this.stars, platforms);
		  this.physics.add.collider(bombsGroup, platforms);
      this.physics.add.collider(this.player, bombsGroup, this.hitBomb, undefined, this);

      this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);

      this.cursorKeys = this.input.keyboard.createCursorKeys();
    }

    update() {
      if (this.gameOver) {
        this.scene.transition({
          target: "MainMenu",
          remove: true,
        });
      }

      if (this?.cursorKeys?.left?.isDown) {
        this.player.setVelocityX(-160);

        this.player.anims.play('left', true);
      }
      else if (this?.cursorKeys?.right?.isDown) {
        this.player.setVelocityX(160);

        this.player.anims.play('right', true);
      }
      else {
        this.player.setVelocityX(0);

        this.player.anims.play('turn');
      }

      if (this?.cursorKeys?.up?.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-330);
      }
    }

    createPlatforms() {
      const platforms = this.physics.add.staticGroup();

      platforms.create(400, 568, GROUND_KEY).setScale(2).refreshBody();
	
      platforms.create(600, 400, GROUND_KEY);
      platforms.create(50, 250, GROUND_KEY);
      platforms.create(750, 220, GROUND_KEY);

      return platforms;
    }

    createPlayer() {
      const player = this.physics.add.sprite(100, 450, PLAYER_KEY);
      player.setBounce(0.2);
      player.setCollideWorldBounds(true);

      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers(PLAYER_KEY, { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });
      
      this.anims.create({
        key: 'turn',
        frames: [ { key: PLAYER_KEY, frame: 4 } ],
        frameRate: 20
      });
      
      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers(PLAYER_KEY, { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
      });

      return player;
  }
  
  createStars() {
		const stars = this.physics.add.group({
			key: STAR_KEY,
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70 }
    });
		
		stars.children.iterate((child: any) => {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
		});

		return stars;
  }
  
  collectStar(player: any, star: any) {
    star.disableBody(true, true);
    
    this.score.add(10);

    if (this.stars.countActive(true) === 0) {
			//  A new batch of stars to collect
			this.stars.children.iterate((child: any) => {
				child.enableBody(true, child.x, 0, true, true);
			})
		}

		this.bombSpawner.spawn(player.x);
  }
  
  createScoreLabel(x: number, y: number, score: number) {
		const style = { fontSize: '32px', fill: '#000' };
		const label = new Score(this, x, y, score, style);

		this.add.existing(label);

		return label;
  }
  
  hitBomb(player: any, bomb: any) {
		this.physics.pause();

		player.setTint(0xff0000);

		player.anims.play('turn');

		this.gameOver = true;
	}
}
  