var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var csrf = require('csurf');
var csrfProtection = csrf();
router.use(csrfProtection);
//----------------
// 引用db.js
//----------------
var pool = require('./lib/db.js');
router.post('/', function(req, res, done) {

    var OrdDate=req.param("OrdDate");
    var FinishDate=req.param("FinishDate");
	console.log(OrdDate);
	console.log(FinishDate);
	var Today = new Date();
	var createtime;
	createtime = Today.getFullYear()+ "" + (Today.getMonth()+1) + "" + Today.getDate() + "" + Today.getHours()+ "" + Today.getMinutes()+ "" + Today.getSeconds()+ "";
	
	
	var ProId=req.param("ProId");
	var inputSpecific=req.param("inputSpecific");
	var inputNum=req.param("inputNum"); 
	var inputPrice=req.param("inputPrice");
	console.log(inputSpecific+" "+inputNum+" "+inputPrice );
	
	//var memo=inputSpecific+"公克 "+inputNum+"包 "+inputPrice+"元";
	//console.log(memo);
	
	//var ProQuantity=inputSpecific*inputNum;
	//console.log(ProQuantity);
	//var Amount=inputNum*inputPrice;
	//console.log(Amount);
	var OrdStatus="新增訂單中"
	var No=req.param("No");
	console.log(No);
	var CusName=req.param("CusName");
	console.log(CusName);
	var Cellphone=req.param("Cellphone");
	console.log(Cellphone);
	var Address=req.param("Address");
	console.log(Address);
	var Email=req.param("Email");
	console.log(Email);
	var Account=req.param("Account");
	Account=CusName+createtime;
	console.log(Account);
	var Password=req.param("Password");
	console.log(Password);
	var createid=req.param("createid");
	console.log(createid);
	
	//新增custom資料
	 var newCustomData={
		CusName:CusName,
		Address:Address,
		Cellphone:Cellphone,
		Email:Email,
		Account:Account,
		Password:Password

	 }
	 
	console.log("newCustomData----------");
	console.log(newCustomData);
	console.log("newCustomData----------");
	
	//存入custom
	pool.query('INSERT INTO custom SET ?', newCustomData, function(err, rows, fields) {
		console.log("-------insert costom----------");

		//查custom.id
		pool.query('SELECT id FROM custom  ORDER BY id DESC LIMIT 0 , 1', function(err, results){
			console.log("-----select id----");
			console.log(results[0].id);
			var Custom_CusNo = results[0].id;		

			//查order.OrdNo
			pool.query('SELECT OrdNo FROM mydb.`order`  ORDER BY OrdNo DESC LIMIT 0 , 1  ',function(err, results){
				console.log("-----select OrdNo----");
				console.log(results[0].OrdNo);
				var OrdNo = results[0].OrdNo;		
				OrdNo = OrdNo+1;
				
				var memo ="";
				if(No.length=='1'){
					memo=inputSpecific+"公克"+inputNum+"包"+inputPrice+"元"+"//"+memo;	
					}
				else{
					for(var m='0';m<No.length;m++){
						
						console.log(inputSpecific[0]);
						memo=inputSpecific[m]+"公克"+inputNum[m]+"包"+inputPrice[m]+"元"+"//"+memo;
						console.log(memo);
						
						
					}
				}
				
				//新增order資料
				var newUserMysql = {
					OrdNo:OrdNo,
					Custom_CusNo:Custom_CusNo,
					OrdDate:OrdDate,
					FinishDate:FinishDate,
					createid:createid,
					createtime:createtime,
					memo:memo
				};
				console.log("newUserMysql----");
				console.log(newUserMysql);
				console.log("newUserMysql----");

				//存入order
				pool.query('INSERT INTO mydb.`order` SET ?', newUserMysql, function(err, rows, fields) {
					console.log("insert order----------");
						
						if (err){
							return (err, {message: '修改失敗'});    //導向更改失敗
					}else{
						return (null, false, {message: '修改成功'});
					}
		
				});
				
				//查orderdetail資料
				if(No.length=='1'){
					var ProQuantity=inputSpecific*inputNum;
					console.log(ProQuantity);
					var Amount=inputNum*inputPrice;
					var Product_ProId = ProId;
					var SerNo = No; 
					var Order_OrdNo = OrdNo;
					var one={SerNo,ProQuantity,Amount,Product_ProId,OrdStatus,Order_OrdNo};
					console.log(one);
					
					//存入orderdetail
					pool.query('INSERT INTO orderdetail SET ?', one, function(err, rows, fields) {
						console.log("---insert orderdetail----------");
						if (err){						
							return done(err);    //導向更改失敗頁面
						}else{
							return done(null,false, {message: '修改成功'}); //導向更改成功頁面
						}
					});
					}
				else{
					for(var n='0';n<No.length;n++){
						var ProQuantity=inputSpecific[n]*inputNum[n];
						console.log(ProQuantity);
						var Amount=inputNum[n]*inputPrice[n];
						var Product_ProId = ProId[n];
						var SerNo = No[n]; 
						var Order_OrdNo = OrdNo;
						var one={SerNo,ProQuantity,Amount,Product_ProId,OrdStatus,Order_OrdNo};
						console.log(one);
						
						pool.query('INSERT INTO orderdetail SET ?', one, function(err, rows, fields) {
							console.log("---insert orderdetail----------");
							if (err){						
								return done(err);    //導向更改失敗頁面
							}else{
								return done(null,false, {message: '修改成功'}); //導向更改成功頁面
							}
						});
					}
				}
					
				//產品名稱選單列
				var productData;
				pool.query('select * from product', function(err, results) {       
					if (err) {
						productData=[];
					}else{
						productData=results;
					}
					
				//console.log("productData");
				//console.log(productData);
				
					//訂單列表order資料表
					var orderData;
					pool.query('select * from mydb.`order`', function(err, results) {       
						if (err) {
							orderData=[];
						}else{
							orderData=results;
						}
					//console.log("orderData");
					//console.log(orderData);

						var orderdetailData;
						pool.query('select * from orderdetail', function(err, results) {       
							if (err) {
								orderdetailData=[];
							}else{
								orderdetailData=results;
							}
						//console.log("orderdetailData");
						//console.log(orderdetailData);

							var customData;
							pool.query('select * from custom', function(err, results) {       
								if (err) {
									customData=[];
								}else{
									customData=results;
								}
							//console.log("customData");
							//console.log(customData);

								var supplierData;
								pool.query('select * from supplier', function(err, results) {       
									if (err) {
										supplierData=[];
									}else{
										supplierData=results;
									}
								//console.log("supplierData");
								//console.log(supplierData);
								
									var suporddetailData;
									pool.query('select * from suporddetail', function(err, results) {       
										if (err) {
											suporddetailData=[];
										}else{
											suporddetailData=results;
										}
									//console.log("suporddetailData");
									//console.log(suporddetailData);
									
										var yetpendordData;
										pool.query('select * from yetpendord', function(err, results) {       
											if (err) {
												yetpendordData=[];
											}else{
												yetpendordData=results;
											}
										console.log("yetpendordData");
										console.log(yetpendordData);
										
											var okpendordData;
											pool.query('select * from okpendord', function(err, results) {       
												if (err) {
													okpendordData=[];
												}else{
													okpendordData=results;
												}
											console.log("okpendordData");
											console.log(okpendordData);

											var messages = req.flash('error');
											res.render('supplierordedit', {csrfToken: req.csrfToken(), productData:productData,orderData:orderData,orderdetailData:orderdetailData,customData:customData,supplierData:supplierData,suporddetailData:suporddetailData,yetpendordData:yetpendordData,okpendordData:okpendordData,user : req.user});    
											});

										});

									});

								});
						
							});
							
						}); 		
						
					}); 
				
				}); 	
				
			
			
			});
			
			
		
		});

		
		
	});


	
});

module.exports = router;