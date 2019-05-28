require('firebase/database')
firebase1 = require('firebase/app');
var json = require('../data/places.json')
const calltime = new Date();



module.exports = (req, res) => {
    if (req.body) {
        console.log(req.body)
        var callminute = calltime.getMinutes("en-US", { timeZone: "Australia/Brisbane" });
        console.log("Calling Minute", callminute)
        while (true) {

            var currentmintute = new Date().getMinutes("en-US", { timeZone: "Australia/Brisbane" });
            if (((currentmintute - callminute) >= 1) || ((currentmintute - callminute) >= -1)) {
                console.log("Final time", new Date().getMinutes("en-US", { timeZone: "Australia/Brisbane" }))
                break
            }

        }

        // console.log('AEST time: ',aestTime.split(',')[1])
        // console.log('AEST time: ',aestTime.getHours("en-US", {timeZone: "Australia/Brisbane"}))
        // var timestamp = aestTime.getTime();
        // var currenttime = new Date(timestamp)
        // console.log(currenttime.getHours("en-US", {timeZone: "Australia/Brisbane"}))
        //console.log("Time is ",time)
        // console.log("Getting Data")
        // console.log(req.body);
        // console.log(req.body.place);
        // var lat = -37.802222;
        // var long = 144.9617;
        var uid = "RO179GyHZHXWiWJwnI4c3vOmlZj2"
        // // firebase1.database().ref("users").child(uid).on("value", function(childSnapshot){
        //     data = childSnapshot.val();
        //     // if(data)
        // });
        // var restplaces = ["Bacchus","Melton","Sunbury","Ballan","Calder","Keilor","Taylors","Sydenham","Caroline",""]

        var parks = json.parks;
        var kfc = json.KFC;
        // console.log("Printing JSON"
        // console.log(json.parks);
        

        console.log("Carlton is present ? ", kfc.hasOwnProperty(req.body.place))



        if (kfc.hasOwnProperty(req.body.place)) {

            firebase1.database().ref("users").child(uid).on("value", function (childSnapshot) {

                if (childSnapshot.hasChild('HistoryRest') == false) {
                    restaurant(req);
                }
                else {
                    firebase1.database().ref("users").child(uid).child('HistoryRest').orderByKey().limitToLast(1).on('value', function (childSnapshot) {
                        data = childSnapshot.val();
                        console.log("getting value", childSnapshot.val());
                        var histimestamp;
                        var place;
                        for (var key in data) {
                            histimestamp = parseInt(key);
                            place = data[key]["Rest"]
                        }
                        currentplace = req.body.place;
                        var histtime = new Date(histimestamp).getHours();
                        var calledtime = calltime.getHours();
                        if (((calledtime - histtime) >= 1) && (currentplace.localeCompare(place)==false)) {
                            restaurant(req);
                        }else{
                            if((currentplace.localeCompare(place)==false)) {
                                restaurant(req)
                        }
                    }
                        

                    });
                }
            });

            //restaurant();
            // var ref = firebase1.database().ref("KFC");
            // var updatecount = firebase1.database().ref("users");
            // var uid = "1vUYysJHRgVm8iB9BlFPOp2UlOO2"
            // var countpark;
            // var countrest;
            // updatecount.child(uid).on("value", function(childSnapshot){
            //     data = childSnapshot.val()
            //     console.log("database service ", data);
            //     countpark = data.countpark;
            //     countrest = data.countrest;
            //     console.log("getting value", countpark);
            //     console.log(countrest);
            // }, function(error) {
            //     console.log("Failed Database service" + error.code)
            // });
            // console.log(countrest,countpark)
            // nextref = ref.child("Carlton").on("value", function (childSnapshot) {
            //     data = childSnapshot.val();

            //      console.log("Test Karo", data.nelat);
            //     if (lat <= data.nelat && long <= data.nelong
            //         && lat <= data.swlat && long <= data.swlong) {
            //         nextref = updatecount.child(uid).child("countrest").transaction(function (current_value) {
            //             console.log("Worked")
            //             test = current_value + 1;
            //             console.log("Counting Restaurant", current_value)
            //             return test;
            //         });

            //     }
            // });
        }
        if (parks.hasOwnProperty(req.body.name)) {
            console.log("Looking for parks")
            firebase1.database().ref("users").child(uid).on("value", function (childSnapshot) {

                if (childSnapshot.hasChild('HistoryPark') == false) {
                    parkmelb(req);
                }
                else {
                    firebase1.database().ref("users").child(uid).child('HistoryPark').orderByKey().limitToLast(1).on('value', function (childSnapshot) {
                        data = childSnapshot.val();
                        console.log("getting value", data);
                        var histimestamp;
                        var place;
                        for (var key in data) {
                            console.log("timestamp")
                            histimestamp = parseInt(key);
                            place = data[key]["Rest"]
                            
                        }
                        currentplace = req.body.place;
                        var histtime = new Date(histimestamp).getHours();
                        console.log("History Time", histtime)
                        var calledtime = calltime.getHours();
                        console.log("Called Time", calledtime)
                        console.log("Time Difference", (calledtime - histtime))
                        if (((calledtime - histtime) >= 1) && (currentplace.localeCompare(place) == false)){
                            parkmelb(req);
                        }
                        if(currentplace.localeCompare(place)==false) {
                                parkmelb(req)
                        }
                    

                    });
                }
            });

            // console.log("Entering in Park")
            //     var ref = firebase1.database().ref("parks");
            //     // req.body.lat.toFixed(3)
            //     nextref = ref.child(req.body.place).on("value", function (childSnapshot) {
            //         data = childSnapshot.val();
            //         // console.log(data);

            //         if (lat <= data.nelat && long <= data.nelong
            //             && lat <= data.swlat && long <= data.swlong) {
            //             nextref = ref.child(uid).transaction(function (current_value) {
            //                 return (current_value || 0) + 1;
            //             });

            //         }
            //     });
            // }
            //     var countpark = 0;
            //     var countrest = 0;
            //     // updatecount.child(uid).on("value", function(childSnapshot){
            //     //     data = childSnapshot.val()
            //     //     console.log("database service ", data);
            //     //     countpark = data.countpark;
            //     //     countrest = data.countrest;

            //     // }, function(error) {
            //     //     console.log("Failed Database service" + error.code)
            //     // });

            //     // let data = {
            //     //     park: countpark,
            //     //     rest: countrest
            //     // }
            //     // console.log("Data of Database service", countpark);
            //     // console.log(countrest);
            //     res.status(200).send();
        }

    }
    function restaurant(req) {
        console.log("Inside Restaurant Function",req.body)
        var ref = firebase1.database().ref("KFC");
        var updatecount = firebase1.database().ref("users");
        var uid = "RO179GyHZHXWiWJwnI4c3vOmlZj2"
        // var lat = -37.802222;
        // var long = 144.9617;
        var lat = req.body.latitude
        var long = req.body.longitude
        var databasenlat
        var databaseslat
        var databasenlong
        var databaseslong
        ref.child("Carlton").on("value", function (childSnapshot) {
            data = childSnapshot.val();
            // console.log("Database Data", data);
            databasenlat = data.nelat;
            databaseslat = data.swlat;
            databasenlong = data.nelong;
            databaseslong = data.swlong;
            // if (lat <= data.nelat && long <= data.nelong
            //     && lat <= data.swlat && long <= data.swlong) {
            //     updatecount.child(uid).child("countrest").transaction(function (current_value) {
            //         console.log("Inside Count Rest Function")
            //         test = current_value + 1;
            //         console.log("Counting Restaurant inside res", test)
            //         return test;
            //     });

            //     var rest = "Carlton KFC"
            //     var time = calltime.getTime("en-US", { timeZone: "Australia/Brisbane" })
            //     var timeis = new Date(time)
            //     console.log("Timestamp ?", timeis.getHours())

            //     updatecount.child(uid).child('HistoryRest').child(time).set({
            //         Rest: rest
            //     });

            // }

        });
        console.log("DATABASE ", databasenlat);
        console.log("DATABASE ", databasenlong);
        console.log("DATABASE ", databaseslat);
        console.log("DATABASE ", databaseslong);

         if (lat <= databasenlat && long <= databasenlong
             && lat <= databaseslat && long <= databaseslong) {
                 console.log("Inside IF")
        //     updatecount.child(uid).child("countrest").transaction(function (current_value) {
        //         console.log("Inside Count Rest Function")
        //         test = current_value + 1;
        //         console.log("Counting Restaurant inside res", test)
        //         return test;
        //     });

        //     var rest = "Carlton KFC"
        //     var time = calltime.getTime("en-US", { timeZone: "Australia/Brisbane" })
        //     var timeis = new Date(time)
        //     console.log("Timestamp ?", timeis.getHours())

        //     updatecount.child(uid).child('HistoryRest').child(time).set({
        //         Rest: rest
        //     });

        }
        updatecount.child(uid).on("value", function (childSnapshot) {
            data = childSnapshot.val();
            console.log("calling user data", data)
        });

    }

    function parkmelb(req) {
        console.log("Inside park function", req.body)
        var ref = firebase1.database().ref("parks");
        var updatecount = firebase1.database().ref("users");
        var uid = "RO179GyHZHXWiWJwnI4c3vOmlZj2"
        var lat = req.body.latitude
        var long = req.body.longitude
        console.log("Lattitude of park", lat)
        console.log("longitude of park", long)

        nextref = ref.child(req.body.name).on("value", function (childSnapshot) {
            data = childSnapshot.val();

            console.log("Test Karo", data.nelat);
            if (lat <= data.nelat && long <= data.nelong
                && lat <= data.swlat && long <= data.swlong) {
                updatecount.child(uid).child("countpaark").transaction(function (current_value) {
                    console.log("Worked")
                    console.log(current_value)
                    test = (current_value || 0)+ 1;
                    console.log("Counting Parks inside park", test)
                    return test;
                });

                var park = req.body.name;
                var time = calltime.getTime("en-US", { timeZone: "Australia/Brisbane" })
                var timeis = new Date(time)
                console.log("Timestamp ?", timeis.getHours())

                updatecount.child(uid).child('HistoryPark').child(time).set({
                    park: park
                });

            }
        });
        nextref = updatecount.child(uid).on("value", function (childSnapshot) {
            data = childSnapshot.val();
            console.log("calling user data", data)
        });
    }
}