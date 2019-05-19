require('firebase/auth')
require('firebase/database')
require('firebase/firestore');
require('firebase/storage');
global.XMLHttpRequest = require("xhr2");
var firebaseApp = require('../server');


module.exports = (req, res) => {
  const timeOut = 500;
  setTimeout((function () {
    if (req.body) {
      //  console.log(req.body);
      var data;
      console.log("New Data")
      console.log(req.body.email);

      firebaseApp.firebaseApp.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
        .catch(function (err) {
          console.log(err);
        });
      console.log("Registered");

      //     firebaseApp.auth().signInWithEmailAndPassword(email, password)
      //         .catch(function(error){
      //             console.log("ERRRROOOOORRRRRRRR")
      //             var errorCode = error.code;
      //             var errorMessage = error.message;
      //             if (errorCode === 'auth/wrong-password') {
      //                     console.log('Wrong password.');
      //                     flag = false;
      //             } else {
      //                     console.log(errorMessage);
      //             }

      //   console.log(error);
      //     });
      //     if (flag){
      //     res.status(200).send("Successful");
      //     }
      //     else
      //     {
      //       res.status(403).end();
      //     }
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User logged in already or has just logged in.
          //  var userId = user.uid

          firebase.database().ref('users/' + user.uid).set({
            name: req.body.name,
            Email: req.body.email,
            PatientID: req.body.patientId,
            doctorId: req.body.doctorId,
            height: req.body.height,
            weight: req.body.weight
          });

          console.log("User Data Completed");
          console.log(typeof req.body.image);
          var firebaseStorage = firebase.storage().ref();
          var metadata = {
            contentType: 'image/jpeg',
          };
          // global.atob = base64.encode;
          firebaseStorage.child(user.uid).putString(req.body.image, 'raw', metadata).then(function (snapshot) {
            console.log('Uploaded a data_url string!');
          });
          firebase.database().ref('PatientID/' + req.body.patientId).set({
            UID: user.uid,
            Email: req.body.email,
            doctorId: req.body.doctorId,
            PatientName: req.body.name
          });
          var ref = firebase.database().ref('users');
          nextref = ref.child(user.uid).on("value", function (childSnapshot) {
            data = childSnapshot.val();
            console.log("Email ID " + data.Email);
            console.log(JSON.stringify(childSnapshot));
            let perdata = {
              name: data.name,
              Email: data.email,
              PatientID: data.patientId,
              doctorId: data.doctorId,
              height: data.height,
              weight: data.weight,
              image: data.image
            }
            console.log("Sending data" + perdata.Email);
            res.status(200).send(perdata);

          });
        }
      });


      //res.status(200).send("Successful");

    }
    else {
      res.status(403).end();
    }
  }), timeOut);
};
