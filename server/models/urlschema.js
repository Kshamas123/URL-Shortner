
const mongoose = require('mongoose');


const urlschema = new mongoose.Schema({
    long_url: {
        type: String,
        require: true
    },
    short_link: {
        type: String,
        require: true
    }
})

const url_model =mongoose.model('URLSCHEMA', urlschema);
module.exports=url_model