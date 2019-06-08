require("firebase/auth")
module.exports = (req, res) => {
    logout(res)
}

async function logout(res){
    await firebase.auth().signOut()
    res.status(200).send("logout")

}