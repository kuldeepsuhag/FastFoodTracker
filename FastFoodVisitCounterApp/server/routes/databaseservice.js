require('firebase/database')
firebase1 = require('firebase/app');
module.exports = (req,res) => {
        if (req.body) {
           console.log("Getting Data")
           console.log(req.body);
           console.log(req.body.place);
        //    var lattt =  -37.8006047;
        //    var longii = 144.9636479;

           var ref = firebase1.database().ref("KFC");
           nextref = ref.child("Carlton").on("value",function (childSnapshot) {
            data = childSnapshot.val();
            console.log("Test Karo" + data.name);
            if (req.body.lat == data.lat && req.body.long == data.long){
                console.log("Working")
            }
           });
           res.status(200).send("Successful");
        }
        else {
            res.status(403).end();
        }
};