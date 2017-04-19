var express = require('express');
var app = express();

//页面静态文件目录，比如css，images等
var staticFilePath = "./test";
app.use("/", express.static(staticFilePath));


app.get("*", function(req, res) {
	res.send("你们到了404页面啦!!");
})

var port = 8088;
app.listen(port, function() {
	console.log("server start at " + port);
});