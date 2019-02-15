const mongoose = require('mongoose');
const test_schema = new mongoose.Schema({
    type: String,
    features: Array
},
{collection:"entity"}
);



let entity = module.exports = mongoose.model('entity', test_schema);
