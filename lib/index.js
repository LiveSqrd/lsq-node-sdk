var  _ 		= require('underscore')
	,https 	= require('https');
exports = module.exports = LSQ;

	function LSQ(host,token,options){
		this.host  = host;
		this.token  = token;
		this.options = _.isObject(options) ? options : {};
		this.options = _.defaults(this.options,{"apiVersion":"v1"});
		return this;
	}

	LSQ.prototype.create = function(collection,data,options,callback){
		if(_.isFunction(options)){
		callback = options;
		}
		else if(!_.isObject(options)){
			options = {};
		}
		if(_.isFunction(data)){
			callback = data;
			data = {};
		}

		if(!_.isString(collection) && collection.length < 1){
			callback("error no collection",{})
			return;
		}
		data = {model:data};
		data.key = collection;
		
		this.apiCall("create",data,options,callback)
			
	}
	LSQ.prototype.count = function(collection,data,options,callback){

		if(_.isFunction(options)){
		callback = options;
		}
		else if(!_.isObject(options)){
			options = {};
		}
		if(_.isFunction(data)){
			callback = data;
			data = {};
		}
		if(_.isString(data)){
			data = {id:data}
		}else{
			data = {query:data}
		}

		if(!_.isString(collection) && collection.length < 1){
			callback("error no collection",{})
			return;
		}
		data.key = collection;
		this.apiCall("count",data,options,callback)
			
	}
	LSQ.prototype.read = function(collection,data,options,callback){
		
		

		if(_.isFunction(options)){
		callback = options;
		}
		else if(!_.isObject(options)){
			options = {};
		}
		if(_.isFunction(data)){
			callback = data;
			data = {};
		}
		if(_.isString(data)){
			data = {id:data}
		}else{
			data = {query:data}
		}

		if(!_.isString(collection) && collection.length < 1){
			callback("error no collection",{})
			return;
		}
		data.key = collection;
		this.apiCall("read",data,options,callback)
			
	}
	LSQ.prototype.update = function(collection,data,model,options,callback){
		


		if(_.isFunction(options)){
		callback = options;
		}
		else if(!_.isObject(options)){
			options = {};
		}

		if(_.isFunction(model) || _.isString(model)){
			callback("error no data",{})
			return;
		}

		if(!_.isString(collection) && collection.length < 1){
			callback("error no collection",{})
			return;
		}
		if(_.isString(data)){
			data = {id:data}
		}else{
			data = {query:data}
		}
		data.model = model;
		data.key = collection;
		this.apiCall("update",data,options,callback)
			
	}
	LSQ.prototype.delete = function(collection,data,options,callback){
		
		

		if(_.isFunction(options)){
		callback = options;
		}
		else if(!_.isObject(options)){
			options = {};
		}
		if(_.isFunction(data)){
			callback = data;
			data = {};
		}

		if(_.isString(data)){
			data = {id:data}
		}else{
			data = {query:data}
		}

		if(!_.isString(collection) && collection.length < 1){
			callback("error no collection",{})
			return;
		}
		data.key = collection;
		this.apiCall("delete",data,options,callback)
			
	}


	LSQ.prototype.apiCall = function(method,data,options,callback){
	var self = this;
	var  op 		= {}
		,result 	= ""
		,error 		= null
		,body 		= {token:this.token}
		,key
		,req;	

	if(_.isFunction(options)){
		callback = options;
	}
	else if(!_.isObject(options)){
		options = {};
	}
	if(_.isFunction(data)){
		callback = data;
		data = {};
	}

	if(!_.isFunction(callback))
		callback = function(){};

		op.host 		= this.host;
		op.port 		= 443;
		op.method 		= "POST";
		op.path 		= "/api/"+self.options.apiVersion+"/"+data.key;
		body			= _.extend(body,options);
		body.model 		= _.isObject(data.model) ? data.model : {};
		body.query 		= _.isObject(data.query) ? data.query : {};

	if(_.isString(data.id))
		body.id = data.id;
	
	if(_.has(this.options,"user")&&_.has(this.options,"pass"))
		op.auth = this.options.user +":"+this.options.pass;

	switch(method){
		case "create":
			body.request= "create";
			
			if(_.isEmpty(body.model)){
				callback("model is empty",{});
				return;
			}
		break;
		case "update":
			body.request= "update";
			
		break;
		case "delete":
			body.request= "delete";
			
		break;
		case "count":
			body.request= "count";
			
		break;
		default:
			body.request= "read";
			
		break;
	}

	var d = new Buffer(JSON.stringify(body));
	op.headers ={'Content-Length': d.length,'Content-Type': 'application/json'};

	req = https.request(op, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			result +=chunk;
		});
			res.on("end",function(){
				var j = {};
				try{
					j = JSON.parse(result)
				}catch(e){
					error = e;
				}

				callback(error,j.result,j.total,j);
		})
	});
	req.on('error', function(e) {
		callback(e.message,e,result);
	});
	for(var i = 0; i < d.length; i+=500){
		var end = i+500 > d.length ? d.length: i+500 ;
		req.write(d.slice(i,end).toString(),'utf8')
	}	
	req.end();

}
