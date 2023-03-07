// phina.js をグローバル領域に展開
phina.globalize();
var SCREEN_X = screen.width;
var SCREEN_Y = screen.height;
let ASSETS = {
	image:{
		reman:"reman-jet.png",
		shot:"reman.png",
		space:"space.png",
		jet01:"e00.png",
		jet02:"e01.png",
		eyemon:"e03.png"
	}
};
//クラス

class Player {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.dx = x;
		this.dy = y;
		this.hp = 3;
		this.time = 0;
		this.shot_flg = true;
		this.play_flg = true;
	}

	move(dx,dy) {
		this.dx = dx;
		this.dy = dy;
    }
}
class Shot{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
	collision() {
		this.y = -SCREEN_Y*2;
		this.x = SCREEN_X * 2;
    }
	move(speed){
	this.y -= speed;
}
	
}
class Enemy{
	
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
	move(speed) {
    }
	collision(){
		this.y = SCREEN_Y*2;
		this.x = -SCREEN_X*2;
	}
}

class Jet01 extends Enemy{
	constructor(x,y){
		super(x,y);
	}
	move(speed){
		this.y += speed;
	}
}

class Jet02 extends Enemy{
	constructor(x,y){
		super(x, y);
		this.time = 0;
		this.direct = 1;
	}
	move(speed) {
		this.time++;
		this.y += speed;
		if (this.time % 20 == 0) this.direct *= -1;
			this.x += ((Math.random() * speed) + 10)*this.direct;
	}
}

class Eyemon extends Enemy{
	constructor(x,y){
		super(x, y);
		this.time = 0;
	}
	move(speed){
		this.y += speed / 2;
		this.x = Math.sin(this.time) * SCREEN_X / 2 + SCREEN_X/2;
		this.time += 0.05;
	}
}

