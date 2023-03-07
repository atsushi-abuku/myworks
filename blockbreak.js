// phina.js をグローバル領域に展開
phina.globalize();
var SCREEN_X = screen.width;
var SCREEN_Y = screen.height;
let ASSETS = {
	image:{
		reman:"reman.png",
		block:"block.png"
	}
};
//ボールクラス

class Ball{
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.dx = 1;
		this.dy = -1;
	}
	move(speed){
	this.x += this.dx * speed;
	this.y += this.dy * speed;
}
	
}
class Block{
	
	constructor(x,y){
		this.x = x;
		this.y = y;
		this.time = 0;
		this.by = y;
	}
	collision(){
		this.y = -SCREEN_Y;
	}
	reborn() {
		this.y = this.by;
		this.time = 0;
    }
}

class Board{
	constructor(x,y){
		this.x = x;
		this.y = y;
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
		//ボール
		ball = new Ball(0, 0);
		var reman = Sprite('reman').addChildTo(this);　// ('reman')内が指定したキー名に相当する
		reman.setPosition(ball.x, ball.y);
		reman.width = 50;
		reman.height = 50;
		reman.speed = 15;

		//ブロック
		var Nblock = 35;
		blocks = new Block(Nblock);
		imgBlocks = new Array(Nblock);
		var blockWidth = SCREEN_X / 10;
		var blockHeight = SCREEN_Y / 20;
		var k = -1;
		for (let i = 0; i < Nblock; i++) {
			if (i % 7 == 0) k++;
			blocks[i] = new Block(blockWidth * (i % 7) + SCREEN_X / 5, k * blockHeight);
			imgBlocks[i] = Sprite('block').addChildTo(this);
			imgBlocks[i].setPosition(blocks[i].x, blocks[i].y);
			imgBlocks[i].width = blockWidth;
			imgBlocks[i].height = blockHeight;
		}
		//ボード
		board = new Board(SCREEN_X / 2, SCREEN_Y);
		var boardWidth = SCREEN_X / 10;
		var boardHeight = SCREEN_Y / 20;
		var imgBoard = Sprite('block').addChildTo(this);
		imgBoard.setPosition(board.x, board.y);
		imgBoard.width = boardWidth;
		imgBoard.height = boardHeight;

		//スコア
		var scoreLabel = Label({
			text: score + '',
			fontSize: 48,
			fill: 'white',
		}).addChildTo(this);
		scoreLabel.setPosition(48, 48);

		// 動かす処理
		reman.update = function () {
			ball.move(this.speed);
			this.rotation += 5;
			// 指定範囲からはみ出さないように
			if (ball.x >= SCREEN_X) {
				ball.dx = -1;
			} else if (ball.x <= 0) {
				ball.dx = 1;
			}
			if (ball.y <= 0) {
				ball.dy = 1;
			} 
			reman.setPosition(ball.x, ball.y);
		}
		for (let i = 0; i < Nblock; i++) {
			imgBlocks[i].update = function () {
				imgBlocks[i].setPosition(blocks[i].x, blocks[i].y);
				if(blocks[i].y < 0)blocks[i].time++;
				if (blocks[i].time > 500) {
					blocks[i].reborn();
                }
			}
		}

		imgBoard.update = function () {
			imgBoard.setPosition(board.x, board.y);
		}

		scoreLabel.update = function () {
			scoreLabel.text = score + "";
        }
		this.on('enterframe', function (e) {
			if (ball.y > SCREEN_Y) {
				scoreLabel.text = "GAME OVER\nSCORE:" + score;
				scoreLabel.setPosition(SCREEN_X / 2, SCREEN_Y / 2);
			} 
				e.app.pointers.forEach(function (p) {
					board.x = p.x;
					board.y = p.y;
				});

				if ((ball.x - board.x) * (ball.x - board.x) < (blockWidth + 50) / 2 * (blockWidth + 50) / 2) {
					if (ball.y < board.y && board.y - ball.y < (50 + boardHeight) / 2) {
						ball.dy = -1;
					}
			}
			for (var i = 0; i < Nblock; i++) {

					if (ball.x < blocks[i].x + blockWidth / 2 && ball.x > blocks[i].x - blockWidth / 2) {
						if (ball.y > blocks[i].y && ball.y - blocks[i].y < (blockHeight + 50) / 2) {
							ball.dy = 1;
							blocks[i].collision();
							score += 50;
						}
						else if (ball.y < blocks[i].y && blocks[i].y - ball.y < (blockHeight + 50) / 2) {
							ball.dy = -1;
							blocks[i].collision();
							score += 50;
						}
					}
					if (ball.y < blocks[i].y + blockHeight / 2 && ball.y > blocks[i].y - blockHeight / 2) {
						if (ball.x > blocks[i].x && ball.x - blocks[i].x < (blockWidth + 50) / 2) {
							ball.dx = 1;
							blocks[i].collision();
							score += 50;
						}
						else if (ball.x < blocks[i].x && blocks[i].x - ball.x < (blockWidth + 50) / 2) {
							ball.dx = -1;
							blocks[i].collision();
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