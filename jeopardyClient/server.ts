import path, { resolve } from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import mysql2, { type Connection } from 'mysql2';


const __dirname: string = path.dirname(fileURLToPath(import.meta.url));
const app: express = express();
const PORT: number = 4000;


let con = mysql2.createConnection({
   host: "localhost",
   user: "root",
   password: "watchFactory",
   database: "jeopardy"
});

con.connect(function(err) {
   if (err) throw err;
});

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "/views"));


app.get('/', getHTML);

function getHTML(req: express.Request, res: express.Response){
    res.status(200);
    res.render('index');
}

app.get('/question', getQuestion);

async function getQuestion(req: express.Request, res: express.Response){
    const trivia: object[] = await getSquares();
    //console.log(trivia);
    const id: number = Number(req.query.id);
    completeSquare(id);

    console.log("ID" + id);
    res.status(200);
    res.render('question',{question: trivia[id-1].question, 'answer': trivia[id-1].answer});

}

app.post('/updateScore', updateScore);

async function updateScore(req: express.Request, res: express.Response){

    let task: string = req.body["task"];
    let updateQuery: string = '';
    console.log(task);

    switch(task){
        case "player1+":
            updateQuery = "UPDATE scores SET player1 = player1 + 200";
            break;

        case "player1-":
            updateQuery = "UPDATE scores SET player1 = player1 - 200";
            break;

        case "player2+":
            updateQuery = "UPDATE scores SET player2 = player2 + 200";
            break;

        case "player2-":
            updateQuery = "UPDATE scores SET player2 = player2 - 200";
            break;

        case "player3+":
            updateQuery = "UPDATE scores SET player3 = player3 + 200";
            break;

        case "player3-":
            updateQuery = "UPDATE scores SET player3 = player3 - 200";
            break;
    }
    console.log(updateQuery);
    return new Promise((resolve, reject) => {
      con.query(updateQuery, (error, results) => {
          if (error) reject(error);
          //console.log(results);
          resolve(results);
      });
    });
}

app.get('/getScores', getScores);

async function getScores(req: express.Request, res: express.Response){
    res.status(200);
   let scoresPromise  =  new Promise((resolve, reject) => {
      con.query('SELECT * FROM scores;', (error, results) => {
          if (error) reject(error);
          //console.log(results);
          resolve(results);
      });
  });
  let scores = await scoresPromise;
  res.send(scores);
}

app.get('/reset', reset);

async function reset(req: express.Request, res: express.Response){
    res.status(200);
   let truncateScores =  new Promise((resolve, reject) => {
      con.query('TRUNCATE TABLE scores;', (error, results) => {
          if (error) reject(error);
          resolve(results);
      });
    });
   let resetScores =  new Promise((resolve, reject) => {
      con.query('INSERT INTO scores(player1, player2, player3) VALUES (0,0,0);', (error, results) => {
          if (error) reject(error);
          resolve(results);
      });
    });
    let resetSquares  =  new Promise((resolve, reject) => {
      con.query('UPDATE squares SET completed = 0;', (error, results) => {
          if (error) reject(error);
          //console.log(results);
          resolve(results);
      });
  });
}
function getSquares(){
   return new Promise((resolve, reject) => {
      con.query('SELECT * FROM squares;', (error, results) => {
          if (error) reject(error);
          //console.log(results);
          resolve(results);
      });
  });
}

app.get('/playedSquares', getPlayedSquares);

function completeSquare(id:number){
   return new Promise((resolve, reject) => {
      con.query('UPDATE squares SET completed = 1 WHERE id = ?;', id, (error, results) => {
          if (error) reject(error);
          //console.log(results);
          resolve(results);
      });
  });
}

async function getPlayedSquares(request: express.Request, response: express.Response){
    response.status(200);
   let squaresPromise  =  new Promise((resolve, reject) => {
      con.query('SELECT id from squares WHERE completed = 1;', (error, results) => {
          if (error) reject(error);
          //console.log(results);
          resolve(results);
      });
  });
  let squares = await squaresPromise;
  response.send(squares);

  
}
//let trivia = getSquares();

/*
setTimeout(function () {
    fs.writeFile('data.json', trivia.toString(), 'utf8', (err) => {
  if (err) {
    console.error('Error writing file:', err);
  }})
}, 120000);
*/



app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running,and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);   
