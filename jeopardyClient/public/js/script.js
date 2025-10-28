

function squareClick(event) {
    id = event.target.getAttribute('id');
    document.getElementById(id).setAttribute("backgroundColor", "white");

    const target = new URL('http://localhost:4000/question');
    const params = new URLSearchParams();
    params.set('id', id);
    target.search = params.toString();
    console.log(target);

    let xhr = new XMLHttpRequest();
    xhr.open("GET", target, params, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();
    window.location.href = target;
    
}

window.onload = (event) => {
    getScores();

    let xhr = new XMLHttpRequest();
    const target = new URL('http://localhost:4000/playedSquares');
    xhr.open("GET", target, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();

    xhr.onreadystatechange = function (){
        if(this.readyState ==4 && this.status == 200){
            console.log(this.response);
            let squares = JSON.parse(this.response);
            squares.forEach(element => {
                console.log(element.id);
                document.getElementById(element.id).innerHTML = "";
            });
        }
    } 
    //event.preventDefault();
};

function updateScore(event){
    let task = event.target.id;
    let player = event.target.parentElement.id;
    console.log("player" + player);

    let xhr = new XMLHttpRequest();
    
    let url = "http://localhost:4000/updateScore";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    const dataToSend = {"task": task};
    const jsonPayload = JSON.stringify(dataToSend);
    xhr.send(jsonPayload);

    getScores();
function getScores(event){

    let xhr = new XMLHttpRequest();
    const target = new URL('http://localhost:4000/getScores');
    xhr.open("GET", target, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();


    xhr.onreadystatechange = function (){
    if(this.readyState ==4 && this.status == 200){

        let res = JSON.parse(this.response);

        console.log(res);

        player1Score = document.getElementById("score1");
        player1Score.innerHTML = res[0].player1;

        player2Score = document.getElementById("score2");
        player2Score.innerHTML = res[0].player2;

        player3Score = document.getElementById("score3");
        player3Score.innerHTML = res[0].player3;
    }
  } 
};
function getScores(event){

    let xhr = new XMLHttpRequest();
    const target = new URL('http://localhost:4000/getScores');
    xhr.open("GET", target, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();


    xhr.onreadystatechange = function (){
    if(this.readyState ==4 && this.status == 200){

        let res = JSON.parse(this.response);

        console.log(res);

        player1Score = document.getElementById("score1");
        player1Score.innerHTML = res[0].player1;

        player2Score = document.getElementById("score2");
        player2Score.innerHTML = res[0].player2;

        player3Score = document.getElementById("score3");
        player3Score.innerHTML = res[0].player3;
    }
  } 
};


    
};

function getScores(event){

    let xhr = new XMLHttpRequest();
    const target = new URL('http://localhost:4000/getScores');
    xhr.open("GET", target, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send();


    xhr.onreadystatechange = function (){
    if(this.readyState ==4 && this.status == 200){

        let res = JSON.parse(this.response);

        console.log(res);

        player1Score = document.getElementById("score1");
        player1Score.innerHTML = res[0].player1;

        player2Score = document.getElementById("score2");
        player2Score.innerHTML = res[0].player2;

        player3Score = document.getElementById("score3");
        player3Score.innerHTML = res[0].player3;
    }
  } 
};

function reset(){
    let xhr = new XMLHttpRequest();
    const target = new URL('http://localhost:4000/reset');
    xhr.open("GET", target, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(); 
    location.reload();

};