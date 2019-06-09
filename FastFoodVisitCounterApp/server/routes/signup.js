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

function setUser(req, res, uid) {
  var firebaseStorage = firebase.storage().ref();
  var metadata = {contentType: 'image/jpeg'};
  if (uid) {
    let userData = {
      name: bleach.sanitize(req.body.name),
      email: bleach.sanitize(req.body.email),
      patientId: bleach.sanitize(req.body.patientId),
      doctorId: bleach.sanitize(req.body.doctorId),
      height: bleach.sanitize(req.body.height),
      weight: bleach.sanitize(req.body.weight),
      restaurantCount: 0,
      parkCount: 0,
      previousTime: null,
    }
    firebase.database().ref('users/' + uid).set({
      ...userData
    });
    if (req.body.image != null) {
      firebaseStorage.child(uid).putString(req.body.image, 'raw', metadata).then(function () {
        console.log('Uploaded a data_url string!');
      });
    }
    userData.image =  bleach.sanitize(req.body.image);
    userData.userID = bleach.sanitize(uid);
    res.status(200).send(userData);
  }
  else {
    res.status(400).send(error);
  }
}