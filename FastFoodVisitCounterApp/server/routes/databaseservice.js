module.exports = (req,res) => {
    const timeOut = 500;
    setTimeout((function() {
        if (req.body) {
           console.log(req.body);
        }
    }), timeOut);
};