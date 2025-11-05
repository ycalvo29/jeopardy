import './App.css';
import { useEffect, useState } from 'react';
//import { generateGame } from './generateQuestions.ts';

function Square({ id, value, completed, setSquareClicked, setID }) {

  const [squareStyle, setSquareStyle] = useState(completed === 0 ? "unplayedSquare" : "playedSquare");

  if (squareStyle === "playedSquare" && completed === 0) {
    setSquareStyle("unplayedSquare");
  }

  function onSquareClick() {
    setSquareStyle("playedSquare");
    setSquareClicked(true);
    console.log(id);
    setID(id);
  }

  return (
    <div className={squareStyle} onClick={onSquareClick}>
      {value}
    </div>
  );
}
function ScoreBoard() {

  const [player1Score, setplayer1Score] = useState(null);
  const [player2Score, setplayer2Score] = useState(null);
  const [player3Score, setplayer3Score] = useState(null);


  function updateScore1Plus() {
    setplayer1Score(player1Score + 200);
  }
  function updateScore1Minus() {
    setplayer1Score(player1Score - 200);
  }

  function updateScore2Plus() {
    setplayer2Score(player2Score + 200);
  }
  function updateScore2Minus() {
    setplayer2Score(player2Score - 200);
  }
  function updateScore3Plus() {
    setplayer3Score(player3Score + 200);
  }
  function updateScore3Minus() {
    setplayer3Score(player3Score - 200);
  }

  useEffect(() => { //get scores from database
    console.log("GET SCORES FROM DATABASE--------------------------------------------------------------------------------------------");
    let xhr = new XMLHttpRequest();
    const target = new URL('http://localhost:9000/graphql');
    xhr.open("POST", target, true);
    xhr.setRequestHeader("Content-type", "application/json");
    let query = "{scores{player1 player2 player3}}";
    const payload = JSON.stringify({ query: query });
    xhr.send(payload);


    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {

        let res = JSON.parse(this.response).data.scores;
        console.log(res);

        console.log(res);
        setplayer1Score(res[0].player1);
        setplayer2Score(res[0].player2);
        setplayer3Score(res[0].player3);
      }
    }
  }, []);


  function updateScore(playerInput, scoreInput) {

    if (scoreInput === null) {
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
      variables: { player: playerInput, score: scoreInput },
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


  }, [player1Score, player2Score, player3Score]);



  return (
    <>
      <div className="scoreboard">
        <div id="player1">
          <h7 contentEditable="true">Player 1: </h7> <h7 id="score1">{player1Score}</h7>
          <button onClick={updateScore1Plus} id="player1+"> + </button>
          <button onClick={updateScore1Minus} id="player1-"> - </button>
        </div>
        <div id="player2">
          <h7 contentEditable="true">Player 2: </h7> <h7 id="score2">{player2Score}</h7>
          <button onClick={updateScore2Plus} id="player2+"> + </button>
          <button onClick={updateScore2Minus} id="player2-"> - </button>
        </div>
        <div id="player3">
          <h7 contentEditable="true">Player 3: </h7> <h7 id="score3">{player3Score}</h7>
          <button onClick={updateScore3Plus} id="player3+"> + </button>
          <button onClick={updateScore3Minus} id="player3-"> - </button>
        </div>
      </div>
    </>

  );

}

