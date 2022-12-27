const { MongoClient } = require('mongodb')
let dbConnection
let uri = 'mongodb+srv://username:password@cluster0.askslvd.mongodb.net/?retryWrites=true&w=majority'

/**
 * Exports two function 
 * 1. To connect to the database
 * 2. To return the database connection
 */
module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(uri)
        .then((client) => {
          dbConnection =  client.db()
          return cb()
        })
        .catch(err => {
        console.log(err)
        return cb(err)

    })
    }, 

    // used to return the database connection to do things like: add, remove and modify
    // the data

    getDb: () => dbConnection
}