const express = require("express");
const router = express.Router();
const MongooseEvModel = require('../models/country')

/**
 * @swagger
 * components:
 *   schemas:
 *     EV:
 *       type: object
 *       required:
 *         - Country
 *         - Sales
 *         - Year
 *       properties:
 *         _id:
 *           type: string
 *           description: The Auto-generated GUID of an electrical vehicle
 *         Country:
 *           type: string
 *           description: Name of the country
 *         Sales:
 *           type: number
 *           description: Number of electrical vehicles sold
 *         Year:
 *           type: number
 *           descripton: Year the sales were taken
 *       example:
 *         _id: 621d30ca0125b6c87d56c32d
 *         Country: Canada
 *         Sales: 96342303
 *         Year: 2020
 */

/**
 * @swagger
 * /api/ev:
 *  get:
 *      summary: Retrieve a list of sales data
 *      tags: [EV]
 *      description: Used to request all sales data
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: A successful response
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/EV'
*/
router.get('/ev', (req, res) => {
    MongooseEvModel.find({}, (err, data) => {
        if (err) res.send(err);
        res.json(data);
    });
});

/**
 * @swagger
 * /api/ev:
 *   post:
 *     summary: Adds sales data
 *     tags: [EV]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EV'
 *     responses:
 *       200:
 *         description: The sales data was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EV'
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/ev/{id}:
 *   put:
 *     summary: updates sales data by id
 *     tags: [EV]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Sales data id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EV'
 *     responses:
 *       200:
 *         decsription: The sales data was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EV'
 *       404:
 *         description: Sales data was not found.
 *       500:
 *         description: Errors happend.
 *
 */
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

/**
 * @swagger
 * /api/ev/{id}:
 *   delete:
 *     summary: Deletes a single sale data
 *     tags: [EV]
  *     parameters:
 *       - name: id
 *         description: Sales data id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data was deleted
 *       404:
 *         description: The sales data was not found
 */
router.delete("/ev/:id", function(req, res, next) {
    MongooseEvModel.findOneAndRemove({ _id: req.params.id }, (err, data) => {
        if (err) res.send(err);
        res.json({ message: 'Successfully deleted student!'});
    });
});

module.exports = router;