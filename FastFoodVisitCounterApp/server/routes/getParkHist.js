require('firebase/database');
require('firebase/auth');
var uid;
module.exports = (req, res) => {
    if (req.body) {
        assignuid(res);
    }
}
async function assignuid(res) {
    await firebase.auth().onAuthStateChanged(function (user) {
        uid = user.uid;
        console.log("UID inside get Park", uid)
    });
    var history = []
    await firebase1.database().ref("users").child(uid).child('HistoryPark').orderByKey().on('value', function (childSnapshot) {
        console.log("SECOND FUNCTION")
        data = childSnapshot.val();
        
        //console.log("Inside Secin", data)
        for (var key in data) {
            let value = {
                histimestamp: parseInt(key),
                histplace: data[key]["place"]   
            }
            history.push(value);

        }
    });
    console.log("History data of Park", history);
    res.status(200).send(history);

}