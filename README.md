# Nodesqllite

I denna uppgift så hämtas data ut med sql-satser istället för JSON.

Först hämtas all data ut för alla klimatkoder i databasen och renderas på sidan.

```javascript
router.get("/", (req, res)=>{
    let sql = "select * from climatecodes";
    db.all(sql, [], (err, rows)=>{
        if(err){
            throw err;
        }
        res.send(rows);
    });
})
```

![image](https://user-images.githubusercontent.com/81629599/144757136-30efb8ec-520a-4328-b2bc-054faf3c1015.png)

Sen så i nästa steg ska det går att hämta ut ett antal forecast antingen på utvald ort eller via datum. Detta gjordes med en endpoint som använder next för att om det inte hitta något värde i databasen gå vidare och kolla istället om endpointen innehåll ett datum istället för ett ortsnamn.

```javascript
//Get last forecast from specific city! Getting last 4 from forecast and adding to array with reverse order.
router.get("/:name", function(req, res, next){
    let sql = "select * from forecast where name=? order by fromtime DESC limit 4";
        db.all(sql, [req.params.name], (err, rows)=>{
            if(err){
                throw err;
            }
            if(rows.length > 0){
                let obj = [];
                let auxdata = [];
                
                for(var i = rows.length-1; i >= 0; i--){
                    auxdata.push({"name": rows[i].name, "fromtime": rows[i].fromtime, "totime": rows[i].totime, "auxdata":JSON.parse(rows[i].auxdata)});
                }
                for(var i = 0; i < 1; i++){
                    var feed = {"name": rows[i].name, "fromtime": rows[i].fromtime, "totime": rows[i].totime, "auxdata":auxdata};
                    obj.push(feed);
                }
                res.status(200).send(obj);
            }else{
                next();
            }
        });
})

//GET last forecast of specific date done. Returns the last forecast of a specific date.!
router.get("/:date", function(req, res){
    console.log(req.params.date);
    let sql = 'SELECT * FROM forecast where fromtime like "%'+req.params.date+'%"';
    db.all(sql, [], (err, rows)=>{
        if(err){
            throw err;
        }
        let obj = [];
        for(var i = rows.length-1; i >= 0; i--){
            var feed = {"name": rows[i].name, "fromtime": rows[i].fromtime, "totime": rows[i].totime, "auxdata":JSON.parse(rows[i].auxdata)};
            obj.push(feed);
        }
        res.status(200).send(obj);
    });
    
})
```



