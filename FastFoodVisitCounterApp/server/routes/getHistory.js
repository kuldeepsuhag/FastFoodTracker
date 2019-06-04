require('firebase/database');
require('firebase/auth');
var uid;
var user = firebase.database().ref("users");
module.exports = (req, res) => {
    if (req.body) {
        getHistory(req.body.history, res)
    }
}

async function getHistory(isPark, res) {
    uid = await assignuid();
    if (uid) {
        historyisPresent = await isHistory(uid, isPark);
        if (historyisPresent) {
            res.status(200).send(await getData(uid, isPark))
        } else {
            res.status(200).send("No data")
        }
    }
}

async function assignuid() {
    await firebase.auth().onAuthStateChanged(function (user) {
        uid = user.uid;
    });
    return uid;
}

async function isHistory(uid, isPark) {
    let place = isPark ? 'HistoryPark' : 'HistoryRest'
    let isPresent
    await firebase1.database().ref("users").child(uid).on("value", function (snapshot) {
        if (snapshot.hasChild(place)) {
            isPresent = true;
        } else {
            isPresent = false;
        }
    });
    return isPresent;
}

async function getData(uid, isPark) {
    var history = []
    let place = isPark ? 'HistoryPark' : 'HistoryRest'
    await user.child(uid).child(place).orderByKey().on('value', function (childSnapshot) {
        data = childSnapshot.val();
        for (var key in data) {
            let value = {
                histimestamp: key,
                histplace: data[key]["place"]
            }
            history.push(value);
        }
    });
    return history;
}
