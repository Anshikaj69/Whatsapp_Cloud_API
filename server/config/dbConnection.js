const mongoose = require('mongoose');

//connect to MongoDB
const dbConnection = async() =>{
    try{
        const connect = await mongoose.connect(process.env.CONNECTION_STRING)
        console.log('db connected', connect.connection.host, connect.connection.name)
    }catch(err){
        console.log(err);
        process.exit(1)
    }
}

module.exports = dbConnection