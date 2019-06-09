require('firebase/database')
firebase1 = require('firebase/app');
var bleach = require('bleach');
require('firebase/auth')

module.exports = (req, res) => {
    if (req.body) {
        getValues(bleach.sanitize(req.body.userId),bleach.sanitize(req.body.updateValue), req.body.label, res);
    }
}

async function getValues(uid, updatedValue, label, res){
        if (uid) {
            updated = await updateValue(uid, updatedValue, label)
            res.status(200).send("updated");
        }else{
            res.status(400).send("No user");
        }
    
}
async function updateValue(uid, updateValue, label) {
    switch (label) {
        case "height":
            await firebase1.database().ref('users').child(uid).update({
                height: updateValue
            })
            break;
        case "weight":
            await firebase1.database().ref('users').child(uid).update({
                weight: updateValue
            })
            break;
        case "currentGoal":
            await firebase1.database().ref('users').child(uid).update({
                currentGoal: updateValue
            })
            break;
        case "patient":
            await firebase1.database().ref('users').child(uid).update({
                PatientID: updateValue
            })
            break;
        case "doctor":
            await firebase1.database().ref('users').child(uid).update({
                doctorId: updateValue
            })
            break;
    }
    return true;



}