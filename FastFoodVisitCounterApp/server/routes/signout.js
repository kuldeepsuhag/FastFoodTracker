require("firebase/auth")
module.exports = (req, res) => {
    console.log("Inside signout")
    logout(res)
}

async function logout(res){
    console.log("going to log out")
    await firebase.auth().signOut()
    res.status(200).send("logout")

}