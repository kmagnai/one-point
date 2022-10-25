
    const { MongoClient } = require("mongodb")
   
    const uri = "mongodb://localhost:27017?retryWrites=true&writeConcern=majority"
    const client = new MongoClient(uri)
    client.connect()
    const database = client.db('data')
    const query = { title: 'Back to the Future' }
    database.insertOne(query)
    database.findOne()
    // try {
    //     await client.connect()
    //     const database = client.db('sample_mflix')
    //     const movies = database.collection('movies')
    //     // Query for a movie that has the title 'Back to the Future'
    //     const query = { title: 'Back to the Future' }
    //     const movie = await movies.findOne(query)
    //     console.log(movie)
    //   } finally {
    //     // Ensures that the client will close when you finish/error
    //    await client.close();
    //   }
    // return {
    //   props:{
    //     "time":Date.now()
    //   }
    // }
