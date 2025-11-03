import './App.css';
import { useEffect, useState} from 'react';

function Square({id, value, completed, setSquareClicked, setID}) {

  const [squareStyle, setSquareStyle] = useState(completed === 0? "unplayedSquare": "playedSquare");

  if (squareStyle === "playedSquare" && completed === 0){
    setSquareStyle("unplayedSquare");
  }

  function onSquareClick(){
    setSquareStyle("playedSquare");
    setSquareClicked(true); 
    setID(id);
  }

  return(
    <div className={squareStyle} onClick={onSquareClick}>
      {value}
    </div>
  );
}
function ScoreBoard(){

  const [player1Score,  setplayer1Score] = useState(null);
  const [player2Score,  setplayer2Score] = useState(null);
  const [player3Score,  setplayer3Score] = useState(null);


  function updateScore1Plus(){
      setplayer1Score(player1Score + 200);
  }
  function updateScore1Minus(){
      setplayer1Score(player1Score - 200);
  }

  function updateScore2Plus(){
      setplayer2Score(player2Score + 200);
  }
  function updateScore2Minus(){
      setplayer2Score(player2Score - 200);
  }
    function updateScore3Plus(){
      setplayer3Score(player3Score + 200);
    }
  function updateScore3Minus(){
      setplayer3Score(player3Score - 200);
  }

  useEffect(() => { //get scores from database
    console.log("GET SCORES FROM DATABASE--------------------------------------------------------------------------------------------");      
    let xhr = new XMLHttpRequest();
    const target = new URL('http://localhost:9000/graphql');
    xhr.open("POST", target, true);
    xhr.setRequestHeader("Content-type", "application/json");
    let query = "{scores{player1 player2 player3}}";
    const payload = JSON.stringify({query: query});
    xhr.send(payload);


    xhr.onreadystatechange = function (){
    if(this.readyState === 4 && this.status === 200){

        let res = JSON.parse(this.response).data.scores;
        console.log(res);

        console.log(res);
        setplayer1Score(res[0].player1);
        setplayer2Score(res[0].player2);
        setplayer3Score(res[0].player3);
    }
  }
  },[]);


  function updateScore(playerInput, scoreInput){

     if(scoreInput === null){
      return;

     }
    //console.log("UPDATE SCORES");
    let xhr = new XMLHttpRequest();
    const target = 'http://localhost:9000/graphql';
    xhr.open("POST", target, true);
    xhr.setRequestHeader("Content-type", "application/json");

    console.log(scoreInput);
    let query = {
            query: 'mutation UpdateScore($player: String!, $score: Int!){ \n updateScore(player: $player, score: $score) \n}',
            variables : {player:playerInput, score: scoreInput},
      };
    const jsonPayload = JSON.stringify(query);
    console.log("PAYLOAD");
    console.log(jsonPayload);      
    xhr.send(jsonPayload);
  }

  useEffect(() => {
    console.log("UPDATE SCORES");
    updateScore("player1", player1Score);
    updateScore("player2", player2Score);
    updateScore("player3", player3Score);


    },[player1Score, player2Score, player3Score]);



  return(
    <>
    <div className="scoreboard">
      <div id="player1"> 
          <h7>Player 1: </h7> <h7 id="score1">{player1Score}</h7>
          <button onClick={updateScore1Plus} id="player1+"> + </button>
          <button onClick={updateScore1Minus} id="player1-"> - </button>
      </div>
      <div id="player2"> 
          <h7>Player 2: </h7> <h7  id="score2">{player2Score}</h7>
          <button onClick={updateScore2Plus} id="player2+"> + </button>
          <button onClick={updateScore2Minus} id="player2-"> - </button>
      </div>
      <div id="player3"> 
          <h7>Player 3: </h7> <h7 id="score3">{player3Score}</h7>
          <button onClick={updateScore3Plus} id="player3+"> + </button>
          <button onClick={updateScore3Minus} id="player3-"> - </button>
      </div>
  </div>
    </>

);

}

