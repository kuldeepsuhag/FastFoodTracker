require('firebase/database')
firebase1 = require('firebase/app');
require('firebase/auth')

module.exports = (req, res) => {
    if (req.body) {
        var updated;
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                updated = updateValue(user.uid, req.body.updateValue, req.body.label, res)
            }
        });
        console.log(updated)
        if (updated) { res.status(200).send("updated"); }
    }
}
async function updateValue(uid, updateValue, label, res) {
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