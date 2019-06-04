const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
var authen = require('./routes/firebaseconfig')
firebase = require('firebase/app');
exports.firebaseApp = firebase.initializeApp(authen.config);
//Route setup
// 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));

app.post("/signup", require("./routes/signup"));
app.post("/signin", require("./routes/signin"));
app.post("/map-data", require("./routes/databaseservice"));
app.get("/step-data", require("./routes/stepservice"));
app.post("/step-data", require("./routes/stepservicepost"));
app.post("/updateValue", require("./routes/updateValue"));
app.post("/signout", require("./routes/signout"));
app.post("/disable", require("./routes/disableaccount"));
app.post("/getHistRest", require("./routes/getResthist"));
app.post("/getHistPark", require("./routes/getParkHist"));

app.listen(port, (req, res) => {

console.log(`server listening on port: ${port}`)

 });
