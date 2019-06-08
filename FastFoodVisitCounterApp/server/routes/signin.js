require('firebase/auth')
require('firebase/database')
require('firebase/firestore');
require('firebase/storage');
const fetch = require('node-fetch');
var fire = require('../server');
var firebaseStorage = firebase.storage().ref();

module.exports = (req, res) => {
  const timeOut = 500;
  setTimeout((function () {
    if (req.body) {
      var email = req.body.email;
      var password = req.body.password;
      console.log(email)
      fire.firebaseApp.auth().signInWithEmailAndPassword(email, password)
        .then(function (user) {
            if (user) {
              var loggedInUser = user.user
              console.log(loggedInUser.uid)
              var ref = firebase.database().ref('users');
              ref.child(loggedInUser.uid).once("value", function (childSnapshot) {
                var data = childSnapshot.val();
                console.log(JSON.stringify(childSnapshot));
                firebaseStorage.child(loggedInUser.uid).getDownloadURL().then(function (url) {
                  console.log(url)
                  getImage(url, data, res, loggedInUser.uid);
                }).catch(function (error) {
                  console.log(error);
                  getImage(null, data, res, loggedInUser.uid);
                });
              });

            }
        }).catch(function (error) {
          console.log(error);
          res.status(400).send(error);
        });
    }
  }), timeOut);
};

async function getImage(url, data, res, uid) {
  console.log(data)
  if(url != null){
    var urlFirebase = await fetch(url);
    var image = await urlFirebase.text();
  }else{
    var image = null;
  }
  console.log("******* USER ID *******", uid)

  let perdata = {
    name: data.name,
    Email: data.Email,
    PatientID: data.PatientID,
    doctorId: data.doctorId,
    height: data.height,
    weight: data.weight,
    image: image,
    userID: uid,
    currentGoal: data.currentGoal,
    rest: data.countRest,
    park: data.countPark
  }
  res.status(200).send(perdata);
}
