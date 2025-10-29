import path, { resolve } from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import mysql2, { type Connection } from 'mysql2';
import XMLHttpRequest from 'xhr2';

const __dirname: string = path.dirname(fileURLToPath(import.meta.url));
const app: express = express();
const PORT: number = 4000;

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
    const id: number = Number(req.query.id);
    const target: String = 'http://localhost:9000/graphql';

    let xhr = new XMLHttpRequest(); 
    xhr.open("POST", target, true);
    xhr.setRequestHeader("Content-type", "application/json");
    let query = {
        query: '{ \n question(id : ' + id + ') {\n question answer \n} \n}'
    };                      
    let jsonPayload = JSON.stringify(query);
    xhr.send(jsonPayload);

    xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        console.log(this.response);
        let response = JSON.parse(this.response);
        let question = response.data.question.question;
        let answer = response.data.question.answer;
        res.status(200);
        res.render('question',{question: question, 'answer': answer});
    }};
}

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running,and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);   
