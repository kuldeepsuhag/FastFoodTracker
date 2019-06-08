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
      var data;
      firebaseApp.firebaseApp.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
      .then(function (user) {
        console.log(user.user.uid);
        setUser(req, res, user.user.uid)
      })
        .catch(function (err) {
          if (err.code == 'auth/email-already-in-use') {
            res.status(400).send(err);
          }
          console.log(err.code);
        })
      }
      }), timeOut);
    }

  function setUser(req, res, uid){
        if (uid) {
          firebase.database().ref('users/' + uid).set({
            name: req.body.name,
            Email: req.body.email,
            PatientID: req.body.patientId,
            doctorId: req.body.doctorId,
            height: req.body.height,
            weight: req.body.weight,
            countRest: 0,
            countPark: 0,
            previoustime: null
          });
          console.log("User Data Completed");
          var firebaseStorage = firebase.storage().ref();
          var metadata = {
            contentType: 'image/jpeg',
          };
          if(req.body.image != null){
            firebaseStorage.child(uid).putString(req.body.image, 'raw', metadata).then(function () {
              console.log('Uploaded a data_url string!');
            });
          }
          // var ref = firebase.database().ref('users');
          // ref.child(user.uid).on("value", function (childSnapshot) {
          //   data = childSnapshot.val();
          //   console.log("Email ID " + data.Email);
          //   console.log(JSON.stringify(childSnapshot));
            let perdata = {
              name: req.body.name, //getting
              Email: req.body.email, //getting
              PatientID: req.body.patientId, 
              doctorId: req.body.doctorId, //getting
              height: req.body.height, //getting
              weight: req.body.weight, //getting
              image: req.body.image,
              userID: uid,
              rest: 0,
              park: 0
            }
            console.log("Sending data" + perdata);
            // ref.child(user.uid).off("value");
            res.status(200).send(perdata);
          // });
        }
    else {
      res.status(400).send(error);
    }
  }