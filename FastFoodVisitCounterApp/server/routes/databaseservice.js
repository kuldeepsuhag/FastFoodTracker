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

    var restaurantCount, parkCount;
    var sen;
    await firebase.database().ref("users").child(uid).once("value", function (snapshot) {
        sen = {
            restaurantCount: snapshot.val().restaurantCount,
            parkCount: snapshot.val().parkCount
        }
        res.status(200).send(sen);

    });

}
async function timevalidation(uid) {

    await firebase.database().ref("users").child(uid).once("value", function (childSnapshot) {
        if (childSnapshot.hasChild('previousTime') == false || childSnapshot.val().previousTime == 0) {
            firebase1.database().ref('users').child(uid).update({
                previousTime: calltime,
                previousPlace: place
            });
        }
        else if (childSnapshot.val().previousPlace != place) {
            firebase1.database().ref('users').child(uid).update({
                previousTime: calltime,
                previousPlace: place
            });
        }
        else {
            var currenttime = new moment().parseZone("Australia/Melbourne")
            var prevtime = moment(childSnapshot.val().previousTime);
            currenttime = moment(calltime);
            prevplace = childSnapshot.val().previousPlace
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
        if (childSnapshot.hasChild('historyRest') == false) {
            updateRestcounting(prevtime, uid);
        }
        else {
            firebase1.database().ref("users").child(uid).child('historyRest').orderByKey().limitToLast(1).once('value', function (childSnapshot) {
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
        if (childSnapshot.hasChild('historyPark') == false) {
            updateParkcounting(prevtime, uid);
        }
        else {
            firebase1.database().ref("users").child(uid).child('historyPark').orderByKey().limitToLast(1).once('value', function (childSnapshot) {
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
    updatecount.child(uid).update({ restaurantCount: count, previousPlace: "null" ,  previousTime: 0 });
    updatecount.child(uid).child("historyRest").child(prevtime.format()).set({
        place: prevplace
    });
}
async function getRestCount(uid) {
    var updatecount = firebase1.database().ref("users");
    await updatecount.child(uid).once("value", function (snapshot) {
        data = snapshot.val();
    });
    return parseInt(data.restaurantCount);
}

async function updateParkcounting(prevtime, uid) {
    let count = await getParkCount(uid)
    var updatecount = firebase1.database().ref("users");
    count = count + 1;
    updatecount.child(uid).update({ parkCount: count, previousPlace: "null",  previousTime: 0 });
    updatecount.child(uid).child("historyPark").child(prevtime.format()).set({
        place: place
    });
}
async function getParkCount(uid) {
    var updatecount = firebase1.database().ref("users");
   await updatecount.child(uid).once("value", function (snapshot) {
        data = snapshot.val();
    });
    return parseInt(data.parkCount);
}