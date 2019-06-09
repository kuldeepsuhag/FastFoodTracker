require("firebase/auth")
var admin = require('firebase-admin')
var serviceAccount = require("../adminservice.json")
var bleach = require('bleach');
var app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://computing-project-236008.firebaseio.com"
});

module.exports = (req, res) => {
    app.auth().deleteUser(bleach.sanitize(req.body.userId))
    res.status(200).send("deleted")
}
