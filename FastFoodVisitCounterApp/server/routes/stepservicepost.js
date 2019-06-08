require('firebase/database')
firebase = require('firebase/app');

module.exports = (req, res) => {
    if (req.body) {
        var ref = firebase.database().ref("StepData");
        userRef = ref.child(req.body.uid)
        userRef.set(req.body.stepData);
        res.status(200).send("Successful");
    } else {
        res.status(403).end();
    }
};