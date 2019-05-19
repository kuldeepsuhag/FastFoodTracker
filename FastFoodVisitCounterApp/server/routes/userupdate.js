require('firebase/auth')
require('firebase/database')
var firebaseApp = require('../server');

module.exports = (req, res) => {
    const timeOut = 500;
    setTimeout((function() {
        if (req.body) {
           console.log(req.body);
            var data;
            console.log("New Data")
            console.log(req.body.email);
                 firebase.database().ref('users/' + req.body.uid).set({
                      name : req.body.name,
                      doctorId : req.body.doctorId,
                      height: req.body.height,
                      weight: req.body.weight
                      
                    });
                    console.log("User Data Completed");
                firebase.database().ref('PatientID/' + req.body.patientId).set({
                    doctorId: req.body.doctorId,
                    PatientName: req.body.name
                });
                firebase.database().ref('DoctorID' + req.body.doctorId).set({
                    PatientID : req.body.patientId,
                    PatientName : req.bosy.name,
                    PatientUID : req.body.uid
                });
                 console.log("Database created")
                 var ref = firebase.database().ref('users');
                 nextref = ref.child(user.uid).on("value",function (childSnapshot) {
                  data = childSnapshot.val();
                  console.log("Email ID " + data.Email);

                  console.log(JSON.stringify(childSnapshot));
                  let perdata = {
                      name : data.name,
                      Email: data.email,
                      PatientID : data.patientId,
                      doctorId : data.doctorId,
                      height: data.height,
                      weight:data.weight
                  }
                  console.log("Sending data" + perdata.email);
                  res.status(200).send(perdata);
      
                });
                } 

        
                res.status(404).end();
    
    }), timeOut);
};
