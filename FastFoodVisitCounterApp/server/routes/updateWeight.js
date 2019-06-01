require('firebase/database')
firebase1 = require('firebase/app');
require('firebase/auth')

module.exports = (req,res) => {
    if(req.body){
        console.log("Inside Update Weight Height is ", req.body);
        var userid;
        firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                console.log("Inside Update Height", user.uid)
                updateheight(req.body,user.uid)
            }
        });
        res.status(200).send("Success")
        

    }
}
function updateheight(req, uid){
    console.log("Is there any user", uid);
    firebase1.database().ref('users').child(uid).update({
        weight: req.Weight
    })
    
}