require('firebase/database')
require('firebase/auth')
var moment = require('moment')
firebase1 = require('firebase/app')
var calltime
var category;
var uid;
var place;
var calltime;
// var calltime = new moment().parseZone("Australia/Melbourne").format('YYYY-MM-DDTHH:mm:ss:SSS');
var prevtime;
module.exports = (req, res) => {
    calltime = new moment().parseZone("Australia/Melbourne").format();
    console.log("test: ", calltime)
    if (req.body) {
        checkUser(req.body, res)
    }
}

function checkUser(data, res){
    if(data.uid){
        console.log(data)
        inKFCorPark(data.uid, data.latitude, data.longitude, res)
    }else{
        res.status(200).send("No user");
        return;
    }
}

async function inKFCorPark(userID, userlatitude, userLongtitude, res) {
    console.log(new moment())
    console.log(new moment().parseZone("Australia/Melbourne"))
   // console.log("Coordinates are", data)
    uid = userID;
    console.log("UID after", uid)

    await firebase.database().ref("Restaurants").on('value', async function (snapshot) {
        snapshot.forEach(function (child) {
            data = child.val();
            if ((Math.abs(userlatitude.toFixed(4) - data.lat.toFixed(4)) <= 0.0002) && (Math.abs(userLongtitude.toFixed(4) - data.long.toFixed(4)) <= 0.0002)) {
                category = "Rest"
                console.log(category)
                place = data.place;
                console.log("TESTTTTT")
                timevalidation(uid)
            }
        });
        firebase.database().ref("Restaurants").off("value");
    });



    await firebase.database().ref("Parks").on('value', async function (snapshot) {
        snapshot.forEach(function (child) {
            data = child.val();
            if ((Math.abs(userlatitude.toFixed(4) - data.lat.toFixed(4)) <= 0.005) && (Math.abs(userLongtitude.toFixed(4) - data.long.toFixed(4)) <= 0.002)) {
                category = "Parks"
                place = data.place
                console.log("place", place)
                console.log("Worked")
                timevalidation(uid)

            }
        });
        firebase.database().ref("Parks").off("value");
    });

    var countRest, countPark;
    var sen;
    await firebase.database().ref("users").child(uid).on("value", function (snapshot) {
        console.log(snapshot.val().countRest)

        sen = {
            countRest: snapshot.val().countRest,
            countPark: snapshot.val().countPark
        }
        console.log(sen)


    });
    if (sen === undefined) {
        sen = {
            countRest: 0,
            countPark: 0,
        }
        res.status(200).send(sen);
    } else {
        res.status(200).send(sen);
    }


}
async function timevalidation(uid) {
    console.log("palce nnnnn", place)

    await firebase.database().ref("users").child(uid).on("value", function (childSnapshot) {
        if (childSnapshot.hasChild('previoustime') == false || childSnapshot.val().previoustime == 0) {
            firebase1.database().ref('users').child(uid).update({
                previoustime: calltime,
                previousplace: place
            });
            console.log("DOne")
            //firebase.database().ref()
        }
        else if (childSnapshot.val().previousplace != place) {
            firebase1.database().ref('users').child(uid).update({
                previoustime: calltime,
                previousplace: place
            });
        }
        else {
            var currenttime = new moment().parseZone("Australia/Melbourne")
            // var now = currenttime.getTime("en-US", { timeZone: "Australia/Brisbane" });

            prevtime = moment(childSnapshot.val().previoustime);
            console.log("Previous Time", prevtime.format('YYYY-MM-DDTHH:mm:ss:SSS'))
            currenttime = moment(calltime);
            console.log("Current TIme", currenttime.format('YYYY-MM-DDTHH:mm:ss:SSS'))
            prevplace = childSnapshot.val().previousplace
            const diff = currenttime.diff(prevtime);
            const diffDuration = moment.duration(diff);
            console.log("Minutes:", diffDuration.minutes());


            if ((Math.abs(diffDuration.minutes()) >= 5) && (prevplace === place)) {
                updatevalues();
            }
        }
    });

}

function updatevalues() {
    console.log("Inside Update")
    switch (category) {
        case "Parks": updatingPark();
            break;

        case "Rest": updatingRest();
            break
    }

}

