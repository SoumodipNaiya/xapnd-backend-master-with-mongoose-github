const mongoose = require('mongoose');
const test_schema = new mongoose.Schema({
    type: String,
    features: Array
},
{collection:"lines"}
);


let geomodel = module.exports = mongoose.model('lines', test_schema);
