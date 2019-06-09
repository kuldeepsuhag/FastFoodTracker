require('firebase/auth')
require('firebase/database')
require('firebase/firestore');
require('firebase/storage');
var bleach = require('bleach');
global.XMLHttpRequest = require("xhr2");
var firebaseApp = require('../server');

module.exports = (req, res) => {
  const timeOut = 500;
  setTimeout((function () {
    if (req.body) {
      var email = bleach.sanitize(req.body.email)
      var password = bleach.sanitize(req.body.password)
      firebaseApp.firebaseApp.auth().createUserWithEmailAndPassword(email, password)
      .then(function (user) {
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
          console.log("NAMEEE" , req.body.name)
          firebase.database().ref('users/' + uid).set({
            name: bleach.sanitize(req.body.name),
            Email: bleach.sanitize(req.body.email),
            PatientID: bleach.sanitize(req.body.patientId),
            doctorId: bleach.sanitize(req.body.doctorId),
            height: bleach.sanitize(req.body.height),
            weight: bleach.sanitize(req.body.weight),
            countRest: 0,
            countPark: 0,
            previoustime: null
          });
          var firebaseStorage = firebase.storage().ref();
          var metadata = {
            contentType: 'image/jpeg',
          };
          if(req.body.image != null){
            firebaseStorage.child(uid).putString(req.body.image, 'raw', metadata).then(function () {
              console.log('Uploaded a data_url string!');
            });
          }
            let perdata = {
              name: bleach.sanitize(req.body.name), //getting
              Email: bleach.sanitize(req.body.email), //getting
              PatientID: bleach.sanitize(req.body.patientId), 
              doctorId: bleach.sanitize(req.body.doctorId), //getting
              height: bleach.sanitize(req.body.height), //getting
              weight: bleach.sanitize(req.body.weight), //getting
              image: bleach.sanitize(req.body.image),
              userID: uid,
              rest: 0,
              park: 0
            }
            res.status(200).send(perdata);
        }
    else {
      res.status(400).send(error);
    }
  }