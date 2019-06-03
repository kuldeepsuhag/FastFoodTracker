require('firebase/auth')
require('firebase/database')
require('firebase/firestore');
require('firebase/storage');
const fetch = require('node-fetch');
var fire = require('../server');


module.exports = (req, res) => {
  const timeOut = 500;
  setTimeout((function () {
    if (req.body) {
      var id = req.body.id;
      var email = req.body.email;
      var password = req.body.password;
      // firebase.auth().signInAndRetrieveDataWithCredential
      fire.firebaseApp.auth().signInWithEmailAndPassword(email, password)
        .then(function (user) {
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              // User logged in already or has just logged in.
              console.log(user.uid);
              var ref = firebase.database().ref('users');
              nextref = ref.child(user.uid).on("value", function (childSnapshot) {
                data = childSnapshot.val();
                console.log(JSON.stringify(childSnapshot));
                var firebaseStorage = firebase.storage().ref();
                console.log(user.uid);
                firebaseStorage.child(user.uid).getDownloadURL().then(function (url) {
                  console.log(url)
                  getImage(url, data, res, user.uid);
                }).catch(function (error) {
                  console.log(error);
                  getImage(null, data, res, user.uid);
                });
              });

            } else {
            }
          });
        }).catch(function (error) {
          console.log(error);
          res.status(400).send(error);
        });
    }
  }), timeOut);
};

async function getImage(url, data, res, uid) {
  var ref = firebase.database().ref('users');
  ref.child(uid).off("value");
  if(url != null){
    var urlFirebase = await fetch(url);
    var image = await urlFirebase.text();
  }else{
    var image = null;
  }

  let perdata = {
    name: data.name,
    Email: data.Email,
    PatientID: data.PatientID,
    doctorId: data.doctorId,
    height: data.height,
    weight: data.weight,
    image: image,
    userID: uid,
    currentGoal: data.currentGoal
  }
  res.status(200).send(perdata);
}
