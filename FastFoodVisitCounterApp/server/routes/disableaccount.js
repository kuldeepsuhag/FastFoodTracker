require("firebase/auth")
var admin = require('firebase-admin')
var serviceAccount = require("../adminservice.json")
var app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://computing-project-236008.firebaseio.com"
});
module.exports = (req, res) => {
    
        console.log("Inside Disable")
        
   
    disable(res)
    //console.log(flag)
}

async function disable(res){
    console.log("going to log out")
    var uid;
    await firebase.auth().onAuthStateChanged((user)=>{
        if(user){
            console.log("Inside Disable", user.uid)
            uid = user.uid;
            
        }
        
    });
    console.log("Outside UID", uid)
    app.auth().deleteUser(uid)
    res.status(200).send("deleted")

}