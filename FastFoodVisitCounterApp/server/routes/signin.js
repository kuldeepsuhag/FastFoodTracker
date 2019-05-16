require('firebase/auth')
require('firebase/database')
var fire = require('../server');

module.exports = (req, res) => {
    const timeOut = 500;
    setTimeout((function () {
        if (req.body) {
            console.log(req.body);
            var id = req.body.id;
            var email = req.body.email;
            var password = req.body.password;
            // firebase.auth().signInAndRetrieveDataWithCredential
            fire.firebaseApp.auth().signInWithEmailAndPassword(email, password)
            .then(function(user) {
                firebase.auth().onAuthStateChanged((user) => {
                    if (user) {
                      // User logged in already or has just logged in.
                      console.log(user.uid);
                      console.log("Database created")
                 var ref = firebase.database().ref('users');
                 nextref = ref.child(user.uid).on("value",function (childSnapshot) {
                  data = childSnapshot.val();
                  console.log("Email ID " + data.Email);
                  
                  console.log(JSON.stringify(childSnapshot));
                  let perdata = {
                      name : data.name,
                      Email: data.Email,
                      PatientID : data.PatientID,
                      doctorId : data.doctorId,
                      height: data.height,
                      weight:data.weight,
                      image: data.image,
                      userID: user.uid
                  }
                  console.log("Sending data" + perdata.Email);
                  res.status(200).send(perdata);
      
                });
                      
                    } else {
                      // User not logged in or has just logged out.
                    }
                  });
            }).catch(function(error) {
               console.log(error);
               res.status(200).send(error);
              });
        }
    }), timeOut);
};
