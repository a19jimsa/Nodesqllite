const { response } = require("express");
const express = require("express");
const router =  express.Router();
var sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database("./weather.db", (err)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log("connected to db");
    }
})

router.get("/", function(req, res){
    res.status(200).json(forecasts);
    console.log("Hämtade ut väderprognoser!");
})

// GET latest forecast from date and city. G
router.get("/:city/:date", function(req, res, next){
    var totime = new Date(req.params.date);
    totime.setDate(totime.getDate() + 3);
    totime = totime.toISOString().substring(0, 10);
    console.log(totime);
    let sql = 'SELECT * FROM forecast where fromtime>=? and totime<=? and name=?';
    db.all(sql, [req.params.date, totime, req.params.city], (err, rows)=>{
        if(err){
            throw err;
        }
        if(rows.length > 0){
            let obj = [];
            for(var i = 0; i < rows.length; i++){
                var feed = {"name": rows[i].name, "fromtime": rows[i].fromtime, "totime": rows[i].totime, "auxdata":JSON.parse(rows[i].auxdata)};
                obj.push(feed);
            }
            res.status(200).send(obj);
        }else{
            next();
        }
    });
})


//GET Specific forecast with code and date or date. VG
router.get("/:code/:date", function(req, res){
    let sql = "select info.name as name, climatecodes.code as code from climatecodes inner join info on info.climatecode=climatecodes.code where code=?";
    console.log(req.params.code);
    db.all(sql, [req.params.code], (err, rows)=>{
        if(err){
            throw err;
        }
        res.status(200).send(rows);
    });
})

//Get last forecast from specific city DO not use in APP!
router.get("/:name", function(req, res){
    let sql = "select * from forecast where name=? order by fromtime DESC limit 1";
        db.each(sql, [req.params.name], (err, rows)=>{
            if(err){
                throw err;
            }else if(rows.name){
                console.log(rows.name);
                let obj = [];
                let auxdata = JSON.parse(rows.auxdata);
                var feed = {"name": rows.name, "fromtime": rows.fromtime, "totime": rows.totime, "auxdata":auxdata};
                obj.push(feed);
                res.json(feed);
            }
        });
})

//GET last forecast of specific date done. Returns the last forecast of a specific date. Do not USE in APP!
router.get("/:date", function(req, res){
    console.log(req.params.date);
    let sql = "select * from forecast where fromtime LIKE '%"+req.params.date+"' order by fromtime DESC limit 1";
    db.each(sql, [], (err, rows)=>{
        if(err){
            throw err;
        }
        console.log(req.params.date);
        let obj = [];
        let auxdata = JSON.parse(rows.auxdata);
        var feed = {"name": rows.name, "fromtime": rows.fromtime, "totime": rows.totime, "auxdata":auxdata};
        obj.push(feed);
        res.json(obj);
    });
    
})

module.exports = router;