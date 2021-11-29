const express = require("express");
const router =  express.Router();

const climatecodes = [
    {code: "Af", name: "Tropical rainforest climate Tropical Rainforest", color: "#960000"},
    {code: "Am", name: "Tropical monsoon climate Tropical Monsoon", color: "#FF0000"}
]

router.get("/", function(req, res){
    res.status(200).json(climatecodes);
    console.log("Hämtade ut klimatkoder!");
});

module.exports = router;