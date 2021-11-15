const express = require('express');

const cors = require('cors');
require('dotenv').config();

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT ||  5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oyagc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
try{
await client.connect();
const database = client.db('watchPoint');
const servicesCollection = database.collection('services');
const usersCollection = database.collection('users');

// Get Api
app.get('/services', async (req, res) => {
  const cursor = servicesCollection.find({});
  const services = await cursor.toArray();
  res.send(services);
});


// get single product
app.get('/services/:id', async (req, res) => {
  const id = req.params.id;
  console.log('getting specific service', id);
  const query = { _id: ObjectId(id) };
  const service = await servicesCollection.findOne(query);
  res.json(service);
})


// Post Api
app.post('/services', async (req, res) => {
  const service = req.body;
  console.log('hit the post api', service);
  const result = await servicesCollection.insertOne(service);
  res.json(result);
})



// Delete Api
app.delete('/services/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await servicesCollection.deleteOne(query);
  res.json(result);
})


// users Api

app.post('/users', async (req, res) => {
  const user = req.body;
  console.log('hit the users post api', user);
  const result = await usersCollection.insertOne(user);
  
  res.json(result);
})

// Up srt Api

app.put('/users', async (req, res) => {
  const user = req.body;
  const filter = {email: user.email};
  const options = { upsert: true };
  const updateDoc = {$set: user};
  const result = await usersCollection.updateOne(filter, updateDoc, options);
  res.json(result);

})

app.put('/users/:admin', async (req, res) => {
  const user = req.body;
  const filter = { email: user.email };
  const updateDoc = {$set: {role: 'admin'}};
  const result = await usersCollection.updateOne(filter, updateDoc);
  res.json(result);
})



}

finally{
    // await client.close();
}

}

run().catch(console.dir);

app.get('/', (req, res) => {

  res.send('Running watch point Server');
});


app.listen(port, () => {
  console.log(`running watchPoint server at http://localhost:${port}`)
})























