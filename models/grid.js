const mongoose = require('mongoose');
const test_schema = new mongoose.Schema({
    type: String,
    features: Array
},
{collection:"grid"}
);



let geomodel = module.exports = mongoose.model('grid', test_schema);
