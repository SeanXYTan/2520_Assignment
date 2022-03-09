const express = require("express");
const router = express.Router();
const MongooseEvModel = require('../models/country')

router.get('/ev', (req, res) => {
    MongooseEvModel.find({}, (err, data) => {
        if (err) res.send(err);
        res.json(data);
    });
});

// Add sales data
router.post("/ev", function(req, res, next) {
    var ev = req.body;
    if (!ev.Country || !ev.Sales || !ev.Year)  {
        res.status(400);
        res.json(
            {"error": "Bad data, could not be inserted into the database."}
        )
    } else {
        let newEV = new MongooseEvModel(ev);
        newEV.save((err, data) => {
            if (err) res.send(err);
            res.json(data);
        });
    }
});

// Update sales data
router.put("/ev/:id", function(req, res, next) {
    var ev = req.body;
    var changedEV = {};
    if (ev.Country) {
        changedEV.Country = ev.Country;
    }
    if (ev.Sales) {
        changedEV.Sales = ev.Sales;
    }
    if (ev.Year) {
        changedEV.Year = ev.Year;
    }
    if (!changedEV) {
        res.status(400);
        res.json({"error": "Bad Data"})        
    } else {
        MongooseEvModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, 
            (err, data) => {
                if (err) res.send(err);
                res.json(data);
            }
        );
    }
});

// Delete sales data
router.delete("/ev/:id", function(req, res, next) {
    MongooseEvModel.findOneAndRemove({ _id: req.params.id }, (err, data) => {
        if (err) res.send(err);
        res.json({ message: 'Successfully deleted student!'});
    });
});

module.exports = router;