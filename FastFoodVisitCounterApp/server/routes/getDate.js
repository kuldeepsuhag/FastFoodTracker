require('firebase/database')
firebase = require('firebase/app');
module.exports = (req, res) => {
    if (req.body) {
        var ref = firebase.database().ref("StepData");
        console.log("UID STEPS", req.body.uid)
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
        console.log("ROWWW", row)
        if(row === null){
            let today = new Date()
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0)
            let start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 8, 0, 0, 0, 0)
            var lastWeekDate = start.getDate() + '-' + (start.getMonth() + 1) + '-' + start.getFullYear();
            console.log(lastWeekDate)
            res.status(200).send(lastWeekDate);
        }else{
            for (var key in row) {
                date = row[key]["date"]
                res.status(200).send(date.toString());
            }
        }

    });
}