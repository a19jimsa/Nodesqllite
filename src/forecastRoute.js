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
    let sql = "select * from forecast where fromtime=? and name=? order by fromtime limit 1";
    db.each(sql, [req.params.date, req.params.city], (err, rows)=>{
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
    next();
})

//GET All citys with code and date or date. VG
router.get("/:code/:date", function(req, res){
    let sql = "select info.name, climatecodes.code, forecast.fromtime from info, climatecodes, forecast where info.name=forecast.name and info.climatecode=climatecodes.code and climatecodes.code=?";
    db.all(sql, [req.params.code], (err, rows)=>{
        if(err){
            throw err;
        }
        res.send(rows);
    });
})

//Get last forecast from specific city or specific date
router.get("/:name", function(req, res, next){
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
        next();
})

//GET last forecast of specific date
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