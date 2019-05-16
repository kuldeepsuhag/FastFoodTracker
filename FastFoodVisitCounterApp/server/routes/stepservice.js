require('firebase/database')
firebase = require('firebase/app');
module.exports = (req, res) => {
    console.log(res);
    if (req.body) {
        console.log("Getting Data STEPS")
        console.log(req.body);
        var userID = firebase.auth().currentUser.uid;
        var ref = firebase.database().ref("StepData");
        userRef = ref.child(userID)
        var requiredStepData = null;
        userRef.on("value", function (snapshot) {
            requiredStepData.snapshot.val();
            console.log(snapshot.val());
        })
        if(requiredStepData){
            res.status(200).send(requiredStepData);
        }else{
            res.status(404).send("No Step Data");
        }
    } else {
        res.status(403).end();
    }
};