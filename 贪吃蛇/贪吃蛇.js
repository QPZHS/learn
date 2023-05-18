var game = {
    "width": 0,//定义游戏宽度
    "height": 0,//定义游戏高度
    "area": null,//定义游戏区域
    "f": null,//定义食物
    "foodArry": [],//定义食物类
    "createArea": function () {
        //设定游戏区域
        game.area = document.getElementsByClassName("game")[0];
        game.width = game.area.offsetWidth;
        game.height = game.area.offsetHeight;
        //创建蛇
        snake.createhead();
        //创建食物
        if (!game.f) {
            game.createFood();
        }
        //设置蛇的移动
        document.onkeyup = function (event) {
            var key = event.keyCode;
            snake.move(key);
        }
    },
    "createFood": function () {
        while (true) {
            //设定食物将要创建的位置
            var rleft = parseInt(Math.random() * 19) * 20;
            var rtop = parseInt(Math.random() * 19) * 20;
            var createFlag=true;
            //判断食物是否与蛇重叠，不重叠则创建食物，重叠则再次判定
            //存在身体时，头部和每个身体格都进行判定
            try {
                for(let b=0;b<=bodyLength;b++){
                    if (rleft == snake.head.offsetLeft && rtop == snake.head.offsetTop 
                        || rleft ==snake.body[b].offsetLeft && rtop == snake.body[b].offsetHeight) {
                        createFlag=false;
                        break;
                    } else {
                        continue;
                    }
                }
                if(createFlag){
                    game.f = new food(rleft, rtop); 
                    game.f.create();
                    break;
                }else{
                    continue;
                }
            //只存在头时，只进行头部判定
            } catch (error) {
                if (rleft != snake.head.offsetLeft && rtop != snake.head.offsetTop) {
                    game.f = new food(rleft, rtop); 
                    game.f.create();
                    break;
                } else {
                    continue;
                }
            }
        }
    },
    retry:function(){
        game.area.removeChild(snake.head);
        for(let i=0;i<snake.bodyLength;i++){
            game.area.removeChild(snake.body[i]);
        }
        snake.bodyLength=0;
        game.createArea();
        document.getElementsByClassName("gameover")[0].style.display="none";
    }
}

