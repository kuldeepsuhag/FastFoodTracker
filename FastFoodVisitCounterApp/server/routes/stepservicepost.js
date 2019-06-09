require('firebase/database')
firebase = require('firebase/app');
var bleach = require('bleach');

module.exports = (req, res) => {
    if (req.body) {
        var ref = firebase.database().ref("StepData");
        userRef = ref.child(bleach.sanitize(req.body.uid))
        for (let i = 0; i < req.body.stepData.length; i++) {
            userRef.push(req.body.stepData[i]);
        }
        res.status(200).send("Successful");
    } else {
        res.status(403).end();
    }
};
