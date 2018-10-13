var express = require('express');
var router = express.Router();
var mysql = require('mysql');

//------------------
// 載入資料庫連結
//------------------
var pool = require('./lib/db.js');
/* GET home page. */
router.get('/', isLoggedIn,function(req, res, next) {
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
			
			//訂單列表orderdetail資料表
			var orderdetailData;
			pool.query('select * from orderdetail', function(err, results) {       
				if (err) {
					orderdetailData=[];
				}else{
					orderdetailData=results;
				}
			//console.log("orderdetailData");
			//console.log(orderdetailData);
				
				//訂單列表custom資料表
				var customData;
				pool.query('select * from custom', function(err, results) {       
					if (err) {
						customData=[];
					}else{
						customData=results;
					}
				//console.log("customData");
				//console.log(customData);

					//訂單列表supplier資料表
					var supplierData;
					pool.query('select * from supplier', function(err, results) {       
						if (err) {
							supplierData=[];
						}else{
							supplierData=results;
						}
					//console.log("supplierData");
					//console.log(supplierData);
					
					
						var okpendordData;
						pool.query('select * from okpendord', function(err, results) {       
							if (err) {
								okpendordData=[];
							}else{
								okpendordData=results;
							}
						//console.log("okpendordData");
						//console.log(okpendordData);

						
							var suporddetailData;
							pool.query('select * from suporddetail', function(err, results) {       
								if (err) {
									suporddetailData=[];
								}else{
									suporddetailData=results;
								}
							console.log("suporddetailData");
							console.log(suporddetailData);


								res.render('supplieruser', {productData:productData,orderData:orderData,orderdetailData:orderdetailData,customData:customData,supplierData:supplierData,okpendordData:okpendordData,suporddetailData:suporddetailData,user : req.user});    
							});
						
						
							
						});


						
					});
			
				});
				
			}); 		
			
		}); 
	
	}); 

});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}