function Board({setSquareClicked, setID }){

  let categories = ["Math", "Mythology", "Board Games", "Vehicles", "Film", "Computer Science"];
  /*
  const [reset, setReset] = useState(false);
  useEffect(()=>{
   
     },[reset]) 

  */

  const[playedSquares, setPlayedSquares] = useState([
    { completed: 1 }, { completed: 1 },
    { completed: 1 }, { completed: 1 },
    { completed: 1 }, { completed: 1 },
    { completed: 1 }, { completed: 1 },
    { completed: 1 }, { completed: 1 },
    { completed: 1 }, { completed: 1 },
    { completed: 1 }, { completed: 1 },
    { completed: 1 }, { completed: 1 },
    { completed: 1 }, { completed: 1 },
    { completed: 1 }, { completed: 1 },
    { completed: 1 }, { completed: 1 },
    { completed: 1 }, { completed: 1 },
    { completed: 1 }, { completed: 1 },
    { completed: 1 }, { completed: 1 },
    { completed: 1 }, { completed: 1 },]);

  useEffect(() => {
    console.log(" GET PLAYED SQUARES!!!!");
    let xhr = new XMLHttpRequest();
    const target = 'http://localhost:9000/graphql';
    xhr.open("POST", target, true);
    xhr.setRequestHeader("Content-type", "application/json");
    const query = "{playedSquares{completed}}";
    let jsonPayload = JSON.stringify({query: query});

    xhr.send(jsonPayload);

    xhr.onreadystatechange = function (){
        if(this.readyState === 4 && this.status === 200){
            let squares = JSON.parse(this.response).data.playedSquares;
            setPlayedSquares(squares);
        }
    }  
  },[]);






  function resetButton(){
    console.log("RESET BUTTON");
    let xhr = new XMLHttpRequest();
    const target = new URL('http://localhost:9000/graphql');
    xhr.open("POST", target, true);
    xhr.setRequestHeader("Content-type", "application/json");
    const query = "mutation{reset}";
    let jsonPayload = JSON.stringify({query: query});
    console.log(jsonPayload);

    xhr.send(jsonPayload);
    //setReset(true);
    window.location.reload();
  }


  return(
    <>
      <div className='categories'>
        <div>{categories[0]}</div>
        <div>{categories[1]}</div>
        <div>{categories[2]}</div>
        <div>{categories[3]}</div>
        <div>{categories[4]}</div>
        <div>{categories[5]}</div>
      </div>

      <div className='board'>
        <Square id="1" value="$200" completed={playedSquares[0].completed} setSquareClicked={setSquareClicked} setID={setID} /> 
        <Square id="2" value="$400" completed={playedSquares[1].completed} setSquareClicked={setSquareClicked} setID={setID} />
        <Square id="3" value="$600" completed={playedSquares[2].completed} setSquareClicked={setSquareClicked} setID={setID} /> 
        <Square id="4" value="$800" completed={playedSquares[3].completed} setSquareClicked={setSquareClicked} setID={setID} />
        <Square id="5" value="$1000" completed={playedSquares[4].completed} setSquareClicked={setSquareClicked} setID={setID} />

        <Square id="6" value="$200" completed={playedSquares[5].completed} setSquareClicked={setSquareClicked} setID={setID} /> 
        <Square id="7" value="$400" completed={playedSquares[6].completed}setSquareClicked={setSquareClicked} setID={setID} />
        <Square id="8" value="$600" completed={playedSquares[7].completed} setSquareClicked={setSquareClicked} setID={setID} /> 
        <Square id="9" value="$800" completed={playedSquares[8].completed} setSquareClicked={setSquareClicked} setID={setID} />
        <Square id="10" value="$1000" completed={playedSquares[9].completed} setSquareClicked={setSquareClicked} setID={setID} />

        <Square id="11" value="$200" completed={playedSquares[10].completed} setSquareClicked={setSquareClicked} setID={setID} /> 
        <Square id="12" value="$400" completed={playedSquares[11].completed} setSquareClicked={setSquareClicked} setID={setID} />
        <Square id="13" value="$600" completed={playedSquares[12].completed} setSquareClicked={setSquareClicked} setID={setID} /> 
        <Square id="14" value="$800" completed={playedSquares[13].completed} setSquareClicked={setSquareClicked} setID={setID} />
        <Square id="15" value="$1000" completed={playedSquares[14].completed} setSquareClicked={setSquareClicked} setID={setID} />


        <Square id="16" value="$200" completed={playedSquares[15].completed} setSquareClicked={setSquareClicked} setID={setID} /> 
        <Square id="17" value="$400" completed={playedSquares[16].completed} setSquareClicked={setSquareClicked} setID={setID} />
        <Square id="18" value="$600" completed={playedSquares[17].completed} setSquareClicked={setSquareClicked} setID={setID} /> 
        <Square id="19" value="$800" completed={playedSquares[18].completed} setSquareClicked={setSquareClicked} setID={setID} />
        <Square id="20" value="$1000" completed={playedSquares[19].completed} setSquareClicked={setSquareClicked} setID={setID} />

        <Square id="21" value="$200" completed={playedSquares[20].completed} setSquareClicked={setSquareClicked} setID={setID} /> 
        <Square id="22" value="$400" completed={playedSquares[21].completed} setSquareClicked={setSquareClicked} setID={setID} />
        <Square id="23" value="$600" completed={playedSquares[22].completed} setSquareClicked={setSquareClicked} setID={setID} /> 
        <Square id="24" value="$800" completed={playedSquares[23].completed} setSquareClicked={setSquareClicked} setID={setID} />
        <Square id="25" value="$1000" completed={playedSquares[24].completed} setSquareClicked={setSquareClicked} setID={setID} />

        <Square id="26" value="$200" completed={playedSquares[25].completed} setSquareClicked={setSquareClicked} setID={setID} /> 
        <Square id="27" value="$400" completed={playedSquares[26].completed} setSquareClicked={setSquareClicked} setID={setID} />
        <Square id="28" value="$600" completed={playedSquares[27].completed} setSquareClicked={setSquareClicked} setID={setID} /> 
        <Square id="29" value="$800" completed={playedSquares[28].completed} setSquareClicked={setSquareClicked} setID={setID} />
        <Square id="30" value="$1000" completed={playedSquares[29].completed} setSquareClicked={setSquareClicked} setID={setID} />

      </div>
       <button onClick={resetButton} className="resetButton" value="Reset" > Reset</button>
       <ScoreBoard/>

    </>

  );
}

