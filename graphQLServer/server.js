const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const {makeExecutableSchema} = require('graphql-tools');
const createHandler = require('graphql-http/lib/use/express');
const mysql2 = require('mysql2');
const  {graphiqlExpress,graphqlExpress} = require('apollo-server-express');

const port = process.env.PORT || 9000;
const app = express();

let con = mysql2.createConnection({
   host: "localhost",
   user: "root",
   password: "watchFactory",
   database: "tasks"
});


con.connect(function(err) {
   if (err) throw err;
});

function getTasks(){
   return new Promise((resolve, reject) => {
      con.query('SELECT * FROM pendingTasks;', (error, results) => {
          if (error) reject(error);
          resolve(results);
      });
  });
}

function recordTasks(root,args,context,info){
   console.log(args.id);
   return new Promise((resolve, reject) => {
      con.query("INSERT INTO pendingTasks(name,completed) VALUES(?, 0);",args.name,(error, results) => {
          if (error) reject(error);
          resolve(results);
      });
  });
}
function deleteTasks(root,args,context,info){
   console.log(args.id);
   return new Promise((resolve, reject) => {
      con.query("DELETE FROM pendingTasks WHERE id = ?;",args.id,(error, results) => {
          if (error) reject(error);
          resolve(results);
      });
  });
}
const resolvers = {
   Query: {
      tasks: getTasks
   },
   Mutation:{
      createTask: recordTasks,
      deleteTask: deleteTasks
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