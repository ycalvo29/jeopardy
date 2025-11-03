import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path, { resolve } from 'path';
import mysql2 from 'mysql2';
import { fileURLToPath } from 'url';
import fs from 'fs';
import {makeExecutableSchema} from 'graphql-tools';
import {graphiqlExpress,graphqlExpress} from 'apollo-server-express';

const __dirname: string = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 9000;
const app = express();

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


function getHTML(req: express.Request, res: express.Response){
    res.status(200);
    res.render('index');
}

function getQuestion(root,args,context,info){
    //const trivia: object[] = await getSquares();
    const id: number = Number(args.id);

    console.log("id: " + id);
    completeSquare(id);


    return new Promise((resolve, reject) => {
      con.query('SELECT question, answer FROM squares WHERE ID = ?;', id, (error, results) => {
          if (error) reject(error);
          console.log(results);
          resolve(results[0]);
      });
  });

}

function updateScore(root,args,context,info){

    //let task: string = args.task;
    //console.log(task)
    let updateQuery: string = '';


    updateQuery = "UPDATE scores SET " + args.player + " = " + args.score + ";";

    return new Promise((resolve, reject) => {
      con.query(updateQuery, (error, results) => {
          if (error) reject(error);
          resolve(results);
      });
    });
}

async function getScores(root,args,context,info){

   return new Promise((resolve, reject) => {
      con.query('SELECT * FROM scores;', (error, results) => {
          if (error) reject(error);
          //console.log(results);
          resolve(results);
      });
  });

}

async function reset(root,args,context,info){

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

function completeSquare(id:number){
   return new Promise((resolve, reject) => {
      con.query('UPDATE squares SET completed = 1 WHERE id = ?;', id, (error, results) => {
          if (error) reject(error);
          //console.log(results);
          resolve(results);
      });
  });
}

async function getPlayedSquares(root,args,context,info){

   return new Promise((resolve, reject) => {
      con.query('SELECT completed from squares;', (error, results) => {
          if (error) reject(error);
          console.log(results);
          resolve(results);
      });
  });

}

const resolvers = {
   Query: {
      question: getQuestion,
      scores: getScores,
      playedSquares: getPlayedSquares
   },
   Mutation:{
      updateScore: updateScore,
      reset: reset
   }
};

const typeDefs = fs.readFileSync('./schema.graphql',{encoding:'utf-8'});
const schema = makeExecutableSchema({typeDefs, resolvers});

app.use(cors(), bodyParser.json());

app.use('/graphql',graphqlExpress({schema}));
app.use('/graphiql',graphiqlExpress({endpointURL:'/graphql'}));

app.listen(
   port, () => console.info(
      `Server started on port ${port}`
   )
);