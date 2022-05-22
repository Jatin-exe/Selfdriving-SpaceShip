// We are only considering Asteroids as Obstacles for now

class Obstacles{
    constructor(obType,obHeight, obMaxSpeed=4, obDiff=0.4, obMaxRad = 100){ 
        this.obType = obType; // Obstacle Type ( Asteroid, Commet , Black hole, Debris, Gravity Well)


        this.angle = Math.PI*2*(Math.random()*2 -1); // Creates Random Angle
        this.speed = obMaxSpeed*obDiff; // obDiff = Obstacle Difficulty

        const spaceCanvas=document.getElementById("spaceCanvas");
        this.x = Math.random()*spaceCanvas.width;
        this.y = obHeight;

        this.radius = (Math.random()+1)*obMaxRad;


    }

    update(){
        //Moveing
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;

        //updatin polygon
        this.polygon = this.#createPolygon2();
    }

    #createPolygon2(){
        const points = [];
        const s = this.radius/2;

        points.push({
            x:this.x+s,
            y:this.y+s
        });
        points.push({
            x:this.x+s,
            y:this.y-s
        });
        points.push({
            x:this.x-s,
            y:this.y+s
        });
        points.push({
            x:this.x-s,
            y:this.y-s
        });

        return points;

    }


    draw(ctx){
        ctx.fillStyle = "white";

        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();

    }



}