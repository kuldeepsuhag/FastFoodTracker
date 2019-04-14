// var service = require("../config");
// ar service = require("../serviceAccountkey.json")
// var Firebase = require('firebase');
// var firebaseRef = new Firebase('https://computing-project-236008.firebaseio.com');
// const FirebaseAuth = require('firebaseauth');
// const firebase = new FirebaseAuth(process.env.FIREBASE_API_KEY);
//import withFirebaseAuth from 'react-with-firebase-auth'
//import * as firebase from 'firebase/app'
firebase = require('firebase/app');
require('firebase/auth')
//import config from '../config'
//config = require('../config') 
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
    console.log("Test");
    const timeOut = 500;
    setTimeout((function() {
        if (req.body) {
           console.log(req.body);
           var id = req.body.id;
           var password = req.body.password;
        //    addUser(id, password);
            firebaseApp.auth().createUserWithEmailAndPassword(id,password)
            .catch(function(err){
                var errorCode = err.code;
                var errorMessage = err.message;
                if (errorCode = 'auth/weak-password'){
                    alert('The Password is too weak');

                }else{
                    alert(errorMessage);
                }
                console.log(err);
                

                
            });
        //    firebase.auth().createUserWithEmailAndPassword

           console.log(id);
           console.log(password);
           res.status(200).send("TESTED");
        }
        else {
            res.status(403).end();
        }
    }), timeOut);
};
// function addUser(email, password) {
//     console.log("kuldeep");
//     service.createUser
// 	service.create
// }
