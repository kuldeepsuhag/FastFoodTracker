require('firebase/database')
firebase1 = require('firebase/app');
module.exports = (req,res) => {
        if (req.body) {
           console.log("Getting Data")
           console.log(req.body);
           console.log(req.body.place);
        //    var lat = -37.802222;
        //    var long = 144.9617;
           var flag = 'false';
           var ref = firebase1.database().ref("KFC");
           nextref = ref.child(req.body.place).on("value",function (childSnapshot) {
            data = childSnapshot.val();
            // console.log("Test Karo" + data.name);
            if (req.body.lat <= data.nelat && req.body.long <= data.nelong 
                && req.body.lat <= data.swlat && req.body.long <= data.swlong){
                console.log("Finally")
                updatedatabase();
            }
           });
           console.log(flag)
           if (flag == 'true'){
           res.status(200).send("KFC");
           }
        }
           else {
            console.log("Entering in Park")
            var ref = firebase1.database().ref("parks");
            // req.body.lat.toFixed(3)
            nextref = ref.child(req.body.place).on("value",function (childSnapshot) {
                data = childSnapshot.val();
                // console.log(data);
    
                if (lat <= data.nelat && long <= data.nelong 
                    && lat <= data.swlat && long <= data.swlong){
                    flag = 'true'
                }
               });
               console.log
            
           }

}
        