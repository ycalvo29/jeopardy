
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

function getScores(){

    let xhr = new XMLHttpRequest();
    const target = new URL('http://localhost:9000/graphql');
    xhr.open("POST", target, true);
    xhr.setRequestHeader("Content-type", "application/json");
    let query = "{scores{player1 player2 player3}}";
    const payload = JSON.stringify({query: query});
    xhr.send(payload);


    xhr.onreadystatechange = function (){
    if(this.readyState ==4 && this.status == 200){

        let res = JSON.parse(this.response).data.scores;

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


window.onload = (event) => {

    let xhr = new XMLHttpRequest();
    const target = 'http://localhost:9000/graphql';
    xhr.open("POST", target, true);
    xhr.setRequestHeader("Content-type", "application/json");
    const query = "{playedSquares{id}}";
    let jsonPayload = JSON.stringify({query: query});
    console.log(jsonPayload);

    xhr.send(jsonPayload);

    xhr.onreadystatechange = function (){
        if(this.readyState ==4 && this.status == 200){
            console.log(this.response);
            let squares = JSON.parse(this.response).data.playedSquares;
            squares.forEach(element => {
                console.log(element.id);
                document.getElementById(element.id).innerHTML = "";
            });
        }
    } 
    getScores();
};

function updateScore(event){
    let task = event.target.id;
    let player = event.target.parentElement.id;

    let xhr = new XMLHttpRequest();
    const target = 'http://localhost:9000/graphql';
    xhr.open("POST", target, true);
    xhr.setRequestHeader("Content-type", "application/json");
    let query = {
            query: 'mutation UpdateScore($name: String!){ \n updateScore(task: $name) \n}',
            variables : {name:task},
    };                      

    const jsonPayload = JSON.stringify(query);
    console.log(jsonPayload);      
    xhr.send(jsonPayload);
    getScores();
};


function reset(){
    let xhr = new XMLHttpRequest();
    const target = new URL('http://localhost:9000/graphql');
    xhr.open("POST", target, true);
    xhr.setRequestHeader("Content-type", "application/json");
    const query = "mutation{reset}";
    let jsonPayload = JSON.stringify({query: query});
    console.log(jsonPayload);

    xhr.send(jsonPayload);
    location.reload();

};