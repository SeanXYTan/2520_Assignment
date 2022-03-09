// grab the things we need
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create a schema
const evSchema = new Schema({
    Country: {
        type: String,
        required: true
    },
    Sales: {
        type: Number,
        required: true
    },
    Year: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("EV", evSchema, "sales");