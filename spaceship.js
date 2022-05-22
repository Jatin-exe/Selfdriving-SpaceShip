class SpaceShip{
    constructor(x,y,width,height,controlType,maxSpeed=5){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=maxSpeed;
        this.angle=0;
        this.damaged=false;

        this.useBrain=controlType=="AI";

        if(controlType!="DUMMY"){
            this.sensor=new Sensor(this);
            this.brain=new NeuralNetwork(
                [this.sensor.rayCount,6,4]
            );
        }
        this.controls=new Controls(controlType);
    }

    update(spaceBorders,obstacles){
        if(!this.damaged){
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(spaceBorders,obstacles);
        }
        if(this.sensor){
            this.sensor.update(spaceBorders,obstacles);
            const offsets=this.sensor.readings.map(
                s=>s==null?0:1-s.offset
            );
            const outputs=NeuralNetwork.feedForward(offsets,this.brain);

            if(this.useBrain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.reverse=outputs[3];
            }
        }
    }

    #assessDamage(spaceBorders,obstacles){
        for(let i=0;i<spaceBorders.length;i++){
            if(polysIntersect(this.polygon,spaceBorders[i])){
                return true;
            }
        }
        for(let i=0;i<obstacles.length;i++){
            if(polysIntersect(this.polygon,obstacles[i].polygon)){
                return true;
            }
        };
        return false;
    }

    //Creating SpaceShip
    #createPolygon(){
        const points=[];
        const r= 50;
        //Math.hypot(this.width,this.height)/2;
        const alpha= (this.angle);
        const w = 30
        

        //Top Point
        points.push({
            x:this.x - r*Math.sin(alpha),
            y:this.y - r*Math.cos(alpha)
        });



        //Left Point
        points.push({
            x:this.x - w*Math.cos(alpha),
            y:this.y + w*Math.sin(alpha)
        });

        //Right Point
        points.push({//try changin thes elfet righ tpoints sign to opposite after this
            x:this.x + w*Math.cos(-alpha),
            y:this.y + w*Math.sin(-alpha)
        });

        return points;
    }

    #move(){
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }

        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }

        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }

        if(this.speed!=0){
            const flip=this.speed>0?1:-1;
            if(this.controls.left){
                this.angle+=0.05;
            }
            if(this.controls.right){
                this.angle-=0.05;
            }
        }

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;

    }

    draw(ctx,color, drawSensor=false){
        if(this.damaged){
            ctx.fillStyle="gray";
        }else{
            ctx.fillStyle=color;
        }

        if(this.sensor && drawSensor){
            this.sensor.draw(ctx);
        };


        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();

    }
}