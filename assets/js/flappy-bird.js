const cvs = document.querySelector("#bird");
const ctx = cvs.getContext("2d");

let frames = 0;
const DEGREE = Math.PI/180;


//load sprite img

const sprite = new Image();
sprite.src = "./assets/img/sprite.png";

//load sounds

const SCORE_S = new Audio();
SCORE_S.src = "./assets/sound/sfx_die.wav"

const FLAP = new Audio();
FLAP.src = "./assets/sound/sfx_flap.wav";

const HIT = new Audio();
HIT.src = "./assets/sound/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "./assets/sound/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "./assets/sound/sfx_die.wav";





// game state

const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2,

}
// start game

const startBtn = {
    x : 120,
    y : 263,
    w : 83,
    h : 29,
}
//Control the game

cvs.addEventListener("click", function (event){

    switch (state.current){
        case state.getReady :
            state.current = state.game;
            SWOOSHING.play();
         
            break;
        case state.game :
            bird.flap();
            FLAP.play();

            break;
        case state.over :
            let rect = cvs.getBoundingClientRect(); // DOMRect, chứa thông tin về kích thước và vị trí của một phần tử DOM trong khung nhìn (viewport).
            let clickX = event.clientX - rect.left;
            let clickY = event.clientY - rect.top;

            // Kiểm tra khi chọn start

            if(clickX >= startBtn.x && clickX  <= startBtn.x + startBtn.w && clickY 
                >= startBtn.y && clickY <= startBtn.y + startBtn.h){
                pipes.reset();
                bird.speedReset();
                score.reset();
            state.current = state.getReady;
            }
            break;


    }
});

//load background img
const background = {
    sX : 0,
    sY: 0,
    w : 275,
    h : 226,
    x : 0,
    y : cvs.height - 226,

    draw : function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);

    }

}
// Foreground - nền trước

const foreground = {
    sX : 276,
    sY: 0,
    w : 224,
    h : 112,
    x : 0,
    y : cvs.height - 112,
    dx : 4,


    draw : function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);

    },
    update: function (){
        if(state.current == state.game){
            this.x = (this.x - this.dx)% (this.w/2);
        }

    }
}
// Bird

const bird = {
    animation : [
        {sX: 276 , sY: 112},
        {sX: 276 , sY:139},
        {sX: 276 , sY: 164},
        {sX: 276 , sY: 139},
    ],
    x : 50,
    y : 150,
    w : 34,
    h : 26 ,

    radius : 12 ,

    frame : 0,

    gravity : 0.25, // trọng lực
    jump : 4.2, //nhảy
    speed : 0 , //tốc độ
    rotation : 0 , // độ góc



    draw : function (){
        let bird = this.animation[this.frame];

        ctx.save ();
        ctx.translate (this.x, this.y );
        ctx.rotate(this.rotation);

        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, - this.w/2, - this.h/2, this.w, this.h);

        ctx.restore ();
    },

    flap :function (){
        this.speed = - this.jump;

    },

    update : function (){
        // Nếu ở trạng thái chuẩn bị chơi game, thì bird sẽ vỗ cánh chậm 
        this.period = state.current == state.getReaady ? 10 :5 ;
        // Nếu tăng thêm 1 khung hình bird chuyển sang một trạng thái khác
        this.frame += frames%this.period == 0 ? 1 : 0;
        // Khun hình bird tăngt ừ 0-4, ngược lại sẽ là 0
        this.frame = this.frame%this.animation.length;

        if(state.current == state.getReady){
            this.y = 150 ; // vị trí bird khi game over
            this.rotation = 0 * DEGREE;

        }else {
            this.speed += this.gravity;
            this.y += this.speed;

            if(this.y + this.h/2 >= cvs.height - foreground.h){
                this.y = cvs.height - foreground.h - this.h/2;
                if (state.current == state.game){
                    state.current = state.over ;
                    DIE.play();
                }
            }
            //Nếu tốc độ nhanh hơn bước nhảy sẽ bị die
            if(this.speed >= this.jump){
                this.rotation = 90 * DEGREE;
                this.frame = 1; 

            }else {
                this.rotation = - 25 * DEGREE;
            }
        }


    },
    speedReset : function(){
        this.speed = 0;
    }
}

