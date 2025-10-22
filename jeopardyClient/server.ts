import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import mysql2, { type Connection } from 'mysql2';
import fs from 'fs';
import fetch from "node-fetch";

const __dirname: string = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT: number = 4001;

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());

let con: Connection = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "watchFactory",
    database: "tasks"
});

app.get('/', getHTML);

function getHTML(req: Request, res: Response){
    res.status = 200;
    res.sendFile(path.join(__dirname + '/index.html'));

}

async function generateCategory(){
    try{
        const response: fetch.Response = await fetch("https://opentdb.com/api.php?amount=10&category=19&difficulty=medium");
        if(!response.ok){
            throw new Error(`Response status: ${response.status}`);
        }else{
            const text: String = await response.text();
            fs.writeFile('data.json', text, 'utf-8', handleError);
            console.log(text);
        }
    }catch (error: fetch.Response){
        console.log(error)
    }
}

function handleError(error: fetch.Response){
    if(error){
        console.log("Error writing game.json" + error)
    }
}

generateCategory();
const data: {game: number} = {game:0};
//const jsonData = JSON.stringify(data)


app.listen(PORT, (error: Response) =>{
    if(!error)
        console.log("Server is Successfully Running,and App is listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);   
