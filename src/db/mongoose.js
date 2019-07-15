const URI = process.env.MONGO_DB_URI;

const mongoose = require("mongoose");
const configObject = {
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindAndModify : false,
    reconnectTries : Number.MAX_VALUE,
    reconnectInterval : 500,
    bufferCommands : false,
    bufferMaxEntries : 0,
}

module.exports = mongoose.connect(URI,configObject);