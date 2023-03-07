// phina.js をグローバル領域に展開
phina.globalize();
var SCREEN_X = screen.width;
var SCREEN_Y = screen.height;
let ASSETS = {
	image:{
		remanfly:"reman-fly01.png",
		remanup:"reman-fly02.png",
		space:"space.png",
		item: "reman.png",
		eyemon: "e03.png"
	}
};
//クラス

class Player {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.dx = x;
		this.dy = y;
		this.enegy = 100;
		this.up_flg = false;
		this.time = 0;
		this.dtime = 0;
	}

	up() {
		this.y -= 6;
    }
}

class Item{
	
	constructor(x,y,id){
		this.x = x;
		this.y = y;
		this.id = id;
	}
	move(speed) {
		this.x -= speed;
    }
	collision(){
		this.y = SCREEN_Y *2;
		this.x = -SCREEN_X ;
	}
}

class Back {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	move(speed) {
		this.x -= speed;
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
		var speed = 0;
		var size = SCREEN_X / 15;
		var start_flg = false;
		//背景
		backs = new Back(2);
		imgBacks = new Array(2);
		var backWidth = SCREEN_X + size*2;
		var backHeight = SCREEN_Y;
		for (let i = 0; i < 2; i++) {
			backs[i] = new Back(SCREEN_X / 2 + i * SCREEN_X, SCREEN_Y / 2);
			imgBacks[i] = Sprite('space').addChildTo(this);
			imgBacks[i].setPosition(backs[i].x, backs[i].y);
			imgBacks[i].width = backWidth;
			imgBacks[i].height = backHeight;
        }
		//プレイヤー
		player = new Player(SCREEN_X / 2, SCREEN_Y/2);
		var imgPlayer = Sprite('remanfly').addChildTo(this);　// ('reman')内が指定したキー名に相当する
		var imgUp = Sprite('remanup').addChildTo(this);
		imgPlayer.setPosition(player.x, player.y);
		imgUp.setPosition(SCREEN_X + size * 2, SCREEN_Y + size * 2);
		imgPlayer.width = size * 2;
		imgPlayer.height = size * 2;
		imgUp.width = size * 2;
		imgUp.height = size * 2;
		//アイテム
		var Nitem = 10;
		items = new Item(Nitem);
		imgItems = new Array(Nitem);
		imgEyemon = new Array(Nitem);
		var itemWidth = size;
		var itemHeight = size;
		for (let i = 0; i < Nitem; i++) {
			items[i] = new Item(SCREEN_X + (Math.floor(Math.random() * 10) / itemWidth) * itemWidth,
				(Math.random() * SCREEN_Y / itemHeight) * itemHeight,0);
			imgItems[i] = Sprite('item').addChildTo(this);
			imgEyemon[i] = Sprite('eyemon').addChildTo(this);
			imgItems[i].setPosition(items[i].x, items[i].y);
			imgEyemon[i].setPosition(-SCREEN_X, SCREEN_Y*2);
			imgItems[i].width = itemWidth;
			imgItems[i].height = itemHeight;
			imgEyemon[i].width = itemWidth;
			imgEyemon[i].height = itemHeight;
		}

		//スコア
		var scoreLabel = Label({
			text: score + 'm   enegy' + player.enegy,
			fontSize: 48,
			fill: 'white',
		}).addChildTo(this);
		scoreLabel.setPosition(SCREEN_X/2, 48);

		// 動かす処理
		this.onpointstart = function () {
			player.up_flg = true;
		};
		this.onpointend = function () {
			player.up_flg = false;
		};
		for (let i = 0; i < 2; i++) {
			imgBacks[i].update = function () {
				this.setPosition(backs[i].x, backs[i].y);
			}
        }
		imgPlayer.update = function () {
			if (player.up_flg && player.enegy > 0) {
				//imgUp.setPosition(player.x, player.y);
				this.setPosition(SCREEN_X + size * 2, SCREEN_Y + size * 2);
			}
			else {
				this.setPosition(player.x, player.y);
            }
			if (player.dtime > 0) {
				this.alpha = 0.5;
				player.dtime -= 1;
			} else this.alpha = 1;
		}
		imgUp.update = function () {
			if (player.up_flg && player.enegy > 0) {
				this.setPosition(player.x, player.y);
			}
			else {
				this.setPosition(SCREEN_X + size * 2, SCREEN_Y + size * 2);
			}
			if (player.dtime > 0) {
				this.alpha = 0.5;
				player.dtime -= 1;
			} else this.alpha = 1;
        }
			for(let i = 0; i < Nitem; i++) {
			imgItems[i].update = function () {
				if (items[i].id == 0) this.setPosition(items[i].x, items[i].y);
				else imgEyemon[i].setPosition(items[i].x, items[i].y);
            }
        }

		scoreLabel.update = function () {
			scoreLabel.text = score + "m" + '   enegy' + Math.floor(player.enegy);
		}
		
		this.on('enterframe', function (e) {
			//描画

			speed = (Math.floor(player.time / 500)+1) * 5;
			for (let i = 0; i < 2; i++) {
				backs[i].move(speed);
				if (backs[i].x <= -SCREEN_X / 2) {
					backs[i].x = SCREEN_X*3 / 2;
                }
			}
			if (player.up_flg == false || player.enegy <=  0) player.y += 6;
			else{
				player.up();
				player.enegy -= 0.1;
			}
			if (player.y >= SCREEN_Y + size) {
				scoreLabel.text = "GAME OVER\nSCORE:" + score  + "m";
				scoreLabel.setPosition(SCREEN_X / 2, SCREEN_Y / 2);
			} else {
				score += speed /5 ;
				player.time++;
			    player.enegy -= 0.01;
			}
			
			for (var i = 0; i < Nitem; i++) {
				items[i].move(speed);
				if (items[i].x <= -itemWidth * 2) {
					var r = Math.floor(Math.random() * 3);
					switch (r) {
						
						case 1:
							items[i].x = SCREEN_X + Math.floor(Math.random() * 10 + 1) * itemWidth;
							items[i].y = Math.floor(Math.random() * SCREEN_Y / itemHeight) * itemHeight;
							items[i].id = 1;
							//imgItems[i] = Sprite('eyemon').addChildTo(this);
							break;
						default:
							items[i].x = SCREEN_X + Math.floor(Math.random() * 10) * itemWidth;
							items[i].y = Math.floor(Math.random() * SCREEN_Y / itemHeight) * itemHeight;
							items[i].id = 0;
							//imgItems[i] = Sprite('item').addChildTo(this);
							break;
					}
					//imgItems[i].setPosition(items[i].x, items[i].y);
					imgItems[i].width = itemWidth;
					imgItems[i].height = itemHeight;
				}
			}
			for (let i = 0; i < Nitem; i++) {
				if ((player.x - items[i].x) * (player.x - items[i].x) < size * size &&
					(player.y - items[i].y) * (player.y - items[i].y) < size * size) {
					if (items[i].id == 0) player.enegy += 2;
					else {
						player.dtime = 50;
						player.enegy -= 6;
						
						player.time -= 100;
						if (player.time < 0) player.time = 0;
						//speed -= 5;
					}
					items[i].collision();
				}

			}
			if (player.enegy < 0) player.enegy = 0;
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
				player.up_flg = true;
				
			});

			this.domElement.addEventListener('mouseup', function (e) {
				self._end(1 << e.button);
				player.up_flg = false;
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