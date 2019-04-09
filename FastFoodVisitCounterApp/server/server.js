const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

//Route setup
app.use("*", (req, res) => {
  console.log(req);
  console.log("hmmm");
  res.status(200).send("TESTED");
  });

//Start server
app.listen(port, (req, res) => {

console.log(`server listening on port: ${port}`)

 });
