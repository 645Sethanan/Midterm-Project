const database = require('./connect');

let productschema = database.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true},
    qualification: { type: String, required: true}
});

const People = database.model('peoples',productschema);

module.exports = People;