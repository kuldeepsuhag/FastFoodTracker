require('firebase/database')
firebase1 = require('firebase/app');
require('firebase/auth')

module.exports = (req, res) => {
    if (req.body) {
        getValues(req.body.updateValue, req.body.label, res);
    }
}

async function getValues(updatedValue, label, res){
    await firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            updated = updateValue(user.uid, updatedValue, label)
        }
    });
    res.status(200).send("updated");
}
async function updateValue(uid, updateValue, label) {
    console.log(label)
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