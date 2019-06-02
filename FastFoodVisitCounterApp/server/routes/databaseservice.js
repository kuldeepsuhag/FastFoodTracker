require('firebase/database')
require('firebase/auth')
firebase1 = require('firebase/app')
const calltime = new Date();
module.exports = (req, res) => {
    if (req.body) {
        let valid = checkforvalidation(req.body);
        if(not){
        updatingcount(req.body,res);}
       }
    async function checkforvalidation(req){
        var lat = -37.800;
        var long = 144.963;      
    }
    
}
async function updatingcount(req,res){
    var uid;
    await firebase.auth().onAuthStateChanged(function(user) {
        uid = user.uid;

    });
    console.log("UserID", uid)

    await firebase1.database().ref("users").child(uid).on("value", function (childSnapshot) {
        console.log("TEST")
        if (childSnapshot.hasChild('HistoryRest') == false) {
            console.log("FIRSTTT FUNCTION")
            restaurant(req,uid);
        }
        else {
            firebase1.database().ref("users").child(uid).child('HistoryRest').orderByKey().limitToLast(1).on('value', function (childSnapshot) {
                console.log("SECOND FUNCTION")
                data = childSnapshot.val();
                console.log("getting value", childSnapshot.val());
                var histimestamp;
                var place;
                for (var key in data) {
                    histimestamp = parseInt(key);
                    place = data[key]["Rest"]
                }
                var histtime = new Date(histimestamp).getMinutes();
                console.log("Hist TIme", histtime)
                var calledtime = calltime.getMinutes();
                console.log("Present TIme", Math.abs(calledtime - histtime));

                if (Math.abs(calledtime - histtime) >= 15) {
                    restaurant(req,uid);
                } 


            });
        }


    });

   await firebase1.database().ref("users").child(uid).on("value", function (childSnapshot) {
        if (childSnapshot.hasChild('HistoryPark') == false) {
            console.log("FIRSTTT FUNCTION")
            parking(req,uid)
        }
        else {
            firebase1.database().ref("users").child(uid).child('HistoryPark').orderByKey().limitToLast(1).on('value', function (childSnapshot) {
                console.log("SECOND FUNCTION")
                data = childSnapshot.val();
                console.log("getting value", childSnapshot.val());
                var histimestamp;
                for (var key in data) {
                    histimestamp = parseInt(key);
                    place = data[key]["place"]
                }
                var histtime = new Date(histimestamp).getMinutes();
                console.log("Hist TIme", histtime)
                var calledtime = calltime.getMinutes();
                console.log("Present TIme", Math.abs(calledtime - histtime));

                if (Math.abs(calledtime - histtime) >= 45) {
                    parking(req,uid);
                }
            });
        }
    });

    var rest,park,histRest,histPark;
    await firebase.database().ref("users").child(uid).on('value',function(snapshot){
        rest = snapshot.val().countRest;
        park = snapshot.val().countPark;
        if(snapshot.hasChild('HistoryPark') == false){
            histPark = null
        }else{
            histPark = snapshot.val().HistoryPark
            
        }
        if(snapshot.hasChild('HistoryRest') == false){
            histRest = null
        }else{
            histRest = snapshot.val().HistoryRest
        }
     });
     console.log("Park is ", park);
     console.log("Rest is", rest);
     console.log("")



}
async function restaurant(req,uid) {
    var lat = -37.800;
    var long = 144.963;

    await firebase.database().ref("KFC").on('value',async function (snapshot) {
        snapshot.forEach(function (child) {
            data = child.val();
            if(lat > data.swlat && lat < data.nelat && long > data.swlong && long < data.nelong) {
            console.log("Place",data.place)
            updateRestcounting(data.place,uid);
             }
        });
    });

}

async function updateRestcounting(place,uid){
    let count = await getRestCount(uid)
    var updatecount = firebase1.database().ref("users");
    updatecount.child(uid).off("value")
    console.log("TIME TO UPDATE")
    console.log(count)
    count = count + 1;
    updatecount.child(uid).update({ countRest: count });
    console.log(count)
    var time = calltime.getTime("en-US", { timeZone: "Australia/Brisbane" })
    updatecount.child(uid).child("HistoryRest").child(time).set({
        place: place 
     });
}
function getRestCount(uid) {
    var updatecount = firebase1.database().ref("users");
    updatecount.child(uid).on("value", function (snapshot) {
        data = snapshot.val();
        console.log(data)
    });
    return data.countRest;
}

async function parking(req,uid) {
    // console.log("Inside Restaurant Function",req.body)
    var ref = firebase1.database().ref("Parks");
    var lat = -37.812;
    var long = 144.984;

    await ref.on('value',async function (snapshot) {
        snapshot.forEach(function (child) {
            data = child.val();
            if(lat > data.swlat && lat < data.nelat && long > data.swlong && long < data.nelong) {
            console.log("Place",data.place)
            updateParkcounting(data.place,uid);
             }
        });
    });

}

async function updateParkcounting(place,uid){
    let count = await getParkCount(uid)
    var updatecount = firebase1.database().ref("users");
    updatecount.child(uid).off("value")
    console.log("TIME TO UPDATE")
    console.log(count)
    count = count + 1;
    updatecount.child(uid).update({ countPark: count });
    console.log(count)
    var time = calltime.getTime("en-US", { timeZone: "Australia/Brisbane" })
    updatecount.child(uid).child("HistoryPark").child(time).set({
       place: place 
     });
}
function getParkCount(uid) {
    var updatecount = firebase1.database().ref("users");
    updatecount.child(uid).on("value", function (snapshot) {
        data = snapshot.val();
        console.log(data)
    });
    return data.countPark;
}