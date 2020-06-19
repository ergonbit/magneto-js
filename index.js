const express = require("express");
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var mysql = require('mysql');
let config  = require('./config/config.js');
let result = '';
let functions = require('./utils/functions.js');

function verificacion(cadenaDNA) {
    var dnaMutant = ["ATGCGA","CAGTGC","TTATGT", "AGAAGG","CCCCTA","TCACTG"];
    if (cadenaDNA.length == dnaMutant.length && cadenaDNA.every(function(u, i) {
        return u === dnaMutant[i] && (u !== 0 || 1 / u === 1 / dnaMutant[i]) || u !== u && dnaMutant[i] !== dnaMutant[i];
        })
    ) {
       console.log(true);
       return true;
    } else {
       console.log(false);
       return false;
    }
};

function registrarVerificacion(valor){
    console.log("Ejecuta registro: " + valor); 
    let esMutante = 0;
    let connection = mysql.createConnection(config);
    let sql = 'CALL registrar_verificacion(?)';
    if (result) {
        esMutante = 1;
    }
    var data = {es_mutante: esMutante};
    connection.connect();
    connection.query(sql, valor, (error, results, fields) => {
        if (error) {
          return console.error(error.message);
        }
        console.log(esMutante);
        console.log(results[0]);
      });
    connection.end();
};

function consultarEstadisticas(){
    console.log("Ejecuta consultarEstadisticas");
    let connection = mysql.createConnection(config);
    let sql = 'select count_mutant_dna, count_human_dna, ratio from estadisticas';
    let data;
    let values;
    var est = "";
    connection.connect();
    connection.query(sql, true, (error, results, data) => {
        if (error) {
          return console.error(error.message);
        }        
        if(results.length > 0){            
            console.log(results[0].count_mutant_dna + ' ' + results[0].count_human_dna + ' ' + results[0].ratio);            
            est = {                
                "count_mutant_dna":  results[0].count_mutant_dna,                 
                "count_human_dna" : results[0].count_human_dna, 
                "ratio": results[0].ratio }
        }else{
            console.log('Registro no encontrado');
        }
    });    
    connection.end();
    callback(est);
};

app.get('/', function(req, res) {
    var pagina_no_encontrada = {message : 'No existe la Página solicitada - Magneto'};
    res.status(200).json(pagina_no_encontrada);
});

app.route('/mutant')
.post(function (req, res) {    
    var esMutante = 0;
    /*
    if (verificacion(req.body.dna)) {
        result = 'HTTP 200-OK';
        esMutante = 1;
    } else {
        result = '403-Forbidden';   
        esMutante = 0; 
    }
    res.send(result);
    registrarVerificacion(esMutante);*/

    functions.verificacion(req.body.dna, function(returnValue){    
        console.log("returnValue:"+returnValue);    
        if (returnValue===true){
            result = 'HTTP 200-OK';            
            esMutante = 1;
            console.log("esMutante:"+esMutante); 
        } else {
            console.log("else"); 
            result = '403-Forbidden';
            esMutante = 0; 
        }
        res.send(result);
        registrarVerificacion(returnValue);    
    });
});

app.route('/stats')
.post(function (req, res) {    
    functions.stats('select count_mutant_dna, count_human_dna, ratio from estadisticas', function(returnValue){
    res.send(returnValue);
   });
});

app.use(function(req, res, next) {    
    res.sendStatus(404);
});

app.listen(3000, () => {    
    console.log("Start PORT 3000");
});