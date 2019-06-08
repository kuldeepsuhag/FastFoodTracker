// require('firebase/auth')
// require('firebase/database')
// var firebaseApp = require('../server');

// module.exports = (req, res) => {
//     const timeOut = 500;
//     setTimeout((function() {
//         if (req.body) {
//             var data;
//                  firebase.database().ref('users/' + req.body.uid).set({
//                       name : req.body.name,
//                       doctorId : req.body.doctorId,
//                       height: req.body.height,
//                       weight: req.body.weight
                      
//                     });
//                 firebase.database().ref('PatientID/' + req.body.patientId).set({
//                     doctorId: req.body.doctorId,
//                     PatientName: req.body.name
//                 });
//                 firebase.database().ref('DoctorID' + req.body.doctorId).set({
//                     PatientID : req.body.patientId,
//                     PatientName : req.bosy.name,
//                     PatientUID : req.body.uid
//                 });
//                  var ref = firebase.database().ref('users');
//                  nextref = ref.child(user.uid).on("value",function (childSnapshot) {
//                   data = childSnapshot.val();
//                   let perdata = {
//                       name : data.name,
//                       Email: data.email,
//                       PatientID : data.patientId,
//                       doctorId : data.doctorId,
//                       height: data.height,
//                       weight:data.weight
//                   }
//                   res.status(200).send(perdata);
      
//                 });
//                 } 
//                 res.status(404).end();
    
//     }), timeOut);
// };