function Board({ setSquareClicked, setID, category1, category2, category3, category4, category5, category6 }) {

  const categories = JSON.parse("{\"trivia_categories\":[{\"id\":9,\"name\":\"General Knowledge\"},{\"id\":10,\"name\":\"Entertainment: Books\"},{\"id\":11,\"name\":\"Entertainment: Film\"},{\"id\":12,\"name\":\"Entertainment: Music\"},{\"id\":13,\"name\":\"Entertainment: Musicals & Theatres\"},{\"id\":14,\"name\":\"Entertainment: Television\"},{\"id\":15,\"name\":\"Entertainment: Video Games\"},{\"id\":16,\"name\":\"Entertainment: Board Games\"},{\"id\":17,\"name\":\"Science & Nature\"},{\"id\":18,\"name\":\"Science: Computers\"},{\"id\":19,\"name\":\"Science: Mathematics\"},{\"id\":20,\"name\":\"Mythology\"},{\"id\":21,\"name\":\"Sports\"},{\"id\":22,\"name\":\"Geography\"},{\"id\":23,\"name\":\"History\"},{\"id\":24,\"name\":\"Politics\"},{\"id\":25,\"name\":\"Art\"},{\"id\":26,\"name\":\"Celebrities\"},{\"id\":27,\"name\":\"Animals\"},{\"id\":28,\"name\":\"Vehicles\"},{\"id\":29,\"name\":\"Entertainment: Comics\"},{\"id\":30,\"name\":\"Science: Gadgets\"},{\"id\":31,\"name\":\"Entertainment: Japanese Anime & Manga\"},{\"id\":32,\"name\":\"Entertainment: Cartoon & Animations\"}]}")["trivia_categories"];

  const [playedSquares, setPlayedSquares] = useState([
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
    let jsonPayload = JSON.stringify({ query: query });

    xhr.send(jsonPayload);

    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        let squares = JSON.parse(this.response).data.playedSquares;
        console.log("SQUARES");
        console.log(squares);
        setPlayedSquares(squares);
      }
    }
  }, []);


  function resetButton() {
    console.log("RESET BUTTON");
    let xhr = new XMLHttpRequest();
    const target = new URL('http://localhost:9000/graphql');
    xhr.open("POST", target, true);
    xhr.setRequestHeader("Content-type", "application/json");
    const query = "mutation{reset}";
    let jsonPayload = JSON.stringify({ query: query });
    console.log(jsonPayload);

    xhr.send(jsonPayload);
    //setReset(true);
    window.location.reload();
  }


  return (
    <>
      <div className='categories'>
        <div>{categories[category1 - 9].name}</div>
        <div>{categories[category2 - 9].name}</div>
        <div>{categories[category3 - 9].name}</div>
        <div>{categories[category4 - 9].name}</div>
        <div>{categories[category5 - 9].name}</div>
        <div>{categories[category6 - 9].name}</div>
      </div>

      <div className='board'>
        <Square id="1" value="$200" completed={playedSquares[0].completed} setSquareClicked={setSquareClicked} setID={setID} />
        <Square id="2" value="$400" completed={playedSquares[1].completed} setSquareClicked={setSquareClicked} setID={setID} />
        <Square id="3" value="$600" completed={playedSquares[2].completed} setSquareClicked={setSquareClicked} setID={setID} />
        <Square id="4" value="$800" completed={playedSquares[3].completed} setSquareClicked={setSquareClicked} setID={setID} />
        <Square id="5" value="$1000" completed={playedSquares[4].completed} setSquareClicked={setSquareClicked} setID={setID} />

        <Square id="6" value="$200" completed={playedSquares[5].completed} setSquareClicked={setSquareClicked} setID={setID} />
        <Square id="7" value="$400" completed={playedSquares[6].completed} setSquareClicked={setSquareClicked} setID={setID} />
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
      <ScoreBoard />

    </>
  );
}

function Question({ setSquareClicked, id }) {

  const [question, setQuestion] = useState("What is the square root of 64");
  const [answer, setAnswer] = useState("8");
  const [answerVis, setAnswerVis] = useState("AnswerHid");
  const [firstClick, setFirstClick] = useState(true);

  function handleClick() {
    if (firstClick) {
      setFirstClick(false);
      setAnswerVis("AnswerVis");
    } else {
      setSquareClicked(false);
      setAnswerVis("AnswerHid");
    }
  };

  useEffect(() => {
    const target = 'http://localhost:9000/graphql';

    console.log("question id" + id);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", target, true);
    xhr.setRequestHeader("Content-type", "application/json");
    let query = { query: '{ \n question(id : ' + id + ') {\n question answer \n} \n}' };
    let jsonPayload = JSON.stringify(query);
    xhr.send(jsonPayload);

    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log(this.response);

        let response = JSON.parse(this.response);
        setQuestion(response.data.question.question);
        setAnswer(response.data.question.answer);
      }
    }
  }, [id]);


  return (
    <div className="QuestionPage" onClick={handleClick}>
      <h6 className='Question' >{question}</h6>
      <h6 className={answerVis}>{answer}</h6>

    </div>
  );
}

