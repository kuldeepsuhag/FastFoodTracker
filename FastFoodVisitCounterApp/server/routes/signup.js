require('firebase/auth')
require('firebase/database')
var authen = require('./firebaseconfig')

firebase = require('firebase/app');
var firebaseApp = firebase.initializeApp(authen.config);
var database = firebase.database();
var flag = true;


module.exports = (req, res) => {
    const timeOut = 500;
    setTimeout((function() {
        if (req.body) {
           console.log(req.body);
           var id = req.body.id;
            var email = req.body.email;
            var password = req.body.password;
            var data;
            firebaseApp.auth().createUserWithEmailAndPassword(email,password)
            .catch(function(err){
                console.log(err);
                flag = false              
            });
              
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
                 var ref = firebase.database().ref('users');
                 nextref = ref.child(user.uid).on("value",function (childSnapshot) {
                  data = childSnapshot.val();
                  console.log("Email ID " + data.Email);

                  console.log(JSON.stringify(childSnapshot));
                  let perdata = {
                    Email: data.Email,
                    Password: data.Password,
                    PatientID: data.PatientID 
                  }
                  console.log(perdata)
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
