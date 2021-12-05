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
Dessa hämtar ut senaste forecasten som ligger i databasen och renderar detta på sidan.

![image](https://user-images.githubusercontent.com/81629599/144757273-f49d0af6-13f3-40d9-a102-a21261537ecc.png)

I detta fall hämtar den senaste värderleksrapporten för Arjeplog eftersom det är valt sedan innan.

För att hämta ut och skapa users användes en endpoint.

Här hämtas alla användares användarnamn ut och renderas på sidan.

```javascript

router.get("/", function(req, res){
    let sql = "select username from user";
    db.all(sql, [], (err, rows)=>{
        if(err){
            throw err;
        }
        res.status(200).send(rows);
    });
})

```

Det går även att skapa, uppdatera och ta bort användare. Genom följande endpoints.

```javascript
//Update specific user
router.put("/:id", express.json(), function(req, res){
    let sql = "update user set username = ?, email = ? where ?";
    db.all(sql, [req.body.username, req.body.email, req.params.id], (err, rows)=>{
        if(err){
            throw err;
        }
        res.status(200).send(rows);
    });
})

//POST new user
router.post("/", express.json(), function(req, res){
    let sql = "insert into user(id, username, email) values(?,?,?)";
    db.run(sql, [req.body.id, req.body.username, req.body.email], (err, rows)=>{
        if(err){
            throw err;
        }
        res.status(201).send({msg: "Created comment"+rows});
        console.log("Skapade användare");
    });
})

//DELETE specific user of name
router.delete("/:name", function(req, res){
    let sql = "delete from user where username = ?";
    db.all(sql, [req.params.name], (err, rows)=>{
        if(err){
            throw err;
        }
        res.status(200).send(rows);
    });
})
```

På sidan kan man här skapa eller ta bort en specifik användare.

![image](https://user-images.githubusercontent.com/81629599/144757364-63dc91ce-dd4d-4c26-8f55-0cc0a4793123.png)

```javascript
//GET all comments on a city
router.get("/:location", function(req, res){
    //var citycomments = comments.filter(comment=>comment.location==req.params.location).reverse();
    if(req.query.id == "null"){
        //citycomments = citycomments.filter(comment=>comment.replyto==req.query.id);
        let sql = "select * from comment where location=? and replyto IS NULL";
        db.all(sql, [req.params.location], (err, rows)=>{
        if(err){
            throw err;
        }
        res.status(200).send(rows);
        });
    }else if(req.query.id){
        let sql = "select * from comment where location=? and replyto=?";
        db.all(sql, [req.params.location,req.query.id], (err, rows)=>{
        if(err){
            throw err;
        }
        res.status(200).send(rows);
        });
    }else{
        let sql = "select * from comment where location=? Order by id DESC";
        db.all(sql, [req.params.location], (err, rows)=>{
        if(err){
            throw err;
        }
        res.status(200).send(rows);
        });
    }
})
```

Här hämtas alla kommentarer ut för en specifik ort. Frågorna specificeras olika beroende på om det skickades med en parameter som fråga. På så sätt filtreras kommentarer ut om de är en kommentar eller svar så de hämtas ut korrekt så det går att ha en endpoint för att hämta data på olika sätt. Så datan skrivs ut korrekt i frontend.

```javascript

//GET specific comment on specific location
router.get("/:location/comment/:id", function(req, res){
    let sql = "select * from comment where location=? and id=?";
    db.all(sql, [req.params.location, req.params.id], (err, rows)=>{
        if(err){
            throw err;
        }
        res.status(200).send(rows);
    });
})
```

Här hämtas en specifik kommentar ut.

```javascript
//PUT change specific comment
router.put("/:location/comment/:id", express.json(), function(req, res){
    let sql = "update comment set content=? where location=? and id=?";
    db.all(sql, [req.body.content, req.params.location, req.params.id], (err, rows)=>{
        if(err){
            throw err;
        }
        res.status(200).send(rows);
    });
})
```

Här uppdateras en specifik kommentar med hjälp av frontend senare.

```javascript
//POST Add comment to specific city
router.post("/:location", express.json(), function(req, res){
    let sql = "insert into comment(id, location, replyto, author, content, posted) values(?,?,?,?,?,?)";
    db.run(sql, [req.body.id, req.body.location, req.body.replyto, req.body.author, req.body.content, req.body.posted], (err, rows)=>{
        if(err){
            throw err;
        }
        res.status(201).send({msg: "Created comment"+rows});
        console.log("Skapade kommentar");
    });
})
```

Här skapas en kommentar för den orten. Här görs en insert till databasen med alla värden från body som skickades in via fetch i React-frontend.

```javascript
// POST Add answer on specific comment on a city
router.post("/:location/comment/:commentid", express.json(), function(req, res){
    let sql = "insert into comment(id, location, replyto, author, content, posted) values(?,?,?,?,?,?)";
    db.run(sql, [req.body.id, req.body.location, req.body.replyto, req.body.author, req.body.content, req.body.posted], (err, rows)=>{
        if(err){
            throw err;
        }
        res.status(201).send({msg: "Created comment"+rows});
        console.log("Skapade svar");
    });
})
```

Här uppdateras en befintlig kommentar istället med endpoints som location och commentid så man endast kan uppdatera befintliga kommentarer.

```javascript
//DELETE remove comment from specific city
router.delete("/:commentid", express.json(), function(req, res){
    let sql = "delete from comment where id=?";
    db.all(sql, [req.params.commentid], (err, rows)=>{
        if(err){
            throw err;
        }
        res.status(200).send(rows);
    });
})
```

Kod för att ta bort en specifik kommentar.

Detta ritas ut i applikationen som en chattruta där det går att svara, kommentera och ta bort kommentarer. Det finns inget inlogg eller koll på vem som skrivit vilken kommentar så det går att administrera allting.

![image](https://user-images.githubusercontent.com/81629599/144758172-bb1fb73a-f8d0-4a2a-81e0-47ed8bb2ccdb.png)

Här syns chattrutan för hur det går att skapa, uppdatera och ta bort kommentarer/svar.

```javascript
//GET Name and code from climatecodes and forecast and info with climatecode and date. VG
router.get("/:code/:date", function(req, res){
    let sql = "select distinct Date(forecast.fromtime) as time, info.name as name, climatecodes.code as code, info.country as country from climatecodes inner join info on info.climatecode=climatecodes.code inner join forecast on info.name=forecast.name where code=? and Date(time)=? order by Date(time)";
    console.log(req.params.code);
    db.all(sql, [req.params.code, req.params.date], (err, rows)=>{
        if(err){
            throw err;
        }
        res.status(200).send(rows);
    });
})
```

Detta är för att joina olika tabeller för att hämta ut data från specifika orter med datum och klimatkoder. Här joinas tre tabeller för att hämta ut specifik data.

![image](https://user-images.githubusercontent.com/81629599/144758281-dbc3fa74-dae0-4366-9422-394b0250e1c2.png)

Genom att välja klimatkod och datum hämtas alla orter som har det datumet och den klimatkoden.