async function updatingRest() {
    console.log("UID is", uid)
    await firebase1.database().ref("users").child(uid).on("value", function (childSnapshot) {
        if (childSnapshot.hasChild('HistoryRest') == false) {
            console.log("FIRSTTT FUNCTION")
            updateRestcounting();
        }
        else {
            firebase1.database().ref("users").child(uid).child('HistoryRest').orderByKey().limitToLast(1).on('value', function (childSnapshot) {
                console.log("SECOND FUNCTION")
                data = childSnapshot.val();
                console.log("getting value", childSnapshot.val());
                var histimestamp;
                //   var place;
                for (var key in data) {
                    histimestamp = parseInt(key);
                    histplace = data[key]["place"]
                }
                histime = moment(histimestamp);
                console.log("Hist TIme", histime)
                var calledtime = moment(calltime);
                console.log("Call Time", calledtime)
                const diff = histime.diff(calledtime);
                const diffDuration = moment.duration(diff);
                console.log("Present TIme", diffDuration.minutes());

                if (Math.abs(diffDuration.minutes()) >= 2 && (diffDuration.hours()) == 0) {
                    console.log("FIRST ONE")
                    updateRestcounting();
                }
                if (diffDuration.hours > 0) {
                    console.log("SECOND ONE")
                    updateRestcounting()
                }
                console.log(histplace)
                console.log(place)
                if (histplace != place) {
                    console.log("THIRD ONE")
                    updateRestcounting()
                }


            });
        }


    });
    firebase1.database().ref("users").child(uid).off("value")

}
async function updatingPark() {
    console.log("UID in Rest is", uid)
    await firebase1.database().ref("users").child(uid).on("value", function (childSnapshot) {
        if (childSnapshot.hasChild('HistoryPark') == false) {
            console.log("FIRSTPark FUNCTION")
            updateParkcounting();
        }
        else {
            firebase1.database().ref("users").child(uid).child('HistoryPark').orderByKey().limitToLast(1).on('value', function (childSnapshot) {
                console.log("SECOND FUNCTION")
                data = childSnapshot.val();
                console.log("getting value", childSnapshot.val());
                var histimestamp;
                for (var key in data) {
                    histimestamp = parseInt(key);
                    histplace = data[key]["place"]
                }
                histime = moment(histimestamp);
                console.log("Hist TIme", histime)
                var calledtime = moment(calltime);
                console.log("Call Time", calledtime)
                const diff = histime.diff(calledtime);
                const diffDuration = moment.duration(diff);
                console.log("Present TIme", diffDuration.minutes());

                if (Math.abs(diffDuration.hours()) > 4) {
                    updateParkcounting();
                }

            });
        }
    });

}


async function updateRestcounting() {
    let count = await getRestCount(uid)
    var updatecount = firebase1.database().ref("users");
    firebase1.database().ref("users").child(uid).off("value");
    firebase1.database().ref("users").child(uid).child('HistoryRest').orderByKey().limitToLast(1).off('value')
    updatecount.child(uid).off("value")
    console.log("TIME TO UPDATE")
    console.log(count)
    count = count + 1;
    updatecount.child(uid).update({ countRest: count });
    updatecount.child(uid).update({ previousplace: "null" });
    updatecount.child(uid).update({ previoustime: 0 })
    console.log("Previuos wwhileeeee", prevtime.format())
    updatecount.child(uid).child("HistoryRest").child(prevtime.format()).set({
        place: prevplace
    });
    firebase1.database().ref("users").child(uid).off("value");
}
function getRestCount() {
    var updatecount = firebase1.database().ref("users");
    updatecount.child(uid).on("value", function (snapshot) {
        data = snapshot.val();
        console.log(data)
    });
    updatecount.child(uid).off("value")
    return data.countRest;
}

async function updateParkcounting() {
    let count = await getParkCount(uid)
    var updatecount = firebase1.database().ref("users");
    firebase1.database().ref("users").child(uid).off("value");
    firebase1.database().ref("users").child(uid).child('HistoryPark').orderByKey().limitToLast(1).off('value')
    updatecount.child(uid).off("value")
    console.log("TIME TO UPDATE")
    console.log(count)
    count = count + 1;
    updatecount.child(uid).update({ countPark: count });
    updatecount.child(uid).update({ previousplace: "null" });
    updatecount.child(uid).update({ previoustime: 0 })
    console.log(count)
    updatecount.child(uid).child("HistoryPark").child(prevtime.format()).set({
        place: place
    });
}
function getParkCount(uid) {
    console.log("Inside get park count")
    var updatecount = firebase1.database().ref("users");
    updatecount.child(uid).on("value", function (snapshot) {
        data = snapshot.val();
        console.log(data)
    });
    return data.countPark;
}