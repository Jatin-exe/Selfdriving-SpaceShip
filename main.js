const spaceCanvas=document.getElementById("spaceCanvas");
spaceCanvas.width=window.innerWidth*0.6;

const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=window.innerWidth*0.5;

const spaceCtx = spaceCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const space=new Space(spaceCanvas.width/2,spaceCanvas.width*0.95);



const N = 10;
const spaceships = generateShips(N);
//const spaceship=new SpaceShip(space.getLaneCenter(2),0,30,50,"AI");
const obstacles = [
    new Obstacles("ast",-800),
    new Obstacles("ast",-800),
    new Obstacles("ast",-800),
    new Obstacles("ast",-800),
    new Obstacles("ast",-800),
    new Obstacles("ast",-800),
    new Obstacles("ast",-800),
    
];

let obpoint = -800; //Distance after which new obstacles are created


//loading best ship/brain
let bestShip = spaceships[0];
if(localStorage.getItem("bestBrain")){
    for(let i =0;i<spaceships.length;i++){
        spaceships[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")
        );

        if(i!=0){
            NeuralNetwork.mutate(spaceships[i].brain,0.1); //Mutation
        }
    }
}

function generateShips(N){
    const ships = [];
    for(let i = 0;i<N;i++){
        ships.push(new SpaceShip(space.getLaneCenter(2),0,30,50,"AI") );
    }
    return ships;
}


function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestShip.brain)
    );
}

function discard(){
    localStorage.removeItem("bestBrain");
}




function canvasUpdate(){ //boring canvas update stuff

    for(let i=0;i<obstacles.length;i++){
        obstacles[i].update()
    }
    for(let i =0;i<N;i++){ 
        if(!spaceships[i].damaged){
            spaceships[i].update(space.borders,obstacles);
        };    
    };

    spaceCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;
    spaceCtx.save();
    spaceCtx.translate(0,-bestShip.y+spaceCanvas.height*0.9); 

    // Can translate and amke teh agam eendless in horizontal directions too later
    //cuz space is endless

    space.draw(spaceCtx);


}
function animate(){

    canvasUpdate();


    // Fitness Function => minimizeAll(y value, damage, time)
    bestShip = spaceships.find(s=>s.y==Math.min(
        ...spaceships.map(s=>s.y)
    ));


    

    for(let i=0;i<obstacles.length;i++){
        obstacles[i].draw(spaceCtx);
    }
    for(let i =0;i<N;i++){
        spaceships[i].draw(spaceCtx,"blue");
    }
    spaceCtx.globalAlpha = 1;
    bestShip.draw(spaceCtx,"blue", true);
    spaceCtx.restore();

    //Visualizing NeuralNetork
    /*
    if(bestShip.y<obpoint){
        obpoint -= 900;
        for(let i = 0;i<8;i++){
            obstacles.push(new Obstacles("ast",obpoint));
        }
    }
    */
    //Visualizer.drawNetwork(networkCtx,bestShip.brain);



    requestAnimationFrame(animate);
}


animate();



//Todo / thoughts

/*
 eject ship if its damaged 
 start optimizing
 a view of what the car can currnelty see using ray and offsets .. we playing with liek thi svs we palying  with ai's eyes
one problem with this is that it cant predict the futuree how those objects and an asteroid will move 
remove obstacles objects or stop updating them or delte thenm when they are outside of crtain distance of y value from the user or best car
 maybe if their seppe is never bound to collid then delte it 
 if theyare bound to collid ot user then it wil be insterstin g//
 on that note we need more asteroid comming from teh sides edges fo border //
 most of teh current ones start form our distance 

teach tehm the act of breaking , reverse and changin directino whil stayin gstil rotatino
these dont usually break or go in reverse

*/