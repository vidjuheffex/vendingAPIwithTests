const express = require('express');
const app = express();
const bodyparser = require('body-parser');

const port = process.env.port || 3000;

const apiRouter = require("./routers/apiRouter");
app.use(bodyparser.json());
app.use("/api", apiRouter);



app.listen(port, ()=>{
  console.log("Server listening on port: ", port);
});

module.exports = app;
   
