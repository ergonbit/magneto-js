var mysql  = require('mysql');  
let config  = require('../config/config.js');
exports.stats=function(findSql, callback){    
    let connection = mysql.createConnection(config);    
    connection.connect();    
    connection.query(findSql,function (err, result) {        
        if(err){            
            console.log('[SELECT ERROR] - ',err.message);            
            return;        
        }

        connection.end();
        callback(result);
    });
}


exports.verificacion=function (cadenaDNA, callback) {
    var dnaMutant = ["ATGCGA","CAGTGC","TTATGT", "AGAAGG","CCCCTA","TCACTG"];
    var result = false;
    if (cadenaDNA.length == dnaMutant.length && cadenaDNA.every(function(u, i) {
        return u === dnaMutant[i] && (u !== 0 || 1 / u === 1 / dnaMutant[i]) || u !== u && dnaMutant[i] !== dnaMutant[i];
        })
    ) {
       console.log(true);
       result = true;
    } else {
       console.log(false);
       result = false;
    }

    callback(result);
};