function Game({ category1, category2, category3, category4, category5, category6 }) {

  const [squareClicked, setSquareClicked] = useState(false);
  const [id, setID] = useState(0);

  return (
    <>
      {squareClicked ? <Question id={id} setSquareClicked={setSquareClicked} /> :
        <Board setID={setID} setSquareClicked={setSquareClicked} category1={category1} category2={category2} category3={category3} category4={category4} category5={category5} category6={category6}
        />}
    </>

  );
}
function SetupScreen({ category1, category2, category3, category4, category5, category6, setCategory1, setCategory2, setCategory3, setCategory4, setCategory5, setCategory6, startGame }) {

  const categories = JSON.parse("{\"trivia_categories\":[{\"id\":9,\"name\":\"General Knowledge\"},{\"id\":10,\"name\":\"Entertainment: Books\"},{\"id\":11,\"name\":\"Entertainment: Film\"},{\"id\":12,\"name\":\"Entertainment: Music\"},{\"id\":13,\"name\":\"Entertainment: Musicals & Theatres\"},{\"id\":14,\"name\":\"Entertainment: Television\"},{\"id\":15,\"name\":\"Entertainment: Video Games\"},{\"id\":16,\"name\":\"Entertainment: Board Games\"},{\"id\":17,\"name\":\"Science & Nature\"},{\"id\":18,\"name\":\"Science: Computers\"},{\"id\":19,\"name\":\"Science: Mathematics\"},{\"id\":20,\"name\":\"Mythology\"},{\"id\":21,\"name\":\"Sports\"},{\"id\":22,\"name\":\"Geography\"},{\"id\":23,\"name\":\"History\"},{\"id\":24,\"name\":\"Politics\"},{\"id\":25,\"name\":\"Art\"},{\"id\":26,\"name\":\"Celebrities\"},{\"id\":27,\"name\":\"Animals\"},{\"id\":28,\"name\":\"Vehicles\"},{\"id\":29,\"name\":\"Entertainment: Comics\"},{\"id\":30,\"name\":\"Science: Gadgets\"},{\"id\":31,\"name\":\"Entertainment: Japanese Anime & Manga\"},{\"id\":32,\"name\":\"Entertainment: Cartoon & Animations\"}]}")["trivia_categories"];

  const [submit, setSubmit] = useState("false");

  function handleChange1(e) {
    setCategory1(e.target.value);
    console.log(e.target.value);
  }
  function handleChange2(e) {
    setCategory2(e.target.value);
  }
  function handleChange3(e) {
    setCategory3(e.target.value);
  }
  function handleChange4(e) {
    setCategory4(e.target.value);
  }
  function handleChange5(e) {
    setCategory5(e.target.value);
  }
  function handleChange6(e) {
    setCategory6(e.target.value);
  }
  function handleSubmit() {
    setSubmit(true);
  }

 useEffect(() => {
    if(submit === true){
      return;
    }

    const target = 'http://localhost:9000/graphql';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", target, true);
    xhr.setRequestHeader("Content-type", "application/json");
    let query = { query: 'query{categories}' };
    let jsonPayload = JSON.stringify(query);
    xhr.send(jsonPayload);

    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log(this.response);
        let result = JSON.parse(this.response).data.categories;
        setCategory1(result[0]);
        setCategory2(result[1]);
        setCategory3(result[2]);
        setCategory4(result[3]);
        setCategory5(result[4]);
        setCategory6(result[5]);

      }
    }
  }, []);

  useEffect(() => {

    if (category1 === null|| category2 === null|| category3 === null|| category4 === null|| category5 === null|| category6 === null) {
      return;
    }

    const target = 'http://localhost:9000/graphql';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", target, true);
    xhr.setRequestHeader("Content-type", "application/json");
    let query = { query: 'mutation($category1:Int!,$category2:Int!, $category3:Int!, $category4:Int!, $category5:Int!, $category6:Int!) {setCategories(categories :[$category1, $category2,$category3,$category4,$category5, $category6])} ', variables: { category1: category1, category2: category2, category3: category3, category4: category4, category5: category5, category6: category6 } }
    let jsonPayload = JSON.stringify(query);
    xhr.send(jsonPayload);

    console.log("SET CATEGORIES");
    console.log(jsonPayload);

    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        console.log(this.response);
      }
    }
  }, [submit]);


 




  return (
    <>
      <div className='Home'>
        <button onClick={startGame}> Resume Previous Game? </button>
        <div className="newGame">
          <h7>Start New Game: </h7>

          <form name="catForm" id="catForm" onSubmit={handleSubmit}>
            <div>
              Category 1:
              <select value={category1} onChange={handleChange1} name="category1" id="category1" >
                {categories.map((cat) => { return <option value={cat.id} > {cat.name} </option> })}
              </select>
            </div>
            <div>
              Category 2:
              <select value={category2} onChange={handleChange2} name="category2" id="category2">
                {categories.map((cat) => { return <option value={cat.id}> {cat.name} </option> })}
              </select>
            </div>

            <div>
              Category 3:
              <select value={category3} onChange={handleChange3} name="category3" id="category3">
                {categories.map((cat) => { return <option value={cat.id}> {cat.name} </option> })}
              </select>
            </div>
            <div>
              Category 4:
              <select value={category4} onChange={handleChange4} name="category4" id="category4">
                {categories.map((cat) => { return <option value={cat.id}> {cat.name} </option> })}
              </select>
            </div>
            <div>
              Category 5:
              <select value={category5} onChange={handleChange5} name="category5" id="category5">
                {categories.map((cat) => { return <option value={cat.id}> {cat.name} </option> })}
              </select>

            </div>
            <div>
              Category 6:
              <select value={category6} onChange={handleChange6} name="category6" id="category6">
                {categories.map((cat) => { return <option value={cat.id}> {cat.name} </option> })}
              </select>
            </div>
            <button type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

function Home() {

  const [start, setStart] = useState(false);

  const [category1, setCategory1] = useState(null);
  const [category2, setCategory2] = useState(null);
  const [category3, setCategory3] = useState(null);
  const [category4, setCategory4] = useState(null);
  const [category5, setCategory5] = useState(null);
  const [category6, setCategory6] = useState(null);

  function startGame() {
    setStart(true);
  }

  return (
    <>
      {start ? <Game category1={category1} category2={category2} category3={category3} category4={category4} category5={category5} category6={category6} />
        : <SetupScreen category1={category1} category2={category2} category3={category3} category4={category4} category5={category5} category6={category6}
          setCategory1={setCategory1} setCategory2={setCategory2} setCategory3={setCategory3} setCategory4={setCategory4} setCategory5={setCategory5} setCategory6={setCategory6} startGame={startGame} />}
    </>

  );
}
export default Home
