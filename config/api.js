var express=require('express');
var app =express();
var bodyParser = require('body-parser');
//引用bodyParser 这个不要忘了写
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
 });

 var appData=require('../data.json');

 var seller= appData.seller;
 var goods=appData.goods;
 var ratings=appData.ratings;.

 var apiRouters=express.Router();


 apiRouters.get('seller',function(req,res){
	 res.json({
		 erron:0,
		 data:seller
	 });
 });

  apiRouters.get('goods',function(req,res){
 	 res.json({
 		 erron:0,
 		 data:goods
 	 });
 });




  apiRouters.get('ratings',function(req,res){
 	 res.json({
 		 erron:0,
 		 data:ratings
 	 });
 });


 app.use('api',apiRouters);



 var server = app.listen(8080,function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log('listen at http://%s:%s',host,port)
})
