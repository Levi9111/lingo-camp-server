const express = require("express");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");
const { ServerApiVersion } = require("mongodb");
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
    const classesCollection = client.db('lingoCamp').collection('classes');
    const usersCollection = client.db('lingoCamp').collection('users');
    const coursesCollection = client.db('lingoCamp').collection('courses');

    // json web token
    app.post('/jwt', (req,res)=>{
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '1h'
        });
        res.send({token})
    })

    app.get("/courses", async (req, res) => {
        const email = req.query.email;
        if (!email) return res.send([]);
        const query = { email: email };
  
        const result = await coursesCollection.find(query).toArray();
        res.json(result);
      });

    app.get('/instructors', async(req,res)=>{
        const result = await instructorsCollection.find().toArray();
        res.send(result);
    })

    app.get('/classes', async(req,res)=>{
        const result = await classesCollection.find().toArray();
        res.send(result);
    })
    
    //--------->

    app.get("/users", async (req, res) => {
        const result = await usersCollection.find().toArray();
        res.send(result);
      });
  
      app.post("/users", async (req, res) => {
        const user = req.body;
        const query = { email: user.email };
        const existedUser = await usersCollection.findOne(query);
        // exister user used to identify if the user is already in the database while logging in with google
        if (existedUser) return res.status(400).send("User already exists");
        const result = await usersCollection.insertOne(user);
        res.send(result);
      });
      //<---------

      app.post('/courses', async (req, res) => {
        const item = req.body;
        const result = await coursesCollection.insertOne(item);
        res.send(result);
      })

      app.delete('/courses/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await coursesCollection.deleteOne(query);
        res.send(result);
      })


    //   TODO : have to fix later
   app.patch('/courses/:id/decrease-seats', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };

  try {
    const currentCourse = await coursesCollection.findOne(filter);

    if (!currentCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const updatedSeats = currentCourse.availableSeats - 1;

    const updateDoc = {
      $set: {
        availableSeats: updatedSeats,
      },
    };

    await coursesCollection.updateOne(filter, updateDoc);

    res.status(200).json({ message: 'availableSeats decreased successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to decrease availableSeats' });
  }
});

      
      
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
  