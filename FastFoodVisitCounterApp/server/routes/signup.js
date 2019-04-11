module.exports = (req, res) => {
    console.log("Test");
    const timeOut = 500;
    setTimeout((function() {
        if (req.body) {
           console.log(req.body);
           var id = req.body.id;
           var password = req.body.password;
           console.log(id);
           console.log(password);
           res.status(200).send("TESTED");
        }
        else {
            res.status(403).end();
        }
    }), timeOut);
};
