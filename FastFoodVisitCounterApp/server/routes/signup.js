firebase = require('firebase/app');
require('firebase/auth')
const config = {
    apiKey: "AIzaSyCRMf_MGMARVp3jF8djO4Vp1RLNRuT-0hA",
    authDomain: "computing-project-236008.firebaseapp.com",
    databaseURL: "https://computing-project-236008.firebaseio.com",
    projectId: "computing-project-236008",
    storageBucket: "computing-project-236008.appspot.com",
    messagingSenderId: "978408621474"
  }
const firebaseApp = firebase.initializeApp(config);

module.exports = (req, res) => {
    const timeOut = 500;
    setTimeout((function() {
        if (req.body) {
           console.log(req.body);
           var id = req.body.id;
           var email = req.body.email;
           var password = req.body.password;
            firebaseApp.auth().createUserWithEmailAndPassword(id,password)
            .catch(function(err){
                var errorCode = err.code;
                var errorMessage = err.message;
                if (errorCode == 'auth/weak-password'){
                    console.log('The Password is too weak');
                }else{
                    console.log(errorMessage);
                }
                console.log(err);               
            });
           res.status(200).send("TESTED");
        }
        else {
            res.status(403).end();
        }
    }), timeOut);
};