class Back {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	move(speed) {
		this.y += speed;
    }
}
// MainScene クラスを定義
phina.define('MainScene', {
  superClass: 'DisplayScene',
	init: function (option) {
		this.superInit(option);
		// 背景色を指定
		this.backgroundColor = '#000';
		var score = 0;
		var size = SCREEN_X/20;
		//背景
		backs = new Back(2);
		imgBacks = new Array(2);
		var backWidth = SCREEN_X;
		var backHeight = SCREEN_Y + size;
		for (let i = 0; i < 2; i++) {
			backs[i] = new Back(SCREEN_X / 2, -SCREEN_Y / 2 + i * SCREEN_Y);
			imgBacks[i] = Sprite('space').addChildTo(this);
			imgBacks[i].setPosition(backs[i].x, backs[i].y);
			imgBacks[i].width = backWidth;
			imgBacks[i].height = backHeight;
        }
		//プレイヤー
		player = new Player(SCREEN_X / 2, SCREEN_Y/2);
		var remanjet = Sprite('reman').addChildTo(this);　// ('reman')内が指定したキー名に相当する
		imgHp = new Array(player.hp);
		for (let i = 0; i < player.hp; i++) {
			imgHp[i] = Sprite('reman').addChildTo(this);
			imgHp[i].width = size;
			imgHp[i].height = size;
			imgHp[i].setPosition(SCREEN_X - size * (i+1), SCREEN_Y - size);
        }
		remanjet.setPosition(player.x, player.y);
		remanjet.width = size*2;
		remanjet.height = size*2;

		//ショット
		var Nshot = 10;
		var interval = 0;
		shots = new Shot(Nshot);
		imgShots = new Array(Nshot);
		var shotWidth = size;
		var shotHeight = size;
		for (let i = 0; i < Nshot; i++) {
			shots[i] = new Shot(SCREEN_X*2, -SCREEN_Y*2);
			imgShots[i] = Sprite('shot').addChildTo(this);
			imgShots[i].setPosition(shots[i].x, shots[i].y);
			imgShots[i].width = shotWidth;
			imgShots[i].height = shotHeight;
		}
		//敵
		var Nenemy = 10;
		enemies = new Enemy(Nenemy);
		imgEnemies = new Array(Nenemy);
		var enemyWidth = size*2;
		var enemyHeight = size*2;
		for (let i = 0; i < Nenemy; i++) {
			enemies[i] = new Jet01((Math.random() * SCREEN_X / enemyWidth) * enemyWidth, -enemyHeight * 2 - (Math.random() * 3 / enemyHeight) * enemyHeight);
			imgEnemies[i] = Sprite('jet01').addChildTo(this);
			imgEnemies[i].setPosition(enemies[i].x, enemies[i].y);
			imgEnemies[i].width = enemyWidth;
			imgEnemies[i].height = enemyHeight;
		}

		//スコア
		var scoreLabel = Label({
			text: score + '',
			fontSize: 48,
			fill: 'white',
		}).addChildTo(this);
		scoreLabel.setPosition(48, 48);

		// 動かす処理
		for (let i = 0; i < 2; i++) {
			imgBacks[i].update = function () {
				this.setPosition(backs[i].x, backs[i].y);
			}
        }
		remanjet.update = function () {
			remanjet.setPosition(player.x, player.y);
			if (player.time > 0) remanjet.alpha = 0.5;
			else remanjet.alpha = 1.0;
		}
		
		for (let i = 0; i < Nshot; i++) {
			imgShots[i].update = function () {
				imgShots[i].setPosition(shots[i].x, shots[i].y);
			}
		}

		for (let i = 0; i < Nenemy; i++) {
			imgEnemies[i].update = function () {
				imgEnemies[i].setPosition(enemies[i].x, enemies[i].y);
            }
        }

		scoreLabel.update = function () {
			scoreLabel.text = score + "" ;
		}
		
		this.on('enterframe', function (e) {
			//描画
			for (let i = 0; i < 3; i++) {
				if (i >= player.hp) imgHp[i].setPosition(-SCREEN_X, -SCREEN_Y);
			}

			for (let i = 0; i < 2; i++) {
				backs[i].move(8);
				if (backs[i].y >= SCREEN_Y * 3 / 2) {
					backs[i].y = -SCREEN_Y / 2;
                }
            }
			if (player.time > 0) player.time -= 1;
			
			e.app.pointers.forEach(function (p) {
				
					player.x = p.x;
					player.y = p.y - size;
				
				});
			if (player.hp <= 0) {
				player.x = SCREEN_X * 2;
				player.y = -SCREEN_Y * 2;
				scoreLabel.text = "GAME OVER\nSCORE:" + score;
				scoreLabel.setPosition(SCREEN_X / 2, SCREEN_Y / 2);
			}
			interval -= 1;
			if (interval <= 0) {
				
				for (let i = 0; i < Nshot; i++) {
					if (shots[i].y < -shotHeight*2) {
						shots[i].y = player.y - SCREEN_Y/20;
						shots[i].x = player.x;
						interval = 40;
						break;
                    }
                }
			}
			for (let i = 0; i < Nshot; i++) {

				if (shots[i].y > -shotHeight*2) {
					
					shots[i].move(10);
				}
				else {
					shots[i].x = SCREEN_X * 2;
					shots[i].y = -SCREEN_Y * 2;
                }
            }
			for (let i = 0; i < Nenemy; i++) {
					if ((player.x - enemies[i].x) * (player.x - enemies[i].x) < size * size &&
						(player.y - enemies[i].y) * (player.y - enemies[i].y) < size * size && player.time <= 0) {
						player.hp -= 1;
						player.time = 50;
					}
				
			}
		
			for (var i = 0; i < Nenemy; i++) {
				enemies[i].move(10);
				if (enemies[i].y >= SCREEN_Y + enemyHeight * 2) {
					enemies[i] = null;
					var r = Math.floor(Math.random() * 3);
					switch (r) {
						case 0:
							enemies[i] = new Jet01((Math.random() * SCREEN_X / enemyWidth) * enemyWidth,
								-enemyHeight * 2 - Math.random() * enemyHeight);
							imgEnemies[i] = Sprite('jet01').addChildTo(this);
							break;
						case 1:
							enemies[i] = new Jet02((Math.random() * SCREEN_X / enemyWidth) * enemyWidth,
								-enemyHeight * 2 - Math.random()* enemyHeight);
							imgEnemies[i] = Sprite('jet02').addChildTo(this);
							break;
						case 2:
							enemies[i] = new Eyemon(SCREEN_X / 2,
								-enemyHeight * 2 - Math.random() * enemyHeight);
							imgEnemies[i] = Sprite('eyemon').addChildTo(this);
							break;
					}
					imgEnemies[i].width = enemyWidth;
					imgEnemies[i].height = enemyHeight;
                }
				for (var j = 0; j < Nshot; j++) {
					if ((shots[j].x - enemies[i].x) * (shots[j].x - enemies[i].x) < size*3/2 * size*3/2 &&
						(shots[j].y - enemies[i].y) * (shots[j].y - enemies[i].y) < size * 3 / 2 * size * 3 / 2) {
						enemies[i].collision();
						shots[j].collision();
						score += 50;
                    }
				}
		}
		});
	},


	onpointstart: function() {
	
    //this.exit('scene01');  
  },
});
; (function () {

	/**
	 * @class phina.input.Mouse
	 * @extends phina.input.Input
	 */
	phina.define('phina.input.Mouse', {

		superClass: 'phina.input.Input',

		/**
		 * @constructor
		 */
		init: function (domElement) {
			this.superInit(domElement);

			this.id = 0;
			var self = this;
			this.domElement.addEventListener('mousedown', function (e) {
				self._start(e.pointX, e.pointY, 1 << e.button);
				
			});

			this.domElement.addEventListener('mouseup', function (e) {
				self._end(1 << e.button);
				
				
			});
			this.domElement.addEventListener('mousemove', function (e) {
				self._move(e.pointX, e.pointY);
			});

			// マウスがキャンバス要素の外に出た場合の対応
			this.domElement.addEventListener('mouseout', function (e) {
				self._end(1);
			});
		},

		/**
		 * ボタン取得
		 */
		getButton: function (button) {
			if (typeof (button) == "string") {
				button = BUTTON_MAP[button];
			}

			return (this.now & button) != 0;
		},

		/**
		 * ボタンダウン取得
		 */
		getButtonDown: function (button) {
			if (typeof (button) === 'string') {
				button = BUTTON_MAP[button];
			}

			return (this.start & button) != 0;
		},

		/**
		 * ボタンアップ取得
		 */
		getButtonUp: function (button) {
			if (typeof (button) == "string") {
				button = BUTTON_MAP[button];
			}

			return (this.end & button) != 0;
		},

		_static: {
			/** @static @property */
			BUTTON_LEFT: 0x1,
			/** @static @property */
			BUTTON_MIDDLE: 0x2,
			/** @static @property */
			BUTTON_RIGHT: 0x4,
		}
	});

	var BUTTON_MAP = {
		"left": phina.input.Mouse.BUTTON_LEFT,
		"middle": phina.input.Mouse.BUTTON_MIDDLE,
		"right": phina.input.Mouse.BUTTON_RIGHT
	};

	phina.input.Mouse.prototype.getPointing = function () { return this.getButton("left"); };
	phina.input.Mouse.prototype.getPointingStart = function () { return this.getButtonDown("left"); };
	phina.input.Mouse.prototype.getPointingEnd = function () { return this.getButtonUp("left"); };

})();

//Scene01 クラスを定義
phina.define("Scene01",{
	superClass: 'DisplayScene',
	
	init: function(option){
		this.superInit(option);
		// 背景色を指定
     this.backgroundColor = '#000';
	Label({
      text: 'Scene01',
      fontSize: 48,
      fill: 'yellow',
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
  },

});


// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    startLabel: 'main', // メインシーンから開始する
	assets: ASSETS,
	width: SCREEN_X,
    height: SCREEN_Y,
	scenes: [
      {
        className: 'MainScene',
        label: 'main',
        nextLabel: '',
      },

      {
        className: 'Scene01',
        label: 'scene01',
        nextLabel: '',
      },
    ]
  });
  // アプリケーション実行
  app.run();
});