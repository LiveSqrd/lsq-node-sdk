var  LSQ= require('./lib')
	,fs 	= require('fs')
	,lsq= new LSQ("your-url.lsq.io","yourToken",{"apiVersion":"v1"});

fs.readFile(__dirname+'/data.json',function(err,data){
	var points = JSON.parse(data);
	for(var i = 0;i < points.length; i++)
		lsq.create('item',points[i],function(err,result){
			console.log(err,result)
		})
})

// lsq.delete('item',{id:""},function(err,result){
// 	console.log(err,JSON.parse(result))
// })


// lsq.read('item',{},function(err,result){
// 	console.log(err,JSON.parse(result))
// })


// lsq.udpate('item',{id:""},{group:"hello"},function(err,result){
//  console.log(err,JSON.parse(result))
// })