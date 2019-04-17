require('firebase/auth')
require('firebase/database')
var authen = require('./firebaseconfig')

firebase = require('firebase/app');
var firebaseApp = firebase.initializeApp(authen.config);
var database = firebase.database();


module.exports = (req, res) => {
    const timeOut = 500;
    setTimeout((function() {
        if (req.body) {
           console.log(req.body);
           var id = req.body.id;
            var email = req.body.email;
            var password = req.body.password;
                firebaseApp.auth().signInWithEmailAndPassword(email, password)
                      .catch(function(error){
                          console.log("ERRRROOOOORRRRRRRR")
                          var errorCode = error.code;
                          var errorMessage = error.message;
                          if (errorCode === 'auth/wrong-password') {
                                  console.log('Wrong password.');
                                  flag = false;
                          } else {
                                  console.log(errorMessage);
                          }
                          
                console.log(error);
                  });
                  if (flag){
                  res.status(200).send("Successful");
                  }
                  else
                  {
                    res.status(403).end();
                  }
              
              res.status(200).send("Successful");

            }
            else {
                res.status(403).end();
            }
        }), timeOut);
    };
    