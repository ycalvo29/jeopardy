import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import mysql2 from 'mysql2';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
//import { generateGame } from './generateQuestions.ts';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 9000;
const app = express();
let con = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "watchFactory",
    database: "jeopardy",
    rowsAsArray: true,
});
con.connect(function (err) {
    if (err)
        throw err;
});
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "/views"));
function getHTML(req, res) {
    res.status(200);
    res.render('index');
}
function getQuestion(_root, args, _context, _info) {
    //const trivia: object[] = await getSquares();
    let id = args.id;
    //console.log("id: " + id);
    completeSquare(id);
    return new Promise((resolve, reject) => {
        con.query('SELECT question, answer FROM squares WHERE ID = ?;', id, (error, rows) => {
            if (error)
                reject(error);
            //let data = rows !== null && rows !== undefined ? rows : [["", ""]];
            if (rows[0] != undefined) {
                resolve({ question: rows[0][0], answer: rows[0][1] });
            }
            else {
                resolve({ question: "", answer: "" });
            }
        });
    });
}
function updateScore(_root, args, _context, _info) {
    //let task: string = args.task;
    //console.log(task)
    let updateQuery = '';
    updateQuery = "UPDATE scores SET " + args.player + " = " + args.score + ";";
    return new Promise((resolve, reject) => {
        con.query(updateQuery, (error, results) => {
            if (error)
                reject(error);
            resolve(results);
        });
    });
}
async function getScores(_root, _args, _context, _info) {
    return new Promise((resolve, reject) => {
        con.query('SELECT * FROM scores;', (error, rows) => {
            if (error)
                reject(error);
            if (rows[0] != undefined) {
                resolve([{ player1: rows[0][0], player2: rows[0][1], player3: rows[0][2] }]);
            }
            else {
                resolve([{ player1: null, player2: null, player3: null }]);
            }
        });
    });
}
async function reset(_root, _args, _context, _info) {
    let truncateScores = new Promise((resolve, reject) => {
        con.query('TRUNCATE TABLE scores;', (error, results) => {
            if (error)
                reject(error);
            resolve(results);
        });
    });
    let resetScores = new Promise((resolve, reject) => {
        con.query('INSERT INTO scores(player1, player2, player3) VALUES (0,0,0);', (error, results) => {
            if (error)
                reject(error);
            resolve(results);
        });
    });
    let resetSquares = new Promise((resolve, reject) => {
        con.query('UPDATE squares SET completed = 0;', (error, results) => {
            if (error)
                reject(error);
            //console.log(results);
            resolve(results);
        });
    });
}
function completeSquare(id) {
    return new Promise((resolve, reject) => {
        con.query('UPDATE squares SET completed = 1 WHERE id = ?;', id, (error, results) => {
            if (error)
                reject(error);
            //console.log(results);
            resolve(results);
        });
    });
}
async function getPlayedSquares(_root, _args, _context, _info) {
    return new Promise((resolve, reject) => {
        con.query('SELECT completed from squares;', (error, rows) => {
            if (error)
                reject(error);
            //console.log(rows);
            let result = [];
            //let data: [[number]];
            rows.forEach((square) => result.push({ completed: square[0] }));
            console.log(result);
            resolve(result);
        });
    });
}
async function getCategories(_root, _args, _context, _info) {
    return new Promise((resolve, reject) => {
        con.query('SELECT * from categories;', (error, results) => {
            if (error)
                reject(error);
            console.log(results);
            resolve(results);
        });
    });
}
function setCategories(_, args, __, info) {
    let updateQuery = '';
    const categories = args.categories;
    updateQuery = "UPDATE categories SET category1 = ?, category2 = ?,category3 = ?,category4 = ?,category5 = ?,category6 = ?;";
    return new Promise((resolve, reject) => {
        con.query(updateQuery, [...categories], (error, results) => {
            if (error)
                reject(error);
            resolve(results);
        });
    });
}
async function generateQuestions(_root, _args, _context, _info) {
    //const categories = [args.category1, args.category2 ,args.category3,args.category4 ,args.category5 ,args.category6];
    console.log("categories:");
    //await generateGame(categories);
}
const resolvers = {
    Query: {
        question: getQuestion,
        scores: getScores,
        playedSquares: getPlayedSquares,
        categories: getCategories
    },
    Mutation: {
        updateScore: updateScore,
        reset: reset,
        generateQuestions: generateQuestions,
        setCategories: setCategories
    }
};
const typeDefs = fs.readFileSync('./schema.graphql', { encoding: 'utf-8' });
const schema = makeExecutableSchema({ typeDefs, resolvers });
app.use(cors(), bodyParser.json());
app.use('/graphql', graphqlExpress({ schema }));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.listen(port, () => console.info(`Server started on port ${port}`));
