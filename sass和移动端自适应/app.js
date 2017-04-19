var express = require("express");
var app = express();

app.use("/test", express.static('./test'));

var port = 3014;

app.listen(port, function () {
    console.log("starting server at " + port);
})