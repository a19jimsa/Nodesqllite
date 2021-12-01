const express = require("express");
const router =  express.Router();
var sqlite3 = require('sqlite3').verbose();

const comments = [
    {id: 1111, location: "Arjeplog", replyto :"null", author: 1, content:"Detta är en kommentar om Arjeplog", posted: "2020-01-02 00:00:00"},
    {id: 1112, location: "Arjeplog", replyto : 1111, author: 2, content:"Detta är ett svar på 1111", posted: "2020-01-02 00:00:01"},
    {id: 1113, location: "Arjeplog", replyto : "null", author: 2, content:"Detta är en kommentar", posted: "2020-01-02 00:00:01"}
]

let db = new sqlite3.Database("./weather.db", (err)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log("connected to db");
    }
})

//GET all comments
router.get("/", (req, res)=>{
    let sql = "select * from comment";
    db.all(sql, [], (err, rows)=>{
        if(err){
            throw err;
        }
        res.send(rows);
    });
})

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

//PUT change specific comment
router.put("/:location/comment/:id", express.json(), function(req, res){
    const comment = comments.findIndex((comment)=>comment.location==req.params.location&&comment.id==req.params.id);
    if(comment < 0){
        res.status(404).json({msg: "Comment not found"});
    }else{
        comments.splice(comment, 1, req.body);
        res.status(200).json({msg: "Updated comment"});
    }
})

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

module.exports = router;