const csv2json = require('csvtojson');
const path = require('path');
const express = require("express");
const router = express.Router();
const MongooseEvModel = require('../models/ev')

const CSV_FILE = path.join(__dirname, "../data/ev_sales_2020.csv")

//Populate the sales collection if empty
MongooseEvModel.countDocuments(function (err, count) {
    if (!err && count === 0) {
        csv2json().fromFile(CSV_FILE).then((data) => {
            MongooseEvModel.collection.insertMany(data, function (err, docs) { 
                if (err){  
                    return console.error(err); 
                } else { 
                  console.log("Multiple documents inserted to sales collection"); 
                } 
            });
        })
    }
});

// list all countries
router.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'chart.html'));
});

module.exports = router;