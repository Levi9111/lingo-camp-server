const express = require("express");
const cors = require("cors");
require("dotenv").config();
const stripe = require("stripe")(process.env.PAYMENT_SECRET_KEY);
const jwt = require("jsonwebtoken");
const { MongoClient, ObjectId } = require("mongodb");
const { ServerApiVersion } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.faioyfi.mongodb.net/?retryWrites=true&w=majority`;

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res
      .status(401)
      .json({ error: true, message: "Unauthorized Access" });
  }

  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: true, message: "Token expired" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ error: true, message: "Invalid token" });
      } else {
        return res
          .status(500)
          .json({ error: true, message: "Token verification failed" });
      }
    }

    req.decoded = decoded;
    next();
  });
};

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    // collections
    const instructorsCollection = client
      .db("lingoCamp")
      .collection("instructors");
    const classesCollection = client.db("lingoCamp").collection("classes");
    const usersCollection = client.db("lingoCamp").collection("users");
    const coursesCollection = client.db("lingoCamp").collection("courses");
    const paymentCollection = client.db("lingoCamp").collection("payment");
    const purchaseHistoryCollection = client
      .db("lingoCamp")
      .collection("purchaseHistory");

    // JSON web token
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    app.get("/courses", async (req, res) => {
      const email = req.query.email;
      if (!email) return res.send([]);
      const query = { email: email };

      const result = await coursesCollection.find(query).toArray();
      res.json(result);
    });

    app.get("/instructors", async (req, res) => {
      const result = await instructorsCollection.find().toArray();
      res.send(result);
    });

    app.get("/classes", async (req, res) => {
      const result = await classesCollection.find().toArray();
      res.send(result);
    });

    app.post("/classes", async (req, res) => {
      const item = req.body;
      const result = await classesCollection.insertOne(item);
      res.send(result);
    });

    app.get("/myclasses", async (req, res) => {
      const user = req.user;
      const query = { email: user.email };
      const result = await classesCollection.find(query).toArray();

      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existedUser = await usersCollection.findOne(query);

      if (existedUser) return res.status(400).send("User already exists");

      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.patch("/users/instructor/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role2: "Instructor",
        },
      };

      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role1: "Admin",
        },
      };

      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.post("/courses", async (req, res) => {
      const item = req.body;
      const result = await coursesCollection.insertOne(item);
      res.send(result);
    });

    app.get("/courses/payment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.delete("/courses/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coursesCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/courses/:id/decrease-seats", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      try {
        const currentCourse = await coursesCollection.findOne(filter);

        if (!currentCourse) {
          return res.status(404).json({ error: "Course not found" });
        }

        const updatedSeats = currentCourse.availableSeats - 1;

        const updateDoc = {
          $set: {
            availableSeats: updatedSeats,
          },
        };

        await coursesCollection.updateOne(filter, updateDoc);

        res
          .status(200)
          .json({ message: "availableSeats decreased successfully" });
      } catch (error) {
        res.status(500).json({ error: "Failed to decrease availableSeats" });
      }
    });

    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = Math.round(+price * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: +amount,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    app.post("/payment", verifyJWT, async (req, res) => {
      const payment = req.body;
      const insertResult = await paymentCollection.insertOne(payment);
      const query = {
        _id: new ObjectId(payment.courseIdentity),
      };

      const deletedResult = await coursesCollection.deleteOne(query);

      res.send({ insertResult, deletedResult });
    });

    // purchase history
    app.get("/history", async (req, res) => {
      const result = await paymentCollection.find().toArray();
      res.send(result);
    });

    app.delete("/history", async (req, res) => {
      const result = await paymentCollection.deleteMany({});
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

// Routes
app.get("/", (req, res) => {
  res.send("lingoCamp server");
});

// Start the server
app.listen(port, () => {
  console.log(`lingoCamp Server is running on port ${port}`);
});