var snake = {
    "head": null,
    "body":[],
    "direction":null,
    "timer": null,
    "bodyLength": 0,
    //创建头部
    "createhead": function () {
        snake.head = document.createElement("div");
        snake.head.className = "snake";
        snake.head.classList.add("head");
        game.area.appendChild(snake.head);
    },
    //创建身体
    "createbody":function(){
        //创建身体分区，赋组名和id
        snake.body[this.bodyLength]=document.createElement("div");
        snake.body[this.bodyLength].className="snake";
        snake.body[this.bodyLength].classList.add("body");
        snake.body[this.bodyLength].bid=this.bodyLength+1;
        //判断身体应该在哪里生成将符合逻辑
        if(snake.direction=="down"){
            snake.body[this.bodyLength].style.top=snake.head.offsetTop - 20 + "px";
            snake.body[this.bodyLength].style.left=snake.head.offsetLeft + "px";
        }else if(snake.direction=="left"){
            snake.body[this.bodyLength].style.top=snake.head.offsetTop + "px";
            snake.body[this.bodyLength].style.left=snake.head.offsetLeft + 20 + "px";
        }else if(snake.direction=="up"){
            snake.body[this.bodyLength].style.top=snake.head.offsetTop + 20 + "px";
            snake.body[this.bodyLength].style.left=snake.head.offsetLeft + "px";
        }else if(snake.direction=="right"){
            snake.body[this.bodyLength].style.top=snake.head.offsetTop + "px";
            snake.body[this.bodyLength].style.left=snake.head.offsetLeft - 20 + "px";
        }
        //生成身体
        game.area.appendChild(snake.body[this.bodyLength]);
    },
    //蛇头的移动
    "move": function (key) {
        //按下方向键"↓"时蛇会向下走
        if(key==40&&snake.direction!="up"){
            clearInterval(snake.timer);
            snake.timer = setInterval(() => {
                if (snake.head.offsetTop <= 562) {
                    snake.direction="down";
                    snake.head.style.top = snake.head.offsetTop + 20 + "px";
                    //蛇身的移动
                    //循环找到最尾端的蛇身，即bid和身长一致的一处，将其放置到蛇头的旁边，位置根据蛇的朝向决定
                    for(let i=0;i<this.bodyLength;i++){
                        if(snake.body[i].bid==this.bodyLength){
                            snake.body[i].style.top=snake.head.offsetTop - 20 + "px";
                            snake.body[i].style.left=snake.head.offsetLeft + "px";
                            //将更改后的蛇身bid设置为1
                            snake.body[i].bid=1;
                            // break;
                        }else{
                            //其它的蛇身增加1
                            snake.body[i].bid++;
                        }
                    }
                    //判断是否撞上身体
                    try{
                        //在有身体的时候
                        for(let b=0;b<=this.bodyLength;b++){
                            if(snake.head.style.left==snake.body[b].style.left&&snake.head.style.top==snake.body[b].style.top){
                                snake.die();
                                break;
                            }
                        }
                    }catch{}//没有身体则跳过
                    snake.eat(snake.head.style.left, snake.head.style.top);
                }else{
                    snake.die();//撞墙了
                }
            }, 200)
        //按下方向键"←"时蛇会向左走
        }else if(key==37&&snake.direction!="right"){
            clearInterval(snake.timer);
            snake.timer = setInterval(() => {
                if (snake.head.offsetLeft >= 20) {
                    snake.direction="left";
                    snake.head.style.left = snake.head.offsetLeft - 20 + "px";
                    //蛇身的移动
                    //循环找到最尾端的蛇身，即bid和身长一致的一处，将其放置到蛇头的旁边，位置根据蛇的朝向决定
                    for(let i=0;i<this.bodyLength;i++){
                        if(snake.body[i].bid==this.bodyLength){
                            snake.body[i].style.top=snake.head.offsetTop + "px";
                            snake.body[i].style.left=snake.head.offsetLeft + 20 + "px";
                            //将更改后的蛇身bid设置为1
                            snake.body[i].bid=1;
                            // break;
                        }else{
                            //其它的蛇身增加1
                            snake.body[i].bid++;
                        }
                    }
                    try{
                        for(let b=0;b<=this.bodyLength;b++){
                            if(snake.head.style.left==snake.body[b].style.left&&snake.head.style.top==snake.body[b].style.top){
                                snake.die();
                                break;
                            }
                        }
                    }catch{}
                    snake.eat(snake.head.style.left, snake.head.style.top);
                }else{
                    snake.die();
                }
            }, 200)
        //按下方向键"↑"时蛇会向上走
        }else if(key==38&&snake.direction!="down"){
            clearInterval(snake.timer);
            snake.timer = setInterval(() => {
                if (snake.head.offsetTop >= 20) {
                    snake.direction="up";
                    snake.head.style.top = this.head.offsetTop - 20 + "px";
                    //蛇身的移动
                    //循环找到最尾端的蛇身，即bid和身长一致的一处，将其放置到蛇头的旁边，位置根据蛇的朝向决定
                    for(let i=0;i<this.bodyLength;i++){
                        if(snake.body[i].bid==this.bodyLength){
                            snake.body[i].style.top=snake.head.offsetTop + 20 + "px";
                            snake.body[i].style.left=snake.head.offsetLeft + "px";
                            //将更改后的蛇身bid设置为1
                            snake.body[i].bid=1;
                            // break;
                        }else{
                            //其它的蛇身增加1
                            snake.body[i].bid++;
                        }
                    }
                    try{
                        for(let b=0;b<=this.bodyLength;b++){
                            if(snake.head.style.left==snake.body[b].style.left&&snake.head.style.top==snake.body[b].style.top){
                                snake.die();
                                break;
                            }
                        }
                    }catch{}
                    snake.eat(snake.head.style.left, snake.head.style.top);
                }else{
                    snake.die();
                }
            }, 200)
        //按下方向键"→"时蛇会向右走
        }else if(key==39&&snake.direction!="left"){
            clearInterval(snake.timer);
            snake.timer = setInterval(() => {
                if (snake.head.offsetLeft <= 762) {
                    snake.direction="right";
                    snake.head.style.left = snake.head.offsetLeft + 20 + "px";
                    //蛇身的移动
                    //循环找到最尾端的蛇身，即bid和身长一致的一处，将其放置到蛇头的旁边，位置根据蛇的朝向决定
                    for(let i=0;i<this.bodyLength;i++){
                        if(snake.body[i].bid==this.bodyLength){
                            snake.body[i].style.top=snake.head.offsetTop + "px";
                            snake.body[i].style.left=snake.head.offsetLeft - 20  + "px";
                            //将更改后的蛇身bid设置为1
                            snake.body[i].bid=1;
                            // break;
                        }else{
                            //其它的蛇身增加1
                            snake.body[i].bid++;
                        }
                    }
                    try{
                        for(let b=0;b<=this.bodyLength;b++){
                            if(snake.head.style.left==snake.body[b].style.left&&snake.head.style.top==snake.body[b].style.top){
                                snake.die();
                                break;
                            }
                        }
                    }catch{}
                    snake.eat(snake.head.style.left, snake.head.style.top);
                }else{
                    snake.die();
                }
            }, 200)
        }
    },
    //判定蛇吃到食物
    "eat": function (sl, st) {
        //遍历食物数量
        for (let i = 0; i < game.foodArry.length; i++) {
            //把食物的id赋值给变量
            var eatfood = document.getElementById(game.foodArry[i]);
            //判定变量的位置和蛇头的位置是否一致
            if (st == eatfood.style.top && sl == eatfood.style.left) {
                //一致则移除此食物，创建新食物，创建一个蛇身，蛇的长度增加
                game.area.removeChild(eatfood);
                game.createFood();
                snake.createbody();
                snake.bodyLength++;
            }
        }
    },
    "die":function(){
        //禁止蛇移动
        document.onkeyup = function (event) {
            return false;
        }
        snake.direction=null;
        clearInterval(snake.timer);
        document.getElementsByClassName("gameover")[0].style.display="block";
    }
}

//食物的属性
var fid = 0;
function food(left, top) {
    this.left = left;
    this.top = top;
    this.id = "f" + fid;
}

//食物的创建
food.prototype.create = function () {
    var newFood = document.createElement("div");
    newFood.className = "food";
    game.area.appendChild(newFood);
    newFood.style.left = this.left + "px";
    newFood.style.top = this.top + "px";
    newFood.id = this.id;
    game.foodArry.push(this.id);
}

//初始运行
window.onload = function () {
    game.createArea();
}