function Question({setSquareClicked, id}){

  const [question, setQuestion] = useState("What is the square root of 64");
  const [answer, setAnswer] = useState("8");
  const [answerVis, setAnswerVis] = useState("AnswerHid");
  const [firstClick, setFirstClick] = useState(true);

  function handleClick(){
    if (firstClick){
      setFirstClick(false);
      setAnswerVis("AnswerVis");
    }else{
      setSquareClicked(false);
      setAnswerVis("AnswerHid");
    }
  };

  useEffect(() => {
    const target = 'http://localhost:9000/graphql';

    let xhr = new XMLHttpRequest(); 
    xhr.open("POST", target, true);
    xhr.setRequestHeader("Content-type", "application/json");
    let query = {query: '{ \n question(id : ' + id + ') {\n question answer \n} \n}'};                      
    let jsonPayload = JSON.stringify(query);
    xhr.send(jsonPayload);

    xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        console.log(this.response);
        
        let response = JSON.parse(this.response);
        setQuestion(response.data.question.question);
        setAnswer(response.data.question.answer);
    }}
    }, [id]);


  return(
      <div className="QuestionPage" onClick={handleClick}>
          <h6 className='Question' >{question}</h6>
          <h6 className={answerVis}>{answer}</h6>

      </div>
  );
}

function Game(){

  const [squareClicked, setSquareClicked] = useState(false)
  const [id, setID] = useState(0);

  return (
    <>
       {squareClicked? <Question id={id} setSquareClicked={setSquareClicked}/> : <Board setID={setID} setSquareClicked={setSquareClicked}
       />}
    </>

  );
}
export default Game
