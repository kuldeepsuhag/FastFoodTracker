const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");

//Route setup
// 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));

app.post("/signup", require("./routes/signup"));

app.listen(port, (req, res) => {

console.log(`server listening on port: ${port}`)

 });
