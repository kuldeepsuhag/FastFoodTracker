require("firebase/auth")
var admin = require('firebase-admin')
var serviceAccount = require("../adminservice.json")
var app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://computing-project-236008.firebaseio.com"
});

module.exports = (req, res) => {
    app.auth().deleteUser(req.body.userId)
    res.status(200).send("deleted")
}