//get ready massage !!

const getReady = {
    sX : 0,
    sY : 228,
    w : 173,
    h : 152,
    x : cvs.width/2 - 173/2,
    y : 80,

    frame: 0,

    draw : function (){
        if(state.current == state.getReady){
            ctx.drawImage(sprite, this.sX, this.sY,
                 this.w, this.h, this.x, this.y, this.w, this.h);
        }

    }

}

// game over massage :(


const gameOver = {
    sX : 175,
    sY : 228,
    w : 225,
    h : 202,
    x : cvs.width/2 - 225/2,
    y : 90,

    frame: 0,

    draw : function (){
        if(state.current == state.over){
            ctx.drawImage(sprite, this.sX, this.sY,
                 this.w, this.h, this.x, this.y, this.w, this.h);

        }

    }

}



//pipes 

const pipes = {
    position :[],

    top :{
        sX: 553,
        sY: 0,

    },
    bottom: {
        sX: 502,
        sY: 0,
    },
    w: 53,
    h: 400 ,
    gap :100,
    maxYPos: -150,
    dx : 2,

    draw : function(){
        for(let i  = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;
            
            // top pipe
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);  
            
            // bottom pipe
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);  
        }
    },
    update : function (){
        if(state.current !== state.game ) return;

        if(frames%100 == 0){
            this.position.push ({
                x: cvs.width,
                y: this.maxYPos * (Math.random() + 1)
            });

        }
        for(let i = 0; i < this.position.length; i ++){
            let p = this.position [i];
            p.x -= this.dx;

            if ((bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w)
            && 
            ((bird.y - bird.radius < p.y + this.h) || (bird.y + bird.radius > p.y + this.h + this.gap))){
                 state.current = state.over;
                 HIT.play();
                }
        //nếu các pipes ngoài khung hình sẽ xoá khỏi mảng
            if(p.x + this.w <= 0){
             this.position.shift();
             score.value += 1;

             SCORE_S.play();

             score.best = Math.max ( score.value, score.best);
             localStorage.setItem("best", score.best);
            }

        }
    },
    reset : function(){
        this.position = [];
    }


}

//Core

const score = {
    best : parseInt (localStorage.getItem ("best"))||0,
    value : 0,

    draw : function (){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";

        if (state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText (this.value, cvs.width/2,50);
            ctx.strokeText (this.value, cvs.width/2,50);

        }else if (state.current == state.over){
            //score
            ctx.font = "25px Teko";
            ctx.fillText (this.value, 225,186);
            ctx.strokeText (this.value, 225,186);

            //best
            ctx.fillText (this.best, 225,228);
            ctx.strokeText (this.best, 225,228);
        }
        
    },

    reset : function(){
        this.value = 0;
    }
}
//medal 
const medals = {
    sX: 360,
    sY: [112, 159],
    sW: 42,
    sH: 42,
    cX: cvs.width / 2 - 25,
    cY: 207,
    cW: 42,
    cH: 42,
    i: 0,


    draw: function() {
        if (state.current == state.over) {
            ctx.drawImage(sprite, this.sX, this.sY[this.i], this.sW, this.sH, this.cX, this.cY, this.cW, this.cH);
        }
    },

    update: function() {
        if (state.current == state.over) {
            if (score.value === 0) {
                this.i = 2;
            } else if (score.value === score.best) {
                this.i = 1;
            } else if (score.value >= score.best / 2 && score.value < score.best) {
                this.i = 0;
            } else {
                this.i = 2;
            }
            this.isVisible = true;
        }
    }
};

//draw
function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect (0,0, cvs.width, cvs.height);

    background.draw();
    pipes.draw();
    foreground.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
    medals.draw();

}
//medal


//update
function update(){
    bird.update ();
    foreground.update ();
    pipes.update ();
    medals.update();


}

//loop
function loop(){
        update();
        draw();
        frames++;

        requestAnimationFrame(loop);

}
loop();
