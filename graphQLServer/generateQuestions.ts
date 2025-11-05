
import mysql2, { type Connection } from 'mysql2';
import fetch from "node-fetch"; 

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

let categories: [number, number, number, number, number, number] = [19, 20, 16,28,11,18];
const categoryIndex = JSON.parse("{\"trivia_categories\":[{\"id\":9,\"name\":\"General Knowledge\"},{\"id\":10,\"name\":\"Entertainment: Books\"},{\"id\":11,\"name\":\"Entertainment: Film\"},{\"id\":12,\"name\":\"Entertainment: Music\"},{\"id\":13,\"name\":\"Entertainment: Musicals & Theatres\"},{\"id\":14,\"name\":\"Entertainment: Television\"},{\"id\":15,\"name\":\"Entertainment: Video Games\"},{\"id\":16,\"name\":\"Entertainment: Board Games\"},{\"id\":17,\"name\":\"Science & Nature\"},{\"id\":18,\"name\":\"Science: Computers\"},{\"id\":19,\"name\":\"Science: Mathematics\"},{\"id\":20,\"name\":\"Mythology\"},{\"id\":21,\"name\":\"Sports\"},{\"id\":22,\"name\":\"Geography\"},{\"id\":23,\"name\":\"History\"},{\"id\":24,\"name\":\"Politics\"},{\"id\":25,\"name\":\"Art\"},{\"id\":26,\"name\":\"Celebrities\"},{\"id\":27,\"name\":\"Animals\"},{\"id\":28,\"name\":\"Vehicles\"},{\"id\":29,\"name\":\"Entertainment: Comics\"},{\"id\":30,\"name\":\"Science: Gadgets\"},{\"id\":31,\"name\":\"Entertainment: Japanese Anime & Manga\"},{\"id\":32,\"name\":\"Entertainment: Cartoon & Animations\"}]}")["trivia_categories"];
var categoryNames:string[] = [];

let countdownEasy= 14000; 
let countdownMedium = 21000;
let countdownHard = 28000;

async function generateEasy(catName:string, catID:number,easyURL: string){
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
                con.query('INSERT INTO Question_Bank (cat_name, cat_id, difficulty, question, answer, choice1, choice2, choice3) VALUES(?, ?, "easy", ?, ?, ?, ?, ?);', [catName, catID,easyQuestions[0].question, easyQuestions[0].correct_answer, easyQuestions[0].incorrect_answers[0], easyQuestions[0].incorrect_answers[1], easyQuestions[0].incorrect_answers[2]],(error, results) => {
                if (error) reject(error);
                resolve(results);
                });
            });

            new Promise((resolve, reject) => {
                con.query('INSERT INTO Question_Bank (cat_name, cat_id, difficulty, question, answer, choice1, choice2, choice3) VALUES(?, ?, "easy", ?, ?, ?, ?, ?);', [catName, catID,easyQuestions[1].question, easyQuestions[1].correct_answer, easyQuestions[1].incorrect_answers[0], easyQuestions[1].incorrect_answers[1], easyQuestions[1].incorrect_answers[2]],(error, results) => {
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
async function generateMedium (catName:string, catID:number, mediumURL: string){
    setTimeout( async ()=> {
        try{
            let response: fetch.Response = await fetch(mediumURL);
            let text: string = await response.text();
            let mediumQuestions: object[] = await JSON.parse(text).results;

            trivia.push(...mediumQuestions);
            new Promise((resolve, reject) => {
                con.query('INSERT INTO Question_Bank (cat_name, cat_id, difficulty, question, answer, choice1, choice2, choice3) VALUES(?, ?, "medium", ?, ?, ?, ?, ?);', [catName, catID, mediumQuestions[0].question, mediumQuestions[0].correct_answer, mediumQuestions[0].incorrect_answers[0], mediumQuestions[0].incorrect_answers[1], mediumQuestions[0].incorrect_answers[2]],(error, results) => {
                if (error) reject(error);
                resolve(results);
                });
            });
            new Promise((resolve, reject) => {
                con.query('INSERT INTO Question_Bank (cat_name, cat_id, difficulty, question, answer, choice1, choice2, choice3) VALUES(?, ?, "medium", ?, ?, ?, ?, ?);', [catName, catID, mediumQuestions[1].question, mediumQuestions[1].correct_answer, mediumQuestions[1].incorrect_answers[0], mediumQuestions[1].incorrect_answers[1], mediumQuestions[1].incorrect_answers[2]],(error, results) => {
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
async function generateHard(catName:string, catID:number, hardURL: string){
    setTimeout( async ()=> {
        try{
            const response: fetch.Response = await fetch(hardURL);
            const text: string = await response.text();
            const hardQuestions: object[] = await JSON.parse(text).results;

            trivia.push(...hardQuestions);
                return new Promise((resolve, reject) => {
                    con.query('INSERT INTO Question_Bank (cat_name, cat_id, difficulty, question, answer, choice1, choice2, choice3) VALUES(?, ?, "hard", ?, ?, ?, ?, ?);', [catName, catID, hardQuestions[0].question, hardQuestions[0].correct_answer, hardQuestions[0].incorrect_answers[0], hardQuestions[0].incorrect_answers[1], hardQuestions[0].incorrect_answers[2]],(error, results) => {
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
    let catName = categoryIndex[catNum -9].name;

    generateEasy(catName, catNum, easyURL); 
    generateMedium(catName, catNum, mediumURL); 
    generateHard(catName, catNum, hardURL);
    console.log(trivia);
    

}

function handleError(error: fetch.Response){
    if(error){
        console.log("Error writing game.json" + error)
    }
}

con.query("TRUNCATE TABLE squares");

/*
setTimeout(function () {
    console.log("DONE!");
    console.log(trivia);
    let triviaString = JSON.stringify(trivia)
    fs.writeFile('data.json', triviaString, 'utf8', (err) => {
    if (err) {
        console.error('Error writing file:', err);
    }})}, 127000);

*/

    
function generateGame(categories: number[]){

    new Promise((resolve, reject) => {
        con.query("TRUNCATE TABLE Question_Bank;",(error, _rows) => {
            if (error) reject(error);
        });
    });
    
    categories.forEach(number => {
    console.log(number);
    generateCategory(number);
        
});

}

let neededCategories: number[]= [];
for (let i: number = 9; i < 33; i++) {
    neededCategories.push(i);
}
console.log(neededCategories);


generateGame(neededCategories);

export {generateGame};
