require('firebase/auth')
require('firebase/database')
var firebaseApp = require('../server');
var flag = true;

module.exports = (req, res) => {
    const timeOut = 500;
    setTimeout((function () {
        if (req.body) {
            console.log(req.body);
            var id = req.body.id;
            var email = req.body.email;
            var password = req.body.password;
            firebaseApp.firebaseApp.auth().signInWithEmailAndPassword(email, password)
                .catch(function (error) {
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
            if (flag) {
                res.status(200).send("Successful");
            }
            else {
                res.status(403).end();
            }
        }
        else {
            res.status(403).end();
        }
    }), timeOut);
};
