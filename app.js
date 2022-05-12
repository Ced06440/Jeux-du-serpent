const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

// vitesse de deplacement du serpent sur l'axe x (en pixel)
vx = 0;
// vitesse de deplacement du serpent sur l'axe y (en pixel)
vy = -10;
//Bug direction
let bugDirection = false;
//Pomme
let pommeX = 0;
let pommeY = 0;

//Serpent
let serpent = [ {x:140, y:200}, {x:130, y:200}, {x:120, y:200}, {x:110, y:200} ]

function nettoieLeCanvas (){
    ctx.fillStyle = "#558776";
    ctx.strokeStyle ='#A3A847';
    ctx.fillRect (0,0,canvas.width,canvas.height);
    ctx.strokeRect (0,0,canvas.width,canvas.height);

}

function animation (){

    setTimeout (function() {
    bugDirection = false;    
    nettoieLeCanvas();
    dessinePomme();
    faireAvancerLeSeprent();
    if(finDuJeu()){
        recommencer();
        return;
    }
    dessineLeSerpent();
    animation();

    }, 100);
}
animation();
creerPomme();


function dessineLesMorceaux (morceau){
    ctx.fillStyle ='#A3A847';
    ctx.strokeStyle ='#A3A847';
    ctx.fillRect (morceau.x,morceau.y, 10,10);
    ctx.strokeRect (morceau.x,morceau.y, 10,10);
}

function dessineLeSerpent (){
    serpent.forEach(morceau =>{
        dessineLesMorceaux(morceau)
    })
}
function faireAvancerLeSeprent(){
    const head = {x : serpent[0].x + vx, y : serpent[0].y + vy};
    serpent.unshift(head);
    const serpentMangePomme = serpent[0].x === pommeX && serpent[0].y === pommeY;

    if(serpentMangePomme){
        score += 10;
        document.getElementById('score').innerHTML = score;
        creerPomme();
    } else {
        serpent.pop();
    }
    
}

dessineLeSerpent();

document.addEventListener('keydown', changerDeDirection);

function changerDeDirection (event){

    if(bugDirection)return;
    bugDirection = true;

    const FLECHE_DROITE = 39;
    const FLECHE_GAUCHE = 37;
    const FLECHE_HAUT = 38;
    const FLECHE_BAS  = 40;

    const direction = event.keyCode;

    const monter = vy === -10;
    const descendre = vy === 10;
    const aGauche = vx === -10;
    const aDroite = vx === 10;

    if(direction === FLECHE_GAUCHE && !aDroite){ vx = -10, vy = 0;};
    if(direction === FLECHE_DROITE && !aGauche){ vx = 10, vy = 0;};
    if(direction === FLECHE_HAUT && !descendre){ vx = 0, vy = -10;};
    if(direction === FLECHE_BAS && !monter){ vx = 0, vy = 10;};

}

function random(){
    return Math.round((Math.random() * 290) /10) * 10;
}

function creerPomme(){
    pommeX = random();
    pommeY = random();

    // connaitre la place de la pomme
    //console.log(pommeX, pommeY);

    serpent.forEach(function (part){
        const pommeSurSerpent = part.x == pommeX && part.y == pommeY;

        if(pommeSurSerpent){
            creerPomme();
        }
    })  
}

function dessinePomme(){
    ctx.fillStyle ='red';
    ctx.strokeStyle ='black';
    ctx.beginPath();
    ctx.arc(pommeX +5,pommeY +5,5, 0, 2*Math.PI);
    ctx.stroke();
    ctx.fill();
}

function finDuJeu(){
    serpentSansTete = serpent.slice(1,-1);
    let mordu = false;

    serpentSansTete.forEach(morceau =>{
        if(morceau.x === serpent[0].x && morceau.y === serpent[0].y)
        mordu = true;
    })
    const toucheMurGauche = serpent[0].x < -1;
    const toucheMurDroit = serpent[0].x > canvas.width - 10;
    const toucheMurHaut = serpent[0].y < -1;
    const toucheMurBas = serpent[0].y > canvas.height - 10;

    let gameOver = false

    if(mordu || toucheMurBas || toucheMurDroit || toucheMurGauche || toucheMurHaut){
        gameOver = true;
    }
    return gameOver;
}
 function recommencer(){
     const restart = document.getElementById('recommencer');
     restart.style.display = "block";

     document.addEventListener('keydown',(e)=>{
         if(e.keyCode === 32){
        document.location.reload(true);
         }
     })
    
 }