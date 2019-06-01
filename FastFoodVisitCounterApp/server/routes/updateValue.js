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
    switch(label){
        case "height":
                firebase1.database().ref('users').child(uid).update({
                    height: updateValue
                })
                res.status(200).send("updated");
                break;
        case "weight":
                firebase1.database().ref('users').child(uid).update({
                    weight: updateValue
                })
                res.status(200).send("updated");
                break;
        case "currentGoal":
                firebase1.database().ref('users').child(uid).update({
                    currentGoal: updateValue
                })
                res.status(200).send("updated");
                break;
    }

    
}