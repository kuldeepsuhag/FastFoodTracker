require('firebase/database')
firebase = require('firebase/app');
module.exports = (req, res) => {
    console.log(res);
    if (req.body) {
        var userID = firebase.auth().currentUser.uid;
        var ref = firebase.database().ref("StepData");
        userRef = ref.child(userID)
        userRef.set(req.body);
        res.status(200).send("Successful");
    } else {
        res.status(403).end();
    }
};