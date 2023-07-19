let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
let canvasHeight = c.height;
let canvasWidth = c.width;
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 20; //每千分之25秒移動20
let ySpeed = 20;
let ground_x = 100;
let ground_y = 500;
let ground_height = 5;
let ground_width = 200;
let brickArray = [];
let count = 0;

function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

//做磚塊 每做出一個磚塊，就讓它放到brickArray裡
class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true; //預設所有的brick都是可見的，像是在 brick 上貼標籤
  }
  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchBall(ball_x, ball_y) {
    return (
      ball_x >= this.x - radius &&
      ball_x <= this.x + this.width + radius &&
      ball_y >= this.y - radius &&
      ball_y <= this.y + this.height + radius
    );
  }
}

// let brick1 = new Brick(100, 100); 只會畫出一個

//製作所有的brick (x,y)座標設定為10的倍數，會必較好確認是否有被球打到)

for (let i = 0; i < 10; i++) {
  new Brick(getRandomArbitrary(0, 950), getRandomArbitrary(0, 550));
}

//滑鼠移動到哪，ground_x就移動到哪
c.addEventListener("mousemove", (e) => {
  ground_x = e.clientX;
});

function drawCircle() {
  //確認球是否打到磚塊

  brickArray.forEach((brick) => {
    if (brick.visible && brick.touchBall(circle_x, circle_y)) {
      //只檢查是visible的磚塊，如果已經被撞過，就不檢查
      //如果是 true 的話，改變 x,y 方向速度，並且將 brick 設為 invisible
      count++; //如果打到 count+1
      brick.visible = false;
      if (circle_y >= brick.y + brick.height || circle_y <= brick.y) {
        //表示球由下方撞擊磚塊   //表示球由上方撞擊磚塊
        ySpeed *= -1;
      }

      if (circle_x >= brick.x + brick.width || circle_x < brick.x) {
        //球從右方撞擊磚塊  //球從左方撞擊磚塊
        xSpeed *= -1;
      }

      //brickArray.splice(index,1); 時間複雜度 O(n)，每刪掉一個值，array 長度改變，array都要重排一次
      //把被球撞到的磚塊(取得其在array中的index，從那個地方刪掉一個值)
      //每次刪完一個值，都要檢查 array的長度
      //   if(brickArray.length==0){
      //     window.alert("遊戲結束");
      //     clearInterval(game);
      //   }

      //用這個方法時間複雜度維持不變
      if (count == 10) {
        window.alert("遊戲結束");
        clearInterval(game);
      }
    }
  });

  //確認球是否打到橘色地板-->更改y位置

  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 200 + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    if (ySpeed > 0) {
      //表示目前正在往下掉(上方打到橘色地板)
      circle_y -= 40;
    } else {
      //ySpeed<0 球由下方往上彈到橘色地板
      circle_y += 40;
    }
    ySpeed *= -1; //會反彈，但還是存在這個區間內，會來回震動，因此做上面的設定，讓圓圈彈力大一點跳離區間
  }

  if (circle_x >= canvasWidth - radius || circle_x <= radius) {
    //確認球是否打到左右邊界(x不能再走，必須改變方向)
    xSpeed *= -1;
  }
  //確認球是否打到上下邊界(y原方向不能再走，必須改變)
  if (circle_y >= canvasHeight - radius || circle_y <= radius) {
    ySpeed *= -1;
  }

  //更動圓的座標位置 (獲得下一次畫圓的座標)
  circle_x += xSpeed;
  circle_y += ySpeed;

  //每過一次，要先把背景也畫一遍，把上一次畫的東西蓋掉
  ctx.fillStyle = "black"; //設定填滿的內容
  ctx.fillRect(0, 0, canvasWidth, canvasHeight); //設定填滿的範圍

  //畫出所有的 brick
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  //畫出可控制的地板
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, ground_width, ground_height);

  //畫出圓球 x,y(圓心的座標),radius,startangle,endangle
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game = setInterval(drawCircle, 200);



