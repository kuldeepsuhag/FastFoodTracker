require('firebase/database')
require('firebase/auth')
var moment = require('moment')
var bleach = require('bleach');
firebase1 = require('firebase/app')
var category;
var place;
var calltime;

module.exports = (req, res) => {
    calltime = new moment().parseZone("Australia/Melbourne").format();
    if (req.body) {
        checkUser(req.body, res)
    }
}

function checkUser(data, res){
    if(data.uid){
        inKFCorPark(bleach.sanitize(data.uid), data.latitude, data.longitude, res)
    }else{
        res.status(200).send("No user");
        return;
    }
}

async function inKFCorPark(userID, userlatitude, userLongtitude, res) {
    var uid = userID;
    await firebase.database().ref("Restaurants").once('value', async function (snapshot) {
        snapshot.forEach(function (child) {
            var data = child.val();
            if ((Math.abs(userlatitude.toFixed(4) - data.lat.toFixed(4)) <= 0.0002) && (Math.abs(userLongtitude.toFixed(4) - data.long.toFixed(4)) <= 0.0002)) {
                category = "Rest"
                place = data.place;
                timevalidation(uid)
            }
        });
    });



    await firebase.database().ref("Parks").once('value', async function (snapshot) {
        snapshot.forEach(function (child) {
            var data = child.val();
            if ((Math.abs(userlatitude.toFixed(4) - data.lat.toFixed(4)) <= 0.005) && (Math.abs(userLongtitude.toFixed(4) - data.long.toFixed(4)) <= 0.002)) {
                category = "Parks"
                place = data.place
                timevalidation(uid)

            }
        });
    });

    var countRest, countPark;
    var sen;
    await firebase.database().ref("users").child(uid).once("value", function (snapshot) {
        sen = {
            countRest: snapshot.val().countRest,
            countPark: snapshot.val().countPark
        }
        res.status(200).send(sen);

    });

}
async function timevalidation(uid) {

    await firebase.database().ref("users").child(uid).once("value", function (childSnapshot) {
        if (childSnapshot.hasChild('previoustime') == false || childSnapshot.val().previoustime == 0) {
            firebase1.database().ref('users').child(uid).update({
                previoustime: calltime,
                previousplace: place
            });
        }
        else if (childSnapshot.val().previousplace != place) {
            firebase1.database().ref('users').child(uid).update({
                previoustime: calltime,
                previousplace: place
            });
        }
        else {
            var currenttime = new moment().parseZone("Australia/Melbourne")
            var prevtime = moment(childSnapshot.val().previoustime);
            currenttime = moment(calltime);
            prevplace = childSnapshot.val().previousplace
            const diff = currenttime.diff(prevtime);
            const diffDuration = moment.duration(diff);
            if ((Math.abs(diffDuration.minutes()) >= 5) && (prevplace === place)) {
                updatevalues(prevtime , uid);
            }
        }
    });

}

function updatevalues(prevtime, uid) {
    switch (category) {
        case "Parks": updatingPark(prevtime, uid);
            break;

        case "Rest": updatingRest(prevtime, uid);
            break
    }

}

async function updatingRest(prevtime, uid) {
    await firebase1.database().ref("users").child(uid).once("value", function (childSnapshot) {
        if (childSnapshot.hasChild('HistoryRest') == false) {
            updateRestcounting(prevtime, uid);
        }
        else {
            firebase1.database().ref("users").child(uid).child('HistoryRest').orderByKey().limitToLast(1).once('value', function (childSnapshot) {
                var data = childSnapshot.val();
                var histimestamp;
                var histplace;
                for (var key in data) {
                    histimestamp = key;
                    histplace = data[key]["place"]
                }
                var histime = moment(histimestamp);
                var calledtime = moment(calltime);
                const diff = histime.diff(calledtime);
                const diffDuration = moment.duration(diff);

                if (Math.abs(diffDuration.minutes()) >= 20 && (diffDuration.hours()) == 0) {
                    updateRestcounting(prevtime, uid);
                }
                if (diffDuration.hours > 0) {
                    updateRestcounting(prevtime, uid)
                }
                if (histplace != place) {
                    updateRestcounting(prevtime, uid)
                }


            });
        }


    });

}
async function updatingPark(prevtime, uid) {
    await firebase1.database().ref("users").child(uid).once("value", function (childSnapshot) {
        if (childSnapshot.hasChild('HistoryPark') == false) {
            updateParkcounting(prevtime, uid);
        }
        else {
            firebase1.database().ref("users").child(uid).child('HistoryPark').orderByKey().limitToLast(1).once('value', function (childSnapshot) {
                data = childSnapshot.val();
                var histimestamp;
                for (var key in data) {
                    histimestamp = parseInt(key);
                    histplace = data[key]["place"]
                }
                histime = moment(histimestamp);
                var calledtime = moment(calltime);
                const diff = histime.diff(calledtime);
                const diffDuration = moment.duration(diff);
                if (Math.abs(diffDuration.hours()) > 4) {
                    updateParkcounting(prevtime, uid);
                }

            });
        }
    });

}


async function updateRestcounting(prevtime, uid) {
    let count = await getRestCount(uid)
    var updatecount = firebase1.database().ref("users");
    count = count + 1;
    updatecount.child(uid).update({ countRest: count });
    updatecount.child(uid).update({ previousplace: "null" });
    updatecount.child(uid).update({ previoustime: 0 })
    updatecount.child(uid).child("HistoryRest").child(prevtime.format()).set({
        place: prevplace
    });
}
async function getRestCount(uid) {
    var updatecount = firebase1.database().ref("users");
    await updatecount.child(uid).once("value", function (snapshot) {
        data = snapshot.val();
    });
    return parseInt(data.countRest);
}

async function updateParkcounting(prevtime, uid) {
    let count = await getParkCount(uid)
    var updatecount = firebase1.database().ref("users");
    count = count + 1;
    updatecount.child(uid).update({ countPark: count });
    updatecount.child(uid).update({ previousplace: "null" });
    updatecount.child(uid).update({ previoustime: 0 })
    updatecount.child(uid).child("HistoryPark").child(prevtime.format()).set({
        place: place
    });
}
async function getParkCount(uid) {
    var updatecount = firebase1.database().ref("users");
   await updatecount.child(uid).once("value", function (snapshot) {
        data = snapshot.val();
    });
    return parseInt(data.countPark);
}