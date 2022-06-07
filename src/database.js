/*
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODBATLAS_URI;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
  const collection = client.db("ServiciosDocentes").collection("users");
  // perform actions on the collection object
  client.close();
});
*/

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/controlapp').then(db => console.log('DB is connected')).catch(err => console.error(err));