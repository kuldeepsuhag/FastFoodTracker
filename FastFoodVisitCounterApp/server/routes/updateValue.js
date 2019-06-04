require('firebase/database')
firebase1 = require('firebase/app');
require('firebase/auth')

module.exports = (req,res) => {
    if(req.body){
        firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                updateheight(user.uid , req.body.updateValue, req.body.label, res)
            }
        });
    }
}
function updateheight(uid, updateValue, label, res){
    console.log(label)
    switch(label){
        case "height":
                firebase1.database().ref('users').child(uid).update({
                    height: updateValue
                })
                break;
        case "weight":
                firebase1.database().ref('users').child(uid).update({
                    weight: updateValue
                })
                break;
        case "currentGoal":
                firebase1.database().ref('users').child(uid).update({
                    currentGoal: updateValue
                })
                break;
        case "patient":
                firebase1.database().ref('users').child(uid).update({
                    PatientID: updateValue
                })
                break;
        case "doctor":
                firebase1.database().ref('users').child(uid).update({
                    doctorId: updateValue
                })
                break;
    }
    res.status(200).send("updated");

    
}