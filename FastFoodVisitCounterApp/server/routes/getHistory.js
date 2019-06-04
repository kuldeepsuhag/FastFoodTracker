require('firebase/database');
require('firebase/auth');
var uid;
module.exports = (req, res) => {
    if (req.body) {
        console.log(req.body.history)
        assignuid(req.body.history, res);
    }
}

async function assignuid(isPark, res) {
    await firebase.auth().onAuthStateChanged(function (user) {
        uid = user.uid;
    });
    var history = []
    let place = isPark ? 'HistoryPark' : 'HistoryRest'
    await firebase1.database().ref("users").child(uid).child(place).orderByKey().on('value', function (childSnapshot) {
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
    console.log("History data", history);
    res.status(200).send(history);

}