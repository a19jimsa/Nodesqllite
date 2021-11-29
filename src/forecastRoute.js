const { response } = require("express");
const express = require("express");
const router =  express.Router();

const forecasts = [
            {name: "Arjeplog", fromtime: "2020-01-01 00:00:00", totime: "2020-01-01 06:00:00", periodno: "0", periodname: "night", code: "Am",auxdata: {"TUNIT":"celsius","TVALUE":"6.4","ALTUNIT":"fahrenheit","ALTVALUE":"43.52","NUMBER":"4","WSYMB3NUMBER":"6","NAME":"Cloudy","RUNIT":"mm","RVALUE":"0","DEG":"22","CODE":"NNE","NAME":"North-northeast","MPS":"0.4","NAME":"Calm","UNIT":"hPa","VALUE":"837"}},
            {name: "Arjeplog",fromtime:"2020-01-02 00:00:00",totime:"2020-01-01 06:00:00",periodno:"0",periodname:"Night", code: "Am", auxdata:{"TUNIT":"celsius","TVALUE":"-8.2","ALTUNIT":"fahrenheit","ALTVALUE":"17.24","NUMBER":"10","WSYMB3NUMBER":"23","FNAME":"Sleet","RUNIT":"mm","RVALUE":"1.2","DEG":"257","CODE":"SW","NAME":"Southwest","MPS":"14.4","NAME":"Near Gale","UNIT":"hPa","VALUE":"1276"}},
            {name:"Arjeplog",fromtime:"2020-01-03 00:00:00",totime:"2020-01-03 06:00:00",periodno:"0",periodname:"Night", code: "Am", auxdata:{"TUNIT":"celsius","TVALUE":"-8.7","ALTUNIT":"fahrenheit","ALTVALUE":"16.34","NUMBER":"11","WSYMB3NUMBER":"25","FNAME":"Light snow","RUNIT":"mm","RVALUE":"1.7","DEG":"257","CODE":"W","NAME":"West","MPS":"15.3","NAME":"Near Gale","UNIT":"hPa","VALUE":"1267"}},
            {name:"Grums",fromtime:"2020-01-01 00:00:00",totime:"2020-01-03 06:00:00",periodno:"0",periodname:"Night", code: "Am",auxdata:{"TUNIT":"celsius","TVALUE":"-8.7","ALTUNIT":"fahrenheit","ALTVALUE":"16.34","NUMBER":"11","WSYMB3NUMBER":"25","FNAME":"Light snow","RUNIT":"mm","RVALUE":"1.7","DEG":"257","CODE":"W","NAME":"West","MPS":"15.3","NAME":"Near Gale","UNIT":"hPa","VALUE":"1267"}}
        ]

router.get("/", function(req, res){
    res.status(200).json(forecasts);
    console.log("Hämtade ut väderprognoser!");
})

// GET latest forecast from date and city. G
router.get("/:city/:date", function(req, res, next){
    const cityanddate = forecasts.slice(-1).find(forecast=>forecast.name==req.params.city&&forecast.fromtime.substring(0, 10)==req.params.date);
    if(cityanddate){
        res.type("application/json");
        res.status(200).send(cityanddate);
    }else{
        console.log("hittade inget på stad och datum");
        next();
    }
})

//GET All forecast with code and date or date. VG
router.get("/:code/:date", function(req, res){
    const codeanddate = forecasts.filter(codeanddate=>codeanddate.fromtime.substring(0, 10) == req.params.date&&codeanddate.code==req.params.code);
    console.log(req.params.date);
    const date = forecasts.filter(forecast=>forecast.fromtime.substring(0,10) == req.params.date);
    console.log(date);
    if(codeanddate.length > 0){
        res.type("application/json");
        res.status(200).send(codeanddate);
    }else if(date.length > 0){
        res.type("application/json");
        res.status(200).send(date);
    }else{
        res.status(404).json({msg:"Hittade inget!"});
    }
})

//Get last forcecast from specific city or specific date
router.get("/:name", function(req, res){
    const city = forecasts.reverse().find(city=>city.name==req.params.name);
    const fromtime = forecasts.find(fromtime=>fromtime.fromtime.substring(0, 10)==req.params.name);
    if(city){
        res.type("application/json");
        res.status(200).send(city);
    }else if(fromtime){
        res.type("application/json");
        res.status(200).send(fromtime);
    }else{
       res.status(404).json({msg: "Hittade ingen med det namnet"});
    }
})

module.exports = router;