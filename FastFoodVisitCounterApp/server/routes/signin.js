require('firebase/auth')
var config = require('./firebaseconfig')
firebase = require('firebase');
var firebaseApp = firebase.initializeApp(config.config);

 module.exports = (req, res) => {
  const timeOut = 500;
  setTimeout((function() {
      if (req.body) {
        console.log(req.body);
            var email = req.body.email;
            var password = req.body.password;
            var flag = true
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
    if (flag == true){
    res.status(200).send("Successful");
    }
    else
    {
      res.status(403).end();
    }
  }
  else {
      res.status(403).end();
  }
}), timeOut);
};


 