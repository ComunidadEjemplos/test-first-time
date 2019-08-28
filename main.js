/** FUNCION DE LA PELOTA */
(function(){
    self.Board = function(width,height){
        this.width=width;
        this.height=height;
        this.playing= false;
        this.game_over=false;
        this.bars = [];
        this.ball = null;
        this.playing = false;
    }

    self.Board.prototype = {
        get elements(){
            // var elements = this.bars;
            var elements = this.bars.map( function(bar){return bar;} );
            elements.push(this.ball);
            return elements;
        }
    }

} )();

/** FUNCION DE LA PELOTA */
(function(){
    self.Ball = function(x,y,radius,board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_x = 3;
        this.speed_y = 0;
        this.board=board;
        this.direcction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 3;
        board.ball = this;
        this.kind = "circle";
    }
         
    self.Ball.prototype = {
        move: function(){
           this.x += (this.speed_x * this.direcction );
           this.y += (this.speed_y);
        },
        get width(){
            return this.radius*2;
        },
        get height(){
            return this.radius*2;
        },
        collision : function(bar){
            var relative_intersect_y = (bar.y +( bar.height/2))-this.y;
            var normalized_intersect_y = relative_intersect_y/(bar.height/2);
            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;
            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);
            if( this.x > (this.board.width/2)) this.direcction =-1;
            else this.direcction =1;
//
        }
   }

})();


/** FUNCION DE LA BARRA */
(function(){
    self.Bar = function(x,y,width,height,board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 10;
    }
    self.Bar.prototype = {
        down: function() {
            this.y += this.speed;
        },
        up:function(){
            this.y -= this.speed;
        },
        toString: function(){
            return "x: "+ this.x + " y: "+this.y;
        }
    }
})();  

/** FUNCION DE LA PIZZARRA */
(function(){
     self.BoardView = function(canvas,board){
         this.canvas = canvas;
         this.canvas.width = board.width;
         this.canvas.height = board.height;
         this.board = board;
         this.ctx = canvas.getContext("2d");
     }

     self.BoardView.prototype={
         clean : function(){
             this.ctx.clearRect(0,0,this.board.width,this.board.height);
         },
         draw : function(){
             for (var i = this.board.elements.length - 1 ; i >=0 ; i--) {
                 var el = this.board.elements[i];
                 draw(this.ctx,el); 
             };
         },
         check_collisions : function(){
             for (var i = this.board.bars.length-1 ; i >=0 ; i--) {
                 var  bar = this.board.bars[i];
                 if ( hit(bar,this.board.ball )){
                        this.board.ball.collision(bar);

                 }
             } 
         },
         play : function(){
            if(this.board.playing){
                this.clean();
                this.draw();
                this.check_collisions();
                this.board.ball.move();    
            }
         }
     }
     ///funcion sin mas Explicacion
     function hit (a,b){
        var hit = false;
        if(b.x + b.width >= a.x && b.x < a.x+a.width)
        {
            if(b.y +b.height >=a.y && b.y <a.y+a.height)
            hit=true;
        }
        if(b.x <= a.x && b.x+b.width >= a.x+a.width)
        {
            if(b.y <=a.y && b.y + b.height >= a.y+a.height)
            hit=true;
        }
        if(a.x <= b.x && a.x + a.width >= b.x+b.width)
        {
            if(a.y <= b.y && a.y+a.height >= b.y+b.height)
            hit=true;
        }
        return hit;
     }
      
     function draw (ctx, element){
        // if(element !==null && element.hasOwnProperty("kind")){
            switch( element.kind ){
                case "rectangle":
            ctx.fillRect(element.x,element.y,element.width,element.height);
                   break;
                  case "circle":
                      ctx.beginPath();
                      ctx.arc(element.x,element.y,element.radius,0,7);
                      ctx.fill();
                      ctx.closePath();
                      break; 
   
            }
         //}
     }


})();


/** FUNCION DE LA BARRA */
    var board = new Board(800,400);
    var barIz = new Bar(20,100,40,100,board);
    var barDe = new Bar(700,100,40,100,board);
    var canvas = document.getElementById("canvasPong");
    var ball = new Ball(350,100,10,board);
    var board_view = new BoardView(canvas,board);
    
    //console.log(board);

/** FUNCION DE LA BARRA */
document.addEventListener("keydown",function( ev ){
     
     if(ev.keyCode ==83){
        ev.preventDefault();
         barIz.down();
     }
     else if(ev.keyCode ===87){
        ev.preventDefault();
         barIz.up();
    }
    else if(ev.keyCode ===40){
        ev.preventDefault();
        barDe.down();
    }
    else if(ev.keyCode ===38){
        ev.preventDefault();
        barDe.up();
   }else if(ev.keyCode ===32){
        ev.preventDefault();
        board.playing = !board.playing;

   }
    // console.log( barIz.toString() ); 
    // console.log( barDe.toString() ); 

});

board_view.draw();
/** FUNCION DE LA BARRA */
//al usa animationFrame dejamos de usar esra
//window.addEventListener("load",main);
window.requestAnimationFrame(controlller);

function controlller(){
    board_view.play();
    window.requestAnimationFrame(controlller);
}