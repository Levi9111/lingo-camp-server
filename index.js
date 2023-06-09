const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.faioyfi.mongodb.net/?retryWrites=true&w=majority`;

const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    // collections 
    const instructorsCollection = client.db('lingoCamp').collection('instructors');

    app.get('/instructors', async(req,res)=>{
        const result = await instructorsCollection.find().toArray();
        res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
// Routes
app.get("/", (req, res) => {
    res.send("lingoCamp  server");
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`lingoCamp Server is running on port ${port}`);
  });
  