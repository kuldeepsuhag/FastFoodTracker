require('firebase/database')
firebase1 = require('firebase/app');
var json = require('../data/places.json')
const calltime = new Date();
module.exports = (req, res) => {
    if (req.body) {

        var callminute = calltime.getMinutes("en-US", { timeZone: "Australia/Brisbane" });
        console.log("Calling Minute", callminute)
        while (true) {

            var currentmintute = new Date().getMinutes("en-US", { timeZone: "Australia/Brisbane" });
            if (((currentmintute - callminute) >= 5) || ((currentmintute - callminute) >= -1)) {
                console.log("Final time", new Date().getMinutes("en-US", { timeZone: "Australia/Brisbane" }))
                break
            }

        }
        var uid = "KwDaSqlqy6R744UpqsUVqUjoz5S2"
            firebase1.database().ref("users").child(uid).on("value", function (childSnapshot) {
                console.log("TEST")
                if (childSnapshot.hasChild('HistoryRest') == false) {
                    console.log("FIRSTTT FUNCTION")
                    restaurant();
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
                        currentplace = req.body.place;
                        var histtime = new Date(histimestamp).getMinutes();
                        console.log("Hist TIme", histtime)
                        var calledtime = calltime.getMinutes();
                        console.log("Present TIme", Math.abs(calledtime - histtime));

                        if (Math.abs(calledtime - histtime) >= 15) {
                            restaurant();
                        } else {
                            if ((currentplace.localeCompare(place) == false)) {
                                restaurant()
                            }
                        }


                    });
                }
            });

            firebase1.database().ref("users").child(uid).on("value", function (childSnapshot) {
                console.log("TEST")
                if (childSnapshot.hasChild('HistoryPark') == false) {
                    console.log("FIRSTTT FUNCTION")
                    parking()
                }
                else {
                    firebase1.database().ref("users").child(uid).child('HistoryPark').orderByKey().limitToLast(1).on('value', function (childSnapshot) {
                        console.log("SECOND FUNCTION")
                        data = childSnapshot.val();
                        console.log("getting value", childSnapshot.val());
                        var histimestamp;
                        var place;
                        for (var key in data) {
                            histimestamp = parseInt(key);
                            place = data[key]["Rest"]
                        }
                        currentplace = req.body.place;
                        var histtime = new Date(histimestamp).getMinutes();
                        console.log("Hist TIme", histtime)
                        var calledtime = calltime.getMinutes();
                        console.log("Present TIme", Math.abs(calledtime - histtime));

                        if (Math.abs(calledtime - histtime) >= 45) {
                            parking(req);
                        } else {
                            if ((currentplace.localeCompare(place) == false)) {
                                parking(req)
                            }
                        }


                    });
                }
            });


    }
   async function restaurant() {
        var ref = firebase1.database().ref("KFC");
        
        var uid = "KwDaSqlqy6R744UpqsUVqUjoz5S2"
        var lat = -37.800;
        var long = 144.963;

        await firebase.database().ref("KFC").on('value',async function (snapshot) {
            snapshot.forEach(function (child) {
                data = child.val();
                if(lat > data.swlat && lat < data.nelat && long > data.swlong && long < data.nelong) {
                console.log("Place",data.place)
                updateRestcounting(data.place);
                 }
            });
        });

    }

    async function updateRestcounting(place){
        let count = await getRestCount()
        var updatecount = firebase1.database().ref("users");
        updatecount.child(uid).off("value")
        console.log("TIME TO UPDATE")
        console.log(count)
        count = count + 1;
        updatecount.child(uid).update({ countRest: count });
        console.log(count)
        var time = calltime.getTime("en-US", { timeZone: "Australia/Brisbane" })
        updatecount.child(uid).child("HistoryRest").child(time).set({
            Rest: place 
         });
    }
    function getRestCount() {
        var updatecount = firebase1.database().ref("users");
        var uid = "KwDaSqlqy6R744UpqsUVqUjoz5S2"
        updatecount.child(uid).on("value", function (snapshot) {
            data = snapshot.val();
            console.log(data)
        });
        return data.countRest;
    }

    async function parking() {
        // console.log("Inside Restaurant Function",req.body)
        var ref = firebase1.database().ref("Parks");
        
        var uid = "KwDaSqlqy6R744UpqsUVqUjoz5S2"
        var lat = -37.812;
        var long = 144.984;

        await ref.on('value',async function (snapshot) {
            snapshot.forEach(function (child) {
                data = child.val();
                if(lat > data.swlat && lat < data.nelat && long > data.swlong && long < data.nelong) {
                console.log("Place",data.place)
                updateParkcounting(data.place);
                 }
            });
        });

    }

    async function updateParkcounting(place){
        let count = await getParkCount()
        var updatecount = firebase1.database().ref("users");
        updatecount.child(uid).off("value")
        console.log("TIME TO UPDATE")
        console.log(count)
        count = count + 1;
        updatecount.child(uid).update({ countRest: count });
        console.log(count)
        var time = calltime.getTime("en-US", { timeZone: "Australia/Brisbane" })
        updatecount.child(uid).child("HistoryPark").child(time).set({
            Rest: place 
         });
    }
    function getParkCount() {
        var updatecount = firebase1.database().ref("users");
        var uid = "KwDaSqlqy6R744UpqsUVqUjoz5S2"
        updatecount.child(uid).on("value", function (snapshot) {
            data = snapshot.val();
            console.log(data)
        });
        return data.countPark;
    }
}