function Snake() {
    this.x = 0;
    this.y = 0;
    this.xspeed = 1;
    this.yspeed = 0;
    this.total = 0;
    this.tail = [];

    this.restart = function() {
        this.x = 0;
        this.y = 0;
        this.xspeed = 1;
        this.yspeed = 0;
        this.total = 0;
        this.tail = [];
    }
    this.death = function() {
        for(var i = 0; i < this.tail.length; ++i) {
            var pos = this.tail[i];
            var d = dist(this.x,this.y,pos.x,pos.y);
            if(d < 1) {
                this.restart();
            }
        }
    }

    this.dir = function(x,y) {
        //prevent self eating, we could also instantiate death?
        var inner = x*this.xspeed+y*this.yspeed;
        if(inner == 0) {
            this.xspeed = x;
            this.yspeed = y;
        }
    }

    this.update = function() {
        if(this.total == this.tail.length) {
            for(var i = 0; i < this.tail.length-1; ++i) {
                this.tail[i] = this.tail[i+1]
            }
        } 
        this.tail[this.total-1] = createVector(this.x,this.y);

        this.x = this.x+this.xspeed*scl;
        this.y = this.y+this.yspeed*scl;
        
        //what if we hit wall?

        //old option was to stop!
        //this.x = constrain(this.x,0,width-scl)
        //this.y = constrain(this.y,0,height-scl)
        if(this.x < 0 || this.y < 0 || this.x > width-scl || this.y > height-scl) {
            //option death
            //this.restart();

            //option going through wall
            if(this.x < 0) {
                this.x = width-scl;
            } else if (this.x > width-scl) {
                this.x = 0;
            } else if (this.y < 0) {
                this.y = height-scl;
            }
            else if (this.y > height-scl) {
                this.y = 0;
            }
        }
    }
    
    this.show = function() {
        //snake color
        fill(50,205,50);
        for(var i = 0; i < this.tail.length; ++i) {
            rect(this.tail[i].x,this.tail[i].y,scl,scl)
        }
        rect(this.x,this.y,scl,scl)
    }

    this.eat = function(pos) {
        var d = dist(this.x,this.y,pos.x,pos.y);
        if(d < 1) {
            this.total++;
            return true;
        } else {
            return false;
        }
    }
    

}