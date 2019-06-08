require('firebase/database')
firebase = require('firebase/app');
module.exports = (req, res) => {
    if (req.body) {
        var ref = firebase.database().ref("StepData");
        userRef = ref.child(req.body.uid)
        getLastDate(userRef , res)
    } else {
        res.status(403).end();
    }
};

async function getLastDate(userRef , res){
    var date;
    await userRef.orderByKey().limitToLast(1).once('value', function (childSnapshot) {
        var row = childSnapshot.val();
        if(row === null){
            res.status(200).send("26-05-2019");
        }else{
            for (var key in row) {
                date = row[key]["date"]
                res.status(200).send(date.toString());
            }
        }

    });
}