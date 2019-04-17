require('firebase/auth')
require('firebase/database')
var authen = require('./firebaseconfig')
var admin = require('firebase-admin')

firebase = require('firebase/app');
var firebaseApp = firebase.initializeApp(authen.config);
var database = firebase.database();

// var db = admin.database();
module.exports = (req, res) => {
    const timeOut = 500;
    setTimeout((function() {
        if (req.body) {
           console.log(req.body);
           var id = req.body.id;
            var email = req.body.email;
            var password = req.body.password;
            firebaseApp.auth().createUserWithEmailAndPassword(email,password)
            .catch(function(err){
                console.log(err);               
            });
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                  // User logged in already or has just logged in.
                //  console.log(user.uid);
                //  console.log("User successfullly Logged In")
                //  var userId = user.uid
                 firebase.database().ref('users/' + user.uid).set({
                      Email: email,
                      PatientID : id,
                      Password : password

                    });
                firebase.database().ref('PatientID/' + id).set({
                    UID : user.uid,
                    Email : email
                });
                 console.log("Database created")
                } else {
                  //  console.log("No User logged In")
                  // User not logged in or has just logged out.
                }
              });


           res.status(200).send("Successful");

        }
        else {
            res.status(403).end();
        }
    }), timeOut);
};
