
import mysql2, { type Connection } from 'mysql2';
import fetch from "node-fetch";
import fs from 'fs';

let con = mysql2.createConnection({
   host: "localhost",
   user: "root",
   password: "watchFactory",
   database: "jeopardy"
});

con.connect(function(err) {
   if (err) throw err;
});

var trivia: object[] = [];

//let trivia: [object, object, object, object, object] = [{},{},{},{}, {}];
let categories: [number, number, number, number, number, number] = [19, 20, 16,28,11,18];
var categoryNames:string[] = [];

let countdownEasy= 14000; 
let countdownMedium = 21000;
let countdownHard = 28000;

async function generateEasy(easyURL: string){
    console.log ("START FUNCTION:");
    console.log(countdownEasy);
    let easyQuestions: object[];
    setTimeout( async ()=> {       

        try{
            let response: fetch.Response = await fetch(easyURL);
            let text: string = await response.text();
            let easyQuestions: object[] = await JSON.parse(text).results;

            let category:string;

            if(easyQuestions != null){
                let category: string = easyQuestions[0].category;
                 categoryNames.push(category);
            }else {
                let category = "";
            } 
            trivia.push(...easyQuestions);

            
            new Promise((resolve, reject) => {
                con.query('INSERT INTO squares(completed, question, answer, choice1, choice2, choice3) VALUES(0, ?, ?, ?, ?, ?);', [easyQuestions[0].question, easyQuestions[0].correct_answer, easyQuestions[0].incorrect_answers[0], easyQuestions[0].incorrect_answers[1], easyQuestions[0].incorrect_answers[2]],(error, results) => {
                if (error) reject(error);
                resolve(results);
                });
            });

            new Promise((resolve, reject) => {
                con.query('INSERT INTO squares(completed, question, answer, choice1, choice2, choice3) VALUES(0, ?, ?, ?, ?, ?);', [easyQuestions[1].question, easyQuestions[1].correct_answer, easyQuestions[1].incorrect_answers[0], easyQuestions[1].incorrect_answers[1], easyQuestions[1].incorrect_answers[2]],(error, results) => {
                if (error) reject(error);
                resolve(results);
                });
            });
            
            
        }catch (error: Error){
            console.log(error);
        }
    }, countdownEasy);

    countdownEasy += 21000;

}
async function generateMedium (mediumURL: string){
    setTimeout( async ()=> {
        try{
            let response: fetch.Response = await fetch(mediumURL);
            let text: string = await response.text();
            let mediumQuestions: object[] = await JSON.parse(text).results;

            trivia.push(...mediumQuestions);
            new Promise((resolve, reject) => {
                con.query('INSERT INTO squares(completed, question, answer, choice1, choice2, choice3) VALUES(0, ?, ?, ?, ?, ?);', [mediumQuestions[0].question, mediumQuestions[0].correct_answer, mediumQuestions[0].incorrect_answers[0], mediumQuestions[0].incorrect_answers[1], mediumQuestions[0].incorrect_answers[2]],(error, results) => {
                if (error) reject(error);
                resolve(results);
                });
            });
            new Promise((resolve, reject) => {
                con.query('INSERT INTO squares(completed, question, answer, choice1, choice2, choice3) VALUES(0, ?, ?, ?, ?, ?);', [mediumQuestions[1].question, mediumQuestions[1].correct_answer, mediumQuestions[1].incorrect_answers[0], mediumQuestions[1].incorrect_answers[1], mediumQuestions[1].incorrect_answers[2]],(error, results) => {
                if (error) reject(error);
                resolve(results);
                });
            });

            }catch (error: fetch.Response){
                console.log(error);
            }
            


    }, countdownMedium);  

    countdownMedium += 21000;          



}
async function generateHard(hardURL: string){
    setTimeout( async ()=> {
        try{
            const response: fetch.Response = await fetch(hardURL);
            const text: string = await response.text();
            const hardQuestions: object[] = await JSON.parse(text).results;

            trivia.push(...hardQuestions);
                return new Promise((resolve, reject) => {
                    con.query('INSERT INTO squares(completed, question, answer, choice1, choice2, choice3) VALUES(0, ?, ?, ?, ?, ?);', [hardQuestions[0].question, hardQuestions[0].correct_answer, hardQuestions[0].incorrect_answers[0], hardQuestions[0].incorrect_answers[1], hardQuestions[0].incorrect_answers[2]],(error, results) => {
                    if (error) reject(error);
                    resolve(results);
                        });
                    });


            }catch (error: fetch.Response){
                console.log(error);
            }


    }, countdownHard);
    countdownHard += 21000;


}
    

async function generateCategory(catNum: number){

    let easyURL: string = "https://opentdb.com/api.php?amount=2&category="+ catNum + "&difficulty=easy&type=multiple";
    let mediumURL: string = "https://opentdb.com/api.php?amount=2&category="+ catNum + "&difficulty=medium&type=multiple";
    let hardURL: string = "https://opentdb.com/api.php?amount=1&category="+ catNum + "&difficulty=hard&type=multiple";

    let results: object[];
    //let easyQs: object[];

    generateEasy(easyURL); 
    generateMedium(mediumURL); 
    generateHard(hardURL);
    console.log(trivia);
    

}

function handleError(error: fetch.Response){
    if(error){
        console.log("Error writing game.json" + error)
    }
}

con.query("TRUNCATE TABLE squares");


setTimeout(function () {
    console.log("DONE!");
    console.log(trivia);
    let triviaString = JSON.stringify(trivia)
    fs.writeFile('data.json', triviaString, 'utf8', (err) => {
    if (err) {
        console.error('Error writing file:', err);
    }})}, 127000);

categories.forEach(number => {
    console.log(number);
    generateCategory(number);
        
});


