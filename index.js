const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000
require('dotenv').config()

app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j1wt1ip.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    //   User Collection here
    const scheduleCollections = client.db('scheduleDB').collection('scheduleDB')


    app.get('/schedule/:id', async (req, res) => {
      console.log('object');
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await scheduleCollections.findOne(query);
      res.send(result);
    });

    //   get method
    // http//:localhost:3000/schedule?searchParams=text
    app.get('/schedule', async (req, res) => {
      const { searchParams } = req.query;
      console.log(searchParams);

      let query = {}

      if (searchParams) {
        query = { title: { $regex: searchParams, $options: 'i' } }
      }

      const cursor = scheduleCollections.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })
    //   post method now
    app.post('/schedule', async (req, res) => {
      const schedule = req.body;
      const result = await scheduleCollections.insertOne(schedule)
      res.send(result)
    })

    // Get single data 


    // update method here
    app.put('/schedule/:id', async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true }
      const updatedDoc = {
        $set: updateData
      }
      console.log({id});
      const result = await scheduleCollections.updateOne(query, updatedDoc, options)
      res.send(result)
    })
    // patch here
    app.patch('/schedule/:id', async (req, res) => {
      const id = req.params.id;
      console.log({ id });
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true }
      const updatedDoc = {
        $set: {
          isCompleted: true,
        }
      }
      const result = await scheduleCollections.updateOne(query, updatedDoc, options)
      res.send(result)
    })

    //   Delete Method
    app.delete('/schedule/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await scheduleCollections.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// get home
app.get('/', (req, res) => {
  res.send('GYM Server is running now')
})

// lister
app.listen(port, () => {
  console.log(`GYM Schedule management server is running port is ${port}`);
})