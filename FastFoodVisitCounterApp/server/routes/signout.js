require("firebase/auth")
module.exports = (req, res) => {
    
        console.log("Inside signout")
        
   
    logout(res)
    //console.log(flag)
}

async function logout(res){
    console.log("going to log out")
    await firebase.auth().signOut()
    let user = await firebase.auth().onAuthStateChanged((user)=>{
        if(user){
            console.log("Inside Singout", user.uid)
            updateheight(req.body,user.uid)
        }
        else{
            console.log("NO USER")
        }
    });
    res.status(200).send("logout")

}